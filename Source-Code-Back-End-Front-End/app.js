var createError                         = require('http-errors');
var express                             = require('express');
var path                                = require('path');
var cookieParser                        = require('cookie-parser');
var logger                              = require('morgan');
const expressHandleBars                 = require('express-handlebars');
const mongoose                          = require('mongoose');
const session                           = require('express-session');
const passport                          = require('passport');
const flash                             = require('connect-flash');
const validator                         = require('express-validator');
const mongoStore                        = require('connect-mongo')(session);

/* Create mongodb connection
*  ShoppingCart is database name
*  27017 is port number
*  mongodb is protocol
*  127.0.0.1 is ip address
* */
mongoose.connect('mongodb://127.0.0.1:27017/OnlineFood', () => {
   // Check error
  if(err){
    console.log(err); // dicplay error on console.
    process.exit(-1); // terminate process.
  }
});

require('./config/passport');
const indexRouter                       = require('./routes/index');
const userRouter                        = require('./routes/users');

const app                               = express();

// view engine setup
app.engine('.hbs', expressHandleBars({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

// Create session.
app.use(session({
    secret: 'musupersecret',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
