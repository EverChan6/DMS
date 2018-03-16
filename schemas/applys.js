var mongoose = require('mongoose');

// 申请表结构
module.exports = new mongoose.Schema({
	//姓名
    name: String,
    // 学号
    sid: {type: String, unique: true},
    // 学院
    college: String,
    // 性别
    gender: String,
    // 宿舍楼号
    dormitory: String,
    // 房间号
    room: String

});