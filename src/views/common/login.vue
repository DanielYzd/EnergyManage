<template>
  <div
    class="loginContainer"
    v-lazy:background-image="img"
    v-loading="homeLoading"
    element-loading-text="页面加载中,请耐心等候"
    element-loading-spinner="el-icon-loading"
  >
    <particles-js />
    <el-card shadow="always">
      <div slot="header" class="head">
        <span>建筑能耗监测管理平台</span>
      </div>
      <el-form
        :model="dataForm"
        ref="dataForm"
        :rules="dataRule"
        label-weidth="80px"
        @keyup.enter.native="dataFormSubmit()"
        status-icon
        class="pageLogin"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="dataForm.userName"
            clearable
            placeholder="请输入用户名"
          >
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            clearable
            placeholder="请输入密码"
          >
            <el-button slot="prepend" icon="el-icon-key"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-input
                v-model="dataForm.captcha"
                clearable
                placeholder="验证码"
              ></el-input>
            </el-col>
            <el-col :span="15" class="login-captcha">
              <img :src="captchaPath" @click="getCaptcha()" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin-left:100px;margin-top:30px;"
            type="primary"
            icon="el-icon-user-solid"
            @click="dataFormSubmit()"
            :loading="loading"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item></el-form
      >
    </el-card>

    <el-footer>
      <div class="copyFooter">
        Copyright@2018-2019 杭州杰特瑞科技有限责任公司
      </div></el-footer
    >
  </div>
</template>

<script>
import { getUUID } from '@/utils'
// let img = () => import('@/assets/img/login-background.jpg')
import ParticlesJs from './ParticlesJS'
let src = require('@/assets/img/login-background.jpg')
export default {
  components: {
    ParticlesJs
  },
  data() {
    return {
      homeLoading: true,
      loading: false,
      img: src,
      captchaPath: '',
      dataForm: {
        userName: '',
        password: '',
        captcha: ''
      },
      dataRule: {
        userName: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.homeLoading = false
    let params = this.$route.params
    console.log(params)
    if (params.token) {
      this.$cookie.set('regionid', '')
      this.$cookie.set('regionName', '')
      this.$cookie.set('token', params.token)
      this.$cookie.set('accountRegionId', params.accountRegionId)
      this.$sysConfig.loadConfig()
      this.$router.push({ name: 'home' })
    }
    this.getCaptcha()
  },
  methods: {
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/sys/login'),
            method: 'post',
            data: this.$http.adornData({
              username: this.dataForm.userName,
              password: this.dataForm.password,
              uuid: this.dataForm.uuid,
              captcha: this.dataForm.captcha
            })
          })
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.$sysConfig.loadConfig()
                this.$cookie.set('token', data.token)
                this.$cookie.set('regionid', data.regionid)
                this.$cookie.set(
                  'regionName',
                  data.regionName ? data.regionName : ''
                )
                this.$cookie.set('accountRegionId', data.regionid)
                this.$router.replace({ name: 'home' })

                setTimeout(() => {
                  this.loading = false
                }, 1000)
              } else {
                setTimeout(() => {
                  this.loading = false
                }, 1000)
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              setTimeout(() => {
                this.loading = false
              }, 3000)
            })
        }
      })
    },
    getCaptcha() {
      this.dataForm.uuid = getUUID()
      this.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.loginContainer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  min-width: 960px;
  // background-image: url('~@/assets/img/login-background.jpg');
  // z-index:-10;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  .el-card {
    width: 400px;
    height: 400px;
    position: absolute;
    right: 20%;
    top: 20%;
    border: none;
    background-color: rgba(16, 33, 59, 0.5);
    color: rgb(185, 211, 221);

    .el-card__header {
      border-bottom: none;
    }
    .head {
      // color: rgb(182, 243, 39);
      font-size: 32px;
      font-weight: bold;
      text-align: center;
    }
    .pageLogin {
      padding: 10px;
      .login-captcha {
      }
    }
  }
  .copyFooter {
    position: absolute;
    color: rgb(197, 203, 235);
    bottom: 5%;
    right: 10%;
  }
}
</style>
