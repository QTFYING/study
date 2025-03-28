const { series, watch } = require('gulp');
const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');
const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper');

// 配置对象
const config = {
  srcDir: 'dist',
  destDir: 'static',
  htmlDestDir: path.join('static', 'html'),
  jsDestDir: path.join('static', 'js'),
  zipUrl: 'https://package.itcjf.com/packages/tibet-airline-oss/1686808649248/tibet-airline-oss-1686808649248.zip', // 替换为实际的 ZIP 包 URL
  zipDest: 'temp.zip', // 临时存储 ZIP 包的路径
};

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

// 文件监听任务
function watchFiles() {
  watch(path.join(config.srcDir, '**/*.html'), htmlPack);
  watch([path.join(config.srcDir, '**/*'), `!${path.join(config.srcDir, '**/*.html')}`], staticPack);
}

// 默认任务
exports.default = series(ensureDistExists, clean, htmlPack, staticPack);