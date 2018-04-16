var mongoose = require("mongoose");


module.exports = new mongoose.Schema({
	title: String,
	auther: String,
	contents: String,
	time: String
});