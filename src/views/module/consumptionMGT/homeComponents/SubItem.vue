<template>
  <div class="subitem">
    <el-card shadow="hover" class="bodypad">
      <div slot="header" class="clearfix">
        <span>能耗分项</span>
        <!-- <el-dropdown style="float:right">
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
      <div class="piecontent">
        <div class="symbol">单位(千瓦时)</div>
        <div class="echart">
          <Echart :isAxisChart="false" :chartData="chartData"></Echart>
        </div>
        <el-tabs type="border-card" v-model="activeName" class="tabs" stretch>
          <el-tab-pane label="昨日" name="first"></el-tab-pane>
          <el-tab-pane label="本月" name="second"></el-tab-pane>
          <el-tab-pane label="本年" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import Echart from '@/components/Echart.vue'
import time from '@/utils/time.js'
export default {
  components: {
    Echart
  },
  data() {
    return {
      activeName: 'first',
      chartData: {
        legend: {
          //图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
          show: true,
          orient: 'vertical',
          left: 'right',
          textStyle: {
            color: '#333'
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            data: [
              { value: 335, name: '空调' },
              { value: 310, name: '电梯' },
              { value: 234, name: '水表' },
              { value: 135, name: '照明' },
              { value: 1548, name: '弱电机房' }
            ],
            //饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
            label: {
              position: 'inside',
              formatter: '{d}%'
            },
            center: ['45%', '45%']
          }
        ]
      }
    }
  },
  watch: {
    activeName(newValue, oldValue) {
      // this.activeName = newValue
      this.handle()
    }
  },
  created() {
    this.handle()
  },
  methods: {
    handle() {
      switch (this.activeName) {
        case 'first': {
          // let beginDate = time.yesterday
          // let endDate = time.yesterday
          let beginDate = '20200104'
          let endDate = '20200104'
          this.purpose(beginDate, endDate)
          break
        }
        case 'second': {
          let beginDate = time.monthfirst
          let endDate = time.monthlast
          this.purpose(beginDate, endDate)
          break
        }
        case 'third': {
          let beginDate = time.yearfirst
          let endDate = time.yearlast
          this.purpose(beginDate, endDate)
          break
        }
      }
    },
    purpose(beginDate, endDate) {
      let body = {
        beginDate,
        endDate
      }
      this.$api.energyhome.purpose(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.chartData.series[0].data = res.data.map(item => {
            return { value: item.zdlp, name: item.itemname }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.subitem {
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
  .bodypad {
    /deep/.el-card__body {
      padding: 0 !important;
      .piecontent {
        height: 310px;
        display: flex;
        flex-direction: column;
      }
      .symbol {
        font-size: 12px;
        margin: 10px 0 10px 10px;
        color: rgb(78, 77, 77);
      }
      .echart {
        flex: 1;
      }
      .tabs {
        height: 30px;
        .el-tabs__content {
          padding: 0;
        }
      }
    }
  }
}
</style>
