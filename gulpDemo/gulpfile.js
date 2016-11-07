// 引入gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 检查脚本
gulp.task('lint', function () {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并,压缩文件
gulp.task('scripts', function () {
    gulp.src('./src/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// 默认任务
gulp.task('default', function () {
    gulp.run('lint', 'scripts');
});

// 监听文件变化
gulp.task('watch', function () {
    gulp.watch('./src/*.js', function () {
        gulp.run('lint', 'scripts');
    });
});  