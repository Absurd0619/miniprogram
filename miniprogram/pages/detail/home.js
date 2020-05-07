// miniprogram/pages/detail/home.js
const app = getApp();
var util = require("../../util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isRecommend: false,
    key: '',
    detailObj: {},
    cardCur: 0,
    isComment: false,
    sendValue: '',
    commentList: [],
    commentId: '',
    commentIndex: 0,
    showText:false,
    like:false,
    dianzan:false,
  },

  /**
   * 生命...{...5
   *    www.周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      id: options.id,
      isRecommend: options.isRecommend,
      key: options.key
    })
    const db = wx.cloud.database();
    if(this.data.isRecommend) {
      db.collection("Admin_space").where({
        appid: app.globalData.appid,
        keyWord: this.data.key,
        _id: this.data.id
      }).get().then(res => {
        console.log(res.data);
        res.data.forEach(item => {
          item.imgList.push(item.imgList[0]);
          item.imgList.push(item.imgList[0]);
          item.imgList.push(item.imgList[0]);
          item.imgList.push(item.imgList[0]);
          if (item.date) {
            item.date = util.getDate(item.date)
          }
        })
        this.setData({
          detailObj: res.data[0] || {}
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      db.collection("Space").where({
        appid: app.globalData.appid,
        keyWord: this.data.key,
        _id: this.data.id
      }).get().then(res => {
        console.log(res.data);
        res.data.forEach(item => {
          if (item.date) {
            item.date = util.getDate(item.date)
          }
        })
        this.setData({
          detailObj: res.data[0] || {}
        })
      }).catch(err => {
        console.log(err)
      })
    }

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

  },
  /**
   * 获得评论数据
   */
  back(){
    wx.navigateBack({
      delta: 1
    })
  },
  getCommentData(){
    const db = wx.cloud.database();
    db.collection("Comment").where({
      dynamicId: this.data.id
    }).orderBy('date', 'desc').get().then(res => {
      res.data.forEach(item => {
        item.date = util.getDate(item.date)
      })
      this.setData({
        commentList: res.data
      })
    });

  },
  showAll(){
    this.setData({
      showText: !this.data.showText
    });
  },
  showComment(){
    console.log(111);
    this.setData({
      isComment: !this.data.isComment
    });
    if(this.data.isComment){
      this.getCommentData();
    }
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.detailObj.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DianZan() {
    this.setData({
      dianzan:true,
    });
    this.handle({
      type: 'dianzan'
    });
  },
  Like() {
    this.setData({
      like: this.data.detailObj
    });
    this.handle({
      type: 'like'
    });
  },
  commentContent(e) {
    this.data.detailObj.comment = (this.data.detailObj.comment || 0) - 0 + 1;
    this.setData({
      isComment: true,
      commentId: e.currentTarget.dataset.commentid
    });
  },
  commentZan(e) {
    this.setData({
      commentIndex: e.currentTarget.dataset.commentid.index
    })
    wx.cloud.callFunction({
      name: 'commentZan',
      data: {
        commentId: e.currentTarget.dataset.commentid
      },
      success: res => {},
      fail: console.error
    });
    this.data.commentList[this.data.commentIndex].zan = (this.data.commentList[this.data.commentIndex].zan || 0) - 0 + 1;
    this.setData({
      commentId: '',
      commentList: this.data.commentList
    })
  },
  send() {
    let obj = {};
    obj.dynamicId = this.data.id; //动态Id
    obj.appid = app.globalData.appid; //评论人id
    obj.isRecommend = this.data.isRecommend; //是否为推荐
    obj.content = this.data.sendValue; //评论内容
    obj.authorId = this.data.detailObj.appid; //作者Id
    obj.commentId = this.data.commentId;
    wx.cloud.callFunction({
      name: 'comment',
      data: obj,
      success: res => {
        if(res.result.code === 200){
          if(!obj.commentId){
            this.data.detailObj.comment = (this.data.detailObj.comment || 0) - 0 + 1;
          }
          this.setData({
            isComment: false,
            sendValue: '',
            commentId: '',
            detailObj: this.data.detailObj,
          })
          wx.showToast({
            title: res.result.msg,
            icon: '评论成功'
          })
          this.getCommentData();
        }else{
          wx.showToast({
            title: res.result.msg,
            image: '/images/Error.png',
          })
        }
      },
      fail: console.error
    })
  },
  getInputValue(e) {
    this.setData({
      sendValue: e.detail.value
    })
  },
  handle(obj) {
    obj.id = this.data.id; //动态id
    obj.appid = app.globalData.appid; //处理人id
    obj.isRecommend = this.data.isRecommend; //是否为推荐
    obj.authorId = this.data.detailObj.appid; //作者id
    wx.cloud.callFunction({
      name: 'handle',
      data: obj,
      success: res => {
        if(obj.type==='like'){
          this.data.detailObj.like = (this.data.detailObj.like || 0) - 0 + 1;
          this.setData({
            like: false,
            detailObj: this.data.detailObj
          });
        }else{
          this.data.detailObj.appreciate = (this.data.detailObj.appreciate || 0) - 0 + 1;
          this.setData({
            dianzan: false,
            detailObj: this.data.detailObj
          });
        }
      },
      fail: console.error
    })
  },
  methods: {

  }
})