/*  数据库操作 */
var Sequelize = require('sequelize');
var db = require('../configs/db');
// 创建model
var User = db.define('user',{
    user_name: {
        type: Sequelize.STRING,// 指定值的类型
        field: 'username', // 指定存储在表中的键的名称
        comment: '用户姓名',
        allowNull: false,
    },
    // 如果没有指定field，表中键名称则与对象键名相同，为email
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        validate : { isEmail: { args: true, msg: "请输入正确的邮箱地址" } },//  验证属性是否符合条件，自定义错误消息
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
    freezeTableName: false,
    timestamps : false,// 不添加时间戳属性（updatedAt,createdAt）
    // 定义表的名称
    tableName: 'user',

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
exports.addUser = function (body) {
    return User.create({
        user_name: body.username,
        email: body.email,
        desc: body.desc,
        isDelete: false
    })
};
exports.findAll = function (option) {
    return User.findAll({ where : { isDelete: false}});
}
exports.find = function (option) {
    return User.find({ where : option});
}
exports.update = function (option, value) {
    return User.update(option,{ where : value});
}
exports.delete = function (option) {
    return User.destroy({ where : option });
}