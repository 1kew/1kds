// 进度条
// 开启进度条
// NProgress.start();


// //结束进度条
// NProgress.done();

$(document).ajaxStart(function(){
    //开启进度条
    NProgress.start();
});

$(document).ajaxStop(function(){
    //关闭进度条
    NProgress.done();
});

//登录拦截

if( location.href.indexOf('login.html') === -1 ) {
    //地址栏中没有login.html  说明不是登录页 需进行拦截

    $.ajax({
        type: 'get',
        url: '/employee/checkRootLogin',
        dataType: 'json',
        success: function(info){
            if( info.success ){
    
            }
            if( info.error === 400){
                location.href = 'login.html';
            }
        }
    })
}






$(function(){
    //分类管理切换
    $('.nav .category').click(function(){
        $('.nav .child').stop().slideToggle();
    })


    // 左侧侧边栏切换
    $('.icon-menu').click(function(){
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
    })

    // 点击退出弹出模态框
    $('.icon-logout').click(function(){
        $('#logoutModal').modal('show');
    })

    //退出功能
    $('#logoutBtn').click(function(){
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            dataType: 'json',
            success: function(info){
                // console.log(info);
                if( info.success ){
                    location.href = 'login.html';
                }
                
            }
        })
    })




});