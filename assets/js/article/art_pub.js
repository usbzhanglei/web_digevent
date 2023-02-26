$(function () {
  const { createEditor, createToolbar } = window.wangEditor

  const editorConfig = {
    placeholder: 'Type here...',
    onChange(editor) {
      const html = editor.getHtml()
      console.log('editor content', html)
      // 也可以同步到 <textarea>
    }
  }

  const editor = createEditor({
    selector: '#editor-container',
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'default', // or 'simple'
  })

  const toolbarConfig = {}

  const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'default', // or 'simple'
  })
  const layer = layui.layer
  const form = layui.form
  initCate()
  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status) return layer.msg('初始化文章分类失败')
        const htmlStr = template('tpl-cate', res)
        $('[name="cate_id"]').html(htmlStr)
        form.render()
      }
    })
  }
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  $('#btnChooseImage').click(function () {
    $('#coverFile').click()
  })

  $('#coverFile').on('change', function (e) {
    const files = e.target.files
    if (!files.length) return layer.msg()
    const newImgURL = URL.createObjectURL(files[0])
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  let art_state = '已发布'
  $('#btnSave2').click(function () {
    art_state = '草稿'
  })

  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    console.log($(this));
    const fd = new FormData($(this)[0])

    // console.log($('#editor-container [data-slate-string="true"]').html());
    fd.append('content', $('#editor-container [data-slate-string="true"]').html())
    fd.append('state', art_state)
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })
    // fd.forEach(function (v, k) {
    //   console.log(v, k);
    // })
  })
  function publishArticle(fd) {
    $.ajax({
      method: 'post',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status) return layer.msg('发布文章失败!')
        layer.msg('发布文章成功!')
        location.href = './art_list.html'
      }
    })
  }
})