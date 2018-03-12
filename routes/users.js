var express = require('express');
var router = express.Router();
var User = require('../models/user');
/*  数据库操作 */
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource good');
});
// add
router.post('/add',function (req, res, next) {
   var body = req.body;
   // 第一种写法 Promise的方式
   // User.create({
   //    user_name: body.username,
   //    email: body.email,
   //    desc: body.desc,
   //    isDelete: false
   // }).then(function (value) {
   //   res.send(JSON.stringify({ status: true, msg: 'success' }));
   // }).catch(function (reason) {
   //   res.send(JSON.stringify({ status: false, msg: reason.message }));
   // });
   // 第二种写法  await方式
   //  (async() => {
   //      try{
   //          var user = await User.create({
   //          user_name: body.username,
   //          email: body.email,
   //          desc: body.desc,
   //          isDelete: false
   //      });
   //          res.send(JSON.stringify(user));
   //      }catch(err){
   //          res.send(JSON.stringify({ msg : err.message }));
   //      }
   //  })();
    (async() => {
        try{
            var user = await User.addUser(body);
            res.send(JSON.stringify(user));
        }catch(err){
            res.send(JSON.stringify({ status: false, msg : err.message}));
        }
    })();

});
// findAll 查询所有符合条件的结果
router.get('/list',function (req, res, next) {
    var dataArray = [];
    User.findAll().then(function (value) {
      if (value.length != 0){
        for (var i = 0; i < value.length; i ++){
           var obj = {
              username: value[i].user_name,
              email: value[i].email,
              desc: value[i].desc
           }
           dataArray.push(obj);
        }
        res.send(JSON.stringify({ status: true, data: dataArray, msg: 'success'}));
      }else{
        res.send(JSON.stringify({ status: true, data: [], msg: 'success'}));
      }
    }).catch(function (reason) {
      res.send(JSON.stringify({ status: false, msg: reason.message }));
    });
});
// find  只会返回一个结果
router.post('/some',function (req, res, next) {
   var body = req.body;
   User.find({ user_name : body.username}).then(function (value) {
       var data = {
           username : value.user_name,
           email : value.email,
           desc : value.desc
       }
       res.send(JSON.stringify({ status : true, data: data }));
   }).catch(function (reason) {
       res.send(JSON.stringify({ status: false, msg: reason.message }));
   });
});
// update  前面是要更新的数值，后面是条件
router.post('/update',function (req, res, next) {
    User.update({ email : req.body.email }, { user_name : req.body.username }).then(function (value) {
        if(value[0] == 1){
            res.send(JSON.stringify({ status : true, msg : "success"}));
        }else{
            res.send(JSON.stringify({ status : true, msg : "failure"}));
        }
    }).catch(function (reason) {
        res.send(JSON.stringify({ status: false, msg : reason.message}));
    });
});
// delete some
router.post('/delete', function (req, res, next) {
    User.delete({ email : req.body.email }).then(function (value) {
       if( value == 1){
           res.send(JSON.stringify({ status : true, msg : "success" }));
       }else {
           res.send(JSON.stringify({ status : true, msg : "failure" }));
       }
    }).catch(function (reason) {
        res.send(JSON.stringify({ status: false, msg : reason.message }));
    });
})
module.exports = router;
