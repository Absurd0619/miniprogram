function getDate(date) {
  let newDate = new Date().getTime();
  let oldDate = new Date(date).getTime();
  let obj = {
  }
  const Dvalue = newDate - oldDate
  //一天1000*60*60*24
  if (Dvalue <= 1000 * 60){//1分钟前
    obj.d = '今天';
    obj.dic = '';
    obj.date="刚刚"
  } else if (Dvalue <= 1000 * 60 * 60){//1小时之内
    let m = Math.ceil(Dvalue / (1000 * 60));
    obj.d = '今天';
    obj.dic = '';
    obj.date = m+"分前"
  } else if (Dvalue <= 1000 * 60 * 60 * 24) {//一天之内
    obj.d = '今天';
    obj.dic = isDic(oldDate);
    obj.date = getHMS(oldDate);
  }else if (Dvalue<=(1000 * 60 * 60 * 24*30)){
    let m = Math.ceil(Dvalue / (1000 * 60 * 60 * 24 * 30));
    obj.d = m + "天前";
    obj.dic = isDic(oldDate);
    obj.date = getHMS(oldDate);
  }else{
    obj.d = getYMD(oldDate);
    obj.dic = isDic(oldDate);
    obj.date = getHMS(oldDate);
  }
  return obj;
};
function getYMD(date) {
  let isY = new Date().getYear() - oldDate.getYear();
  let Y = oldDate.getYear();
  let M = oldDate.getMonth() + 1;
  let D = oldDate.getDate();
  if (isY){
    return Y+"年"+M+"月"+D +"日";
  }else{
    return M + "月" + D + "日";
  }
}
function getHMS(date){
  let oldDate = new Date(date)
  console.log(oldDate.getHours());
  let h = oldDate.getHours() > 12 ? oldDate.getHours() - 12 : oldDate.getHours();
  let m = oldDate.getMinutes();
  let s = oldDate.getSeconds()
  if(s-0<10){
    s = '0' + s;
  }
  if (m-0 < 10) {
    m = '0' + m;
  }
  return h+":"+m+":"+s
}
function isDic(date){//获得凌晨，上午，下午，深夜
  var hours = new Date(date).getHours();
  let dic = ''
  if (hours < 6){
    dic = '凌晨'
  } else if(hours<12){
    dic = '上午'
  } else if (hours < 18) {
    dic = '下午'
  } else if(hours < 22) {
    dic = '晚上'
  }else{
    dic = '深夜'
  }
  return dic;
}
module.exports = {
  getDate: getDate
}