var config = require("./config.js");

var gulp = require("gulp"); // 引用gulp
var del = require("del"); // 引用gulp删除插件
var uglify = require("gulp-uglify"); // 压缩js文件
var css = require("gulp-clean-css"); // 压缩css
var rename = require("gulp-rename"); // 文件重命名

var postcss = require("gulp-postcss"); // 多个插件通过管道传递CSS，但是仅解析一次CSS

var concat = require("gulp-concat"); // 合并文件(js/css)
var debug = require("gulp-debug"); // bug打印
// var using = require("gulp-using");
var sourcemaps = require("gulp-sourcemaps"); // 存储源代码与编译代码对应位置映射的信息文件
var sass = require("gulp-sass"); // 编译sass
var autoprefixer = require("gulp-autoprefixer"); // css自动修复插件
// var autoprefixer = require("autoprefixer"); // css自动修复插件
var htmlprettify = require("gulp-html-prettify"); // html代码格式化
var fileinclude = require("gulp-file-include"); // include引入公共文件
var connect = require("gulp-connect"); // 热加载，配置一个服务器

// var importCss = require("gulp-import-css"); // import引入的css文件
// var bless = require("gulp-bless"); // 分割适合 IE <10的CSS文件
// var cssnano = require("gulp-cssnano"); // gulp压缩css文件

console.log(config);

gulp.task("hello", function () {
  console.log("helllo");
});

//task()：定义任务
//src():源文件
// pipe():管道流，接通源头文件与目标文件的输出
// dest():输出文件的目的地
// watch():监视文件
//事例：
// 1、复制单个文件
gulp.task("copyHtml", function () {
  return gulp.src("./src/public/login.html").pipe(gulp.dest("dist/public"));
});

// 2、复制多个文件
gulp.task("copyAllHtml", function () {
  return gulp.src("./src/public/*.html").pipe(gulp.dest("dist/public"));
});

// 3、复制指定文件
// [指定的文件1，指定的文件2]
gulp.task("copy2Js", function () {
  return gulp
    .src(["./src/public/js/ajax.js", "./src/public/js/classPage.js"])
    .pipe(gulp.dest("dist/public/js/"));
});

// 4、某个文件
// ！排队的文件
gulp.task("copyNoJs", function () {
  return gulp
    .src(["./src/public/js/*.js", "!./src/public/js/classroom.js"])
    .pipe(gulp.dest("./dist/public/js"));
});

// 5、复制多个后缀名的图片
// {选项一，选项二}
gulp.task("copyImage", function () {
  return gulp
    .src("./src/public/img/*.{png,jpg,bmp,jpeg,gif}")
    .pipe(gulp.dest("dist/public/img"));
});

// 6、执行多个任务
// gulp.task('任务名称',[任务依赖的模块],回调函数)
// 依赖任务之间没有顺序之分，异步执行
// 依赖任务之间完成后，在执行当前的回调函数
// gulp.task("build", ["copyAllHtml", "copyNoJs"], function () {
//   console.log("编译成功");
// });
gulp.task(
  "build",
  gulp.series("copyAllHtml", "copyNoJs", "copyImage", function (done) {
    console.log("-------");
    console.log("编译成功");
    console.log("-------");
    done();
  })
);

// 7、Watch:监视文件的变化
gulp.task("myWatch", function () {
  gulp.watch("./src/public/login.html", gulp.series("copyHtml"));
});

// 8、删除文件
gulp.task("del", function (done) {
  // del('./dist/public/img/*.{jpg,png,jepg,gif}')
  // *：所有文件
  // **：所有文件夹
  del(["./dist/public/js/*"]);
  //   del(["./dist/**/*"]);
  console.log("删除文件成功");
  done();
});

// 9、压缩js文件
gulp.task("ysjs", function () {
  return gulp
    .src("./src/public/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist/public/js"));
});

//10、 添加监听
gulp.task("watch_js", function () {
  return gulp.watch("./src/public/js/*.js", gulp.series("ysjs"));
});

//11、压缩css文件
// ./src/public/sass/*.css
gulp.task("css", function () {
  return gulp
    .src("./src/public/sass/*.css")
    .pipe(css())
    .pipe(gulp.dest("./dist/public/sass"));
});

//12、重命名css文件
gulp.task("reName", function () {
  return gulp
    .src("./src/public/sass/*.css")
    .pipe(rename({ suffix: ".min", extname: ".css1" }))
    .pipe(css())
    .pipe(gulp.dest("./dist/public/sass"));
});

//13、sass解析及合并文件
gulp.task("concat", function () {
  var cssFiles = [
    "./src/public/sass/index.css",
    "./src/public/sass/reset.css",
    "./src/public/sass/common.scss"
  ].concat("./src/public/sass/base.css");

  var plugins = [autoprefixer()];

  return (
    gulp
      .src(cssFiles)
      .pipe(sourcemaps.init({ includeContent: false, sourceRoot: "./" })) // sourcemaps init
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer())
      .pipe(css())
      // .pipe(postcss([autoprefixer(), css()])) // autoprefixer和css解析一直
      // .pipe(postcss(plugins))
      .pipe(concat("all.min.css"))
      .pipe(sourcemaps.write("/."))
      .pipe(gulp.dest("./dist/public/sass"))
  );
});

//14、html格式美化
gulp.task("prettifyHtml", function () {
  return gulp
    .src("./src/public/*.html")
    .pipe(htmlprettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("dist/public"));
});

//15、include引入公共文件
gulp.task("includeHtml", function () {
  return (
    gulp
      .src("./src/public/*.html")
      .pipe(debug({ title: "unicorn:" }))
      // .pipe(
      //   fileinclude({
      //     prefix: "@@", //变量前缀 @@include
      //     basepath: "./src/_include", //引用文件路径
      //     indent: true //保留文件的缩进
      //   })
      // )
      .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
      .pipe(htmlprettify({ indent_char: " ", indent_size: 2 }))
      .pipe(gulp.dest("dist/public"))
  );
});

//16 实现热更新+自动刷新
gulp.task("connect", function () {
  connect.server({
    root: "./dist",
    livereload: true,
    host: "0.0.0.0",
    port: 8081
  });
});

// Default server
gulp.task("server", gulp.series("includeHtml", "concat"));

// Default build
gulp.task("default", gulp.series("includeHtml", "concat"));

// Default default
gulp.task("build", gulp.series("includeHtml", "concat", "connect"));
