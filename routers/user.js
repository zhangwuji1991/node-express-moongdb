var express  = require('express');
var router   = express.Router();
//个人中心
router.get('/',function(req,res,next){
	res.render('user/index',{
		userInfo: req.userInfo
	})
})
//账户中心
router.get('/user',function(req,res,next){
	res.render('user/user',{
		userInfo: req.userInfo
	})
})
module.exports = router;