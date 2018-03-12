var express = require('express');
var router = express.Router();

/*  数据库操作 */
var Sequelize = require('sequelize');
var db = require('../configs/db');
const Document = db.define('document',{
    author : Sequelize.STRING
})
const Version = db.define('version', {
    timestamp : Sequelize.DATE
})
Document.hasMany(Version,{ as : 'workID'});

Document.sync({ force: false}).then(function (result) {
    console.log('init document mode success');
}).catch(function (reason) {
    console.log('init document model failure'+ reason);
})

Version.sync({ force: false}).then(function (result) {
    console.log('init version mode success');
}).catch(function (reason) {
    console.log('init version model failure'+ reason);
})
router.get('/test',function (req, res, next) {
    res.send('hello company');
});
module.exports = router;