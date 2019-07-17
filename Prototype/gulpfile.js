var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver');

sass.compiler = require('node-sass');

gulp.task('sass', function() {
    //编译css
    //压缩css
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {
    gulp.src(['js/main', 'js/require','js/scrollto','js/backtop'])
        //.pipe(jshint())
        .pipe(concat('all.js')) //合并后的文件名
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('webserver',function() {
    gulp.src('.')
        .pipe(webserver({
            livereload:true,//实时刷新
            directoryListing: true,
            open:true,
            fallback: 'index.html'
        }));
});

gulp.task('serve', ['sass', 'scripts'], function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('javascripts/*js', ['scripts']);
    gulp.watch('*html').on('change', browserSync.reload);
});

gulp.task('default', ['serve','webserver']);
