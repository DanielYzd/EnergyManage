import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { Notification } from 'element-ui'

const http = axios.create({
  timeout: 1000 * 50,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(
  config => {
    config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截
 */
http.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 401) {
      // 401, token失效
      Vue.cookie.delete('token')
      Notification.error({
        title: '系统提示',
        message: '登录状态已过期或者其他地方登录，请重新登录',
        duration: 2500
      })
      // MessageBox.confirm(
      //   '登录状态已过期或者其他地方登录，请重新登录',
      //   '系统提示',
      //   {
      //     confirmButtonText: '重新登录',
      //     showCancelButton: true,
      //     type: 'warning'
      //   }
      // ).then(() => {
      //   router.push({ name: 'login' }, () => {
      //     location.reload() // 刷新页面, 清空整站临时存储数据
      //   })
      // })
      router.push({ name: 'login' }, () => {
        location.reload() // 刷新页面, 清空整站临时存储数据
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = actionName => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (
    (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY
      ? '/proxyApi/'
      : window.SITE_CONFIG.baseUrl) + actionName
  )
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    t: new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    t: new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
/**
 * 发送get请求
 *
 */
http.ajaxGet = (url, params, successFun, errorFun) => {
  http({
    url: http.adornUrl(url),
    method: 'get',
    params: http.adornParams(params)
  }).then(res => {
    if (res.data.code === 0 && successFun != null) {
      successFun(res.data)
    } else {
      if (errorFun != null) {
        errorFun(res.data)
      }
    }
  })
  // .catch(() => {
  //   console.log("err")
  // })
}
/**
 * 发送post请求
 *
 */
http.ajaxPost = (url, params, successFun, errorFun) => {
  http({
    url: http.adornUrl(url),
    method: 'post',
    data: http.adornData(params, false)
  }).then(({ data }) => {
    if (data.code === 0 && successFun) {
      successFun(data)
    } else {
      if (errorFun) {
        errorFun(data.msg)
      }
    }
  })
  // .catch((error) => {
  //   console.log(error)
  //   if (errorFun) {
  //     errorFun(error)
  //   }
  // })
}
export default http
