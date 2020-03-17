const browserify = require("browserify");
const fs = require('fs');

browserify("./src/js/main.js")
  .transform("babelify", {
    presets: ["@babel/preset-env"]
    //plugins : ["babel-plugin-transform-class-properties"]
  })
  .bundle()
  .pipe(fs.createWriteStream("./public/dist.js"));