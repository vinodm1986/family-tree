'use strict';
/*
Description: 
    Entry to the application
Author: 
    Vinod Mohanan
Update log:
        
*/
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var passport = require('passport');
var flash = require('connect-flash');
var appConfig = require('../config/app-config');
var members = require('./controllers/member-controller').router;
var login = require('./controllers/login-controller').router;
var authStrategies = require('./auth/auth-strategies');
var log = log4js.getLogger("startup");
var mongoose = require('mongoose');

mongoose.connect(appConfig.database.development);
var db = mongoose.connection;
db.on('error', (err) => { log.error(`Error connecting to db ${err}`); });
db.once('open', () => { log.debug('connected to Mongo DB'); });
passport.serializeUser(function(user, done) {
  console.log('user.id = ' + user.id);
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  console.log('obj.id = ' + user.id);
  done(null, user);
});
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: log4js.levels.INFO, format: ':method :url' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
passport.use(authStrategies.FacebookStrategy);
app.use(passport.initialize());
app.use(session({secret:'OKFamilyApp',resave:true,saveUninitialized:true}));
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', login);
app.use('/members', members);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});



module.exports = app;
