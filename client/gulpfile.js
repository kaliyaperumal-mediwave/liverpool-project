const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

gulp.task('sass', () => {
  return gulp.src('lib/modules/apostrophe-assets/public/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('lib/modules/apostrophe-assets/public/css'))
});


gulp.task('minify-css', () => {
  return gulp.src('lib/modules/apostrophe-assets/public/css/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('lib/modules/apostrophe-assets/public/css'));
});


gulp.task('watch', () => {
  gulp.watch('lib/modules/apostrophe-assets/public/scss/**/*.scss', gulp.series('sass','minify-css'));
});

gulp.task('default',gulp.series('watch'));
