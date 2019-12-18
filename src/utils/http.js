import axios from 'axios'
import router from '@/router'
// element的message提示框组件，大家可根据自己的ui组件更改。
import { Message } from 'element-ui'
import Vue from 'vue'

// 环境切换
console.log(process.env.NODE_ENV)
console.log(process.env)
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://39.100.106.72:8080/multi-meter-fast-api'
} else if (process.env.NODE_ENV === 'test') {
  axios.defaults.baseURL = 'http://39.100.106.72:8080/multi-meter-fast-api'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://39.100.106.72:8080/multi-meter-fast-api'
}
console.log(axios.defaults.baseURL)

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const message = msg => {
  Message({
    message: msg,
    duration: 2000,
    type: 'error'
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      message('token失效，请重新登录')
      Vue.cookie.delete('token')
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      message('登录过期，请重新登录')
      Vue.cookie.delete('token')
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      message('请求的资源不存在')
      break
    default:
      message(other)
  }
}

// 创建axios实例
let instance = axios.create({
  timeout: 1000 * 12,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 设置post请求头
// instance.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded'
instance.defaults.headers.post['Content-Type'] = 'application/json'

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    console.log('请求拦截')
    console.log(config)
    const token = Vue.cookie.get('token')
    token ? (config.headers['token'] = token) : (config.headers['token'] = null)
    console.log(config)
    return config
  },
  error => Promise.error(error)
)
// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    console.log('响应成功拦截')
    console.log(res)
    // res.data.code === 200 ? Promise.resolve(res) : Promise.reject(res)
    if (res.data && res.data.code === 0) {
      // code=0 响应正确  很蠢
      return Promise.resolve(res.data)
    } else {
      errorHandle(res.data.code, res.data.msg) // 如果不是0 不返回到login.vue 直接错误提示
      return Promise.reject(res.data)
      // return Promise.resolve(res.data)
    }
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      errorHandle(response.status, response.data)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // if (!window.navigator.onLine) {
      //   // store.commit('changeNetwork', false)
      // } else {
      //   return Promise.reject(error)
      // }
    }
  }
)

export default instance
