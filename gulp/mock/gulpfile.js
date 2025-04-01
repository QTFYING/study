const gulp = require('gulp');
const mockServer = require('gulp-mock-server');
const { series } = gulp;

// Gulp任务：打包HTML文件
function mock() {
  return gulp.src('.')
    .pipe(mockServer({
      port: 8080,
      host: 'localhost',
      open: true,
      livereload: true,
      directoryListing: true
    }))
}

exports.default = series(mock);