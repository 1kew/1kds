
$(function(){
    var currentPage = 1; //当前页
    var pageSize = 2; //每页条数


    // 1 进入页面 请求商品数据 进行页面渲染
    render();
    function render(){
        //发送请求进行渲染
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function( info ){
                console.log( info );
                //通过template生成模板
                var htmlStr = template('productTpl', info );
                $('.lt_content tbody').html( htmlStr );


                //分页初始化
                $('#paginator').bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: info.page,
                    //总页数
                    totalPages: Math.ceil( info.total / info.size ),

                    //配置按钮文本
                    //每个按钮在初始化的时候都会调用一次这个函数，通过返回值进行设置文本
                    //参数1 type 取值； page first last prev next
                    //参数2 page 指的是当前这个按钮所指向的页码
                    //参数3 current 当前页 
                    itemTexts: function( type, page, current ){

                      switch( type ) {
                        case "page":
                            return page;
                        case "first":
                            return "首页";
                        case "last":
                            return "尾页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                          
                      }
                    },

                    //配置title属性
                    tooltipTitles: function( type, page, current){
                        switch( type ) {
                            case "page":
                                return "前往第"+ page +"页";
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                              
                          }
                    },

                    //使用bootstrap的提示框组件
                    useBootstrapTooltip: true,


                    //给页码 添加点击事件
                    onPageClicked: function( a,b,c,page ){
                        //更新当前页
                        currentPage = page;
                        //重新渲染
                        render();
                    }
                })
                
            }

        })
    }


    // 2 点击添加商品  显示模态框
    $('#addBtn').click(function(){
        $('#addModal').modal('show');


        // 发送ajax请求 请求所有的二级分类数据 进行下拉列表渲染
        // 通过分页接口，模拟获取全部数据的接口
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function( info ){
                var htmlStr = template('downTpl', info);
                $('.dropdown-menu').html( htmlStr);
                
            }
        })
        


    })



    // 3 给dropdown-menu下面的a 注册点击事件(通过事件委托)

    $('.dropdown-menu').on('click','a',function(){
        //设置文本
        var txt = $(this).text();
        $('#dropdownText').text(txt);

        //设置id 给隐藏域 name="brandId"
        var id = $(this).data('id');
        $('[name="brandId"]').val(id);
    })




})