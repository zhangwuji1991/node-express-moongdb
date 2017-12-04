var express  = require('express');
var router   = express.Router();
var user = require('../models/User');
// 设置统一返回格式
router.use(function(req,res,next){
	responseData = {
		code:0,
		message:''
	}
	next();
})
//个人中心
router.get('/',function(req,res,next){
	res.render('user/index',{
		userInfo: req.userInfo
	})
})
//账户中心
router.get('/user',function(req,res,next){
	//查询用户账号及密码
	user.findOne({
		username: req.userInfo.username
	}).then(function(users){
		// console.log(users.password)
	})

	res.render('user/user',{
		userInfo: req.userInfo
	})
})

//修改密码
router.post('/update',function(req,res,next){
	//判断输入的是否为新密码
	var oldpass = req.body.oldpass
	var newpass = req.body.newpass
	//查询用户账号及密码
	user.findOne({
		username: req.userInfo.username
	}).then(function(users){
		if(users.password == oldpass){
			//输入正确，保存密码
			responseData.code = 0;
			responseData.message = "密码更新成功"
			res.json(responseData);
			//保存数据到数据库中
			return user.update({
					_id:users._id
				},{
					password:newpass
				})
		}else{
			//输入不正确
			responseData.code = 1;
			responseData.message = "你输入的原密码错误！"
			res.json(responseData);
			return;
		}
	})
});

//发表博客

module.exports = router;