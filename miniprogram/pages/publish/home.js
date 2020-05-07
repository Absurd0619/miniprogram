const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    IsAdmin: app.globalData.isAdmin,
    index: null,
    imgList: [],
    isNi: true,
    isPublish: true,
    isTuijian:false,
    publish: {
      type: '',
      content: '',
      isPublish: true,
      isNi: true,
      keyWord:''
    }
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res);
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除照片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  getInputValue(e) {
    this.setData({
      IsAdmin: app.globalData.isAdmin
    })
    let name = e.currentTarget.dataset.name;
    this.data.publish[name] = e.detail.value
    this.setData({
      publish: this.data.publish
    })
    console.log(this.data.publish);
  },
  getTuijian(e) {
    this.setData({
      isTuijian: e.detail.value
    })
  },
  hideModal() {
    this.triggerEvent('closeModal')
  },
  publishFn() {
    wx.showLoading({
      title: '发送中',
      mask: true,
    })
    if(!this.data.publish.type){
      wx.showToast({
        title: '请输入话题',
        icon: 'warn'
      })
      return
    } else if (!this.data.publish.content){
      wx.showToast({
        title: '请输入内容',
        icon: 'warn'
      })
      return
    } else if (this.data.publish.isNi && !this.data.publish.keyWord){
      wx.showToast({
        title: '请输入密码',
        icon:'warn'
      })
      return
    }
    this.data.publish.imgList = [];
    this.data.publish.appid = app.globalData.appid;

    const promiseArr = []
    for (let i = 0; i < this.data.imgList.length; i++) {
      console.log(this.data.imgList);
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: app.globalData.appid + '__' + new Date().getTime() + suffix,
          filePath: filePath // 文件路径
        }).then(res => {
          console.log(res.fileID)
          this.data.publish.imgList = this.data.publish.imgList.concat(res.fileID)
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }

    Promise.all(promiseArr).then(res => {
      console.log(res);
      this.data.publish.isTuijian = this.data.isTuijian;
      wx.cloud.callFunction({
        name: 'publish',
        data: this.data.publish,
        success: res => {
          if (res.result.code === 200){
            console.log('callFunction test result: ', res)
            wx.showToast({
              title: res.result.msg,
              icon: 'success'
            })
            this.setData({
              isPublish: true,
              isNi: true,
              imgList: [],
              publish: {
                isNi: true,
                isPublish: true
              }
            })
          }else{
            wx.showToast({
              title: res.result.msg,
              image: '/images/Error.png',
            })
          }
          this.triggerEvent('publishSuccess')
          wx.hideLoading();
        },
        fail: console.error
      })
    })
  }
})