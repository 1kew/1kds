$(function(){
    $('#form').bootstrapValidator({
  
        //图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', //校验成功
            invalid: 'glyphicon glyphicon-remove', //校验失败
            validating: 'glyphicon glyphicon-refresh' //校验中
        },

        //配置字段
        fields: {
            username: {
                //配置校验规则
                validators: {
                    //非空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在 2-6 位之间'
                    },
                    callback: {
                    message: "用户名不存在"
                    }
                    }
            },
            //专门用于配置回调提示的规则

            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须在 6-12 位之间'
                    },
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        }
    })

    //登录功能 表单校验成功事件 ，阻止默认提交，通过ajax提交
    //校验失败 不会提交表单
    $('#form').on('success.form.bv', function(e){
        e.preventDefault();
        // console.log('阻止');

        //通过ajax提交
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $('#form').serialize(),
            dataType: "json",
            success: function(info){
                console.log(info);
                if( info.success ){
                    location.href = "index.html" 
                }
                if( info.error === 1000 ){
                    // alert('用户名不存在');
                    $('#form').data('bootstrapValidator').updateStatus('username','INVALID',"callback");
                }
                if( info.error === 1001){
                    // alert('密码错误');
                    $('#form').data('bootstrapValidator').updateStatus("password","INVALID","callback");
                }
                
            }
        })
        
    })


    //重置功能
    $('[type="reset"]').click(function(){
        //resetForm() 传true 重置内容以及校验状态
        $('#form').data("bootstrapValidator").resetForm(true);
    })
});