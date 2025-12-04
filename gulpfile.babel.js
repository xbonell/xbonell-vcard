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
import { dest, parallel, series, src, task, watch } from 'gulp';
import plugins from 'gulp-load-plugins';
import metalsmith from 'metalsmith';
import layouts from '@metalsmith/layouts';
import markdown from '@metalsmith/markdown';
import permalinks from '@metalsmith/permalinks';
import { rimraf } from 'rimraf';
import source from 'vinyl-source-stream';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import rev from 'gulp-rev';
import revDel from 'gulp-rev-delete-original';
import fs from 'fs';

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

// PostCSS filters - optimized for modern browsers
const processors = [
  autoprefixer({
    overrideBrowserslist: ['last 2 versions', 'not dead', 'not ie 11'],
  }),
  combineMediaQuery(),
  cssnano({
    preset: [
      'default',
      {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true,
      },
    ],
  }),
];

// Create JS bundle - optimized for modern browsers
// Uses browserslist config from package.json for target browsers
// ----------------------------------------------------------------------------
const bundle = () => {
  return browserify(`${dir.source}scripts/main.js`)
    .transform(babelify, {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
    })
    .transform(envify, { NODE_ENV: PRODUCTION ? 'production' : 'development' })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.jslint())
    .pipe(
      $.if(
        PRODUCTION,
        $.uglify({
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
          },
        })
      )
    )
    .pipe($.if(!PRODUCTION, $.sourcemaps.write('./')))
    .pipe(dest(`${dir.dest}assets/js`));
};

// Delete the "dist" folder (this happens every time a build starts)
// ----------------------------------------------------------------------------
const clean = async (done) => {
  try {
    await rimraf(dir.dest);
    done();
  } catch (error) {
    done(error);
  }
};

// Copy static files to root
// ----------------------------------------------------------------------------
const copy = () => {
  return src(`${dir.source}_static/**/*`, { encoding: false }).pipe(dest(dir.dest));
};

// Compile Sass into CSS and apply filters - optimized for modern browsers
// ----------------------------------------------------------------------------
const css = () => {
  return src(`${dir.source}scss/style.scss`)
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: PRODUCTION ? 'compressed' : 'expanded',
        includePaths: ['node_modules'],
      }).on('error', sass.logError)
    )
    .pipe($.postcss(processors))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(dest(`${dir.dest}assets/css`));
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

// Minify HTML
// ----------------------------------------------------------------------------
const minify = () => {
  return src(`${dir.dest}**/*.html`)
    .pipe(
      $.if(
        PRODUCTION,
        $.htmlmin({
          collapseWhitespace: true,
        })
      )
    )
    .pipe(dest(dir.dest));
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
  return src([`${dir.source}svg/*.svg`], { encoding: false })
    .pipe(
      $.rename(function (path) {
        path.basename = path.basename.replace(/__icon_prefix__/, '');
        return path;
      })
    )
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.rename('sprite.svg'))
    .pipe(dest(`${dir.dest}assets/images`));
};

// Watch for file changes
// ----------------------------------------------------------------------------
const watcher = () => {
  watch([`${dir.source}content/**/*.md`, `${dir.source}layouts/**/*.hbs`]).on(
    'change',
    series(html, minify, browser.reload)
  );
  watch([`${dir.source}scss/**/*.scss`]).on('change', series(css, browser.reload));
  watch([`${dir.source}scripts/**/*.js`]).on('change', series(bundle, browser.reload));
  watch([`${dir.source}svg/**/*.svg`]).on('change', series(svg, browser.reload));
};

// Hash static assets and rewrite HTML references
// ----------------------------------------------------------------------------
const hashAssets = (done) => {
  // First pass: hash assets and generate manifest
  src([`${dir.dest}assets/**/*.{css,js,gif,png,jpg,svg,ico}`], {
    base: 'dist',
    encoding: false,
  })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest(dir.dest))
    .pipe(rev.manifest())
    .pipe(dest(dir.dest))
    .on('end', () => {
      // Second pass: rewrite asset references in HTML and JS files
      // Paths have leading slashes (e.g., /assets/css/style.css)
      // but manifest keys don't (e.g., assets/css/style.css)
      // Uses fs-based approach due to gulp-rev-rewrite Gulp 5 incompatibility
      const manifestPath = `${dir.dest}rev-manifest.json`;
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      // Find all HTML and JS files that may contain asset references
      const filesToProcess = fs
        .readdirSync(dir.dest, { recursive: true })
        .filter((file) => file.endsWith('.html') || file.endsWith('.js'))
        .map((file) => `${dir.dest}${file}`);

      // Replace references in each file
      for (const filePath of filesToProcess) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace each manifest entry (add leading slash to match paths)
        for (const [original, hashed] of Object.entries(manifest)) {
          const searchPath = '/' + original;
          const replacePath = '/' + hashed;
          content = content.split(searchPath).join(replacePath);
        }

        fs.writeFileSync(filePath, content, 'utf8');
      }

      done();
    });
};

task('build', series(clean, parallel(bundle, css, html, svg, copy), hashAssets, minify));

// Build site, run the server, and watch for file changes
task('default', series(clean, parallel(bundle, css, html, svg, copy), server, watcher));
