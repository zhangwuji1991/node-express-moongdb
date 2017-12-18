//壁纸
function Submitbz() {
    $.ajax({
        type:'POST',
        dataType:'json',
        url:'/admin/bz/bzadd',
        data:{
            contentbz:$('#contenbz').val()
        },
        success:function (data) {
            console.log(data)
        }
    })
}
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
        },
        error: function (err) {
            console.log(err.message);
        }
    })
};
//提交
$('#sumbitbz').on('click',function () {
    console.log(1)
    Submitbz()
})