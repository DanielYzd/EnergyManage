<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  created () {
    let val = sessionStorage.getItem('theme')
    if (val) {
      this.$store.commit('common/SET_THEMEINFO', val)
      this.setEle(val)
    } else {
      this.setEle(this.$store.state.common.nowThemeInfo)
    }
  },
  methods: {
    setEle (theme) {
      let themeLink = document.querySelector('link[name="theme"]')
      let url = ''
      switch (theme) {
        // ../../static/element-ui-theme/heyeqing/index.css
        case 'heyeqing':
          url = './static/element-ui-theme/heyeqing/index.css'
          break
        case ('gaoyahei'):
          url = './static/element-ui-theme/gaoyahei/index.css'
          break
        case ('mocuilv'):
          url = './static/element-ui-theme/mocuilv/index.css'
          break
        case ('shuilvlan'):
          url = './static/element-ui-theme/shuilvlan/index.css'
          break
        case ('tiankonglan'):
          url = './static/element-ui-theme/tiankonglan/index.css'
          break
        case ('zangqinglan'):
          url = './static/element-ui-theme/zangqinglan/index.css'
          break
      }
      // let url = `../src/element-ui-theme/heyeqing/index.css`
      themeLink.setAttribute('href', url)
    }
  }
}
</script>
<style lang="scss" scoped>
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
