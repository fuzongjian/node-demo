var express = require('express');
var router = express.Router();
/*  数据库操作 */
var Sequelize = require('sequelize');
var db = require('../db');
// 创建model
var User = db.define('user',{
  user_name: {
    type: Sequelize.STRING,// 指定值的类型
    field: 'username', // 指定存储在表中的键的名称
    comment: '用户姓名'
  },
  // 如果没有指定field，表中键名称则与对象键名相同，为email
  email:{
    type: Sequelize.STRING,
    comment: '邮箱'
  },
  create_at: {
    type: Sequelize.DATE,
    comment: '创建日期',
    defaultValue: Sequelize.NOW
  },
  desc: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
    comment: '是否被删除'
  }
},{
  // 如果为true 则表的名称和model相同，为 user
  // 为false  MySQL创建的表名称会是复数 users
  // 如果指定的表名称本就是复数形式则不变
  freezeTableName: false
});
// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 force = false
User.sync({ force: false}).then(function (result) {
  console.log('init user mode success');
}).catch(function (reason) {
  console.log('init user model failure'+ reason);
})
/*  数据库操作 */
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource good');
});
// add
router.post('/add',function (req, res, next) {
   var body = req.body;
   User.create({
      user_name: body.username,
      email: body.email,
      desc: body.desc,
      isDelete: false
   }).then(function (value) {
     res.send(JSON.stringify({ status: true, msg: 'success' }));
   }).catch(function (reason) {
     res.send(JSON.stringify({ status: false, msg: reason.message }));
   });
});
// findAll 查询所有符合条件的结果
router.get('/list',function (req, res, next) {
    var dataArray = [];
    User.findAll({ where: { isDelete: false }}).then(function (value) {
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
   User.find({ where : { user_name : body.username}}).then(function (value) {
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
    User.update({ email : req.body.email },{ where : { user_name : req.body.username }}).then(function (value) {
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
    User.destroy({ where : { email : req.body.email }}).then(function (value) {
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
