
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

    //2. 点击添加分类按钮，显示添加模态框
    $('#addBtn').click(function(){
        $('#addModal').modal('show');

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function( info ){
                console.log(info);
                var htmlStr = template('stpl', info);
                $('.dropdown-menu').html( htmlStr );
                
            }
        })
    })



    // 3. 通过事件委托 给dropdown-menu下所有a标签绑定点击事件
    $('.dropdown-menu').on('click', 'a', function(){
        //获取a的文本
        var txt = $(this).text();
        //设置给dropdownText
        $('#dropdownText').text(txt);

        //获取选中id
        var id = $(this).data('id');
        //设置给input框
        $('[name="categoryId"]').val( id );
    })



    // 4. 进行文件上传初始化
        $('#fileupload').fileupload({
            dataType: 'json',
            done: function( e, data ){
                console.log(data.result.picAddr );
                var imgurl = data.result.picAddr;
                //赋值给img
                $('#imgBox img').attr("src", imgurl);

                //将图片地址设置给input
                $('[name="brandLogo"]').val( imgurl );
                
            }
        })



});