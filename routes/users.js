var express = require('express');
var router = express.Router();
var path = require('path');

// const multer = require('multer');
// const upload = multer({ dest: path.join(__dirname, 'uploads') });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.post('/', function(req, res, next) {
//   upload.single('myFile');
//   console.log('success!');
// });

module.exports = router;
