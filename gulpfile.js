var gulp = require('gulp');
var ts = require('gulp-typescript');
var rimraf = require('gulp-rimraf');
var exec = require('child_process').exec;

var typescriptProject = ts.createProject('tsconfig.json');

gulp.task('clean-build-folder', function () {
  return gulp.src('built/**/*', { read: false })
    .pipe(rimraf());
});

gulp.task('build', ['clean-build-folder'], function (done) {
  exec('tsc --p .', function (error, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    done(null);
  });
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