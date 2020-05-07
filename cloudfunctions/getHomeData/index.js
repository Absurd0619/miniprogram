// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var pageIndex = event.pageIndex||1;
  var pageSize = event.pageSize||10;
  const conuteResult = await db.collection("Space").where({
    'isPublish': true
  }).count();
  const total = conuteResult.total;
  const totalPage = Math.ceil(total / pageSize);
  var hasMore;
  if (pageIndex >= totalPage){
    hasMore = false;
  }else{
    hasMore = true;
  }
  return db.collection("Space").where({ 'isPublish': true }).orderBy('date', 'desc').skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res=>{
    res.hasMore = hasMore;
    return res;
  })
}