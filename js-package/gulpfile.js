'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var bourbon = require("bourbon");
var nodeSass = require('node-sass').includePaths = [bourbon];


var bundler = browserify('./src/app.js', {
  fullPaths: true
});
bundler.exclude('crypto');

gulp.task('browserify', ['jshint'], function() {
  return bundler.bundle()
    .on('error', function(error) {
      console.log(error.message);
      this.emit('end');
    })
    .pipe(source('./app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

//不做压缩
gulp.task('browserify-no-uglify', ['jshint'], function() {
  return bundler.bundle()
    .on('error', function(error) {
      console.log(error.message);
      this.emit('end');
    })
    .pipe(source('./app.min.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
	return gulp.src(['src/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
});


gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
        includePaths : [ bourbon.includePaths ]
      })
    .on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['browserify-no-uglify', 'sass'], function() {
  gulp.watch('src/**/*.js', ['browserify-no-uglify']);
  gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('clean', function() {
	return gulp.src('./dist')
		.pipe(clean());
});

gulp.task('default', ['browserify']);