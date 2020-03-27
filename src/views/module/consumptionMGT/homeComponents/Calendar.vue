<template>
  <div class="calendar">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>能耗日历</span>
        <span style="font-size:16px;color:#f79120;float:right;">{{
          this.$moment().format('YYYY-MM-DD')
        }}</span>
        <!-- <el-dropdown @command="handleCommand" style="float:right">
          <icon-svg
            name="menu"
            style="font-size:16px;cursor:pointer"
          ></icon-svg>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">水</el-dropdown-item>
            <el-dropdown-item command="b">电</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
      <el-row :gutter="40" style="height:270px;">
        <el-col :span="12" class="second">
          <div class="secondname">
            <div class="secondname1">水日用量(m3)</div>
            <div class="secondname2">{{ day1 }}</div>
          </div>
          <div class="secondname">
            <div class="secondname1">水月用量(m3)</div>
            <div class="secondname2">{{ month1 }}</div>
          </div>
        </el-col>
        <el-col :span="12" class="second">
          <div class="secondname">
            <div class="secondname1">电日用量(kWh)</div>
            <div class="secondname2">{{ day2 }}</div>
          </div>
          <div class="secondname">
            <div class="secondname1">电月用量(kWh)</div>
            <div class="secondname2">{{ month2 }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    let body = {
      day: this.$moment().format('YYYYMMDD')
    }
    this.$api.energyhome.day(body).then(res => {
      console.log(res)
      if (res.code === 0) {
        res.data.forEach(item => {
          //88 电 89水 2日 3 月
          if (item.typecode === '88') {
            console.log(item)
            if (item.schemeid === 2) {
              this.day2 = item.consumption ? item.consumption : 0
            } else {
              this.month2 = item.consumption ? item.consumption : 0
            }
          } else {
            if (item.schemeid === 2) {
              this.day1 = item.consumption ? item.consumption : 0
            } else {
              this.month1 = item.consumption ? item.consumption : 0
            }
          }
        })
      }
    })
  },
  data() {
    return {
      day1: 0,
      day2: 0,
      month1: 0,
      month2: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar {
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
