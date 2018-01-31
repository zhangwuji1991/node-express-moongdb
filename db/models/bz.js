var mongoose = require("mongoose");
var bzSchema = require('../scheamas/bz');

module.exports = mongoose.model("bz" , bzSchema);