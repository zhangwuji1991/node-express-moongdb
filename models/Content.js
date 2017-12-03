var mongoose = require("mongoose");
var contentSchema = require('../scheamas/content');

module.exports = mongoose.model("Content" , contentSchema);