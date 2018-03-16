var mongoose = require('mongoose');
var fixesSchema = require('../schemas/fixes.js');

module.exports = mongoose.model('Fix',fixesSchema);