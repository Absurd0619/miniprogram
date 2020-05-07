// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  // obj.id = this.data.id;
  // obj.appid = app.globalData.appid;
  // obj.isRecommend = this.data.isRecommend;

  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    if (result.errCode === 87014) {
      return {
        code: 500,
        msg: '内容含有违法违规内容',
        data: result
      }
    } else {
    }
  } catch (err) {     // 错误处理
    if (err.errCode === 87014) {
      return {
        code: 500,
        msg: '内容含有违法违规内容',
        data: err
      }
    }
    return {
      code: 502,
      msg: '调用msgSecCheck接口异常',
      data: err
    }
  }





  if (event.commentId) {//有评论Id；
    await db.collection('Comment').where({
      _id: event.commentId
    }).update({
      // data 字段表示需更新的 JSON 数据
      data: {
        commentList: _.unshift({
          handleId: event.appid,
          content: event.content,
          date: new Date(),
          isRead:false
        }),
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  } else {
    if (event.isRecommend) {
      await db.collection("Admin_space").where({
        _id: event.dynamicId
      }).update({
        data: {
          comment: _.inc(1),
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    } else {
      await db.collection("Space").where({
        _id: event.dynamicId
      }).update({
        data: {
          comment: _.inc(1),
        },
        success: function (res) {
          console.log(res.data)
        }
      }
      )
    }
    await db.collection('Comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        dynamicId: event.dynamicId,//动态Id
        authorId: event.authorId,
        handleId: event.appid,
        content: event.content,
        commentList: [],
        hasRead:false,
        date: new Date()
      },
      success: function (res) {
        console.log(res.data)
      }
    });
    await db.collection("Appreciate").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        dynamicId: event.id,//动态Id
        userId: event.userId,//作者Id
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
    code: 200,
    msg: '评论成功'
  }
}