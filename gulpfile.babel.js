'use strict';

import pkg          from './package.json';
import autoprefixer from 'autoprefixer';
import browser      from 'browser-sync';
import browserify   from 'browserify';
import buffer       from 'vinyl-buffer';
import colors       from 'colors';
import critical     from 'critical';
import cssnano      from 'cssnano';
import mqpacker     from 'css-mqpacker';
import gulp         from 'gulp';
import babel        from 'gulp-babel';
import image        from 'gulp-image';
import htmlmin      from 'gulp-htmlmin';
import plugins      from 'gulp-load-plugins';
import gutil        from 'gulp-util';
import handlebars   from 'handlebars';
import metalsmith   from 'metalsmith';
import moment       from 'moment';
import layouts      from 'metalsmith-layouts';
import markdown     from 'metalsmith-markdown';
import permalinks   from 'metalsmith-permalinks';
import rimraf       from 'rimraf';
import source       from 'vinyl-source-stream';
import yargs        from 'yargs';

const criticalStream = critical.stream;

// Load Gulp plugins
const $ = plugins();

// Look for the --production flag
const PRODUCTION = !!(yargs.argv.production);

// Main directories and Metalsmith configuration objects
const dir = {
  base: __dirname + '/',
  lib: __dirname + '/src/_lib/',
  source: './src/',
  dest: './dist/'
};

const siteMeta = {
  devBuild: !PRODUCTION,
  version: pkg.version,
  name: 'Xavier Bonell',
  desc: 'Front-End Web Developer',
  author: 'Xavier Bonell',
  contact: 'https://twitter.com/xbonell',
  domain: PRODUCTION ? 'http://localhost' : 'https://xbonell.com', // set domain
  rootpath: PRODUCTION ? null : '/' // set absolute path (null for relative)
};

const templateConfig = {
  engine:   'haml',
  directory: dir.source + '_templates/',
  partials:  dir.source + '_partials/',
  default:  'default.haml'
};

// PostCSS filters 
const processors = [
  autoprefixer({ browsers: ['last 2 versions', '> 5%'] }),  
  mqpacker({ sort: true }),
  cssnano()
];

// Build the "dist" folder by running all of the above tasks
gulp.task('build', gulp.series(clean, gulp.parallel(bundle, css, html, images, svg, minify)));

// Build site, run the server, and watch for file changes
gulp.task('default', gulp.series('build', minify, server, watch));

// Create JS bundle
// ----------------------------------------------------------------------------
function bundle() {
  return browserify('src/scripts/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.jslint())
    .pipe($.if(!PRODUCTION, $.sourcemaps.init({loadMaps: true})))
    .pipe($.if(PRODUCTION, $.uglify()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write('./')))
    .pipe(gulp.dest('dist/assets/js'));
};

// Delete the "dist" folder (this happens every time a build starts)
// ----------------------------------------------------------------------------
function clean(done) {
  rimraf('dist', done);
}

// Optimize CSS delivery
// ----------------------------------------------------------------------------
function optimizeCSS(done) {
  
  if (PRODUCTION) {
  
    return gulp.src('dist/**/*.html')
      .pipe(criticalStream({
        base: 'dist/',
        inline: true,
        css: ['dist/assets/css/style.css'],
        minify: true
      }))
      .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
      .pipe(gulp.dest('dist'));

  } else {

    done();

  }

}

// Compile Sass into CSS and apply PostCSS filters
// ----------------------------------------------------------------------------
function css() {
  return gulp.src('src/scss/style.scss')
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/css'));
}

// Build HTML
// ----------------------------------------------------------------------------
function html(done) {
  
  var ms = metalsmith(dir.base)
    .clean(PRODUCTION)
    .source(dir.source + 'content/')
    .destination(dir.dest)
    .metadata(siteMeta)  
    .use(markdown())
    .use(permalinks())
    .use(layouts(templateConfig))
    .build( function(err) {
      if (err) throw err;
      done();
    });

}

// Process images
// ----------------------------------------------------------------------------
function images() {
  return gulp.src('src/images/**/*')
    .pipe(image({
      pngquant: false,
      optipng: true,
      zopflipng: false,
      jpegRecompress: false,
      jpegoptim: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 8
    }))
    .pipe(gulp.dest('dist/assets/images'));  
}

// Minify HTML
// ----------------------------------------------------------------------------
function minify() {
  return gulp.src('dist/**/*.html')
    .pipe($.if(PRODUCTION, htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
}

// Start a server with LiveReload to preview the site in
// ----------------------------------------------------------------------------
function server(done) {
  browser.init({
    server: 'dist'
  });
  done();
}

// Process SVG files and generate sprite
// ----------------------------------------------------------------------------
function svg() {
  
  return gulp.src(['src/svg/*.svg'])
    .pipe($.rename(function (path) {
        path.basename = path.basename.replace(/__icon_prefix__/, '');
        return path;
      }))
      .pipe($.svgmin(function (file) {
        return {
          // https://github.com/svg/svgo/tree/master/plugins
          plugins: [
            { cleanupIDs: { remove: true, minify: true } }
            , { removeDoctype: true }
            , { removeComments: true }
            , { removeStyleElement: true }
            , { removeDimensions: true }
              , { cleanupNumericValues: { floatPrecision: 2  } }
              , { removeAttrs: { attrs: ['(fill|stroke|class|style)', 'svg:(width|height)'] } }
          ]
          //, js2svg: { pretty: true } // uncomment for readability 
        };
      }))
      .pipe($.svgstore())
      .pipe($.rename('sprite.svg'))
      .pipe(gulp.dest('./dist/assets/svg'));
}

// Watch for file changes
// ----------------------------------------------------------------------------
function watch() {

  gulp.watch(['src/content/**/*.md', 'src/_templates/**/*.haml', 'src/_partials/**/*.hbs'])
    .on('change', gulp.series(html, browser.reload));
  
  gulp.watch(['src/scss/**/*.scss'])
    .on('change', gulp.series(css, browser.reload));
  
  gulp.watch(['src/scripts/**/*.js'])
    .on('change', gulp.series(bundle, browser.reload));
  
  gulp.watch(['src/svg/**/*.svg'])
    .on('change', gulp.series(svg, browser.reload));
  
  gulp.watch(['src/images/**/*.{gif,jpg,jpeg,png}'])
    .on('change', gulp.series(images, browser.reload));

}