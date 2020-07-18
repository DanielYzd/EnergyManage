<template>
  <div :class="themeClass">
    <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
      <div class="site-sidebar__inner">
        <el-menu
          :default-active="menuActiveName || 'home'"
          :collapse="sidebarFold"
          unique-opened
          text-color="#fff"
          active-text-color="#ffd04b"
          :background-color="background"
          :collapse-transition="false"
        >
          <el-menu-item index="home" @click="$router.push({ name: 'home' })">
            <icon-svg name="home" class="site-sidebar__menu-icon"></icon-svg>
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
    </aside>
  </div>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { isURL } from '@/utils/validate'
export default {
  data() {
    return {
      dynamicMenuRoutes: []
    }
  },
  components: {
    SubMenu
  },

  computed: {
    background() {
      console.log(this.themeClass)
      let arr = [
        { name: 'tiankonglan', color: '#1468a2' },
        { name: 'heyeqing', color: '#1fa5af' },
        { name: 'mocuilv', color: '#0f8171' },
        { name: 'gaoyahei', color: '#0b121d' },
        { name: 'zangqinglan', color: '#152b39' },
        { name: 'shuilvlan', color: '#01748d' }
      ]
      let temp = arr.find(item => {
        return item.name === this.themeClass
      })
      console.log(temp)
      return temp.color
      // if (this.themeClass === 'tiankonglan') {
      //   return '#1679bd'
      // } else {
      //   return '#333'
      // }
    },
    themeClass: {
      get() {
        return this.$store.state.common.nowThemeInfo
      }
    },
    sidebarLayoutSkin: {
      get() {
        return this.$store.state.common.sidebarLayoutSkin
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold
      }
    },
    menuList: {
      get() {
        return this.$store.state.common.menuList
      },
      set(val) {
        this.$store.commit('common/updateMenuList', val)
      }
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName
      },
      set(val) {
        this.$store.commit('common/updateMenuActiveName', val)
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName
      },
      set(val) {
        this.$store.commit('common/updateMainTabsActiveName', val)
      }
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem('dynamicMenuRoutes') || '[]'
    )
    this.routeHandle(this.$route)
  },
  methods: {
    // 路由操作
    routeHandle(route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        var tab = this.mainTabs.filter(item => item.name === route.name)[0]
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(
              item => item.name === route.name
            )[0]
            if (!route) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || ''
          }
          this.mainTabs = this.mainTabs.concat(tab)
        }
        this.menuActiveName = tab.menuId + ''
        this.mainTabsActiveName = tab.name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/themeMixin.scss';
.el-menu {
  padding-top: 25px;
  position: relative;
  border-right: none;
  // background: #f2f2f2;
  // border: 1px solid white;
  -webkit-transition: all 0.25s ease-in-out;
  -o-transition: all 0.25s ease-in-out;
  -moz-transition: all 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;
  .el-menu-item {
    @include themify($themes) {
      border-bottom: 4px solid mix(rgb(8, 8, 8), themed('base-color'), 35%);
    }
  }

  .el-submenu {
    @include themify($themes) {
      border-bottom: 4px solid mix(rgb(8, 8, 8), themed('base-color'), 35%);
    }
    /deep/.el-submenu__title {
      i {
        color: #fff !important;
        font-size: 15px;
      }
    }
  }
}
.el-menu:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-width: 0 25px 25px 0;
  border-style: solid;
  border-color: white white #cccccc #cccccc;
  background: #cccccc;
  display: block;
  width: 0;
  -webkit-transition: all 1.25s ease-in-out;
  -o-transition: all 0.25s ease-in-out;
  -moz-transition: all 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;
  -webkit-box-shadow: -2px 2px 3px -1px #b3b3b3;
  -moz-box-shadow: -2px 2px 3px -1px #b3b3b3;
  -o-box-shadow: -2px 2px 3px -1px #b3b3b3;
  box-shadow: -2px 2px 3px -1px #b3b3b3;
}
.el-menu:hover::before {
  border-width: 0;
}
</style>
