var mongoose = require('mongoose');
var visits = require('../schemas/visits.js');

module.exports = mongoose.model('Visits',visits);