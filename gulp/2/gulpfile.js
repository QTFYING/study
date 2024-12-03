const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const uglify = require('gulp-uglify');

// 定义编译 JavaScript 文件的任务
gulp.task('compile-js', function () {
  return gulp.src('src/index.js')
    .pipe(uglify()) // 压缩文件
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

// 定义一个默认任务，它会在你运行 `gulp` 命令时执行
gulp.task('default', gulp.series('compile-js', function(done) {
  console.log('Compilation tasks completed!');
  done();
}));