$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage;
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    const y = dt.getFullYear()
    const m = padZero(dt.getMonth() + 1)
    const d = padZero(dt.getDate())

    const hh = padZero(dt.getHours())
    const mm = padZero(dt.getMinutes())
    const ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // 定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1,//页码值,默认请求第一页数据
    pagesize: 2,	///每页显示多少条数据
    cate_id: '',//文章分类的 Id
    state: '' //文章的状态，可选值有：已发布、草稿
  }
  initTable()
  //获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'get',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status) return layer.msg('获取文章列表数据失败！')
        // layer.msg('获取文章列表数据成功！')
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }
  initCate()
  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        console.log(res);
        if (res.status) return layer.msg('获取分类数据失败！')
        const htmlStr = template('tpl-cate', res)
        $('[name="cate_id"]').html(htmlStr)
        // initTable()
        form.render()
      }
    })
  }
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    const cate_id = $('[name="cate_id"]').val()
    const state = $('[name="state"]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  //分页
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,//每页条数的选择项
      curr: q.pagenum, //起始页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 4, 5, 6, 7],
      //1.点击页码时会调用jump回调
      //2.只要调用了laypage.render()方法就会触发jump回调
      jump: function (obj, first) {
        // console.log(obj.curr);
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) initTable()
      }
    });
  }
  //删除
  $('tbody').on('click', '.btn-delete', function () {
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      const len = $('.btn-delete').length
      const id = $(this).attr('data-id')
      //do something
      $.ajax({
        method: 'get',
        url: `/my/article/delete/${id}`,
        success: function (res) {
          if (res.status) return layer.msg('删除文章失败！')
          layer.msg('删除文章成功！')
          if (len === 1)
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          initTable()
        }
      })
      layer.close(index)
    });
  })
})