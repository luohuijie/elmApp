/**
 * Created by Administrator on 2017/4/13.
 */
export function formatDate(date,fmt){
  //console.log(date)处理时间
  //str.replace(old , new)
    /**
     *  1、时间拼接空字符串转换为字符串操作截取。思想非常牛鼻
     *
     * *
     * */
    if( /(y+)/.test(fmt) ){
      fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
      // console.log((date.getFullYear()));
      // console.log(fmt)
    };

    let o = {
      "M+": date.getMonth()+1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };

    //全部匹配
    for( var k in o ){
      if(new RegExp(`(${k})`).test( fmt )){
        let str = o[k]+'';
        fmt = fmt.replace(RegExp.$1,(
          o[k].length === 1 ? str : addLeftZero(str)
        ))
      }
    }
    return fmt;
};
function addLeftZero(str){  //专业辅助函数，添加前到0
    //哦。str.length 是拼接前的
   // console.log(("00"+str),("00"+str).substr(str.length))
    return ("00"+str).substr(str.length);
}
