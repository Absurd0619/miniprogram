// pages/timeLine/home.js
const app = getApp();
var util = require("../../util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nikey: String
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {
  },
  observers: {
    'nikey': function (nikey) {
      // 在 rate被设置时，执行这个函数
      this.getData(nikey);
    }
  },
  moved: function () {
   },
  detached: function () { },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      console.log(e)
      // url = "/pages/detail/home"
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/detail/home?id=" + e.currentTarget.dataset.id + "&&key=" + this.data.nikey
      })
    },
    getData(key){
      util.getDate(new Date());
      console.log(key);
      console.log(this.data.nikey);
      const db = wx.cloud.database();
      if(key){
        db.collection("Space").where({
          appid: app.globalData.appid,
          keyWord: key
        }).orderBy('date', 'desc').get().then(res => {
          console.log(res.data);
          res.data.forEach(item=>{
            if(item.date){
              item.date = util.getDate(item.date)
            }
          })
          this.setData({
            list: res.data || []
          })
        }).catch(err => {
          console.log(err)
        })
      }else{
        db.collection("Space").where({
          appid: app.globalData.appid,
          keyWord:""
        }).orderBy('date', 'desc').get().then(res => {
          console.log(res.data);
          res.data.forEach(item => {
            if (item.date) {
              item.date = util.getDate(item.date)
            }
          })
          this.setData({
            list: res.data || []
          })
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
})
