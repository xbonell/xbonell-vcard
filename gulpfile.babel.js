'use strict';

import pkg from './package.json';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import cssnano from 'cssnano';
import combineMediaQuery from 'postcss-combine-media-query';
import gulp from 'gulp';
import image from 'gulp-image';
import plugins from 'gulp-load-plugins';
import metalsmith from 'metalsmith';
import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
import permalinks from 'metalsmith-permalinks';
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import yargs from 'yargs';

// Load Gulp plugins
const $ = plugins();

// Look for args passed via cmd line parameters
const PRODUCTION = !!(yargs.argv.production);
const DEST = yargs.argv.dest;

// Main directories and Metalsmith configuration objects
const dir = {
  base: __dirname + '/',
  lib: __dirname + '/src/_lib/',
  source: './src/',
  dest: DEST || './dist/'
};

const siteMeta = {
  devBuild: !PRODUCTION,
  build: !PRODUCTION ? 'Development' : 'Production',
  version: pkg.version,
  name: 'Xavier Bonell',
  desc: 'Front-End Web Developer',
  author: 'Xavier Bonell',
  contact: 'https://twitter.com/xbonell',
  domain: PRODUCTION ? 'http://localhost' : 'https://xbonell.com', // set domain
  rootpath: PRODUCTION ? null : '/' // set absolute path (null for relative)
};

const templateConfig = {
  engine: 'haml',
  directory: dir.source + '_templates/',
  partials: dir.source + '_partials/',
  default: 'default.haml'
};

// PostCSS filters 
const processors = [
  autoprefixer(),
  combineMediaQuery(),
  cssnano()
];

// Create JS bundle
// ----------------------------------------------------------------------------
const bundle = () => {
  return browserify(`${dir.source}scripts/main.js`)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.jslint())
    .pipe($.if(!PRODUCTION, $.sourcemaps.init({
      loadMaps: true
    })))
    .pipe($.if(PRODUCTION, $.babel({
      presets: ['env']
    })))
    .pipe($.if(PRODUCTION, $.uglify()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write('./')))
    .pipe(gulp.dest(`${dir.dest}assets/js`));
};

// Delete the "dist" folder (this happens every time a build starts)
// ----------------------------------------------------------------------------
const clean = (done) => {
  rimraf(`${dir.dest}**/*`, done);
}

// Copy static files to root
// ----------------------------------------------------------------------------
const copy = () => {
  return gulp.src(`${dir.source}_static/*.*`)
    .pipe(gulp.dest(dir.dest));
}

// Compile Sass into CSS and apply PostCSS filters
// ----------------------------------------------------------------------------
const css = () => {
  return gulp.src(`${dir.source}scss/style.scss`)
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(`${dir.dest}assets/css`));
}

// Build HTML
// ----------------------------------------------------------------------------
const html = (done) => {

  metalsmith(dir.base)
    .clean(false)
    .source(`${dir.source}content/`)
    .destination(dir.dest)
    .metadata(siteMeta)
    .use(markdown())
    .use(permalinks())
    .use(layouts(templateConfig))
    .build(function (err) {
      if (err) throw err;
      done();
    });

}

// Process images
// ----------------------------------------------------------------------------
const images = () => {
  return gulp.src(`${dir.source}images/**/*`)
    .pipe(image({
      pngquant: false,
      optipng: true,
      zopflipng: false,
      jpegRecompress: true,
      jpegoptim: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 8
    }))
    .pipe(gulp.dest(`${dir.dest}assets/images`));
}

// Minify HTML
// ----------------------------------------------------------------------------
const minify = () => {
  return gulp.src(`${dir.dest}**/*.html`)
    .pipe($.if(PRODUCTION, $.htmlmin({
      collapseWhitespace: true
    })))
    .pipe(gulp.dest(dir.dest));
}

// Start a server with LiveReload to preview the site in
// ----------------------------------------------------------------------------
const server = (done) => {
  browser.init({
    server: dir.dest,
    startPath: 'ca/'
  });
  done();
}

// Process SVG files and generate sprite
// ----------------------------------------------------------------------------
const svg = () => {

  return gulp.src([`${dir.source}svg/*.svg`])
    .pipe($.rename(function (path) {
      path.basename = path.basename.replace(/__icon_prefix__/, '');
      return path;
    }))
    .pipe($.svgmin(function (file) {
      return {
        // https://github.com/svg/svgo/tree/master/plugins
        plugins: [{
          cleanupIDs: {
            remove: true,
            minify: true
          }
        }, {
          removeDoctype: true
        }, {
          removeComments: true
        }, {
          removeStyleElement: true
        }, {
          removeDimensions: true
        }, {
          cleanupNumericValues: {
            floatPrecision: 2
          }
        }, {
          removeAttrs: {
            attrs: ['(fill|stroke|class|style)', 'svg:(width|height)']
          }
        }]
        //, js2svg: { pretty: true } // uncomment for readability 
      };
    }))
    .pipe($.svgstore())
    .pipe($.rename('sprite.svg'))
    .pipe(gulp.dest(`${dir.dest}assets/images`));
}

// Watch for file changes
// ----------------------------------------------------------------------------
const watch = () => {
  gulp.watch([`${dir.source}content/**/*.md`, `${dir.source}_templates/**/*.haml`])
    .on('change', gulp.series(html, minify, browser.reload));

  gulp.watch([`${dir.source}scss/**/*.scss`])
    .on('change', gulp.series(css, browser.reload));

  gulp.watch([`${dir.source}scripts/**/*.js`])
    .on('change', gulp.series(bundle, browser.reload));

  gulp.watch([`${dir.source}svg/**/*.svg`])
    .on('change', gulp.series(svg, browser.reload));

  gulp.watch([`${dir.source}images/**/*.{gif,jpg,jpeg,png}`])
    .on('change', gulp.series(images, browser.reload));
}

// Build the "dist" folder by running all of the above tasks
gulp.task('build', gulp.series(clean, gulp.parallel(bundle, css, html, images, svg, copy), minify));

// Build site, run the server, and watch for file changes
gulp.task('default', gulp.series('build', server, watch));