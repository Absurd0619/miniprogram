// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event);
  const db = cloud.database()


  try {    
    const  result = await  cloud.openapi.security.msgSecCheck({      
      content: event.content
    }) 
    if  (result.errCode === 87014) {      
      return  {        
        code: 500,
                msg: '内容含有违法违规内容',
                data: result      
      }    
    } else  {       
    }  
  } catch  (err) {     // 错误处理
    if  (err.errCode === 87014) {      
      return  {        
        code: 500,
                msg: '内容含有违法违规内容',
                data: err      
      }    
    }    
    return  {      
      code: 502,
            msg: '调用msgSecCheck接口异常',
            data: err    
    }  
  }
  try  {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.type
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


  for(let i = 0;i<event.imgList.length;i++){
    try {
      let imgBulr = (await cloud.downloadFile({
        fileID: event.imgList[i]
      }));
      console.log(event.imgList[i].split("."))
      const result = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/' + event.imgList[i].split(".")[2],
          value: imgBulr.fileContent
        }
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
  }
  let name = 'Space'
  if (event.isTuijian) {
    name = "Admin_space"
  }
  await db.collection(name).add({
    // data 字段表示需新增的 JSON 数据
    data: {
      appid: event.appid,
      date: new Date(),
      type: event.type,
      content: event.content,
      imgList: event.imgList,
      // 为待办事项添加一个地理位置（113°E，23°N）
      isPublish: event.isPublish,
      isNi: event.isNi,
      keyWord: event.keyWord || "",
    }
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
  return {
    code: 200,
    msg: '发布成功'
  }
}