var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// MIDDLEWARES
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * SETUP I18N (idiomas)
 */
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);
i18n.setLocale('es');
console.log(i18n.__('EXAMPLE'));

require('./lib/connectMongoose');
require('./models/APIv1');

// API
app.use('/apiv1', require('./routes/apiv1'));

// WEB
app.use('/', require('./routes/index'));
app.use('/anuncios', require('./routes/anuncios'));
app.use('/tags', require('./routes/tags'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// MIDDLEWARE DE ERRORES
// Gestionar errores aquí
// error handler
app.use(function(err, req, res, next) {
  // Comprobar error de validación
  if(err.array){  // Comprobamos si err tiene una propiedad array
    err.status = 422; // Unprocessable Entity (WebDAV)
    const errInfo = err.array({ onlyFirstError:true })[0]; // Objeto de error de Express Validator
    // err.message = `Not valid - ${errInfo.param} must be ${errInfo.msg}`;
    err.message = isAPI(req) ? 
      {
        message: 'Not valid',
        errors: err.mapped()
      } :
      err.message = `Not valid - ${errInfo.param} must be ${errInfo.msg}`;
  }

  // Si viene error, lo cogemos. Si no, damos error 500
  res.status(err.status || 500);

  if(isAPI(req)){
    res.json({
      success: false,
      error: err.message
    });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

/**
 * Comprueba si una petición es al API o no a partir de su request
 */
function isAPI(req){
  return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;
