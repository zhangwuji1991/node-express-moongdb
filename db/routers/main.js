var express = require('express');
var router  = express.Router();
var Category = require('../models/category');
var Content = require('../models/content');
var data;
//处理通用数据
router.use(function(req,res,next){
	data = {
		userInfo:req.userInfo,
		categories:[]
	}

	Category.find().then(function(category){
		data.categories = category;
		next();
	})	
})
router.get('/',function(req,res,next){
	data.category = req.query.category || '',
	data.limit = 5,
	data.pages = 0,
	data.count = 0,
	data.page  = Number(req.query.page || 1)
	var where = {};
	if(data.category){
		where.category = data.category
	}
	//把分类数据返回到页面
	Content.where(where).count().then(function(count){
		data.count=count
		data.pages = Math.ceil(data.count/data.limit);
		//取值不能超过pages
		data.page = Math.min(data.page,data.pages)
		//取值不能小于1
		data.page = Math.max(data.page,1)
		var skip  = (data.page - 1)*data.limit;
		//读取内容
		return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user'])
	}).then(function(contents){
		data.contents=contents	
		res.render("main/index",data)
	})	
})
// 详情页面
router.get('/view',function(req,res){
	var contentId = req.query.contentId || ''
	Content.findOne({
		_id:contentId
	}).then(function(content){
		
		data.content = content;
		content.views++
		content.save()
		res.render('main/view',data)
	})
})
module.exports = router;