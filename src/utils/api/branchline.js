/**
 * 变压器档案接口
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornData, adornParams } from './adddefault'
const transformer = {
  // GET /archive/branchline/querytopline 查询树
  querytopline(params) {
    params = adornParams(params)
    return axios.get('/archive/branchline/querytopline', {
      params: params
    })
  },
  // POST /archive/branchline/addline 新增分线
  addline(data) {
    data = adornData(data)
    return axios.post('/archive/branchline/addline', data)
  },
  // POST /archive/association/mountmeter
  mountmeter(data) {
    data = adornData(data)
    return axios.post('/archive/association/mountmeter', data)
  },
  // GET /archive/transformer/queryoneline  点击树展示对应的档案/分线或者变压器
  queryoneline(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryoneline', {
      params: params
    })
  },
  // POST /archive/branchline/modifyline 修改分线
  modifyline(data) {
    data = adornData(data)
    return axios.post('/archive/branchline/modifyline', data)
  },
  // GET /archive/association/afterlineresultmeter
  afterlineresultmeter(params) {
    params = adornParams(params)
    return axios.get('/archive/association/afterlineresultmeter', {
      params: params
    })
  }
}
export default transformer
