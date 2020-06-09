/*
 * @FileName:
 * @Description:
 * @Author:
 * @Company: Hangzhou jetreal company
 * @Date: 2019-10-05 11:20:15
 * @LastEditTime: 2019-10-05 11:20:15
 * @LastEditors:
 * @Output a custom information
 */
import Vue from 'vue'
import App from '@/App'
import router from '@/router' // api: https://github.com/vuejs/vue-router
import store from '@/store' // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie' // api: https://github.com/alfhen/vue-cookie
import '@/element-ui' // api: https://github.com/ElemeFE/element
import '@/icons' // api: http://www.iconfont.cn/
import '@/assets/scss/reset.scss' // 在element样式之前引入
// import 'element-ui/lib/theme-chalk/index.css'
// import '@/element-ui-theme/index.js'
import VueLazyLoad from 'vue-lazyload'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import sysConfig from '@/utils/sysConfig'
import moment from 'moment' //导入文件
import {
    isAuth,
    formatDate,
    randomName,
    getMoble,
    getRtuAddress,
    showSuccessMsgBox,
    stringFormat
} from '@/utils'
import utils from '@/utils/utils'
import api from './utils/api' // 导入api接口
Vue.prototype.$api = api
Vue.prototype.$moment = moment //赋值使用
moment.locale('zh-cn') //需要汉化
Vue.use(VueLazyLoad)
Vue.use(VueCookie)
Vue.config.productionTip = false

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
    require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.$sysConfig = sysConfig
Vue.prototype.$utils = utils
Vue.prototype.isAuth = isAuth // 权限方法
Vue.prototype.stringFormat = stringFormat
Vue.prototype.formatDate = formatDate
Vue.prototype.randomName = randomName
Vue.prototype.getMoble = getMoble
Vue.prototype.getRtuAddress = getRtuAddress
Vue.prototype.showSuccessMsgBox = showSuccessMsgBox
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})