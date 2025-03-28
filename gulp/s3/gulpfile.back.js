const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

// 定义源目录和目标目录
const srcDir = 'cits';
const jspackDir = 'jspack';
const htmlpackDir = 'htmlpack';

// 创建目标目录（如果不存在）
if (!fs.existsSync(jspackDir)) {
    fs.mkdirSync(jspackDir);
}
if (!fs.existsSync(htmlpackDir)) {
    fs.mkdirSync(htmlpackDir);
}

// Gulp任务：处理文件
gulp.task('process-files', function () {
    // 遍历源目录
    function processDirectory(srcPath, jspackPath, htmlpackPath) {
        const files = fs.readdirSync(srcPath);

        files.forEach(file => {
            const srcFilePath = path.join(srcPath, file);
            const stats = fs.lstatSync(srcFilePath);

            if (stats.isDirectory()) {
                // 如果是目录，则递归处理
                const newJspackPath = path.join(jspackPath, file);
                const newHtmlpackPath = path.join(htmlpackPath, file);

                if (!fs.existsSync(newJspackPath)) {
                    fs.mkdirSync(newJspackPath);
                }
                if (!fs.existsSync(newHtmlpackPath)) {
                    fs.mkdirSync(newHtmlpackPath);
                }

                processDirectory(srcFilePath, newJspackPath, newHtmlpackPath);
            } else {
                // 如果是文件，则根据类型复制到相应目录
                if (path.extname(file) === '.html') {
                    gulp.src(srcFilePath)
                        .pipe(gulp.dest(htmlpackPath));
                } else {
                    gulp.src(srcFilePath)
                        .pipe(gulp.dest(jspackPath));
                }
            }
        });
    }

    // 开始处理源目录
    processDirectory(srcDir, jspackDir, htmlpackDir);
});

// 默认任务
gulp.task('default', gulp.series('process-files'));

exports.default = defaultTask