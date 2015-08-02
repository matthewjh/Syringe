var gulp = require('gulp');
var ts = require('gulp-typescript');
var rimraf = require('gulp-rimraf');
var exec = require('child_process').exec;

gulp.task('clean-build-folder', function () {
  return gulp.src('built/**/*', { read: false })
    .pipe(rimraf());
});

gulp.task('build', ['clean-build-folder'], function (done) {
  var tsconfig = require("./tsconfig.json");
  var filesGlob = tsconfig.filesGlob;
  return gulp.src(filesGlob)
      .pipe(ts(tsconfig.compilerOptions))
      .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
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