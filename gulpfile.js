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

function runKarmaTests(confFile) {
  var karma = require('gulp-karma');
  var testFiles = [
    'built/test/**/*.js'
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
  return gulp.src('built/**/*', { read: false })
    .pipe(rimraf());
});

gulp.task('build', function (done) {
  var tsconfig = require("./tsconfig.json");
  var filesGlob = tsconfig.filesGlob;

  tsconfig.compilerOptions.typescript = require('typescript');
  
  var tsResult = gulp.src(filesGlob)
      .pipe(ts(tsconfig.compilerOptions));   

  return merge([
    tsResult.dts.pipe(gulp.dest(tsconfig.compilerOptions.outDir)),
    tsResult.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir))
  ]);
});

gulp.task('copy-api-definitions', function () {
  return gulp.src('./built/src/index.d.ts')
    .pipe(rename('syringe.d.ts'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-definitions', ['copy-api-definitions'], function () {
  return gulp.src('./definitions/es6-promise/**/*')
    .pipe(gulp.dest('./dist/es6-promise'));
});

gulp.task('package', ['build', 'copy-definitions'], function (done) {
  var outFolder = './dist';
  var browserify = require('browserify');
  var config = require('./browserify.conf.js');
  
  var b = browserify(config);

  return b
    .bundle()
    .pipe(source('syringe.js'))
    .pipe(buffer())
    .pipe(concat.header(fs.readFileSync('./license-comment.txt')))
    .pipe(gulp.dest(outFolder))
    .pipe(uglify())
    .pipe(concat.header(fs.readFileSync('./license-comment.txt')))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(outFolder));
});

gulp.task('unit', ['build'], function () {
  runKarmaTests('karma.conf.js');
});

gulp.task('unit.ci', ['build'], function () {
  runKarmaTests('karma-sauce.conf.js');
});