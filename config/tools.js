module.exports = {
  nextday: function (datetime) {
    var old_time = new Date(datetime.replace(/-/g, "/")); //替换字符，js不认2013-01-31,只认2013/01/31
    var fd = new Date(old_time.valueOf() + 1 * 24 * 60 * 60 * 1000); //日期加上指定的天数
    var new_time = fd.getFullYear() + "-";
    var month = fd.getMonth() + 1;
    if (month >= 10) {
      new_time += month + "-";
    } else {
      //在小于10的月份上补0
      new_time += "0" + month + "-";
    }
    if (fd.getDate() >= 10) {
      new_time += fd.getDate();
    } else {
      //在小于10的日期上补0
      new_time += "0" + fd.getDate();
    }
    return new_time; //输出格式：2013-01-02
  }

}