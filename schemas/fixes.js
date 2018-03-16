var mongoose = require("mongoose");

//报修表结构
module.exports = new mongoose.Schema({
	building: String,
	details: String,
	id: String,
	name: String,
	item: String,
	phone: String,
	remark: String,
	room: String,
	spareDay: String,
	spareTime: String
});