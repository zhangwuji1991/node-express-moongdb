// 应用程序的启动入口文件
var express     = require("express");//加载express模块
var mongoose    = require('mongoose');//加载数据库模块
var bodyParser  = require('body-parser');//用来处理post提交的数据
// var MongoClient = require('mongodb').MongoClient;
var swig        = require('swig');//加载模板处理模块
var Cookies     = require('cookies');
// 创建app应用 => NODE.js http.createServe()
var app = express();
var User = require('./models/User');//引入数据表
// 设置静态文件托管
// 当用户访问的url以/public开始，那么直接返回对呀的__diraname +'/public'下的文件
app.use('/public',express.static(__dirname+'/public'))
// 加载模板
// 定义当前应用所使用的模板引擎
// 第一个参数：模板引擎名称，同时也是模板文件的后缀
// 第二个参数：用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
// 设置模板文件存放的目录
// 第一个参数必须是views 第二个参数是目录
app.set('views','./views');
// 注册所使用的模板引擎，第一个参数必须是 view engine 第二个参数等同于模板引擎的第一个参数
app.set('view engine','html')
// 在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});
swig.setDefaults({ autoescape: false });  //将富文本编译器中的字符串转为标签  https://www.mgenware.com/blog/?p=2576
// 首页
// res:  resonpe对象
// req:  request对象
// next: 函数 
// app.get('/',function(req,res,next){
// 	// res.send('<h1>欢迎来到我的博客</h1>')
// 	// 读取views目录下的文件  解析并返回给客服端e
// 	res.render('index')
// })
// bodyparser设置
app.use(bodyParser.urlencoded({extended: true}));
// //设置cookies
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res);
	//解析登录用户的cookie信息
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			 req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			 //获取当前用户是否为管理员
			 User.findById(req.userInfo._id).then(function(userInfo){
			 	req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
			 	next();
			 })
		}catch(e){
			next();
		}
	}else{
		next();
	}
})
//设置跨域第一种方式
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });
//设置跨域第二种方式
var cors = require('cors');
app.use(cors());
// 根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/users',require('./routers/user'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
mongoose.Promise = global.Promise;
//监听http请求
mongoose.connect("mongodb://localhost:27018/blog",function(err){
	if(err){
		console.log("链接失败")
	}else{
		console.log("链接成功")
		app.listen(8888);
	}
})
