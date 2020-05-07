// miniprogram/pages/lead/lead.js
Page({

      /**
       * 页面的初始数据
       */
      data: {
        cardCur: 0,
        swiperList: [{
            id: 0,
            type:'img',
            content: [{
              img: 'cloud://urt-wy-epnoc.7572-urt-wy-epnoc-1300874780/welcome.gif'
            }],
            text: '欢迎来到Ni 时光'
          }, {
            id: 1,
            type: 'icon',
            content: [{
              name: 'emojifill',
                text: '开心',
              color: '#e54d42'
              }, {
                name: 'communityfill',
                text: '私密',
                color: '#f37b1d'
              },
              {
                name: 'hotfill',
                text: '情绪',
                color: '#fbbd08'
              },
              {
                name: 'medalfill',
                text: '荣耀',
                color: '#8dc63f'
              }
            ],
            text: '开启您的NI 时光之旅'
          }, {
            id: 2,
            type: 'icon',
            content: [
                {
                name: 'friendaddfill',
                  text: '谈心',
                color: '#39b54a'
                },

                {
                  name: 'likefill',
                  text: '表白',
                  color: '#1cbbb4'
                },

                {
                  name: 'writefill',
                  text: '记录',
                  color: '#0081ff'
                },
                {
                  name: 'share',
                  text: '分享',
                  color: '#6739b6'
                },
              ],
            text: '开启您的NI 时光之旅'
            },
            {
              id: 3,
              type: 'video',
              content: [{
                video: '/images/lvtu.mp4'
              }],
              text: '点击右侧按钮，开启您的旅途'
            }],
        },
        cardSwiper(e) {
          this.setData({
            cardCur: e.detail.current
          })
        },
        goIndex() {
          wx.redirectTo({
            url: "/pages/index/index"
          })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
          // setTimeout(function() {
          //   wx.redirectTo({
          //     url: "/pages/index/index"
          //   })
          // }, 10000)
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function() {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {

        }
      })