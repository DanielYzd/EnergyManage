/**
 * 分线档案接口
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornData, adornParams } from './adddefault'
const newBranchLine = {
  //   查询所有树 get archive/association/queryallregionline
  queryallregionline(params) {
    params = adornParams(params)
    return axios.get('/archive/association/queryallregionline', { params })
  },
  // 新曾进线&支路档案archive/transformer/addline
  addline(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/addline', data)
  },
  //   查询某个档案archive/transformer/queryonedocument
  queryonedocument(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryonedocument', { params })
  },
  // 查询新增进线支路可选择的父级 archive/transformer/searchpcode
  searchpcode(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/searchpcode', { params })
  },
  // 修改进线或者支路archive/transformer/modifylines
  modifylines(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/modifylines', data)
  },
  //  删除档案 archive/transformer/deletetransline/{id}
  deletetransline(params) {
    return axios.post(`archive/transformer/deletetransline/${params}`)
  },
  // 新增变压器  archive/transformer/addtrans
  addtrans(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/addtrans', data)
  },
  // 修改变压器archive/transformer/modifytrans
  modifytrans(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/modifytrans', data)
  },
  //已挂载列表archive/transformer/linestransmeter
  linestransmeter(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/linestransmeter', { params })
  },
  //  待挂载 archive/association/querymeterchildnode
  querymeterchildnode(params) {
    params = adornParams(params)
    return axios.get('/archive/association/querymeterchildnode', { params })
  },
  //挂载archive/transformer/mountitelinestransmmeter
  mountitelinestransmmeter(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/mountitelinestransmmeter', data)
  },
  //写载archive/transformer/dismountitemlinestransmeter
  dismountitemlinestransmeter(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/dismountitemlinestransmeter', data)
  }
}
export default newBranchLine
