var tool = {}
tool.oneDayLong = 86400000 //24*60*60*1000
tool.padLeftZero = function(str) {
  return ('00' + str).substr(str.length)
}
tool.formatDate = function(date, fmt) {
  if (!date) {
    return null
  }
  if (!fmt) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : this.padLeftZero(str)
      )
    }
  }
  return fmt
}
tool.getIntervalDays = function(date1, date2) {
  return Math.abs(date1.getTime() - date2.getTime()) / this.oneDayLong
}
tool.addDay = function(date, days) {
  return new Date(date.getTime() + days * this.oneDayLong)
}
tool.addMonth = function(date, months) {
  var sMonth = date.getMonth() + months
  return new Date(
    date.getFullYear(),
    sMonth,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
}
tool.addYear = function(date, years) {
  var sMonth = date.getMonth() + years * 12
  return new Date(
    date.getFullYear(),
    sMonth,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
}

tool.getIntervalStr = function(foarmatStr, startDate, endDate) {
  let result = []
  if (typeof startDate === 'string') {
    startDate = new Date(startDate)
  }
  if (typeof endDate === 'string') {
    endDate = new Date(endDate)
  }
  if (foarmatStr === 'MM-dd') {
    while (startDate <= endDate) {
      result.push(this.formatDate(startDate, foarmatStr))
      startDate = this.addDay(startDate, 1)
    }
  } else if (foarmatStr === 'dd') {
    while (startDate <= endDate) {
      result.push(this.formatDate(startDate, foarmatStr))
      startDate = this.addDay(startDate, 1)
    }
  } else if (foarmatStr === 'yyyy') {
    while (startDate <= endDate) {
      result.push(this.formatDate(startDate, foarmatStr))
      startDate = this.addYear(startDate, 1)
    }
  }
  return result
}
/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
tool.getPreMonth = function(date) {
  var arr = date.split('-')
  var year = arr[0] //获取当前日期的年份
  var month = arr[1] //获取当前日期的月份
  var day = arr[2] //获取当前日期的日
  var days = new Date(year, month, 0)
  days = days.getDate() //获取当前日期中月的天数
  var year2 = year
  var month2 = parseInt(month) - 1
  if (month2 == 0) {
    year2 = parseInt(year2) - 1
    month2 = 12
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  var t2 = year2 + '-' + month2 + '-' + day2
  return t2
}

/**
 * 获取下一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
tool.getNextMonth = function(date) {
  var arr = date.split('-')
  var year = arr[0] //获取当前日期的年份
  var month = arr[1] //获取当前日期的月份
  var day = arr[2] //获取当前日期的日
  var days = new Date(year, month, 0)
  days = days.getDate() //获取当前日期中的月的天数
  var year2 = year
  var month2 = parseInt(month) + 1
  if (month2 == 13) {
    year2 = parseInt(year2) + 1
    month2 = 1
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }

  var t2 = year2 + '-' + month2 + '-' + day2
  return t2
}
tool.stringFormat = function(str) {
  //将arguments转化为数组（ES5中并非严格的数组）
  var args = Array.prototype.slice.call(arguments)
  var count = 1
  //通过正则替换%s
  return str.replace(/%s/g, function(s, i) {
    return args[count++]
  })
}
tool.getUrlArgs = function(url) {
  var args = {}
  var query = url
  var start = query.indexOf('?')
  if (start == -1) {
    start = query.indexOf('&')
  }
  if (start == -1) {
    return args
  }
  var str = query.substring(start + 1)
  var tmp = str.split('&')
  for (var i = 0; i < tmp.length; i++) {
    var t = tmp[i].split('=')
    if (t.length != 2) continue
    var argname = t[0]
    var value = decodeURIComponent(t[1])
    args[argname] = value
  }
  return args
}
export default tool
