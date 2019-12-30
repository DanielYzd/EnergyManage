/**
 * 变压器档案接口
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornData, adornParams } from './adddefault'
const building = {
  // GET /archive/transformer/queryallbuilding //查询建筑档案树
  queryallbuilding(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryallbuilding', {
      params: params
    })
  },
  // GET /archive/transformer/addbuilding //新增建筑档案
  addbuilding(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/addbuilding', data)
  },
  // POST /archive/transformer/modifybuilding //修改建筑档案
  modifybuilding(data) {
    data = adornData(data)
    return axios.post('/archive/transformer/modifybuilding', data)
  },
  // GET /archive/transformer/queryallbuildingkind 查询所有建筑类型
  queryallbuildingkind(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryallbuildingkind', {
      params: params
    })
  },
  // GET /archive/transformer/queryonebuilding
  queryonebuilding(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryonebuilding', {
      params: params
    })
  },
  // POST /archive/archive/transformer/deletebuilding/{id}
  deletebuilding(params) {
    return axios.post(`/archive/archive/transformer/deletebuilding/${params}`)
  },
  // GET /archive/transformer/queryallenergyitem //查询所有分项
  queryallenergyitem(params) {
    return axios.get('/archive/transformer/queryallenergyitem', {
      params: params
    })
  },
  // GET /archive/transformer/queryallenergytype  //查询所有分类
  queryallenergytype(params) {
    return axios.get('/archive/transformer/queryallenergytype', {
      params: params
    })
  }
  //   // GET /archive/branchline/querytopline 查询树
  //   querytopline(params) {
  //     params = adornParams(params)
  //     return axios.get('/archive/branchline/querytopline', {
  //       params: params
  //     })
  //   },
  //   // POST /archive/branchline/addline 新增分线
  //   addline(data) {
  //     data = adornData(data)
  //     return axios.post('/archive/branchline/addline', data)
  //   }
}
export default building
