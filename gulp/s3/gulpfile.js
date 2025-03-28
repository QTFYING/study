const { series, watch } = require('gulp');
const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');

// 配置对象
const config = {
  srcDir: 'dist',
  destDir: 'static',
  htmlDestDir: path.join('static', 'html'),
  jsDestDir: path.join('static', 'js'),
};

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
exports.default = series(clean, htmlPack, staticPack, watchFiles);