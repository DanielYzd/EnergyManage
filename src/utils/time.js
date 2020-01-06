let moment = require('moment')
//获取昨日时间
let yesterday = moment()
  .subtract(1, 'days')
  .format('YYYYMMDD')
//获取本月第一天
let monthfirst = moment()
  .month(moment().month())
  .startOf('month')
  .format('YYYYMMDD')
//获取本月最后一天
let monthlast = moment()
  .month(moment().month())
  .endOf('month')
  .format('YYYYMMDD')
//获取本年第一天
let yearfirst = moment()
  .year(moment().year())
  .startOf('year')
  .format('YYYYMMDD')
//获取本年最后一天
let yearlast = moment()
  .year(moment().year())
  .endOf('year')
  .format('YYYYMMDD')
let hour = []
for (let i = 0; i < 24; i++) {
  hour.push(i + '时')
}
let month = []
for (let i = 1; i < 13; i++) {
  month.push(i + '月')
}
let diff = moment(monthlast).diff(moment(monthfirst), 'days') + 1
let days = []
for (let i = 1; i < diff + 1; i++) {
  days.push(i + '日')
}
export default {
  yesterday,
  monthfirst,
  monthlast,
  yearfirst,
  yearlast,
  hour,
  month,
  days
}
