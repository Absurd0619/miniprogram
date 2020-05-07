// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  db.collection("Comment").where({
    _id: event.commentId
  }).update({
    data: {
      zan: _.inc(1),
    },
    success: function (res) {
      console.log(res.data)
    }
  })
  return {
    msg:'评论成功'
  }
}