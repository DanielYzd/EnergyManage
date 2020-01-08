/**
 * 分级用能 用能概览
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
const classificationenergy = {
  // GET /classificationEnergy/summary/proportion
  proportion(params) {
    return axios.get('/classificationEnergy/summary/proportion', {
      params: params
    })
  },
  //   GET /classificationEnergy/summary/time
  summarytime(params) {
    return axios.get('/classificationEnergy/summary/time', {
      params: params
    })
  },
  //   GET /classificationEnergy/summary/use
  summaryuse(params) {
    return axios.get('/classificationEnergy/summary/use', {
      params: params
    })
  },
  //   GET /classificationEnergy/summary/categorytime
  categorytime(params) {
    return axios.get('/classificationEnergy/summary/categorytime', {
      params: params
    })
  }
}
export default classificationenergy
