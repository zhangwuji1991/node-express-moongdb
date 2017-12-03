var mongoose = require("mongoose");
// 分类表结构
module.exports = new mongoose.Schema({
	//关联字段
	category:{
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用
		ref:'Category'
	},
	//关联字段
	user:{
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用
		ref:'user'
	},
	//时间
	addTime:{
		//类型
		type:Date,
		default:new Date()
	},
	//阅读量
	views:{
		//类型
		type:Number,
		default:0
	},
	// 内容标题
	title: String,

	//简介
	description:{
		//类型
		type:String,
		default:''
	},
	//内容
	content:{
		//类型
		type:String,
		default:''
	},
	//评论
	comments:{
		type:Array,
		default:[]
	}
})