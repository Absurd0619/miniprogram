let pageStart = 1;
var util = require("../../../util");
Component({
  properties: {
    publishTime: {
      type: Boolean,
      value: false,
      observer: 'publishFn',
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    modalName: '',
    key: '',
    requesting:false,
    scrollData: {}
  },
  attached() {
    this.setData({
      scrollData: {
        requesting: false,
        end: false,
        emptyShow: false,
        page: pageStart,
        listData: [],
        recommend:{}
      }
    })
    this.getList('refresh', pageStart);
  },
  methods: {
    publishFn(){
      console.log("publishFn");
      this.getList('refresh', pageStart);
    },
    showModal(e) {
      wx.vibrateShort()
      this.setData({
        modalName: 'RadioModal'
      })
      console.log(111)
    },
    getInputValue(e) {
      this.setData({
        key: e.detail.value
      })
    },
    goNi() {
      console.log(1);
      if (!this.data.key) {
        return
      }
      console.log(this.data.key)
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/ni/home?key=" + this.data.key
      })
      this.setData({
        modalName: '',
        key: '',
      })
    },
    hideModal() {
      this.setData({
        modalName: null
      })
    },
    getList(type, currentPage) {
      console.log(type);
      let currentCur = this.data.categoryCur;
      let pageData = this.data.scrollData;

      if (type !== "refresh" && pageData.end) {
        wx.showToast({
          title: '已加载全部',
          image: '/images/Error.png',
        })
        return
      };
      console.log(123);
      // pageData.requesting = true;
      this.setData({
        requesting: true
      })
      let PromiseArr =[];
      const db = wx.cloud.database()
      PromiseArr.push(new Promise((resolve, reject) => {
        db.collection("Admin_space").orderBy('date', 'desc').limit(1).get().then(res => {
          resolve(res.data[0])
        }).catch(err => {
          console.log(err)
        })
      }));
      PromiseArr.push(new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'getHomeData',
          data: {
            pageIndex: currentPage,
            pageSize:3
          },
          success: res => {
            res.result.data.forEach(item => {
              if (item.date) {
                item.date = util.getDate(item.date)
              }
            })
            resolve(res.result)
          },
          fail: err=>{
            reject(err)
          }
        })



      }));
      Promise.all(PromiseArr).then(res => {
        wx.hideLoading();
        console.log(res);
        let data = {
          datas: res[1].data || [],
          recommend: res[0],
          over: res[1].hasMore
        };
        // pageData.requesting = false;
        this.setData({
          requesting: false
        })
        if (type === 'refresh') {
          pageData.listData = data.datas;
          pageData.end = !data.over;
          pageData.recommend = data.recommend;
          pageData.page = currentPage + 1;
        } else {
          pageData.listData = pageData.listData.concat(data.datas);
          pageData.end = !data.over;
          pageData.recommend = data.recommend;
          pageData.page = currentPage + 1;
        }

        this.setCurrentData(pageData);
      })
    },
    // 更新页面数据
    setCurrentData(pageData) {
      console.log(pageData);
      this.setData({
        scrollData: pageData
      })
    },
    // 刷新数据
    refresh() {
      this.getList('refresh', pageStart);
    },
    // 加载更多
    more() {
      this.getList('more', this.data.scrollData.page);
    },
    getRE(){
    },
    getCom(){
      const db = wx.cloud.database()
      return 
    }

  }
})