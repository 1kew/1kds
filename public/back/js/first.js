
$(function(){

    var currentPage = 1;
    var pageSize = 5;

    //一进入页面 发送ajax请求获取数据，通过模板引擎渲染
    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function( info ){
                console.log(info);
                var htmlStr = template('tpl', info);
                $('tbody').html( htmlStr );
                
                 // 分页初始化
                $('#paginator').bootstrapPaginator({
                    //指定版本
                    bootstrapMajorVersion: 3,
                    // 总页数
                    totalPages: Math.ceil( info.total / info.size ),
                    // 当前第几页
                    currentPage: info.page,
                    //注册按钮点击事件
                    onPageClicked: function(a,b,c,page){
                        // 更新当前页
                        currentPage = page
                        //重新渲染
                        render();
                    }
                })
                
            }
        })
    }


    // 点击添加分类按钮，显示模态框
    $('#addBtn').click(function(){
        $('#addModal').modal('show');
    })


    // 表单校验
    $('#form').bootstrapValidator({
        //配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', //校验成功
            invalid: 'glyphicon glyphicon-remove', //校验失败
            validating: 'glyphicon glyphicon-refresh' //校验中
        },
        //配置字段
        fields: {
            categoryName: {
                validators: {
                    notEmpty:{
                        message: '一级分类不能为空'
                    }
                }
            }
        }
    });




    // 注册表单校验成功事件  阻止默认提交  通过ajax提交
    $('#form').on('success.form.bv', function( e ) {
        e.preventDefault();

        //通过ajax提交

        $.ajax({
            type: 'POST',
            url: '/category/addTopCategory',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function( info ){
                if( info.success ) {
                    //添加成功
                    //关闭模态框
                    $('#addModal').modal('hide');

                    //页面重新渲染
                    currentPage = 1;
                    render();

                    //重置模态框
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })
});