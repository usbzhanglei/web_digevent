$(function () {
  const layer = layui.layer
  const form = layui.form
  initArtCateList()
  function initArtCateList() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res);
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  let indexAdd = null
  $('#btnAddCate').click(function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式，为form-add表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    // console.log($(this).serialize());
    // console.log($('#form-add [name="name"]').val());
    $.ajax({
      method: 'post',
      url: '/my/article/addcates',
      data: {
        name: $('#form-add [name="name"]').val(), alias: $('#form-add [name="alias"]').val()
      },
      success: function (res) {
        console.log(res);
        if (res.status) return layer.msg('新增分类失败！')
        initArtCateList()
        layer.msg('新增分类成功！')
        layer.close(indexAdd)
      }
    })
  })
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function (e) {
    console.log('ok');
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    const id = $(this).attr('data-id')
    // console.log(id);
    $.ajax({
      method: 'get',
      url: `/my/article/cates/${id}`,
      success: function (res) {
        // console.log(res);
        form.val('form-edit', res.data)
      }
    })
  })
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status) return layer.msg('更新分类数据失败!')
        layer.msg('更新分类数据成功!')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })
  $('tbody').on('click', '.btn-delete', function () {
    // console.log(11);
    const id = $(this).attr('data-id')
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          // console.log(res);
          if(res.status) return layer.msg('删除分类失败！')
          layer.msg('删除分类成功！')
          layer.close(index);
          initArtCateList()
        }
      })
    });
  })
})