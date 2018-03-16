var mongoose = require('mongoose');
var applysSchema = require('../schemas/applys.js');

module.exports = mongoose.model('Apply',applysSchema);