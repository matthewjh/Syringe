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

})