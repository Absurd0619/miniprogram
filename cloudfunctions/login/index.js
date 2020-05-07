const cloud = require('wx-server-sdk')
// 默认配置
cloud.init()

const db = cloud.database()

exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext);
  let userInfo = null;
  await db.collection('User').get({
    appid: wxContext.APPID
  }).then(res => {
    userInfo = res.data[0];
    }).catch(err => {
      console.log(err)
    })
  try {
    if (userInfo) {
      return {
        'appid': wxContext.APPID,
        'time': 1
      }
    } else {
      db.collection('User').add({
        data: {
          appid: wxContext.APPID,
          like:0,
          likeList:[],
          appreciate:0,
          appreciateList:[],
          comment:0,
          commentList:[],
          space:[]
        }
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
      return {
        'appid': wxContext.APPID,
        'time': 0
      }
    }
  } catch (e) {
    console.error(e)
  }
}