import path from 'node:path';
import { Transform } from 'node:stream';
import { dest, parallel, src, task } from 'gulp';
import svgmin from 'gulp-svgmin';
import sharp from 'sharp';

const paths = {
  srcRoot: 'src/images',
  dest: 'src/_static/assets/images',
};

/**
 * Format byte counts for the optimization summary log.
 * @param {number} bytes
 * @returns {string}
 */
const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 2 : 1)} kB`;
};

/**
 * Optimize JPEG/PNG/WebP buffers with sharp (arm64-safe native bindings).
 * GIF/ICO and other formats are handled by separate copy/SVG tasks.
 */
const sharpOptimize = () =>
  new Transform({
    objectMode: true,
    async transform(file, _encoding, callback) {
      if (file.isNull()) {
        callback(null, file);
        return;
      }

      if (file.isStream()) {
        callback(new Error('Streaming is not supported'));
        return;
      }

      const ext = path.extname(file.path).toLowerCase();
      const before = file.contents.length;

      try {
        const image = sharp(file.contents, { failOn: 'none' });
        let optimized;

        if (ext === '.jpg' || ext === '.jpeg') {
          optimized = await image
            .jpeg({ mozjpeg: true, progressive: true, quality: 80 })
            .toBuffer();
        } else if (ext === '.png') {
          optimized = await image
            .png({ compressionLevel: 9, effort: 10, palette: true })
            .toBuffer();
        } else if (ext === '.webp') {
          optimized = await image.webp({ quality: 80 }).toBuffer();
        } else {
          callback(null, file);
          return;
        }

        if (optimized.length < before) {
          file.contents = optimized;
        }

        const after = file.contents.length;
        const reduced = before - after;
        const percent = before === 0 ? 0 : (reduced / before) * 100;
        console.log(
          `✔ ${file.relative} -> before=${formatBytes(before)} after=${formatBytes(after)} reduced=${formatBytes(reduced)} (${percent.toFixed(1)}%)`
        );

        callback(null, file);
      } catch (error) {
        callback(error);
      }
    },
  });

const optimizeRaster = () =>
  src(`${paths.srcRoot}/**/*.{jpg,jpeg,png,webp}`, {
    encoding: false,
    base: paths.srcRoot,
  })
    .pipe(sharpOptimize())
    .pipe(dest(paths.dest));

const optimizeSvg = () =>
  src(`${paths.srcRoot}/**/*.svg`, {
    encoding: false,
    base: paths.srcRoot,
  })
    .pipe(svgmin())
    .pipe(dest(paths.dest));

// Preserve animated GIF and ICO; sharp/svgmin are not the right tools for these.
const copyPassthrough = () =>
  src(
    [
      `${paths.srcRoot}/**/*`,
      `!${paths.srcRoot}/**/*.{jpg,jpeg,png,webp,svg}`,
      `!${paths.srcRoot}/**/*.{JPG,JPEG,PNG,WEBP,SVG}`,
    ],
    {
      encoding: false,
      base: paths.srcRoot,
    }
  ).pipe(dest(paths.dest));

task('images', parallel(optimizeRaster, optimizeSvg, copyPassthrough));
