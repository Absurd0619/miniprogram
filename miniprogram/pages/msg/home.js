// miniprogram/pages/msg/home.js
const app = getApp();
var util = require("../../util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList:[],
    type:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      type: options.type
    })
    const db = wx.cloud.database();
    if (options.type=='1'){
      db.collection("Like").where({
        userId: app.globalData.appid
      }).orderBy('date', 'desc').get().then(res => {
        console.log(res)
        res.data.forEach(item => {
          item.date = util.getDate(item.date)
        });
        this.setData({
          msgList: res.data
        })
      });
    } else if (options.type == '2') {
      db.collection("Appreciate").where({
        userId: app.globalData.appid
      }).orderBy('date', 'desc').get().then(res => {
        console.log(res)
        res.data.forEach(item => {
          item.date = util.getDate(item.date)
        });
        this.setData({
          msgList: res.data
        })
      });
    } else if (options.type == '3') {
      db.collection("Comment").where({
        authorId: app.globalData.appid
      }).orderBy('date', 'desc').get().then(res => {
        console.log(res)
        res.data.forEach(item => {
          item.date = util.getDate(item.date)
        });
        this.setData({
          msgList: res.data
        })
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  methods: {
  
  },
  toDetail(e) {
    let obj = {
      id: e.currentTarget.dataset.id,
      type:this.data.type
    }
    wx.cloud.callFunction({
      name: 'handle',
      data: obj,
      success: res => { },
      fail: console.error
    })
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/detail/home?id=" + e.currentTarget.dataset.dynamicid
    })
  }
})