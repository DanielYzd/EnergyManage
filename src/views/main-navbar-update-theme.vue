<template>
  <div>
    <el-dialog
      title="主题选择"
      class="theme"
      :visible.sync="visible"
      :append-to-body="true"
      v-loading="loading"
      element-loading-text="主题切换编译中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-select v-model="theme" @change="changeTheme">
        <el-option
          v-for="item in themeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div :style="{ background: item.color }">
            <span style="color:#fff;margin-left:45px;">{{ item.label }}</span>
          </div>
        </el-option>
      </el-select>
      <div
        :style="{
          height: '40px',
          width: '40px',
          background: beijing,
          marginLeft: '10px'
        }"
      ></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false" size="mini"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      visible: false,
      msg: 'Dynamic Themes',
      beijing: '',
      theme: '',
      themeArr: [
        {
          value: 'mocuilv',
          label: '墨翠绿',
          color: '#109684'
        },
        {
          value: 'heyeqing',
          label: '荷叶青',
          color: '#23c1cc'
        },
        {
          value: 'tiankonglan',
          label: '天空蓝',
          color: '#1679bd'
        },
        {
          value: 'gaoyahei',
          label: '高雅黑',
          color: '#0b1421'
        },
        {
          value: 'zangqinglan',
          label: '藏青蓝',
          color: '#173142'
        },
        {
          value: 'shuilvlan',
          label: '水绿蓝',
          color: '#0087a5'
        }
      ]
    }
  },
  created() {
    let val = sessionStorage.getItem('theme')
    if (val) {
      this.theme = val
      this.$store.commit('common/SET_THEMEINFO', val)
      // console.log(this.$store.state.common.nowThemeInfo)
    } else {
      this.theme = this.$store.state.common.nowThemeInfo
    }
    this.back(this.theme)
    // this.setEle(this.theme)
  },
  watch: {
    theme(newValue, oldValue) {
      console.log(oldValue)
      this.setEle(newValue)
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    changeTheme(val) {
      this.loading = true
      this.$store.commit('common/SET_THEMEINFO', val)
      this.theme = val
      this.back(this.theme)
      setTimeout(() => {
        this.loading = false
        // this.visible = false
      }, 1500)
    },
    back(theme) {
      let index = this.themeArr.findIndex(item => {
        return item.value === theme
      })
      this.beijing = this.themeArr[index].color
    },
    setEle(theme) {
      let themeLink = document.querySelector('link[name="theme"]')
      let url = ''
      switch (theme) {
        // ../../static/element-ui-theme/heyeqing/index.css
        case 'heyeqing':
          url = './static/element-ui-theme/heyeqing/index.css'
          break
        case 'gaoyahei':
          url = './static/element-ui-theme/gaoyahei/index.css'
          break
        case 'mocuilv':
          url = './static/element-ui-theme/mocuilv/index.css'
          break
        case 'shuilvlan':
          url = './static/element-ui-theme/shuilvlan/index.css'
          break
        case 'tiankonglan':
          url = './static/element-ui-theme/tiankonglan/index.css'
          break
        case 'zangqinglan':
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
.theme {
  /deep/.el-dialog__body {
    // padding: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
