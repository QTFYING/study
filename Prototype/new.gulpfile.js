var gulp = require('gulp'),
    compass = require('gulp-compass'),
    mincss = require('gulp-minify-css');

gulp.task('css', function() {
    //编译css
    //压缩css
    gulp.src('./sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: 'stylesheets',
            sass: 'sass'
        }))
        .pipe(mincss())
        .pipe(gulp.dest('./stylesheet'));
});

gulp.task('watch', function() {
    gulp.watch('./sass/*.scss', ['css'])
});

gulp.task('default', ['watch'], function() {
    // 将你的默认的任务代码放在这
    console.log("task default");
});
