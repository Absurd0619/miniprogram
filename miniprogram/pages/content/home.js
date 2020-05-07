// pages/content/home.js
const app = getApp();
var util = require("../../util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contentData:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardCur:0
  },
  observers: {
    'contentData': function (contentData) {
      console.log(contentData);
      // 在 rate被设置时，执行这个函数
      // this.setData({
      //   contentData: contentData
      // })
    }
  },
  created() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      console.log(e)
      // url = "/pages/detail/home"
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/detail/home?id=" + e.currentTarget.dataset.id
      })
    },
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    }
  }
})
