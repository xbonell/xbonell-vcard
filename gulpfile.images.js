'use strict';

import gulp from 'gulp';
import image from 'gulp-image';

const paths = {
  src: 'src/images/**/*',
  dest: 'src/_static/assets/images',
};

// Define the task
const optimizeImages = () => {
  return gulp
    .src(paths.src, { encoding: false })
    .pipe(
      image({
        pngquant: false,
        optipng: true,
        zopflipng: false,
        jpegRecompress: true,
        jpegoptim: true,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 8,
      })
    )
    .pipe(gulp.dest(paths.dest));
};

gulp.task('images', optimizeImages);
