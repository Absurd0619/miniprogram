const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    likeTotal: 0,
    appreciateTotal: 0,
    commentTotal: 0,
  },
  attached() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    const db = wx.cloud.database()
    db.collection("Space").where({
      'appid': app.globalData.appid,
      'isPublish': true
    }).get().then(res => {
      console.log(res.data);
      res.data.forEach(item => {
        this.data.likeTotal += item.like || 0;
        this.data.appreciateTotal += item.appreciate || 0;
        this.data.commentTotal += item.comment || 0;
        this.setData({
          likeTotal: this.coutNum(this.data.likeTotal),
          appreciateTotal: this.coutNum(this.data.appreciateTotal),
          commentTotal: this.coutNum(this.data.commentTotal)
        })
        wx.hideLoading()
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://wimg.588ku.com/gif620/19/07/09/8b9b76058cc9b5c7f9a53ac046fa7f98.gif'],
        current: 'https://wimg.588ku.com/gif620/19/07/09/8b9b76058cc9b5c7f9a53ac046fa7f98.gif' // 当前显示图片的http链接      
      })
    },
    toList(e) {
      
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/msg/home?type=" + e.currentTarget.dataset.type
      })
    }
  }
})