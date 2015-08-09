var gulp = require('gulp');
var ts = require('gulp-typescript');
var rimraf = require('gulp-rimraf');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var exec = require('child_process').exec;

gulp.task('clean-build-folder', function () {
  return gulp.src('built/**/*', { read: false })
    .pipe(rimraf());
});

gulp.task('build', function (done) {
  var tsconfig = require("./tsconfig.json");
  var filesGlob = tsconfig.filesGlob;
  return gulp.src(filesGlob)
      .pipe(ts(tsconfig.compilerOptions))
      .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});

gulp.task('copy-api-definitions', function () {
  return gulp.src('./definitions/api.d.ts')
    .pipe(rename('syringe.d.ts'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-definitions', ['copy-api-definitions'], function() {
    return gulp.src('./definitions/es6-promise/**/*')
      .pipe(gulp.dest('./dist/es6-promise'));
});

gulp.task('package', ['build', 'copy-definitions'], function (done) {
  var outFolder = './dist';
  var browserify = require('browserify');
  var b = browserify({
    entries: 'built/src/index.js',
    debug: false,
    standalone: 'syringe'
  });
  
  return b
    .bundle()
    .pipe(source('syringe.js'))
    .pipe(buffer())
    .pipe(gulp.dest(outFolder))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(outFolder));
});

gulp.task('unit', ['build'], function () {
  var karma = require('gulp-karma');
  var testFiles = [
    'built/test/**/*.js'
  ];
  
  return gulp.src(testFiles)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero 
        throw err;
      });  
});