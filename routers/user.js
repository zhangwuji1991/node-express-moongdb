var express  = require('express');
var router   = express.Router();
var user = require('../models/User');
var multer = require('multer');
var path = require('path');
var Jl   = require('../models/jl')
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
    console.log(req.userInfo)
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
//上传图片
router.get('/tp',function(req,res,next){

    user.findOne({
        username: req.userInfo.username
    }).then(function(users){
        console.log(users)
        res.render('user/tp',{
            user: users
        })
    })
})
// 获取上传图片保存到其他地方
var storage = multer.diskStorage({
    //保存地址
    destination: function (req, file, cb) {
        cb(null, path.resolve('public/uploads'));
    },
    //文件名
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});

router.post('/profile', upload.single('avatar'), function(req, res, next){

    user.findOne({
        username: req.userInfo.username
    }).then(function(users){
        responseData.code = 0;
        responseData.message = "头像上传成功";
        responseData.filePath= '/public/uploads/' + path.basename(req.file.path)
        res.json(responseData);
        //保存数据到数据库中
        return user.update({
            _id:users._id
        },{
            headImg:'/public/uploads/' + path.basename(req.file.path)
        })
    })
});
//修改密码
router.post('/update',function(req,res,next){
	//判断输入的是否为新密码
	var oldpass = req.body.oldpass;
	var newpass = req.body.newpass;
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

//用户资料
router.get('/userdata',function (req,res,next) {
	console.log(req.userInfo._id)
	Jl.findOne({
		user:req.userInfo._id
	}).populate('user').then(function (jl) {
		console.log(jl)
        res.render('user/userinfo',{
        	jl:jl
		})
    })

})

//保存用户资料
router.post('/userinfos',function (req,res,next) {
	Jl.find().then(function (data) {
		if(data == ""){
			//保存数据
			 new Jl({
				user:req.userInfo,
				nc: req.body.nc,
				zw: req.body.zw,
				gs: req.body.gs,
				jb: req.body.jb,
			    jj: req.body.jj,
				phone: req.body.phone
			}).save().then(function () {
                 responseData.code= 0;
                 responseData.message="简历保存成功"
                 res.json(responseData);
                 return;
             })

		}
    })
	console.log(req.body)
})



//壁纸设置


//发表博客
module.exports = router;