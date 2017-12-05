$(function () {
    $('[data-toggle="popover"]').popover()
})
//修改密码
$('#udpass').on('click',function(){
	if($('#Password1').val()==''&&$('#Password2').val()==''){
		$('#udpass').attr("data-content","你输入的旧密码或新密码为空")
	}else{
		$.ajax({
			type:"post",
			url:"/users/update",
			async:true,
			dataType:'json',
			data:{
				username:$('#username').val(),
				oldpass:$('#Password1').val(),
				newpass:$('#Password2').val()
			},
			success:function(result) {
				console.log(result)
				$('#udpass').attr("data-content",result.message)
			}
		});
	}
});


//上传图片
function handle() {
    let file = document.getElementById("choose").files[0];
    let formData = new FormData();
    formData.append("avatar", file);
    $.ajax({
        type: 'POST',
        url: '/users/profile',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
        	console.log(data)
            $(".newImg").attr("src", data.filePath);
            window.location.reload()
        },
        error: function (err) {
            console.log(err.message);
        }
    })
};