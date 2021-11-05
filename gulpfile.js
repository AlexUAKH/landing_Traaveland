const preprocessor = "sass";
const fileswatch = "html,htm,txt,json,md,woff2"; // List of files extensions for watching & hard reload

const source_folder = "app";
const project_folder = "dist";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/"
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: [source_folder + "/styles/*.*", "!" + source_folder + "/styles/_*.*"], //source_folder + "/scss/style.scss",
    js: [source_folder + "/js/*.js", "!" + source_folder + "/js/*.min.js"], // source_folder + "/js/script.js",
    img: [source_folder + "/images/src/**/*"], //source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",//
    fonts: source_folder + "/fonts/*.ttf"
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/styles/**/*.scss",
    js: [
      source_folder + "/js/**/*.js",
      "!" + source_folder + "/js/**/*.min.js"
    ], //source_folder + "/js/**/*.js",
    img: source_folder + "/img/src/**/*" //source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
  },
  clean: "./" + project_folder + "/"
};

import pkg from "gulp";
const { src, dest, parallel, series, watch } = pkg;

import browserSync from "browser-sync";
import bssi from "browsersync-ssi";
import ssi from "ssi";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import gulpSass from "gulp-sass";
import sass from "sass";

const scss = gulpSass(sass);
import group_css_media from "gulp-group-css-media-queries";
import clean_css from "gulp-clean-css";
import rename from "gulp-rename";

//import dartSass from "sass";
//import sassglob from "gulp-sass-glob";
//const sass = gulpSass(dartSass);

import postcss from "gulp-postcss";
//import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import concat from "gulp-concat";
import rsync from "gulp-rsync";
import del from "del";

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./" + source_folder + "/",
      middleware: bssi({ baseDir: "./" + source_folder + "/", ext: ".html" })
    },
    ghostMode: { clicks: false },
    notify: false,
    online: true
    // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
  });
}

function scripts() {
  return src(path.src.js)
    .pipe(
      webpackStream(
        {
          mode: "production",
          performance: { hints: false },
          plugins: [
            new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery",
              "window.jQuery": "jquery"
            }) // jQuery (npm i jquery)
          ],
          module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env"],
                    plugins: ["babel-plugin-root-import"]
                  }
                }
              }
            ]
          },
          optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                terserOptions: { format: { comments: false } },
                extractComments: false
              })
            ]
          }
        },
        webpack
      )
    )
    .on("error", function handleError() {
      this.emit("end");
    })
    .pipe(concat("app.min.js"))
    .pipe(dest(source_folder + "/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      }).on("error", scss.logError)
    )
    .pipe(group_css_media())
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: ["last 5 versions"],
          cascade: true
        })
      ])
    )
    .pipe(dest(source_folder + "/css/"))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(source_folder + "/css/"))
    .pipe(browserSync.stream());

  // return src(path.src.css)
  //   .pipe(sassglob())
  //   .pipe(sass({ "include css": true }))
  //   .pipe(
  //     postCss([
  //       autoprefixer({ grid: "autoplace" }),
  //       cssnano({
  //         preset: ["default", { discardComments: { removeAll: true } }]
  //       })
  //     ])
  //   )
  //   .pipe(dest(source_folder + "/css"))
  //   .pipe(concat("app.min.css"))
  //   .pipe(dest(source_folder + "/css"))
  //   .pipe(browserSync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(changed("app/images/dist"))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    )
    .pipe(dest(source_folder + "/images/dist"))
    .pipe(browserSync.stream());
}

function buildcopy() {
  return src(
    [
      source_folder + "/js",
      source_folder + "/css/*.*",
      source_folder + "/js/*.*",
      source_folder + "/img/**/*.*",
      "!" + source_folder + "/img/src/**/*",
      source_folder + "/fonts/**/*"
    ],
    { base: source_folder + "/" }
  ).pipe(dest(project_folder));
}

async function buildhtml() {
  let includes = new ssi(
    source_folder + "/",
    project_folder + "/",
    "/**/*.html"
  );
  includes.compile();
  del(project_folder + "/parts", { force: true });
}

async function cleandist() {
  del(project_folder + "/**/*", { force: true });
}

function deploy() {
  return src(project_folder + "/**").pipe(
    rsync({
      root: project_folder + "/",
      hostname: "username@yousite.com",
      destination: "yousite/public_html/",
      // clean: true, // Mirror copy with file deletion
      include: [
        /* '*.htaccess' */
      ], // Included files to deploy,
      exclude: ["**/Thumbs.db", "**/*.DS_Store"],
      recursive: true,
      progress: true,
      archive: true,
      silent: false,
      compress: true
    })
  );
}

function startwatch() {
  watch(path.watch.css, { usePolling: true }, styles);
  watch(path.watch.js, { usePolling: true }, scripts);
  watch(path.watch.img, { usePolling: true }, images);
  watch(`${source_folder}/**/*.{${fileswatch}}`, { usePolling: true }).on(
    "change",
    browserSync.reload
  );
}

export { scripts, styles, images, deploy };
export let assets = series(scripts, styles, images);
export let build = series(
  cleandist,
  images,
  scripts,
  styles,
  buildcopy,
  buildhtml
);
export default series(
  scripts,
  styles,
  images,
  parallel(browsersync, startwatch)
);
