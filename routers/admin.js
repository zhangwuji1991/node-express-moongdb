var express  = require('express');
var router   = express.Router();
var User     = require('../models/User')
var Category = require('../models/category')
var Content = require('../models/Content')
router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		//如果当前用户不是管理员
		res.send('只有管理员才能进入该页面');
		return;
	}
	next();
});
//首页
router.get('/',function(req,res,next){
	res.render('admin/index',{
		userInfo: req.userInfo
	})
})
//用户管理界面
router.get('/user',function(req,res,netx){
	//从数据库中读取所有的数据
	//limit(Number) 限制获取数据的条数
	//skip(2) 忽略的条数	
	var page  = Number(req.query.page || 1);
	var limit = 10;
	var pages = 0; //设置总页数	
	//从数据库中查询出条数
	User.count().then(function(count){
		pages = Math.ceil(count/limit);
		//取值不能超过pages
		page = Math.min(page,pages)
		//取值不能小于1
		page = Math.max(page,1)

		var skip  = (page - 1)*limit;
		User.find().limit(limit).skip(skip).then(function(users){
		  // console.log(users)
		  res.render('admin/user_index',{
			userInfo: req.userInfo,
			users:users,
			page:page,
			count:count,
			pages:pages,
			limit:limit,
			urls:'/admin/user'
		  })
	   })	
	})	
})
//分类首页路由
router.get('/category',function(req,res){
	var page  = Number(req.query.page || 1);
	var limit = 5;
	var pages = 0; //设置总页数
	//从数据库中查询出条数
	Category.count().then(function(count){
		pages = Math.ceil(count/limit);
		//取值不能超过pages
		page = Math.min(page,pages)
		//取值不能小于1
		page = Math.max(page,1)

		var skip  = (page - 1)*limit;
		Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
		  // console.log(users)
		  res.render('admin/category_index',{
			userInfo: req.userInfo,
			categories:categories,
			page:page,
			count:count,
			pages:pages,
			limit:limit,
			urls:'/admin/category'
		  })
	   })	
	})	
})
//分类添加路由
router.get('/category/add',function(req,res){
	res.render('admin/category_add',{
		userInfo:req.userInfo
	})
})
//分类的保存
router.post('/category/add',function(req,res){
	var name = req.body.name;
	if(name == ''){
		res.render('admin/err',{
			userInfo:req.userInfo,
			message:'你输入的为空'
		})
		return;
	}
	//保存数据
	Category.findOne({
		name:name
	}).then(function(re){
		if(re){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'你输入的名称已存在'
			})
			return Promise.reject()
		}else{
			return new Category({
				name:name
			}).save()
		}
	}).then(function(newCategory){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'保存成功',
			url:'/admin/category'
		})
	})
});
//编辑界面  查找数据
router.get('/category/edit',function(req,res){
	var id = req.query.id || '';
	//获取修改信息的id
	Category.findOne({
		_id:id
	}).then(function(category) {
		// console.log(category)
		if(!category){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'分类信息不存在'
			})
			return Promise.reject()
		}else{
			res.render('admin/category_edit',{
				userInfo:req.userInfo,
				category:category
			})
		}
	})
})
//分类信息更新
router.post('/category/edit',function(req,res){
	//获取要修改的分类信息,
	var id = req.query.id || '';
	var name = req.body.name || '';
	//获取修改信息的id
	Category.findOne({
		_id:id
	}).then(function(category) {
		if(!category){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'分类信息不存在'
			})
			return Promise.reject()
		}else{
			//当用户没有做修改
			if(name == category.name){
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'分类信息保存成功',
					url:'/admin/category'
			    })
			    return Promise.reject()
			}else{
			 return	Category.findOne({
						_id:{$ne:id},
						name:name
				   })
			}
		}
	}).then(function(sameCategory){
		if(sameCategory){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'数据库中已经存在同名分类'
			})
			return Promise.reject()
		}else{
		return  Category.update({
					_id:id
				},{
					name:name
				})
		}
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'分类信息修改成功',
			url:'/admin/category'
	    })
	})
})
//删除分类数据
router.get('/category/delete',function(req,res){
	//获取要删除的信息id,
	var id = req.query.id || '';
	Category.remove({
		_id:id
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'分类信息删除成功',
			url:'/admin/category'
	    })
	})
})
//博客内容首页路由
router.get('/content',function(req,res,next){
	var page  = Number(req.query.page || 1);
	var limit = 5;
	var pages = 0; //设置总页数
	
	//从数据库中查询出条数
	Content.count().then(function(count){
		pages = Math.ceil(count/limit);
		//取值不能超过pages
		page = Math.min(page,pages)
		//取值不能小于1
		page = Math.max(page,1)
		var skip  = (page - 1)*limit;
		Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
		  res.render('admin/content_index',{
			userInfo: req.userInfo,
			contents:contents,
			page:page,
			count:count,
			pages:pages,
			limit:limit,
			urls:'/admin/content'
		  })
	   })	
	})	
})
//博客内容首页路由
router.get('/content/add',function(req,res,next){
	// 读取分类信息
	Category.find().sort({_id:-1}).then(function(category){
		res.render('admin/content_add',{
		   userInfo: req.userInfo,
		   category:category
	    })
	})	
})
//保存内容路由
router.post('/content/add',function(req,res){
	//前端验证提交是否有效
	//保存到数据库中
	new Content({
		category:req.body.category,
		user:req.userInfo._id.toString(),
		title:req.body.title,
		description:req.body.description,
		content:req.body.content
	}).save().then(function(rs){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'博客信息保存成功',
			url:'/admin/content'
	    })
	})
})
//保存修改数据
//修改博客内容
router.get('/content/edit',function(req,res){
	var id = req.query.id || '';
	var category = []
	// 读取分类信息
	Category.find().sort({_id:-1}).then(function(rs){
		category = rs
		// console.log(category)
		return Content.findOne({
				_id:id
			}).populate('category')
	}).then(function(content){
			// console.log(content)
			res.render('admin/content_edit',{
				userInfo:req.userInfo,
				content:content,
				category:category
		    })
		})
})	
//保存修改内容
router.post('/content/edit',function(req,res){
	var id = req.query.id || '';
	Content.update({
		_id:id
	},{
		category:req.body.category,
		title:req.body.title,
		description:req.body.description,
		content:req.body.content
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'博客信息保存成功',
			url:'/admin/content'
	    })
	})
})
//删除博客内容
router.get('/content/delete',function(req,res){
	var id = req.query.id || '';
	Content.remove({
		_id:id
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'博客信息删除成功',
			url:'/admin/content'
	    })
	})
})
module.exports = router;