var config = {
  compile_dir: "dist",
  tmp_dir: "tmp",
  vendor_files: {
    js: [
      "./vendor/jquery/dist/jquery.js",
      "./vendor/popper.js/dist/umd/popper.js",
      "./vendor/bootstrap/dist/js/bootstrap.js",
      "./vendor/skrollr/dist/skrollr.min.js",
      "./vendor/particles.js/particles.js"
    ],
    js_copy: [],
    css: ["./vendor/normalize/normalize.css"]
  },
  app_files: {
    js: [
      "./src/js/libs/*.js",
      "./src/js/action/*.js",
      "./src/js/init.scripts.js"
    ],
    css: []
  }
};
module.exports = config;
