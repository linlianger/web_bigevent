; (function () {
    // 点击'去注册'
    $('#link-reg').on('click', () => {
        $('.reg-box').css({
            display: 'none'
        })
        $('.login-box').css({
            display: 'block'
        })
    })
    // 点击去登录
    $('#link-login').on('click', () => {
        $('.reg-box').css({
            display: 'block'
        })
        $('.login-box').css({
            display: 'none'
        })
    })


    // 获取form对象
    const form = layui.form;
    const layer = layui.layer;
    // 通过verify函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            const pwd = $('.login-box [name=password]').val()
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 注册按钮

    $('#form-reg').on('submit', (e) => {
        e.preventDefault()
        const data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }
        $.post("/api/reguser", data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录')
                // 模拟人的点击行为
                $('#link-login').click()

            },

        );
    })

    $('#form-login').on('submit', (e) => {
        e.preventDefault()
        $.ajax({
            method: "post",
            url: "/api/login",
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (response) {
                if(response.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登陆成功')
                // 将登陆成功的字符串保存到localStorage中
                localStorage.setItem('token', response.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        });
    })
})()