/**
 * 用户模块接口列表
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import merge from 'lodash/merge'
// import qs from 'qs' // 根据需求是否导入qs模块
function adornData (params) {
  let defaults = {
    t: new Date().getTime()
  }
  return merge(defaults, params)
}
const home = {

  // post提交
  login (params) {
    params = adornData(params)
    return axios.post('/sys/login', JSON.stringify(params))
  }
//   // 菜单&权限获取
//   getMenu (params) {
//     params = adornData(params)
//     return axios.get('/sys/menu/nav', params)
//   }
}

export default home
