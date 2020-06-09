/*
 * @Description:
 * @Author: Sun
 * @Date: 2019-10-05 11:20:16
 * @LastEditTime: 2019-10-05 11:20:16
 * @LastEditors: Sun
 * @Output a custom information
 */
/**
 * 开发环境
 */
(function() {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] =
    'http://39.100.106.72:8080/multi-meter-fast-api'
  // 'http://127.0.0.1:8080/multi-meter-fast-api'
  // 'http://120.77.200.215:8888/multi-meter-fast-api'
  // 'http://192.168.0.100:8080/multi-meter-fast-api'
  // window.SITE_CONFIG['baseUrl'] = 'http://127.0.0.1:8080/multi-meter-fast-api'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] =
    window.SITE_CONFIG.domain + window.SITE_CONFIG.version
  // XXXXX手动推送地址
  window.SITE_CONFIG['zjnUploadUrl'] =
    'http://localhost:16666/multi-meter-fast-api'
})()
