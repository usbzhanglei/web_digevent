$(function () {
  $('#link_reg').click(function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').click(function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })


  //从layui中获取form对象
  const form = layui.form
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      const pwd = $('.reg-box [name="password"]').val()
      if (pwd != value) {
        return '两次密码不一致！'
      }
    }
  });
  const layer = layui.layer
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    const data = { username: $('#form_reg [name="username"]').val(), password: $('#form_reg [name="password"]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录')
      $('#link_login').click()
    })
  })
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    const data = {}
    $.ajax({
      url: '/api/login',
      method: 'post',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status) {
          return layer.msg(res.message)
        }
        layer.msg('登录成功')
        localStorage.setItem('token', res.token)
        location.href = './index.html'
      }
    })
  })
})

