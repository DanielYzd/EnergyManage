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
  },
  // GET /archive/transformer/queryenergyitem
  queryenergyitem(params) {
    return axios.get('/archive/transformer/queryenergyitem', {
      params: params
    })
  },
  // GET /archive/transfomer/itemaddmeter 查询已挂载的表计
  itemaddmeter(params) {
    params = adornParams(params)
    return axios.get('/archive/transfomer/itemaddmeter', {
      params: params
    })
  },
  // GET /archive/transfomer/itemsubmeter 查询已挂载的表计
  itemsubmeter(params) {
    return axios.get('/archive/transfomer/itemsubmeter', {
      params: params
    })
  },
  // GET /archive/transfomer/itemunmountedmeter 查询待挂载表计
  itemunmountedmeter(params) {
    return axios.get('/archive/transfomer/itemunmountedmeter', {
      params: params
    })
  },
  // POST /archive/transfomer/saveitemtagert
  saveitemtagert(data) {
    data = adornData(data)
    return axios.post('/archive/transfomer/saveitemtagert', data)
  },
  // GET /archive/transformer/queryenergyitemtarget 查询能耗信息年月
  queryenergyitemtarget(params) {
    params = adornParams(params)
    return axios.get('/archive/transformer/queryenergyitemtarget', {
      params: params
    })
  },
  // POST /archive/association/dismountitemmeter//卸载分项上的电表
  dismountitemmeter(data) {
    return axios.post('/archive/association/dismountitemmeter', data)
  },
  // POST /archive/transfromer/mountitemmeter 挂载分项上电表
  mountitemmeter(data) {
    return axios.post('/archive/transfromer/mountitemmeter', data)
  },
  // GET /archive/dicListclass 查询所有分类类别
  dicListclass(params) {
    return axios.get('/archive/dicListclass', {
      params: params
    })
  },
  // GET /archive/transformer/queryenergytypeone //查询单个能源分类
  queryenergytypeone(params) {
    return axios.get('/archive/transformer/queryenergytypeone', {
      params: params
    })
  },
  // GET /archive/association/afterresultwater //查询已挂载
  afterresultwater(params) {
    return axios.get('/archive/association/afterresultwater', {
      params: params
    })
  },
  // GET /archive/association/querywaterchildnode //查询待挂载
  querywaterchildnode(params) {
    return axios.get('/archive/association/querywaterchildnode', {
      params: params
    })
  },
  // POST /archive/association/mountlinewater 挂载水表
  mountlinewater(data) {
    return axios.post('/archive/association/mountlinewater', data)
  },
  // POST /archive/association/unmountlinewater 卸载水表
  unmountlinewater(data) {
    return axios.post('/archive/association/unmountlinewater', data)
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
