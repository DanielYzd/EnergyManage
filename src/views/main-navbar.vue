<template>
  <!-- <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType"> -->
  <div :class="themeClass">
    <nav class="site-navbar">
      <div class="site-navbar__header">
        <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
          <a class="site-navbar__brand-lg" href="javascript:;">
            <icon-svg name="run"></icon-svg>&nbsp;建筑能耗管理平台
          </a>
          <a class="site-navbar__brand-mini" href="javascript:;">
            <icon-svg name="run"></icon-svg>
          </a>
        </h1>
      </div>
      <div class="headcontent">
        <div class="lcontent">
          <!-- <el-button
            plain
            icon="el-icon-menu"
            size="mini"
            type="plain"
            @click="sidebarFold = !sidebarFold"
          ></el-button> -->
          <i v-if="!sidebarFold" class="el-icon-s-fold" style="color:#f4f3f7;font-size:30px;cursor:pointer;"
            @click="sidebarFold = !sidebarFold"></i>
          <i v-else-if="sidebarFold" class="el-icon-s-unfold" style="color:#f4f3f7;font-size:30px;cursor:pointer;"
            @click="sidebarFold = !sidebarFold"></i>
        </div>
        <div class="rcontent">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <!-- <img src="~@/assets/img/avatar5.png" class="user" /> -->
              <icon-svg name="admin" class="user" style="color:#fff;"></icon-svg>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="updateThemeHandle()">主题切换</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div style="color:#fff;margin-right:15px;">
            登录用户：{{ userName }}
          </div>
          <!-- <div class="help" @click="showHelp">
          
            <icon-svg name="help"></icon-svg>
            <span style="color:#fff;font-size:14px;">帮助</span>
          </div> -->
        </div>
      </div>
      <!-- <div class="site-navbar__body clearfix">
        <el-menu class="site-navbar__menu" mode="horizontal">
          <el-menu-item
            class="site-navbar__switch"
            index="0"
            @click="sidebarFold = !sidebarFold"
          >
            <icon-svg name="zhedie1"></icon-svg>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
        >
          <el-menu-item class="site-navbar__avatar" index="3">
            <el-dropdown :show-timeout="0" placement="bottom">
              <span class="el-dropdown-link">
                <img src="~@/assets/img/avatar5.png" :alt="userName" />{{
                  userName
                }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="updatePasswordHandle()"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item @click.native="updateThemeHandle()"
                  >主题切换</el-dropdown-item
                >
                <el-dropdown-item @click.native="logoutHandle()"
                  >退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
          <el-menu-item index="1" @click="showHelp">
            <i class="el-icon-question"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </div> -->
      <!-- 弹窗, 修改密码 -->
      <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
      <!-- 弹窗, 主题切换 -->
      <update-theme ref="updateTheme"></update-theme>
    </nav>
  </div>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import UpdateTheme from './main-navbar-update-theme.vue'
export default {
  data() {
    return {
      updatePassowrdVisible: false
    }
  },
  components: {
    UpdatePassword,
    UpdateTheme
  },
  computed: {
    // ...mapState({
    //   themeClass: state => state.common.nowThemeInfo
    // }),
    themeClass: {
      get() {
        return this.$store.state.common.nowThemeInfo
      }
    },
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold
      },
      set(val) {
        this.$store.commit('common/updateSidebarFold', val)
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
    userName: {
      get() {
        return this.$store.state.user.name
      }
    }
  },
  methods: {
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true
      console.log(this.$refs)
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    updateThemeHandle() {
      this.$nextTick(() => {
        this.$refs.updateTheme.init()
      })
    },
    // 退出
    logoutHandle() {
      this.$confirm('确定进行[退出]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$cookie.delete('token')
              this.$router.push({ name: 'login' }, () => {
                location.reload() // 刷新页面, 清空整站临时存储数据
              })
            }
          })
        })
        .catch(() => {})
    },
    showHelp() {
      this.$router.push({ name: 'help' })
    }
  }
}
</script>
<style lang="scss" scoped>
.headcontent {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
}

.lcontent {
  display: flex;
  align-items: center;
  .el-button {
    margin: 10px;
  }
}
.rcontent {
  display: flex;
  align-items: center;
  .user {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 20px;
  }
  .help {
    cursor: pointer;
    margin-right: 15px;
    font-size: 12px;
  }
}
</style>
