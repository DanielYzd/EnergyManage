/**
 * 区域接口列表
 */

import axios from '@/utils/http' // 导入http中创建的axios实例
import { adornParams } from './adddefault'
const region = {
  // 获取数据字典树
  getDataList(params) {
    params = adornParams(params)
    return axios.get('/pob/region/list', { params: params })
  }
}
export default region
