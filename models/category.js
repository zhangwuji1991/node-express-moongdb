var mongoose = require("mongoose");
var categoriesSchema = require('../scheamas/categories');

module.exports = mongoose.model("Category" , categoriesSchema);

