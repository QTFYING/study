const { series } = require('gulp');
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

// 定义源目录和目标目录
const srcDir = 'dist';
const destDir = 'static';
const htmlDestDir = path.join(destDir, 'html');
const jsDestDir = path.join(destDir, 'js');

// 确保目标目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDirectoryExists(htmlDestDir);
ensureDirectoryExists(jsDestDir);

// Gulp任务：打包HTML文件
function htmlPack(cb) {
  gulp.src(path.join(srcDir, '**/index.html'), {base: srcDir})
    .pipe(gulp.dest(htmlDestDir))
    .on('end', cb)
    .on('error', cb);
}

// Gulp任务：打包JavaScript文件
function staticPack(cb) {
  gulp.src([path.join(srcDir, '**/*'), `!${path.join(srcDir, '**/*.html')}`], {base: srcDir})
    .pipe(gulp.dest(jsDestDir))
    .on('end', cb)
    .on('error', cb);
}

// 默认任务
exports.default = series(htmlPack, staticPack);