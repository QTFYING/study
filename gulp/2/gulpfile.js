const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');

// 定义编译 JavaScript 文件的任务
gulp.task('scripts', function () {
  return gulp.src('src/*.js')
    .pipe(babel()) // 使用 .babelrc 中的配置
    .pipe(uglify()) // 压缩文件
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', gulp.series('scripts', function () {
    browserSync.init({
      server: { baseDir: './'}
  });
  gulp.watch('src/*.js', gulp.series('scripts')).on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));