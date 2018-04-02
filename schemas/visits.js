var mongoose = require("mongoose");

//来访信息表结构
module.exports = new mongoose.Schema({
	name: String,
	sex: String,
	reason: String,
	date: String,
	contact: String	
});