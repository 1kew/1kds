
$(function(){
    var currentPage = 1; //当前页
    var pageSize = 2; //每页条数

    //定义用来存储已上传图片的数组
    var picArr = [];



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

        //重置校验状态为VALID
        $('#form').data("bootstrapValidator").updateStatus("brandId","VALID");

    })



    // 4 文件上传初始化  多文件上传时 插件会遍历选中图片 发送多次请求到服务器 
    // 将来响应多次 每次响应都会调用一次done方法
    $('#fileupload').fileupload({
        //返回数据的格式
        dataType: 'json',
        //文件上传完成时调用的回调函数
        done: function( e, data){
            // data.result 是后台响应的内容
            //向数组最前面追加图片对象
            picArr.unshift(data.result)
            
            //向imgBox最前面追加img元素
            $('#imgBox').prepend('<img src="'+ data.result.picAddr +'" width="100">');

            // 通过判断数组长度 如果长度大于3 移除最后一项 
            if( picArr.length > 3 ){
                // 移除数组最后一项
                picArr.pop();

                //移除最后一张图片
                // $('#imgBox img:last-of-type')
                $('#imgBox img').eq(-1).remove();
            }
                //如果处理后，图片数组的长度为3 那么久通过校验 手动讲picStatus置成VALID
                if ( picArr.length === 3 ){
                    $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
                }
            
        }
    })




    // 5 进行表单校验初始化

    $('#form').bootstrapValidator({

    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },


    // 配置校验字段
    fields:{
        //请选择二级分类
        brandId:{
            validators:{
                notEmpty:{
                    message: "请选择二级分类"
                }
            }
        },
        //产品名称
        proName:{
            validators:{
                notEmpty:{
                    message: "请输入商品名称"
                }
            }
        },
        //产品描述
        proDesc:{
            validators:{
                notEmpty:{
                    message: "请输入商品描述"
                }
            }
        },
        //产品库存
        num:{
            validators:{
                notEmpty:{
                    message: "请输入商品库存"
                },
                //正则校验
                regexp: {
                    //* 表示出现一次或者多次
                    regexp: /^[1-9]\d*$/,
                    message: '商品库存必须是非零开头的数字'
                  }
            }
        },
        //产品尺码 要求xx-xx的格式 x为数字
        size:{
            validators:{
                notEmpty:{
                    message: "请输入商品尺码"
                },
                regexp: {
                    //* 表示出现一次或者多次
                    regexp: /^\d{2}-\d{2}$/,
                    message: '尺码必须是 xx-xx 的格式，例：32-42'
                  }
            }
        },
        //产品原价
        oldPrice:{
            validators:{
                notEmpty:{
                    message: "请输入商品原价"
                }
            }
        },
        //产品现价
        price:{
            validators:{
                notEmpty:{
                    message: "请输入商品现价"
                }
            }
        },

        //图片校验
        picStatus:{
            validators:{
                notEmpty:{
                    message: "请选择三张图片上传"
                }
            }
        }
    }
 });


    // 6 注册表单校验成功事件，阻止默认的提交，通过ajax进行提交
    $('#form').on("success.form.bv", function(e){
        //阻止默认的提交
        e.preventDefault();

        //表单元素数据
        var params = $('#form').serialize();
        // 需要在参数的基础上拼接上这些参数
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: params,
            dataType: 'json',
            success: function( info){
                if( info.success ){
                    //添加成功

                    //关闭模态框
                    $('#addModal').modal('hide');

                     //重置表单内容和校验状态
                     $('#form').data('bootstrapValidator').resetForm(true);

                    //重新渲染
                    currentPage = 1;
                    render();

                    //下拉列表和图片不是表单元素 需要手动重置
                    $('#dropdownText').text('请选择二级分类');
                    $('#imgBox img').remove();
                    //重置数组
                    picArr = [];
                }
            }

        })
    });
})