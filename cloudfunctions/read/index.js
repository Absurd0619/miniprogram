// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let name = '';
  if(event.type == '1'){
    name = 'Like'
  } else if (event.type == '2'){
    name = 'Appreciate'
  }else{
    name = 'Comment'
  }

  db.collection(name).where({
    _id: event.id
  }).update({
    data: {
      hasRead: true,
    },
    success: function (res) {
      console.log(res.data)
    }
  })
  return {
    msg: '成功'
  }
}