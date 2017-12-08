var express = require('express');
var router  = express.Router();
var User    = require('../models/User');
var Content    = require('../models/Content');
var responseData;
// 设置统一返回格式
router.use(function(req,res,next){
	responseData = {
		code:0,
		message:''
	}
	next();
})
router.post('/user/register',function(req,res,next){
	// console.log(req.body)
	var username   = req.body.username;
	var password   = req.body.password;
	var repassword = req.body.repassword;
    console.log(req.body.imgs)
	if(username == ''){
		responseData.code = 1;
		responseData.message = "用户名不能为空"
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 2;
		responseData.message = "密码不能为空"
		res.json(responseData);
		return;
	}
	if(password != repassword){
		responseData.code = 3;
		responseData.message = "两次输入的密码不一致,请重新输入！"
		res.json(responseData);
		return;
	}
	// 基于数据库的验证
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			//表示数据库有该记录
			responseData.code= 4;
			responseData.message="用户名已经被注册"
			res.json(responseData);
			return;
		}
		//保存数据到数据库中
		var user = new User({
			username:username,
			password:password
		});
		return user.save();
	}).then(function(newuserInfo){
		// console.log(newuserInfo)
		responseData.message="注册成功!";
		
		//设置cookise 
		req.cookies.set('userInfo',JSON.stringify({
			_id: newuserInfo.id,
			username: newuserInfo.username,
			headImg: 'https://avatars0.githubusercontent.com/u/19239161?s=40&v=4'
		}))
	    res.json(responseData);
	    return;
	});
})
// 登录路由
router.post('/user/login',function(req,res){
	var username   = req.body.username;
	var password   = req.body.password;

	if(username == '' || password == ''){
		responseData.code = 1;
		responseData.message='用户名或密码不能为空'
		res.json(responseData);
		return;
	}
	User.findOne({
		username:username,
		password:password
	}).then(function(userInfo){
		if(!userInfo){
		  responseData.code=2;
		  responseData.message="用户或密码错误";
		  res.json(responseData);
		  return;
		}
		//用户名和密码正确
		responseData.message="登录成功";
		responseData.userInfo={
			_id: userInfo.id,
			username: userInfo.username
		};
		// 设置cookise 
		req.cookies.set('userInfo',JSON.stringify({
			_id: userInfo.id,
			username: userInfo.username
		}));
		res.json(responseData);
		return;
	})
})

//退出
router.get('/user/logout',function(req,res){
	req.cookies.set('userInfo',null);
	res.json(responseData);
})
//获取所有评论接口
router.get('/comment',function(req,res){
	var id = req.query.contentid || '';

	Content.findOne({
		_id:id
	}).then(function(content){
		console.log(content)
		responseData.code=1;
		responseData.message="获取所有的文章评论";
		responseData.data=content.comments
		res.json(responseData);
	})
})
//评论提交
router.post('/comment/post',function(req,res){
	// console.log(req.body.contentid )
	var contentId = req.body.contentid || ''
	// console.log(contentId)
	var postData = {
		username:req.userInfo.username,
		postTime: new Date(),
		content:req.body.content,
		headImg:''
	};
    User.findOne({
        username:req.userInfo.username
    }).then(function (users) {
        console.log(users.headImg)
		 postData.headImg =users.headImg
		console.log(postData.headImg)
    })
	console.log(postData)
	//查询当前这篇内容的信息
	Content.findOne({
		_id: contentId
	}).then(function(content){
		// console.log(content)
		content.comments.push(postData);
		return content.save();
	}).then(function(newContent){
		responseData.message="评论成功";
		responseData.data=newContent
		res.json(responseData);
	})
})
module.exports = router;