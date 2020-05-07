// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.type);
  // obj.id = this.data.id;
  // obj.appid = app.globalData.appid;
  // obj.isRecommend = this.data.isRecommend;
  let name = 'Space';
  if (event.isRecommend) {
    name = "Admin_space"
  } else {
    name = "Space"
  }
  if (event.type === 'like') {
    await db.collection(name).where({
      _id: event.id
    }).update({
      // data 字段表示需更新的 JSON 数据
      data: {
        like: _.inc(1),
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    await db.collection("Like").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        dynamicId: event.id,//动态Id
        authorId: event.authorId,//作者Id
        handle: event.appid,//handleId
        date: new Date(),
        hasRead: false
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  } else {
    await db.collection(name).where({
      _id: event.id
    }).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        appreciate: _.inc(1),
      },
      success: function (res) {
        console.log(res.data)
      }
    });
    await db.collection("Appreciate").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        dynamicId: event.id,//动态Id
        authorId: event.authorId,//作者Id
        handle: event.appid,//handleId
        date: new Date(),
        hasRead: false
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }
  return {
    msg: '处理成功'
  }
}