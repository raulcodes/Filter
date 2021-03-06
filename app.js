var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var gm = require('gm');

var routes = require('./routes/index');
var users = require('./routes/users');


const upload = multer({ dest: path.join(__dirname, 'uploads') });

//declare userController
//const userController = require('./controllers/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

app.use('/', routes);
app.use('/users', users);

app.get('/', (req, res) => {
  res.render('views/index');
});

function getRandom() {
  var rand = [];

  for (var i = 0; i < 5; i++) {
    rand.push(Math.floor(Math.random() * 10));
  }
  return rand.join("");
}

app.post('/', upload.single('myFile'), (req, res, next) => {
  console.log(req.file);

  // fs.open("uploads/HackTX.png", "r", (err, file) => {
  //   if (file) {
  //     fs.unlink('uploads/HackTX.png', (err) => {
  //       if (err) {
  //         console.log('error deleting file');
  //       }
  //       else console.log('done');
  //     });
  //   }
  // });
  //
  // fs.open("uploads/resize.png", "r", (err, file) => {
  //   if (file) {
  //     fs.unlink('uploads/resize.png', (err) => {
  //       if (err) {
  //         console.log('error deleting file');
  //       }
  //       else console.log('done');
  //     });
  //   }
  // });

  // var rand = getRandom();
  // var res = getRandom();
  // var resPath = res + '.png';
  // var path = 'uploads/' + rand + '.png';

  fs.rename(req.file.path, req.file.destination + '/propic.png');
  // //req.file.filename = req.file.filename + '.png';
  console.log(path);

  gm('uploads/propic.png').size(function(err, value) {
    if (value) {

      if (value.height <= 1000) {

        //scale filter down to pro pic size
        gm('uploads/filter.png')
          .scale(value.width, value.height)
          .write('uploads/newfilter.png', (err) => {
            if (err) { console.log('scale of filter failed'); }
          });

        setTimeout(function() {
          gm('uploads/propic.png')
            .draw(['image Over 0,0 0,0 uploads/newfilter.png'])
            .write('uploads/HackTX.png', function(err){
              if (!err) { console.log('done'); }
            });
        }, 5500);

      } else {
        gm('uploads/propic.png')
          .scale(1000, 1000)
          .draw(['image Over 0,0 0,0 uploads/filter.png'])
          .write('uploads/HackTX.png', function(err){
            if (!err) { console.log('done'); }
          });
      }

    } else console.log('error printing size of photo');
  });

  setTimeout(function() { res.render('index.jade', { name: 'HackTX.png' }); }, 2000);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
