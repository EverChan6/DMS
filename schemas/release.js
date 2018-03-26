var mongoose = require("mongoose");

//报修表结构
module.exports = new mongoose.Schema({
	title: String,
	auther: String,
	contents: String,
	time: String
});