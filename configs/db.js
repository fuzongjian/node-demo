var Sequelize = require('sequelize');
module.exports = new Sequelize('orm','root','123456',{
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    pool:{
        max: 5, // 连接池中最大的连接数量
        min: 0, // 连接池中最小的连接数量
        idle: 10000 // 如果一个线程10秒钟内没有被使用的话，那么就释放线程
    },
    logging : false   // 是否输出sql日志
})