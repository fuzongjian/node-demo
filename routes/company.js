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

//  一对一关联

const Player = db.define('player',{
    username : { type: Sequelize.STRING, comment : '用户姓名' },
    age : { type : Sequelize.BIGINT(3), comment: '年龄' }
});
const Team = db.define('team',{
    name : { type: Sequelize.STRING, comment: '队名' },
    // uuid
    // uuid: { type:Sequelize.UUID, primaryKey: true, comment: '主键' }
});
const Address= db.define('address',{
   street : {type: Sequelize.STRING, comment: '街道'}
});
const  Child = db.define('child',{
    name: {type: Sequelize.STRING, comment: '姓名'}
});
// belongsTo 关联表示一对一 外键存在于源模型  外键将从目标模型的名称和主键名称生成
// Player.belongsTo(Team);
// Player.belongsTo(Team);

// 自定义外键
// Team.hasOne(Player, { foreignKey: 'initiator_id' });

// Team.hasOne(Player);
Player.hasOne(Team);
Player.hasOne(Address);
Player.hasMany(Child);

Player.sync({ force : false}).then(function (value) {
    console.log('init player model success')
}).catch(function (reason) {
    console.log('init player model failure'+reason)
});
Team.sync({ force : false}).then(function (value) {
    console.log('init team model success')
}).catch(function (reason) {
    console.log('init team model failure'+reason)
});
Address.sync({force: false}).then(function (value) {
    console.log('init address model success');
}).catch(function (reason) {
    console.log(reason);
})
Child.sync({force: false}).then(function (value) {
    console.log('init child model success');
}).catch(function (reason) {
    console.log(reason);
})

router.get('/test',function (req, res, next) {
    res.send('hello company');
});
// 1:1 添加
router.get('/add',function (req, res, next) {
    Player.create({username: '周润发', age: 25}).then(function (value) {
        var team = Team.build({name: '新加坡'});
        value.setTeam(team);
        var address = Address.build({street: '西源大道'});
        value.setAddress(address);
        res.send(JSON.stringify(value));
    }).catch(next);
});
// 1:1 关联关系查询，用include查询
router.post('/find',function (req, res, next) {
    Player.findOne({ include: [Team, Address], where: {username: req.body.username }}).then(function (value) {
        var json = {
            username: value.username,
            age: value.age,
            team: value.team.name,
            address: value.address.street
        };
        res.send(JSON.stringify(json));
    }).catch(function (reason) {
        res.send(JSON.stringify(reason.message));
    });
})
// 更新
router.post('/update',function (req, res, next) {
    Player.findOne({include: [Address], where: {username: req.body.username}}).then(function (value) {
        Address.update({street: '天天向上'},{ where: {playerId: value.id}}).then(function (value2) {
            res.send(JSON.stringify(value2));
        });
        // value.setAddress(address);
    }).catch(function (reason) {
        res.send(JSON.stringify(reason));
    })
})


module.exports = router;