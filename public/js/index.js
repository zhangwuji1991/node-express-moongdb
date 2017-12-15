var $regiser = $('.regiser');
var $dl      = $('.dl')
//注册
$('#zcbutton').on('click',function  () {
	//提交ajax请求
	$.ajax({
		type:"post",
		url:"/api/user/register",
		async:true,
		dataType:'json',
		data:{
			username: $regiser.find('.form-group>[name="username"]').val(),
			password: $regiser.find('.form-group>[name="password"]').val(),
			repassword: $regiser.find('.form-group>[name="repassword"]').val()
		},
		success:function(result) {
			console.log(result)
			if(result.code==0){
				window.location.reload()
			}else{
				$regiser.find('.zcts').html(result.message)
			}
		}
	});
});
$regiser.find('.qh').on('click',function(){
	$dl.show()
	$regiser.hide()
})
$dl.find('.qh').on('click',function(){
	$regiser.show()
	$dl.hide()
})
//登录
//判断是否为空值
$('#dlbutton').on('click',function(){
	//提交ajax请求
	//图片
	if($('#userName').val()==''||$('#passWord').val()==''){
		$('.cwts').html('你输入的账号或密码为空')
	}else{
		$.ajax({
			type:"post",
			url:"/api/user/login",
			async:true,
			dataType:'json',
			data:{
				username: $('#userName').val(),
				password: $('#passWord').val()
			},
			success:function(result) {
				console.log(result)
				if(result.code==0){
				 window.location.reload()
				}else{
				  $('.cwts').html(result.message)	
				}
			}
	    });
	}	
})

//退出
$('#logout').on('click',function(){
	$.ajax({
		url:"/api/user/logout",
		success:function(result) {
			if(!result.code){
			 window.location.reload()
			}
		}
	});
})

