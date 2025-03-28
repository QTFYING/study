const { series, watch, parallel } = require('gulp');
const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');
const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper');
const s3 = require('gulp-s3');
const AWS = require('aws-sdk');

// const OSS = require('ali-oss'); // 如果只做阿里云，可以引入这个SDK

// 配置对象
const config = {
  srcDir: 'dist',
  destDir: 'static',
  htmlDestDir: path.join('static', 'html'),
  jsDestDir: path.join('static', 'js'),
  zipUrl: 'https://package.itcjf.com/packages/tibet-airline-oss/1686808649248/tibet-airline-oss-1686808649248.zip', // 替换为实际的 ZIP 包 URL
  zipDest: 'temp.zip', // 临时存储 ZIP 包的路径
};

// S3 配置（兼容 AWS 和阿里云 OSS）
const S3_CONFIG = {
  key: 'LTAI5tL2R34C8vgNmaG5fkaF', // 替换为你的 Access Key
  secret: 'IXooBvcuKzaEAJSPLwPXfNzGBdXwQU', // 替换为你的 Secret Key
  bucket: 'qa-tibetairlines', // 替换为你的存储桶名称
  region: 'oss-cn-chengdu', // 替换为你的区域
};

const s3Client = new AWS.S3({
  accessKeyId: S3_CONFIG.key,
  secretAccessKey: S3_CONFIG.secret,
  endpoint: `https://${S3_CONFIG.region}.aliyuncs.com`, // 阿里云 OSS 的 endpoint
  region: S3_CONFIG.region, // 区域
  signatureVersion: 'v4', // 使用 S3 兼容的签名版本
});

// 检查 dist 目录是否存在
async function ensureDistExists(cb) {
  if (!fs.existsSync(config.srcDir)) {
    console.log('dist 目录不存在，开始下载 ZIP 包...');
    await downloadZip(config.zipUrl, config.zipDest);
    console.log('ZIP 包下载完成，开始解压...');
    await extractZip(config.zipDest, config.srcDir);
    console.log('解压完成');
    fs.unlinkSync(config.zipDest); // 删除临时 ZIP 文件
  } else {
    console.log('dist 目录已存在，跳过下载');
  }
  cb();
}

// 下载 ZIP 包
function downloadZip(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          // 检查文件是否是有效的ZIP文件
          if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
            console.log('ZIP 文件下载成功：', dest)
            resolve();
          } else {
            reject(new Error('下载的 ZIP 文件为空或损坏'))
          }
        });
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest); // 删除部分下载的文件
      reject(err);
    });
  });
}

// 解压 ZIP 包
function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: destDir }))
      .on('close', resolve)
      .on('error', reject);
  });
}

// 清理目标目录
async function clean(cb) {
  const del = (await import('del')).deleteSync; // 动态导入 del 模块
  del([config.destDir]);
  cb();
}

// Gulp任务：打包HTML文件
function htmlPack(cb) {
  gulp.src(path.join(config.srcDir, '**/index.html'), { base: config.srcDir })
    .pipe(plumber())
    .pipe(gulp.dest(config.htmlDestDir))
    .on('end', cb);
}

// Gulp任务：打包JavaScript文件
function staticPack(cb) {
  gulp.src([path.join(config.srcDir, '**/*'), `!${path.join(config.srcDir, '**/*.html')}`], { base: config.srcDir })
    .pipe(plumber())
    .pipe(gulp.dest(config.jsDestDir))
    .on('end', cb);
}

// 通用的 S3 上传逻辑
function uploadToS3Async(src, uploadPath) {
  return new Promise((resolve, reject) => {
    gulp.src(src)
    .pipe(s3({...S3_CONFIG, endpoint: `${S3_CONFIG.region}.aliyuncs.com`}, {
      uploadPath, // 上传路径前缀
      headers: {
        'x-amz-acl': 'public-read',
        'Cache-Control': 'max-age=315360000, no-transform, public'
      },
    }))
    .on('end', () => {
      console.log(`文件已成功上传到 S3: ${uploadPath}`);
      resolve();
    })
    .on('error', (err) => {
      console.error(`上传到 S3 失败 (${uploadPath}):`, err);
      reject(err);
    });
  })
}

// 上传文件js至S3
function uploadsJs3() {
  const src = [path.join(config.destDir, '**/*'), `!${path.join(config.destDir, '**/*.html')}`];
  return uploadToS3Async(src, 'tibet-upload');
}

// 备份 S3 存储桶中的 html 文件夹到 html-back
async function backupHtml() {
  console.log('开始备份 S3 存储桶中的 html 文件夹...');

  const today = new Date();
  const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
  const backupFolder = `html-back-${formattedDate}/`; // 动态生成备份文件夹名称

  return new Promise((resolve, reject) => {
    // 列出 S3 存储桶中 html 文件夹的所有文件
    s3Client.listObjectsV2(
      {
        Bucket: S3_CONFIG.bucket,
        Prefix: 'tibet-upload/html/', // 指定要备份的文件夹
      },
      (err, data) => {
        if (err) {
          console.error('列出 S3 对象失败:', err);
          return reject(err);
        }

        console.log('列出的文件:', data); // 打印返回的文件列表

        if (!data.Contents || data.Contents.length === 0) {
          console.log('没有找到任何文件，备份终止');
          return resolve(); // 如果没有文件，直接结束
        }

        const copyPromises = data.Contents.map((file) => {
          const sourceKey = file.Key;
          const targetKey = sourceKey.replace('html/', backupFolder); // 替换路径为备份路径

          // 复制文件到 html-back 文件夹
          return s3Client
            .copyObject({
              Bucket: S3_CONFIG.bucket,
              CopySource: `${S3_CONFIG.bucket}/${sourceKey}`,
              Key: targetKey,
            })
            .promise()
            .then(() => {
              console.log(`已备份文件: ${sourceKey} -> ${targetKey}`);
            });
        });

        // 等待所有文件复制完成
        Promise.all(copyPromises)
          .then(() => {
            console.log(`文件夹已成功备份到${backupFolder}`);
            resolve();
          })
          .catch((copyErr) => {
            console.error('备份 html 文件夹失败:', copyErr);
            reject(copyErr);
          });
      }
    );
  });
}

// 上传文件html至S3
function uploadsHtml3(cb) {
  const src = path.join(config.destDir, '**/*.html');
  return uploadToS3Async(src, 'tibet-upload');
}

// 文件监听任务
function watchFiles() {
  watch(path.join(config.srcDir, '**/*.html'), htmlPack);
  watch([path.join(config.srcDir, '**/*'), `!${path.join(config.srcDir, '**/*.html')}`], staticPack);
}

// 默认任务
exports.default = series(ensureDistExists, clean, parallel(htmlPack, staticPack), uploadsJs3, backupHtml, uploadsHtml3);