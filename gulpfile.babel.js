'use strict';

import pkg from './package.json';
import autoprefixer from 'autoprefixer';
import babelify from 'babelify';
import browser from 'browser-sync';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import cssnano from 'cssnano';
import combineMediaQuery from 'postcss-combine-media-query';
import dartSass from 'sass';
import envify from 'envify';
import gulp from 'gulp';
import image from 'gulp-image';
import plugins from 'gulp-load-plugins';
import metalsmith from 'metalsmith';
import layouts from '@metalsmith/layouts';
import markdown from '@metalsmith/markdown';
import permalinks from '@metalsmith/permalinks';
import { rimraf } from 'rimraf';
import source from 'vinyl-source-stream';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Load plugins
const $ = plugins();
const sass = $.sass(dartSass);
const argv = yargs(hideBin(process.argv)).parse();

// Look for args passed via cmd line parameters
const PRODUCTION = !!argv.production;
const DEST = argv.dest;

// Main directories and Metalsmith configuration objects
const dir = {
  base: __dirname + '/',
  lib: __dirname + '/src/_lib/',
  source: './src/',
  dest: DEST || './dist/',
};

const siteMeta = {
  version: pkg.version,
  name: 'Xavier Bonell',
  desc: 'Front-End Web Developer',
  author: 'Xavier Bonell',
  contact: 'https://x.com/xbonell',
  domain: PRODUCTION ? 'https://xbonell.com' : 'http://localhost',
  rootpath: '/',
};

const templateConfig = {
  directory: dir.source + 'layouts',
  default: 'default.hbs',
  pattern: '**/*.html',
  transform: 'handlebars',
  engineOptions: {
    helpers: {
      eq: (a, b) => a === b,
      year: () => new Date().getFullYear(),
    },
  },
};

// PostCSS filters
const processors = [autoprefixer(), combineMediaQuery(), cssnano()];

// Create JS bundle
// ----------------------------------------------------------------------------
const bundle = () => {
  return browserify(`${dir.source}scripts/main.js`)
    .transform(babelify, { presets: ['@babel/preset-env'] })
    .transform(envify, { NODE_ENV: PRODUCTION ? 'production' : 'development' })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.jslint())
    .pipe($.if(PRODUCTION, $.uglify()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write('./')))
    .pipe(gulp.dest(`${dir.dest}assets/js`));
};

// Delete the "dist" folder (this happens every time a build starts)
// ----------------------------------------------------------------------------
const clean = (done) => {
  rimraf(`${dir.dest}**/*`);
  done();
};

// Copy static files to root
// ----------------------------------------------------------------------------
const copy = () => {
  return gulp.src(`${dir.source}_static/**/*`, { encoding: false }).pipe(gulp.dest(dir.dest));
};

// Compile Sass into CSS and apply filters
// ----------------------------------------------------------------------------
const css = () => {
  return gulp
    .src(`${dir.source}scss/style.scss`)
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe(
      sass({ outputStyle: $.if(PRODUCTION, 'compressed', 'expanded') }).on('error', sass.logError)
    )
    .pipe($.postcss(processors))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(`${dir.dest}assets/css`));
};

// Build HTML
// ----------------------------------------------------------------------------
const html = (done) => {
  metalsmith(dir.base)
    .metadata(siteMeta)
    .source(`${dir.source}content/`)
    .destination(dir.dest)
    .clean(false)
    .use(markdown())
    .use(permalinks())
    .use(layouts(templateConfig))
    .build(function (err) {
      if (err) throw err;
      done();
    });
};

// Process images
// ----------------------------------------------------------------------------
const images = () => {
  return gulp
    .src(`${dir.source}images/**/*`, { encoding: false })
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
    .pipe(gulp.dest(`${dir.source}_static/assets/images`));
};

// Minify HTML
// ----------------------------------------------------------------------------
const minify = () => {
  return gulp
    .src(`${dir.dest}**/*.html`)
    .pipe(
      $.if(
        PRODUCTION,
        $.htmlmin({
          collapseWhitespace: true,
        })
      )
    )
    .pipe(gulp.dest(dir.dest));
};

// Start a server with LiveReload to preview the site in
// ----------------------------------------------------------------------------
const server = (done) => {
  browser.init({
    server: dir.dest,
    startPath: 'ca/',
    open: false,
  });
  done();
};

// Process SVG files and generate sprite
// ----------------------------------------------------------------------------
const svg = () => {
  return gulp
    .src([`${dir.source}svg/*.svg`], { encoding: false })
    .pipe(
      $.rename(function (path) {
        path.basename = path.basename.replace(/__icon_prefix__/, '');
        return path;
      })
    )
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.rename('sprite.svg'))
    .pipe(gulp.dest(`${dir.dest}assets/images`));
};

// Watch for file changes
// ----------------------------------------------------------------------------
const watch = () => {
  gulp
    .watch([`${dir.source}content/**/*.md`, `${dir.source}layouts/**/*.hbs`])
    .on('change', gulp.series(html, minify, browser.reload));
  gulp.watch([`${dir.source}scss/**/*.scss`]).on('change', gulp.series(css, browser.reload));
  gulp.watch([`${dir.source}scripts/**/*.js`]).on('change', gulp.series(bundle, browser.reload));
  gulp.watch([`${dir.source}svg/**/*.svg`]).on('change', gulp.series(svg, browser.reload));
  gulp
    .watch([`${dir.source}images/**/*.{gif,jpg,jpeg,png}`])
    .on('change', gulp.series(images, copy, browser.reload));
};

// Process images
gulp.task('images', gulp.series(images));

// Build the "dist" folder by running all of the above tasks
gulp.task('build', gulp.series(clean, gulp.parallel(bundle, css, html, svg, copy), minify));

// Build site, run the server, and watch for file changes
gulp.task('default', gulp.series('build', server, watch));
