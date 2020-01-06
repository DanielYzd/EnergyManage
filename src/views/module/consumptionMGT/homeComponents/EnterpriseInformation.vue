<template>
  <div class="info">
    <el-card shadow="hover">
      <div slot="header">
        <h2>企业信息</h2>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="content">
            <el-row style="width:100%">
              <el-col :span="12">
                <icon-svg name="zhubiantaishu" class="zhubian"></icon-svg>
              </el-col>
              <el-col :span="12" class="title">
                <div class="title1">{{ transformNum }}</div>
                <div class="title2">主变台数(台)</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content">
            <el-row style="width:100%">
              <el-col :span="12">
                <icon-svg name="zhuangjirongliang" class="zhubian"></icon-svg>
              </el-col>
              <el-col :span="12" class="title">
                <div class="title1">{{ capacity }}</div>
                <div class="title2">装机容量(kVA)</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:20px;">
        <el-col :span="12">
          <div class="content">
            <el-row style="width:100%">
              <el-col :span="12">
                <icon-svg name="wangguanshuliang" class="zhubian"></icon-svg>
              </el-col>
              <el-col :span="12" class="title">
                <div class="title1">{{ gatewayNum }}</div>
                <div class="title2">网关数量(个)</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content">
            <el-row style="width:100%">
              <el-col :span="12">
                <icon-svg name="jiliangdianshu" class="zhubian"></icon-svg>
              </el-col>
              <el-col :span="12" class="title">
                <div class="title1">{{ meterNum }}</div>
                <div class="title2">计量点数(个)</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transformNum: 0,
      capacity: 0,
      gatewayNum: 0,
      meterNum: 0
    }
  },
  created() {
    this.$api.energyhome.enterpriseinfo().then(res => {
      console.log(res)
      if (res.code === 0) {
        this.transformNum = res.data.transformNum
        this.capacity = res.data.capacity
        this.gatewayNum = res.data.gatewayNum
        this.meterNum = res.data.meterNum
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.info {
  .el-card {
    /deep/.el-card__header {
      padding: 10px 20px !important;
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }
    }
    .content {
      width: 100%;
      height: 125px;
      background-color: #f0f6f9;
      display: flex;
      padding: 0 10px;
      // justify-content: center;
      align-items: center;
      /deep/.zhubian {
        // background-color: #24a5e8;
        font-size: 70px;
      }

      .title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 15px;
        .title1 {
          font-size: 20px;
        }
        .title2 {
          font-size: 12px;
        }
      }
    }
    .second {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .secondname {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .secondname1 {
          font-size: 14px;
        }
        .secondname2 {
          margin-top: 10px;
          color: #f79120;
          font-size: 30px;
        }
      }
    }
  }
}
</style>
