var mongoose = require("mongoose");
// 用户表结构
module.exports = new mongoose.Schema({
    //关联字段
    user:{
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref:'user'
    },
    //职位
    zw: String,
    gs: String,
    jb: String,
    jj: String,
    phone: String

})