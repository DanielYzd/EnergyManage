/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
  return (
    JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !==
      -1 || false
  )
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
export function stringFormat() {
  if (arguments.length === 0) return null
  var str = arguments[0]
  for (var i = 1; i < arguments.length; i++) {
    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
    str = str.replace(re, arguments[i])
  }
  return str
}
export function showSuccessMsgBox(context, callback, message = '操作成功') {
  context.$message({
    message: message,
    type: 'success',
    duration: 1500,
    onClose: () => {
      if (context.callback) context.callback()
    }
  })
}
export function showFailMsgBox(msg) {
  context.$message.error(msg)
}
export function randomName() {
  var familyNames = new Array(
    '赵',
    '钱',
    '孙',
    '李',
    '周',
    '吴',
    '郑',
    '王',
    '冯',
    '陈',
    '褚',
    '卫',
    '蒋',
    '沈',
    '韩',
    '杨',
    '朱',
    '秦',
    '尤',
    '许',
    '何',
    '吕',
    '施',
    '张',
    '孔',
    '曹',
    '严',
    '华',
    '金',
    '魏',
    '陶',
    '姜',
    '戚',
    '谢',
    '邹',
    '喻',
    '柏',
    '水',
    '窦',
    '章',
    '云',
    '苏',
    '潘',
    '葛',
    '奚',
    '范',
    '彭',
    '郎',
    '鲁',
    '韦',
    '昌',
    '马',
    '苗',
    '凤',
    '花',
    '方',
    '俞',
    '任',
    '袁',
    '柳',
    '酆',
    '鲍',
    '史',
    '唐',
    '费',
    '廉',
    '岑',
    '薛',
    '雷',
    '贺',
    '倪',
    '汤',
    '滕',
    '殷',
    '罗',
    '毕',
    '郝',
    '邬',
    '安',
    '常',
    '乐',
    '于',
    '时',
    '傅',
    '皮',
    '卞',
    '齐',
    '康',
    '伍',
    '余',
    '元',
    '卜',
    '顾',
    '孟',
    '平',
    '黄',
    '和',
    '穆',
    '萧',
    '尹'
  )
  var givenNames = new Array(
    '子璇',
    '淼',
    '国栋',
    '夫子',
    '瑞堂',
    '甜',
    '敏',
    '尚',
    '国贤',
    '贺祥',
    '晨涛',
    '昊轩',
    '易轩',
    '益辰',
    '益帆',
    '益冉',
    '瑾春',
    '瑾昆',
    '春齐',
    '杨',
    '文昊',
    '东东',
    '雄霖',
    '浩晨',
    '熙涵',
    '溶溶',
    '冰枫',
    '欣欣',
    '宜豪',
    '欣慧',
    '建政',
    '美欣',
    '淑慧',
    '文轩',
    '文杰',
    '欣源',
    '忠林',
    '榕润',
    '欣汝',
    '慧嘉',
    '新建',
    '建林',
    '亦菲',
    '林',
    '冰洁',
    '佳欣',
    '涵涵',
    '禹辰',
    '淳美',
    '泽惠',
    '伟洋',
    '涵越',
    '润丽',
    '翔',
    '淑华',
    '晶莹',
    '凌晶',
    '苒溪',
    '雨涵',
    '嘉怡',
    '佳毅',
    '子辰',
    '佳琪',
    '紫轩',
    '瑞辰',
    '昕蕊',
    '萌',
    '明远',
    '欣宜',
    '泽远',
    '欣怡',
    '佳怡',
    '佳惠',
    '晨茜',
    '晨璐',
    '运昊',
    '汝鑫',
    '淑君',
    '晶滢',
    '润莎',
    '榕汕',
    '佳钰',
    '佳玉',
    '晓庆',
    '一鸣',
    '语晨',
    '添池',
    '添昊',
    '雨泽',
    '雅晗',
    '雅涵',
    '清妍',
    '诗悦',
    '嘉乐',
    '晨涵',
    '天赫',
    '玥傲',
    '佳昊',
    '天昊',
    '萌萌',
    '若萌'
  )
  var i = parseInt((familyNames.length + 1) * Math.random())
  var familyName = familyNames[i]
  var j = parseInt((givenNames.length + 1) * Math.random())
  var givenName = givenNames[j]
  return familyName + givenName
}

export function getMoble() {
  var prefixArray = new Array(
    '130',
    '131',
    '132',
    '133',
    '135',
    '137',
    '138',
    '170',
    '187',
    '189'
  )
  var i = parseInt(10 * Math.random())
  var prefix = prefixArray[i]
  for (var j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(Math.random() * 10)
  }
  return prefix
}
export function getRtuAddress() {
  var charArray = '0123456789'.split('')
  var tmp = ''
  for (var i = 0; i < 8; i++) {
    var j = parseInt(charArray.length * Math.random())
    tmp += charArray[j]
  }
  return tmp
}
export function formatDate(date, fmt) {
  if (!fmt) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
export function getRunContext() {
  var runContextUrl = window.SITE_CONFIG['baseUrl']
  return ['杭州杰特瑞科技有限责任公司']
}
