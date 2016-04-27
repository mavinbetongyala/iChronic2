var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

gulp.task('babel', () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', () => {
  gulp.watch('./src/js/**/*.js', ['babel']);
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['babel', 'sass', 'watch']);
