const { watch } = require('gulp');
// const sass = require('gulp-sass');
const browserify = require("browserify");
const fs = require('fs');

function build_js(){
 return browserify("./src/js/main.js")
 .transform("babelify", { 
   presets: ["@babel/preset-env"]
   //plugins : ["babel-plugin-transform-class-properties"]
  })
  .bundle()
  .pipe(fs.createWriteStream("./public/dist.js"));
}

// function build_css() {
//   return src('./src/adminer/public/css/sass/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(dest('./src/adminer/public/css'));
// }

// exports.css = build_css;
// exports.ui = build_js;

exports.default = function() {
  // You can use a single task
  watch('src/js/**/*.js', build_js);
};