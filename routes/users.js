var express = require('express');
var router = express.Router();
// 数据库操作
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource good');
});

module.exports = router;
