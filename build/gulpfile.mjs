import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import gulpSass from 'gulp-sass';
import sass from 'sass'

const _sass = gulpSass(sass)

const paths = {
  dest: {
    lib: '../lib',
    es: '../es',
  },
  styles: ['../src/index.scss'],
};

// scss -> css
function sass2css() {
  const { dest, styles } = paths;

  return gulp
    .src(styles)
    .pipe(_sass())
    .pipe(autoprefixer())
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

const build = gulp.parallel(sass2css);

export { build };
export default build;