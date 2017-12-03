var perpage = 10; //每页展示条数
var page    = 1;  //起始页
var pages   = 0;  //总页数
var comment = []; //所有评论内容
//提交评论
$('#messagebt').on('click',function(){
	if($('#messageContent').val()==''){
		$('#messageContent').attr('placeholder','你暂未输入任何信息')
	}else{
		$.ajax({
		type:"POST",
			url:"/api/comment/post",
			async:true,
			dataType:'json',
			data:{
				contentid:$('#contentId').val(),
				content:$('#messageContent').val()
			},
			success:function(result) {
				comment=result.data.comments.reverse()
				renderComment()			 //reverse():数组翻转
			}
		});
	}
})
//更新评论内容
function renderComment(){	
	var pages = Math.max(Math.ceil(comment.length/perpage),1);
	var $lis  = $('.page li')   
    var star  = Math.max(0,(page-1)*perpage)
    var end   = Math.min(star + perpage,comment.length)
	$lis.eq(1).html(page+'/'+pages)
	if(page<=1){
		$lis.eq(0).html('<span>无</span>')
		page=1
	}else{
		$lis.eq(0).html('<a href="javascript:;" style="color:white;">上一页</a>')
	}
	if(page>=pages){
		page=pages
		$lis.eq(2).html('<span>无</span>')
	}else{
		$lis.eq(2).html('<a href="javascript:;" style="color:white;">下一页</a>')
	}
	$('.commentslength').html(comment.length)
	if(comment.length==0){
		$('#comments').html('<p>当前还没有留言</p>');
	}else{
		var html = '';
		for (var i= star;  i < end ; i++) {
			html += '<div class="panel panel-default"><div class="panel-body" style="text-align: left;"><p>作者:'+comment[i].username+'<span></span><span>&nbsp&nbsp&nbsp</span>时间:'+getDate(comment[i].postTime)+'<span></span></p></div><div style="text-align: left;" class="panel-footer">'+comment[i].content+'</div></div>'
		};
		$('#comments').html(html);
	}	
}
//获取所有的文章评论
function getComments(){
	$.ajax({
		url:"/api/comment",
		async:true,
		dataType:'json',
		data:{
			contentid:$('#contentId').val(),
		},
		success:function(result) {
			console.log(result)
			comment = result.data.reverse()
			renderComment()
		}
	});
}
//翻页
$('.page').delegate('a','click',function(){
	if($(this).parent().hasClass('previous')){
		page--;
	}else{
		page++;
	}
	renderComment()
})
//转换时间
function getDate(d){
	var datas = new Date(d);
	return datas.getFullYear()+'年'+(datas.getMonth()+1)+'月'+datas.getDate()+'日'+datas.getHours()+':'+datas.getMinutes()+':'+datas.getSeconds()
}
getComments()