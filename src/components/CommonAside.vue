<template>
  <div :class="themeClass">
    <el-menu
      :default-active="menuActiveName || 'home'"
      :collapse="sidebarFold"
      unique-opened
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="home" @click="$router.push({ name: 'home' })">
        <icon-svg name="shouye"></icon-svg>
        <span slot="title">首页</span>
      </el-menu-item>
      <sub-menu
        v-for="menu in menuList"
        :key="menu.menuId"
        :menu="menu"
        :dynamicMenuRoutes="dynamicMenuRoutes"
      >
      </sub-menu>
    </el-menu>
  </div>
</template>

<script>
import SubMenu from './CommonAsideSubMenu'
export default {
  components: {
    SubMenu
  },
  data () {
    return {
      dynamicMenuRoutes: []
    }
  },
  computed: {
    themeClass: {
      get () {
        return this.$store.state.common.nowThemeInfo
      }
    },
    menuActiveName: {
      get () {
        return this.$store.state.common.menuActiveName
      },
      set (val) {
        this.$store.commit('common/updateMenuActiveName', val)
      }
    },
    sidebarFold: {
      get () {
        return this.$store.state.common.sidebarFold
      }
    }
  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem('dynamicMenuRoutes') || '[]'
    )
    this.routeHandle(this.$route)
  }
}
</script>

<style lang="scss" scoped></style>
