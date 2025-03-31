const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');
const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper');
const s3 = require('gulp-s3');
const aws = require('aws-sdk');
const dayjs = require('dayjs');
const { series, watch, parallel } = gulp;

// const OSS = require('ali-oss'); // 如果只做阿里云，可以引入这个SDK

// 配置对象
const base_config = {
  srcDir: 'dist',  // 目标文件夹
  destDir: 'static', // 输入文件夹
  htmlDestDir: path.join('static', 'html'), // html静态资源在文件夹位置
  jsDestDir: path.join('static', 'cssjs'), // js、css、图片等静态资源在文件夹位置
  zipUrl: '', // 替换为实际的 ZIP 包 URL
  zipDest: 'temp.zip', // 临时存储 ZIP 包的路径
  root: ''  // 存储桶的根路径
};

// S3 配置（兼容 aws 和阿里云 OSS）
const s3_config = {
  key: '', // 替换为你的 Access Key
  secret: '', // 替换为你的 Secret Key
  bucket: '', // 替换为你的存储桶名称
  region: '', // 替换为你的区域
   // 格式如：oss-cn-suzhou.aliyuncs.com
  endpoint: '', // 阿里云需要手动配置格式如，AWA则不需要
};

const s3Client = new aws.S3({
  accessKeyId: s3_config.key,
  secretAccessKey: s3_config.secret,
  region: s3_config.region, // 区域
  endpoint: s3_config.endpoint,
  // endpoint: `https://${s3_config.region}.aliyuncs.com`, // 阿里云需要拼接好，AWA不需要
  signatureVersion: 'v4', // 使用 S3 兼容的签名版本
});

// 检查 dist 目录是否存在
async function ensureDistExists(cb) {
  if (!fs.existsSync(base_config.srcDir)) {
    console.log('dist 目录不存在，开始下载 ZIP 包...');
    await downloadZip(base_config.zipUrl, base_config.zipDest);
    console.log('ZIP 包下载完成，开始解压...');
    await extractZip(base_config.zipDest, base_config.srcDir);
    console.log('解压完成');
    fs.unlinkSync(base_config.zipDest); // 删除临时 ZIP 文件
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
  del([base_config.destDir]);
  cb();
}

// Gulp任务：打包HTML文件
function htmlPack(cb) {
  gulp.src(path.join(base_config.srcDir, '**/index.html'), { base: base_config.srcDir })
    .pipe(plumber())
    .pipe(gulp.dest(base_config.htmlDestDir))
    .on('end', cb);
}

// Gulp任务：打包非HTML文件
function staticPack(cb) {
  gulp.src([path.join(base_config.srcDir, '**/*'), `!${path.join(base_config.srcDir, '**/*.html')}`], { base: base_config.srcDir })
    .pipe(plumber())
    .pipe(gulp.dest(base_config.jsDestDir))
    .on('end', cb);
}

// 通用的 S3 上传逻辑
function uploadToS3Async(src, uploadPath) {
  return new Promise((resolve, reject) => {
    gulp.src(src)
    .pipe(s3(s3_config, {
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
  const src = [path.join(base_config.destDir, '**/*'), `!${path.join(base_config.destDir, '**/*.html')}`];
  return uploadToS3Async(src, base_config.root);
}

// 列出 S3 存储桶中所有以指定前缀开始的文件
async function listAllObjects(bucket, prefix) {
  let allObjects = [];
  let isTruncated = true; // 是否还有更多对象
  let continuationToken = null;

  while (isTruncated) {
    try {
      const params = {
        Bucket: bucket,
        Prefix: prefix, // 指定前缀
        ContinuationToken: continuationToken, // 用于获取下一页结果
      };

      const data = await s3Client.listObjectsV2(params).promise();

      // 将当前页的对象添加到结果数组中
      allObjects = allObjects.concat(data.Contents);

      // 检查是否还有更多对象
      isTruncated = data.IsTruncated;
      continuationToken = data.NextContinuationToken; // 获取下一页的 ContinuationToken
    } catch (err) {
      console.error('获取 S3 对象列表失败:', err);
      throw err;
    }
  }

  return allObjects;
}

// 备份 S3 存储桶中的 html 文件夹到 html-back
async function backupHtml() {
  console.log('开始备份 S3 存储桶中的 html 文件夹...');
  const backupFolder = `html-back-${dayjs().format('YYYYMMDD')}/`;

  try {
    const allObjects = await listAllObjects(s3_config.bucket, `${base_config.root}/html/`);

    if (allObjects.length === 0) {
      console.log('没有找到任何文件，备份终止');
      return;
    }

    const copyPromises = allObjects.map((file) => {
      const sourceKey = file.Key;
      const targetKey = sourceKey.replace('html/', backupFolder);

      return s3Client.copyObject({
        Bucket: s3_config.bucket,
        CopySource: `${s3_config.bucket}/${sourceKey}`,
        Key: targetKey,
      }).promise().then(() => {
        console.log(`已备份文件: ${sourceKey} -> ${targetKey}`);
      });
    });

    await Promise.all(copyPromises);
    console.log(`文件夹已成功备份到 ${backupFolder}`);
  } catch (err) {
    console.error('备份 html 文件夹失败:', err);
  }
}

// 上传文件html至S3
function uploadsHtml3() {
  const src = path.join(base_config.destDir, '**/*.html');
  return uploadToS3Async(src, base_config.root);
}

exports.default = series(ensureDistExists, clean, parallel(htmlPack, staticPack), uploadsJs3, backupHtml, uploadsHtml3);