const gulp = require('gulp'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync').create(),
  uglify = require('gulp-uglify'),
  ts = require('gulp-typescript');

// 定义编译 JavaScript 文件的任务
gulp.task('jsscripts', function () {
  return gulp
    .src('src/*.ts')
    .pipe(babel()) // 使用 .babelrc 中的配置
    .pipe(uglify()) // 压缩文件
    .pipe(gulp.dest('dist'));
});

gulp.task('tsscripts', function () {
  return gulp
    .src('src/*.ts')
    .pipe(ts({ noImplicitAny: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task(
  'serve',
  gulp.series('jsscripts', 'tsscripts', function () {
    browserSync.init({
      server: { baseDir: './' },
    });
    gulp.watch('src/*.js', gulp.series('jsscripts')).on('change', browserSync.reload);
    gulp.watch('src/*.ts', gulp.series('tsscripts')).on('change', browserSync.reload);
    gulp.watch('*.html').on('change', browserSync.reload);
  })
);

gulp.task('default', gulp.series('serve'));
