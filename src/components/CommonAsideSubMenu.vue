<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    popper-append-to-body
  >
    <template slot="title">
      <icon-svg
        :name="menu.icon || ''"
      ></icon-svg>
      <span>{{ menu.name }}</span>
    </template>
    <template v-for="item in menu.list">
      <sub-menu
        :key="item.menuId"
        :menu="item"
        :dynamicMenuRoutes="dynamicMenuRoutes"
      >
      </sub-menu>
    </template>
  </el-submenu>
  <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
    <icon-svg
      :name="menu.icon || ''"
    ></icon-svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'SubMenu',
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  methods: {
       // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      var route = this.dynamicMenuRoutes.filter(
        item => item.meta.menuId === menu.menuId
      )
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
