var mongoose = require("mongoose");
var usersSchema = require('../scheamas/user');

module.exports = mongoose.model("user" , usersSchema);