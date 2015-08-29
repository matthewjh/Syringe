var gulp = require('gulp');
var ts = require('gulp-typescript');
var rimraf = require('gulp-rimraf');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var concat = require('gulp-concat-util');
var exec = require('child_process').exec;
var fs = require('fs');
var merge = require('merge2');
var bundleDts = require('./dts-bundle');
var browserify = require('browserify');
var config = require('./browserify.conf.js');

var paths = {
	builtFolder: '../built',
	distFolder: '../dist'
};

module.exports = function () {
	function runKarmaTests(confFile) {
		var karma = require('gulp-karma');
		var testFiles = [
			'built/test/karma/**/*.js'
		];

		return gulp.src(testFiles)
			.pipe(karma({
				configFile: confFile,
				action: 'run'
			}))
			.on('error', function (err) {
				// Make sure failed tests cause gulp to exit non-zero 
				throw err;
			});
	}

	gulp.task('clean-build-folder', function () {
		return gulp.src(paths.builtFolder + '**/*', { read: false })
			.pipe(rimraf());
	});

	gulp.task('build', function (done) {
		var tsconfig = require('../tsconfig.json');
		var filesGlob = tsconfig.filesGlob;

		tsconfig.compilerOptions.typescript = require('typescript');

		var tsResult = gulp.src(filesGlob)
			.pipe(ts(tsconfig.compilerOptions));
		
		tsResult.dts.pipe(gulp.dest(tsconfig.compilerOptions.outDir))
		.on('end', function() {
			console.log('hello');
			bundleDts();
			done();
		});
		
		tsResult.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
	});

	gulp.task('package', ['build'], function (done) {
		var b = browserify(config);

		return b
			.bundle()
			.pipe(source('syringe.js'))
			.pipe(buffer())
			.pipe(concat.header(fs.readFileSync('./license-comment.txt')))
			.pipe(gulp.dest(paths.distFolder))
			.pipe(uglify())
			.pipe(concat.header(fs.readFileSync('./license-comment.txt')))
			.pipe(rename({ extname: '.min.js' }))
			.pipe(gulp.dest(paths.distFolder));
	});

	gulp.task('test', ['build'], function () {
		return runKarmaTests('karma.conf.js');
	});

	gulp.task('test.sauce', ['build'], function () {
		return runKarmaTests('karma-sauce.conf.js');
	});

	gulp.task('test.tsc', ['build'], require('./gulp-tasks/run-tsc-tests'));
};