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
var router = require('./routes/index');//首页
var flash = require('connect-flash');
// var fs = require('fs');
// var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
// var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.logger({stream: accessLogfile}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    url: 'mongodb://localhost/db'//链接数据库地址
  }),

  resave: false,
  saveUninitialized:true
}));
app.use(flash());

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


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
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
