$(function () {
  const form = layui.form
  const layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6 || value.length < 1) {
        return '昵称长度应该在1 ~ 6长度之间!!!'
      }
    }
  })
  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      method: 'get',
      url: '/my/userinfo',
      success: function (res) {
        // console.log(res);
        if (res.status) return layer.msg('获取用户信息失败!')
        // console.log(res);
        // form.val('formUserInfo', res.data)
        // console.log(res.data.username);
        $('#formUserInfo').val(res.data.username)

      }
    })
  }
  initUserInfo()
  //重置表单数据
  $('#btnReset').click(function (e) {
    e.preventDefault()
    initUserInfo()
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    // console.log($('#nickname').val());
    const span = window.parent.$('#datid')[0]
    // console.log(span.dataset.id);
    $.ajax({
      method: 'post',
      url: '/my/userinfo',
      data: {
        id: span.dataset.id,
        nickname: $('#nickname').val(),
        email: $('#email').val()
      },
      success: function (res) {
        // console.log(res);
        if (res.status) return layer.msg('更新用户信息失败！')
        layer.msg('更新用户信息成功！')
        //调用父页面（index.html）方法
        window.parent.getUserInfo()
      }
    })
  })
})