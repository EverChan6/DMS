var mongoose = require('mongoose');
var stayInfo = require('../schemas/stayInfo.js');

module.exports = mongoose.model('StayInfo',stayInfo);