/*
 * @Author: Sun
 * @Date: 2019-10-05 11:20:15
 * @LastEditTime: 2019-10-05 11:20:15
 * @LastEditors: Sun
 * @Description:
 * @输出一段不带属性的自定义信息
 */
/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { Notification, MessageBox } from 'element-ui'

Vue.use(Router)

const _import = require('./import-development.js')

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  {
    path: '/404',
    component: _import('common/404'),
    // component: () => import('@/views/common/404'),
    name: '404',
    meta: { title: '404未找到' }
  },
  {
    path: '/login',
    component: _import('common/login'),
    // component: () => import('@/views/common/login'),
    name: 'login',
    meta: { title: '登录' }
  },
  {
    path: '/sso',
    component: _import('common/sso'),
    // component: () => import('@/views/common/sso'),
    name: 'sso',
    meta: { title: '单点登录' }
  }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  // component: () => import('@/views/main'),
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    {
      path: '/home',
      // component: () => import('@/views/common/home'),
      component: _import('module/consumptionMGT/home'),
      name: 'home',
      meta: { title: '首页', keepAlive: true }
    },
    {
      path: '/theme',
      // component: () => import('@/views/common/theme'),
      component: _import('common/theme'),
      name: 'theme',
      meta: { title: '主题' }
    }
  ],
  beforeEnter(to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  base: '/',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (
    router.options.isAddDynamicMenuRoutes ||
    fnCurrentRouteType(to) === 'global'
  ) {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem(
          'menuList',
          JSON.stringify(data.menuList || '[]')
        )
        sessionStorage.setItem(
          'permissions',
          JSON.stringify(data.permissions || '[]')
        )
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    })
  }
})
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
// router.onError(err => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = err.message.match(pattern)
//   if (isChunkLoadFailed) {
//     let chunkBool = sessionStorage.getItem('chunkError')
//     let nowTimes = Date.now()
//     if (
//       chunkBool === null ||
//       (chunkBool && nowTimes - parseInt(chunkBool) > 60000)
//     ) {
//       //路由跳转报错,href手动跳转
//       sessionStorage.setItem('chunkError', 'reload')
//       const targetPath = router.history.pending.fullPath
//       window.location.href = window.location.origin + targetPath
//     } else if (chunkBool === 'reload') {
//       //手动跳转后依然报错,强制刷新
//       sessionStorage.setItem('chunkError', Date.now())
//       window.location.reload(true)
//     }
//   }
// })
/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (
      globalRoutes[i].children &&
      globalRoutes[i].children.length >= 1
    ) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (/\S/.test(menuList[i].url)) {
      var mUrl = menuList[i].url
      if (!mUrl) {
        mUrl = '/'
      }
      menuList[i].url = mUrl.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`module/${menuList[i].url}`) || null
        } catch (e) {
          console.log(e)
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    addPageHyperlink(routes)
    mainRoutes.children = routes
    router.addRoutes([mainRoutes, { path: '*', redirect: { name: '404' } }])
    sessionStorage.setItem(
      'dynamicMenuRoutes',
      JSON.stringify(mainRoutes.children || '[]')
    )
    console.log(
      '\n%c!<-------------------- 动态(菜单)路由 s -------------------->',
      'color:blue'
    )
    console.log(mainRoutes.children)
    console.log(
      '%c!<-------------------- 动态(菜单)路由 e -------------------->\n\n',
      'color:blue'
    )
  }
}
function addPageHyperlink(routes) {
  routes.push(
    {
      path: '/ppf-customermoney',
      // component: () => import('@/views/modules/ppf/customermoney'),
      component: _import('modules/ppf/customermoney'),
      name: 'customermoney',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '用户费用明细'
      }
    },
    {
      path: '/data-pointEnergy',
      // component: () => import('@/views/modules/data/pointEnergy'),
      component: _import('modules/data/pointEnergy'),
      name: 'pointEnergy',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '表计用量曲线'
      }
    },
    {
      path: '/data-pointLoad',
      // component: () => import('@/views/modules/data/pointLoad'),
      component: _import('modules/data/pointLoad'),
      name: 'pointLoad',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '负荷曲线'
      }
    },
    {
      path: '/input-bm',
      // component: () => import('@/views/modules/runmain/input-bm'),
      component: _import('modules/runmain/input-bm'),
      name: 'inputBm',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '录入读数'
      }
    },
    {
      path: '/calcFormula-add',
      // component: () => import('@/views/modules/pob/calcFormula-add-or-update'),
      component: _import('modules/pob/calcFormula-add-or-update'),
      name: 'calcFormulaAdd',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '编辑计算公式'
      }
    },
    {
      path: '/shareDetail-list',
      // component: () => import('@/views/modules/report/shareDetail'),
      component: _import('modules/report/shareDetail'),
      name: 'shareDetail',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '分摊明细'
      }
    },
    {
      path: '/help',
      // component: () => import('@/views/common/help'),
      component: _import('common/help'),
      name: 'help',
      meta: {
        isDynamic: true,
        isTab: true,
        title: '帮助说明'
      }
    }
    // 	,{ path: '/data-pointBm',
    // 	  	component: _import('modules/data/pointBm'),
    // 	  	name: 'pointLoad',
    // 	  	meta: {
    // 	  		isDynamic: true,
    //      	isTab: true,
    // 	  		title: '表计读数明细'
    // 	  	}
    // 	}
  )
}
export default router
