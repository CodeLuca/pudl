
(function(require) {
  'use strict';

  var gulp, scss, sourcecmaps;

  gulp = require('gulp');
  scss = require('gulp-sass');
  sourcecmaps = require('gulp-sourcemaps');

  gulp.task('default', ['start']);

  gulp.task('start', function() {
    var nodemon, options;

    options = {
      server: 'app.js',
      watch: ['app.js', 'config.js', 'server']
    };

    nodemon = require('gulp-nodemon')(options);
  });

  gulp.task('scss', function() {
    gulp.src('src/scss/style.scss')
      .pipe(sourcecmaps.init())
      .pipe(scss({ includePaths: ['src/scss/'] }))
      .pipe(sourcecmaps.write('./maps'))
      .pipe(gulp.dest('public/css/'));
  });

  gulp.watch('src/scss/**/*.scss', ['scss']);
})(require);
