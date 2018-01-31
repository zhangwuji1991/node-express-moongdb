var mongoose = require("mongoose");
// 用户表结构
module.exports = new mongoose.Schema({
    //添加时间
    addTime:{
        //类型
        type:Date,
        default:new Date()
    },
    city:String,
    //内容
    content: String,
    //壁纸
    bzImg: {
        type: String,
        default: ''
    }
})