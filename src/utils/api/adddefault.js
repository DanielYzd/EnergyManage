import merge from 'lodash/merge'
import qs from 'qs' // 根据需求是否导入qs模块
export function adornData(params, openDefultdata = true, contentType = 'json') {
  let defaults = {
    t: new Date().getTime()
  }
  let data = openDefultdata ? merge(defaults, params) : params
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
export function adornParams(params, openDefultParams = true) {
  let defaults = {
    t: new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}
