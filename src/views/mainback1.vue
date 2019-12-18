<template>
  <el-container
    style="height:100%;"
    v-loading.fullscreen.lock="loading"
    element-loading-text="页面加载中，请稍后"
  >
    <el-aside width="auto">
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <el-header>
        <common-header> </common-header>
      </el-header>
      <common-tab></common-tab>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonHeader from '@/components/CommonHeader'
import CommonAside from '@/components/CommonAside'
import CommonTab from '@/components/CommonTab'
export default {
  components: {
    CommonHeader,
    CommonAside,
    CommonTab
  },
  data() {
    return {
      loading: true
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    userId: {
      get() {
        return this.$store.state.user.id
      },
      set(val) {
        this.$store.commit('user/updateId', val)
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name
      },
      set(val) {
        this.$store.commit('user/updateName', val)
      }
    }
  },
  methods: {
    // 获取当前登录用户信息信息
    getUserInfo() {
      this.$sysConfig.loadConfig()
      this.$http({
        url: this.$http.adornUrl('/sys/user/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.loading = false
          this.userId = data.user.userId
          this.userName = data.user.username
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #333;
  .el-main {
    padding-top: 0;
  }
}
</style>
