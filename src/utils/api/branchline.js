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
  // GET /archive/association/afterlineresultmeter 查询分线已挂载的电表
  afterlineresultmeter(params) {
    params = adornParams(params)
    return axios.get('/archive/association/afterlineresultmeter', {
      params: params
    })
  },
  // POST /archive/branchline/deleteline/{id} 删除分线档案
  deleteline(params) {
    return axios.post(`/archive/branchline/deleteline/${params}`)
  },

  // GET /archive/association/querytranformerchildnode// 显示待挂载的变压器
  querytranformerchildnode(params) {
    return axios.get('/archive/association/querytranformerchildnode', {
      params: params
    })
  },
  // POST /archive/association/mountlineperline  //挂载分线
  mountlineperline(data) {
    // data = adornData(data)
    return axios.post('/archive/association/mountlineperline', data)
  },
  // POST /archive/association/mountlinetrans  //挂载变压器
  mountlinetrans(data) {
    // data = adornData(data)
    return axios.post('archive/association/mountlinetrans', data)
  },
  // GET /archive/association/afterresultlinequery //查询已挂载的分线
  afterresultlinequery(params) {
    return axios.get('/archive/association/afterresultlinequery', {
      params: params
    })
  },
  // GET /archive/transformer/afterresultquery //查询已挂载的变压器
  afterresultquery(params) {
    return axios.get('/archive/transformer/afterresultquery', {
      params: params
    })
  },
  // POST /archive/association/dismountlineperline //从分线卸载分线或子级
  dismountlineperline(data) {
    return axios.post('/archive/association/dismountlineperline', data)
  },
  // POST /archive/association/dismountlinetrans //从分线卸载变压器
  dismountlinetrans(data) {
    return axios.post('/archive/association/dismountlinetrans', data)
  },
  // POST /archive/association/mountlinemeter 挂载电表
  mountlinemeter(data) {
    return axios.post('/archive/association/mountlinemeter', data)
  },
  // POST /archive/association/dismountlinemeter
  dismountlinemeter(data) {
    return axios.post('/archive/association/dismountlinemeter', data)
  }
}
export default transformer
