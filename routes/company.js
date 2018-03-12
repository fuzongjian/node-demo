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

Document.hasMany(Version);

Document.sync({ force: false}).then(function (result) {
    console.log('init user mode success');
}).catch(function (reason) {
    console.log('init user model failure'+ reason);
})

Version.sync({ force: false}).then(function (result) {
    console.log('init user mode success');
}).catch(function (reason) {
    console.log('init user model failure'+ reason);
})
router.get('/test',function (req, res, next) {
    res.send('hello company');
});
module.exports = router;