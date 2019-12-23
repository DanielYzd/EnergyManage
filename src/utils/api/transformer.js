/**
 * 变压器档案接口
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornData, adornParams } from './adddefault'
const transformer = {
  // 所有变压器档案
  queryalltrans(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryalltrans', params)
  },
  //   POST /archive/transformer/addtrans
  addtrans(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/addtrans', data)
  },
  // POST /archive/transformer/modifytrans
  modifytrans(params) {
    params = adornData(params)
    return axios.post('/archive/transformer/modifytrans', params)
  },
  //   POST /archive/archive/transformer/deletetrans/{id}
  deletetrans(id) {
    return axios.post(`/archive/archive/transformer/deletetrans/${id}`)
  },
  // GET /archive/transformer/page
  queryPage(params) {
    params = adornParams(params)
    console.log(params)
    return axios.get('/archive/transformer/page', { params: params })
  },
  // GET /archive/association/queryparentchildnode 待挂载子级列表
  queryparentchildnode(params) {
    params = adornParams(params)
    return axios.get('/archive/association/queryparentchildnode', {
      params: params
    })
  },
  // GET /archive/association/afterresultquery
  afterresultquery(params) {
    return axios.get('/archive/association/afterresultquery', {
      params: params
    })
  },
  // GET /archive/association/mountchild
  mountchild(params) {
    return axios.post('/archive/association/mountchild', params)
  }
}
export default transformer
