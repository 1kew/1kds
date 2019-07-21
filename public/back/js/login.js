$(function(){
    $('#form').bootstrapValidator({
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
                  }
                }
            },




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
                    }
                }
            }
        }
    })

});