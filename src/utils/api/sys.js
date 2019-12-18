/**
 * 系统管理接口列表
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornData, adornParams } from './adddefault'
const sys = {
  // post提交
  login(params) {
    params = adornData(params)
    return axios.post('/sys/login', params)
  },
  // 获取数据字典树
  getDictlist(params) {
    params = adornParams(params)
    return axios.get('/sys/dicList', { params: params })
  },
  // POST /sys/dictOperation
  dictOperation(params) {
    params = adornData(params)
    return axios.post('/sys/dictOperation', params)
  },
  // POST /sys/dictDetailModify
  dictDetailModify(params) {
    params = adornData(params)
    return axios.post('/sys/dictDetailModify', params)
  },
  //POST /sys/dictDetailDelete
  dictDetailDelete(params) {
    // params = adornData(params)
    return axios.post(`/sys/dictDetailDelete/${params}`)
  }
}

export default sys
