// 加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var router = require('./routes/index');//路由
var flash = require('connect-flash');
// var fs = require('fs');
// var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
// var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'})

// 创建项目实例
var app = express();

// view engine setup 定义ejs模板引擎和模板文件位置，也可以使用jade或其他模型引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public 定义icon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.logger({stream: accessLogfile}));
app.use(logger('dev'));// 定义日志和输出级别
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());// 定义cookie解析器
app.use(express.static(path.join(__dirname, 'public')));// 定义静态文件目录
app.use(partials());//使用视图片段
app.use(session({ //链接mongoDB数据库，提供会话支持
  secret: settings.cookieSecret,
  store: new MongoStore({
    url: 'mongodb://localhost/db'//链接数据库地址
  }),

  resave: false,
  saveUninitialized:true
}));
app.use(flash());//定义connect-flash

//视图交互
app.use(function(req,res,next){
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;

  next();
});

//路由引入
app.use('/', router);


// catch 404 and forward to error handler // 404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler// 开发环境生产环境，500错误处理和错误堆栈跟踪
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.configure('production', function(){
// app.error(function (err, req, res, next) {
// var meta = '[' + new Date() + '] ' + req.url + '\n';
// errorLogfile.write(meta + err.stack + '\n');
// next();
// });
// });


module.exports = app;
