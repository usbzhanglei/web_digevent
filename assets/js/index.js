$(function () {
  getUserInfo()
  const layer = layui.layer
  $('#btnLogout').click(function () {
    console.log('ok');
    //提示用户是否退出
    //eg1
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      //do something
      if (index) {
        location.href = './login.html'
        localStorage.removeItem('token')
      }
      console.log(index);
      layer.close(index);
    })
  })
})
function getUserInfo() {
  $.ajax({
    method: 'get',
    url: '/my/userinfo',
    //headers请求头配置对象
    /* headers: {
      Authorization: localStorage.getItem('token') || ''
    }, */
    success: function (res) {
      // console.log(res);
      if (res.status) return layui.layer.msg('获取用户信息失败')
      renderAvater(res.data)
    },
    // 不论成功还是失败都会调用
    // complete: function (res) {
    //   // console.log('执行了' + res);
    //   // console.log(res);
    //   if (res.responseJSON.status && res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     localStorage.removeItem('token')
    //     location.href = './login.html'
    //   }
    // }
  })
}
function renderAvater(user) {
  const name = user.nickname || user.username
  $('#welcome').html(`欢迎&nbsp;${name}`)
  const url = user.user_pic
  $('#datid').attr('data-id', user.id)
  if (url) {
    $('.layui-nav-img').attr('src', url).show()
    $('.text-avatar').hide()
  } else {
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
    $('.layui-nav-img').hide()
  }
}
