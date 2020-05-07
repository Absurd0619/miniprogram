//app.js
App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('callFunction test result: ', res)
        this.globalData.appid = res.result.appid;
        this.globalData.isFirst = res.result.time;
        this.globalData.isAdmin = res.result.appid ==='wxd8f631e706870c64';
      },
      fail: console.error
    })
  },
  globalData: {
  }
})