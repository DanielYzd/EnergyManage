/**
 * 变压器档案接口
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornData, adornParams } from './adddefault'
const transformer = {
  // 所有变压器档案
  queryalltrans(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryalltrans', { params: params })
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
  },
  // POST /archive/association/dismountchild
  dismountchild(params) {
    return axios.post('/archive/association/dismountchild', params)
  },
  // GET /archive/association/afterresultmeter
  afterresultmeter(params) {
    return axios.get('/archive/association/afterresultmeter', {
      params: params
    })
  },
  // GET /archive/association/querymeterchildnode
  querymeterchildnode(params) {
    return axios.get('/archive/association/querymeterchildnode', {
      params: params
    })
  },
  // POST /archive/association/dismountmeter
  dismountmeter(params) {
    return axios.post('/archive/association/dismountmeter', params)
  },
  // POST /archive/association/mountmeter
  mountmeter(params) {
    return axios.post('/archive/association/mountmeter', params)
  }
}
export default transformer
