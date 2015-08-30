var gulp = require('gulp');
var ts = require('gulp-typescript');
var rimraf = require('rimraf');
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
var path = require('path');
var browserify = require('browserify');
var config = require('./browserify.conf.js');

var paths = {
	builtFolder: '../built',
	distFolder: 'dist'
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

	gulp.task('clean', function (done) {
		rimraf('./built', done);
	});
	
	gulp.task('clean-dist', function (done) {
		rimraf('./' + paths.distFolder, done);
	});

	gulp.task('build', function () {
		var tsconfig = require('../tsconfig.json');
		tsconfig.compilerOptions.typescript = require('typescript');
		
		var filesGlob = tsconfig.filesGlob;
		var tsResult = gulp.src(filesGlob).pipe(ts(tsconfig.compilerOptions));
		var dtsDestStream = tsResult.dts.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
		var tsDestStream = tsResult.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
		
		// A bit nasty
		dtsDestStream
		.on('end', function() {
			bundleDts(path.resolve('built', 'src'));
		});
		
		return merge(
			tsDestStream,
			dtsDestStream,
			gulp.src('build/to-copy/**/*').pipe(gulp.dest('built'))
		);
	});

	gulp.task('package', ['build'], function (done) {
		var b = browserify(config);
		var browserifyStream = b
			.bundle()
			.pipe(source('syringe.js'))
			.pipe(buffer())
			.pipe(concat.header(fs.readFileSync('./license-comment.txt')))
			.pipe(gulp.dest(paths.distFolder))
			.pipe(uglify())
			.pipe(concat.header(fs.readFileSync('./license-comment.txt')))
			.pipe(rename({ extname: '.min.js' }))
			.pipe(gulp.dest(paths.distFolder));
			
		browserifyStream.on('finish', function() {
			bundleDts(path.resolve(paths.distFolder));
		});
			
		return merge(
			browserifyStream,
			gulp.src(['**/*', 'lazy.d.ts'], { cwd: paths.builtFolder + '/src/' })
				.pipe(gulp.dest(paths.distFolder))
		);
	});

	gulp.task('test', ['build'], function () {
		return runKarmaTests('karma.conf.js');
	});

	gulp.task('test.sauce', ['build'], function () {
		return runKarmaTests('karma-sauce.conf.js');
	});

	gulp.task('test.tsc', ['build'], require('./gulp-tasks/run-tsc-tests'));
};