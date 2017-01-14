/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const serve = require('gulp-serve');
const livereload = require('gulp-livereload');

const sourcePath = path.resolve(path.join(__dirname, 'src'));
const destPath = path.resolve(path.join(__dirname, 'build'));
const indexPath = path.join(sourcePath, 'index.html');
const scssPath = path.join(sourcePath, 'sass', '**');
const jsPath = path.join(sourcePath, 'js', '**');

function copyIndex() {
  return gulp
    .src(indexPath)
    .pipe(gulp.dest(destPath));
}

function buildCss() {
  return gulp
    .src(scssPath)
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest(destPath));
}

function buildJs() {
  return gulp
    .src(jsPath)
    .pipe(gulp.dest(destPath));
}

function reloadBrowser(callback) {
  setTimeout(() => {
    livereload.changed(path.join(__dirname, 'build'));

    callback();
  }, 200);
}

module.exports = {
  index: copyIndex,
  css: buildCss,
  js: buildJs,
  watch: watcher,
  reload: reloadBrowser,
};

const defaultSeries = gulp.series(copyIndex, buildCss, buildJs);

function watcher() {
  livereload.listen({ port: 26785 });

  gulp.watch(path.join(sourcePath, '**'), gulp.series(copyIndex, buildCss, buildJs, reloadBrowser));
}

gulp.task('serve', serve({
  root: ['build'],
  port: 7979,
}));

gulp.task('default', defaultSeries);
