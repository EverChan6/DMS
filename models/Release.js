var mongoose = require('mongoose');
var releaseSchema = require('../schemas/release.js');

module.exports = mongoose.model('Release',releaseSchema);