var mongoose = require("mongoose");

//报修表结构
module.exports = new mongoose.Schema({
	id: {type: String, unique: true},
	name: String,
	sex: String,
	college: String,
	building: String,
	room: String
});