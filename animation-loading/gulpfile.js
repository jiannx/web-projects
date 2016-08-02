'use strict';

var path = require('path');
var browserify = require('browserify');
var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var pjson = require("./package");

var config = pjson.config;
var type = config.type;
var inJs = config.inJs;
var outJs = config.outJs;


var bundler = browserify('./src/' + inJs, {
    standalone: config.export,
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
});
bundler.exclude('crypto');

gulp.task('js', ['jshint'], function() {
    if (type == 'concat') {
        return gulp.src(['src/**/*.js', '!src/assets/**/*.js'])
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(concat(outJs)) //合并所有js到main.js
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist')); //输出
    } else if (type == 'browserify') {
        return bundler.bundle()
            .on('error', function(err) {
                console.log(err.message);
                this.emit('end');
            })
            .pipe(source('./' + outJs))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify({
                //mangle : false  //不混淆变量名
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    } else {
        console.error('please check config.type in package.json!');
    }
});

gulp.task('watch', ['js', 'sass', 'copy'], function() {
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/assets/**/*', ['copy']);
});

gulp.task('server', ['watch'], function() {
    connect.server({
        port: config.port
    });
});

//js语法校验
gulp.task('jshint', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

//scss编译
gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({
                outputStyle: 'compressed',
                includePaths: []
            })
            .on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function() {
    return gulp.src('./dist')
        .pipe(clean());
});

gulp.task('copy', function() {
    gulp.src('src/assets/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('build', ['js', 'sass']);

gulp.task('default', ['build']);
