
$(function() {
    var currentPage = 1;
    var pageSize = 5;
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






})