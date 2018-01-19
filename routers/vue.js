var express = require('express');
var router  = express.Router();
var User    = require('../models/User');
var Bz    = require('../models/bz');
var multer = require('multer');
var path   = require('path')
var responseData;
// 设置统一返回格式
router.use(function(req,res,next){
    responseData = {
        code:0,
        message:''
    }
    next();
})

// 登录路由
router.post('/login',function(req,res){
    console.log(req.body)
    var username   = req.body.username;
    var password   = req.body.password;


    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        // console.log(userInfo)
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
            username: userInfo.username,
            headImg:userInfo.headImg

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
//返回接口给博客  vue
router.post('/users',function (req,res,next) {
    console.log(req.body)
    var pages = 0; //设置总页数
    var datas = req.body.username;
    var page  = req.body.page;  //当前条数
    var limit = parseInt(req.body.pages);//前端设置的每页显示的条数；
    User.count().then(function(count){
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages)
        //取值不能小于1
        page = Math.max(page,1)
        var skip  = (page - 1)*limit;
        if(datas){
            User.find({"username":datas}).then(function(categories){
                responseData.code=1;
                responseData.message="ddd";
                responseData.data=categories;
                responseData.lengths = 1;
                res.json(responseData);
            })
        }else {
            User.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
                responseData.code=1;
                responseData.message="ddd";
                responseData.data=categories;
                responseData.lengths = count;
                res.json(responseData);
            })
        }
    })
});
//修改用户资料
router.post("/edituser",function (req,res,next) {
    // console.log(req.body)
    var Id       = req.body._id;
    var passWord = req.body.password;
    var isAdmins  = req.body.isAdmin
    console.log(isAdmins)
    User.findOne({"_id":Id}).then(function (users) {
        console.log(users)
        if(users.password == passWord){
            responseData.code = 0;
            responseData.message = "密码未做更新"
            res.json(responseData);
        }else {
            //输入正确，保存密码
            responseData.code = 1;
            responseData.message = "密码更新成功"
            res.json(responseData);
            //保存数据到数据库中
            return User.update({
                _id:req.body._id
            },{
                password: passWord,
                isAdmin:  isAdmins
            })
        }
    })

})

//删除用户
router.post('/deluser',function (req,res,next) {
    console.log(req.body)
    var Id = req.body.id;
    User.remove({
        _id:Id
    }).then(function(){
        responseData.code = 1;
        responseData.message = "删除成功"
        res.json(responseData);
    })
});
//添加用户
router.post('/adduser',function (req,res,next) {
    console.log(req.body)
    var Username =  req.body.username;
    var Password =  req.body.password;
    var Isadmin  =  req.body.isAdmin;
    User.findOne({
        username:Username
    }).then(function (users) {
        console.log(users)
        if(users){
            responseData.code = 0;
            responseData.message = "用户名存在"
            res.json(responseData);
        }else {
            //保存到数据库中
            //保存数据到数据库中
            responseData.code = 1;
            responseData.message = "保存成功"
            res.json(responseData);
            var user = new User({
                username:Username,
                password:Password,
                isAdmin:Isadmin,
                registerDate: new Date()
            });
            return user.save();


        }
    })
});

//壁纸接口
router.post('/bzdata',function (req,res,next) {

    var pages = 0; //设置总页数
    var datas = req.body.city;
    var page  = req.body.page;  //当前条数
    var limit = parseInt(req.body.pages);//前端设置的每页显示的条数；
    Bz.count().then(function(count){
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages)
        //取值不能小于1
        page = Math.max(page,1)
        var skip  = (page - 1)*limit;
        if(datas){
            Bz.find({"city":datas}).then(function(categories){
                responseData.code=1;
                responseData.message="ddd";
                responseData.data=categories;
                responseData.lengths = 1;
                res.json(responseData);
            })
        }else {
            Bz.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
                responseData.code=1;
                responseData.message="ddds";
                responseData.data=categories;
                responseData.lengths = count;
                res.json(responseData);
            })
        }
        //为博客返回接口
        if(req.body.vue){
            Bz.find().sort({_id:-1}).then(function(categories){
                responseData.code=1;
                responseData.message="ddds";
                responseData.data=categories;
                responseData.lengths = count;
                res.json(responseData);
            })
        }
    })
});

//上传图片
var storage = multer.diskStorage({
    //保存地址
    destination: function (req, file, cb) {
        cb(null, path.resolve('public/bzimg'));
    },
    //文件名
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});
//上传壁纸
router.post('/bzadd',upload.single('avatar'),function (req,res,next) {
    cost = bzImg = '/public/bzimg/' + path.basename(req.file.path)
    responseData.data=bzImg;
    res.json(responseData);
})

router.post('/bzadds',function (req,res,next) {
    return new Bz({
        addTime: Date.now(),
        city:req.body.city,
        content: req.body.content,
        bzImg: req.body.imgurl
    }).save().then(function (bzs) {
        responseData.code=1;
        responseData.message="保存成功";
        res.json(responseData);
    })
})
module.exports = router;