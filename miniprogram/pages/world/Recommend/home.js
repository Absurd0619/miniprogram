// pages/world/Recommend/home.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  observers: {
    'recommendData': function (recommendData) {
      // 在 rate被设置时，执行这个函数
      // this.setData({
      //   recommendData: recommendData
      // })
    }
  },
  created() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      console.log(e)
      // url = "/pages/detail/home"
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/detail/home?id=" + e.currentTarget.dataset.id +"&&isRecommend="+ true
      })
    },
  }
})