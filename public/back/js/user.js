
$(function() {
    var currentPage = 1; //当前页
    var pageSize = 5;  //每页多少条  
    var currentId; //当前选中的用户id
    var isDelete;
    render();
    function render(){
        $.ajax({
            type: 'get',
            url: ' /user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function(info){
                var htmlStr = template('tpl', info);
                $('tbody').html( htmlStr );
                
                // 分页初始化
                $('#paginator').bootstrapPaginator({
                    //配置Bootstrap版本
                    bootstrapMajorVersion: 3,
                    //指定总页数
                    totalPages: Math.ceil(info.total / info.size ),
                    //当前页
                    currentPage: info.page,
                    // 当页码被点击时调用的函数
                    onPageClicked: function(a,b,c, page){
                        //通过page获取点击的页码

                        //更新当前页
                        currentPage = page;
                        
                        // 重新渲染
                        render();
                    }
                });
    
            }
        })
    }



// 点击启用禁用按钮，显示模态框，通过事件委托绑定事件

$('tbody').on('click', '.btn', function(){
    //显示模态框
    $('#userModal').modal('show');

    //获取用户id jquery data() 获取自定义属性
    currentId = $(this).parent().data("id");

    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;

    
})


//点击确认按钮 修改对应用户状态
$('#submitBtn').click(function(){
    $.ajax({
        type: 'POST',
        url: '/user/updateUser',
        data: {
            id: currentId,
            isDelete: isDelete
        },
        dataType: 'json',
        success: function( info ){
            if( info.success ){
                //关闭模态框
                $('#userModal').modal('hide');
                //重新渲染
                render();
            }

        }
    })
})


})