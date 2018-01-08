var mongoose = require("mongoose");
var jlSchema = require('../scheamas/jl');

module.exports = mongoose.model("jl" , jlSchema);