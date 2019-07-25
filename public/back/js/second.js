
$(function(){

    var currentPage = 1;
    var pageSize = 5;

    render();
    function render(){

        $.ajax({
            type: 'GET',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function( info ){
                console.log(info);
                var htmlStr = template('tpl', info);
                $('tbody').html( htmlStr );

                //进行分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    //总页数
                    totalPages: Math.ceil( info.total / info.size ),
                    //当前页
                    currentPage: info.page,

                    //添加点击事件
                    onPageClicked: function(a,b,c,page ){
                        //更新当前页
                        currentPage = page;
                        //重新渲染
                        render();
                    }

                })
                
            }
        })
    }
})