import Vue from 'vue'
import httpRequest from '@/utils/httpRequest'
const sysConfig = {}
sysConfig.getMeterTypes = () => {
  if (sysConfig.meterTypes) {
    return sysConfig.meterTypes
  }
  sysConfig.meterTypes = [
    { key: '电', value: 0 },
    { key: '水', value: 1 }
  ] //,{key : '气',value : 2},{key : '热',value : 3},{key : '开关控制',value : 4},{key : '空调控制',value : 5}
  return sysConfig.meterTypes
}
sysConfig.getAllMeterTypes = () => {
  return [{ key: '全部', value: '' }].concat(sysConfig.meterTypes)
}
sysConfig.getTypes = () => {
  if (sysConfig.types) {
    return sysConfig.types
  }
  sysConfig.types = [0, 1] //,2,3
  return sysConfig.types
}
sysConfig.setMeterTypes = meterTypeList => {
  sysConfig.meterTypes = meterTypeList
}
sysConfig.setTypes = types => {
  var tmp = types.split(',')
  var res = []
  tmp.forEach(function(item) {
    res.push(parseInt(item))
  })
  sysConfig.types = res
}
sysConfig.loadConfig = () => {
  httpRequest.ajaxGet('/sys/config/partList', { regionid: 0 }, data => {
    sysConfig.setTypes(data.meterTypes)
    sysConfig.setMeterTypes(data.meterTypeList)
  })
}

export default sysConfig
