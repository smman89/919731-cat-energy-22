const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");


// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/app.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// HTML

const html = () => {
  return gulp.src("source/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html

//Scripts

const scripts = () => {
  return gulp.src("source/js/app.js")
    .pipe(terser())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream())
}
exports.scripts = scripts

//Images
const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}", "!source/img/icons/*.svg")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}
exports.images = images;


const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"))
}
exports.copyImages = copyImages

const copyFavicons = () => {
  return gulp.src("source/favicon/**/*.{ico,svg}")
    .pipe(gulp.dest("build/favicon"))
}
exports.copyFavicons = copyFavicons


// Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}
exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}
exports.sprite = sprite;

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.svg",
    "!source/img/icons/*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}
exports.copy = copy;


const clean = () => {
  return del("build");
};
exports.clean = clean;


const build = gulp.series(
  clean,
  copy,
  images,
  copyFavicons,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  )
);
exports.build = build;


exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  copyFavicons,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
