<template>
  <div class="vertical">
    <el-card shadow="hover" style="height:100%">
      <div slot="header" class="clearfix">
        <span style="height:40px;line-height:40px;"
          >纵向能耗同比-{{ name }}
          <span style="height:40px;line-height:40px;font-size:12px;color:#999">
            (单位：{{ unit }})
          </span>
        </span>
        <el-dropdown @command="handleCommand" style="float:right">
          <!-- <icon-svg
            name="menu"
            style="font-size:16px;cursor:pointer;height:40px;line-height:40px;"
          ></icon-svg> -->
          <i
            class="el-icon-s-operation"
            style="font-size:16px;cursor:pointer;height:40px;line-height:40px;"
          ></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="89">水</el-dropdown-item>
            <el-dropdown-item command="88">电</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tabs
          style="float:right;height:20px;margin-right:20px;"
          v-model="dimension"
        >
          <el-tab-pane label="逐时" name="1"></el-tab-pane>
          <el-tab-pane label="逐日" name="2"></el-tab-pane>
          <el-tab-pane label="逐月" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <Echart
        class="echart"
        :isAxisChart="true"
        :chartData="chartData"
      ></Echart>
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
      name: '电力',
      unit: '千瓦时',
      dimension: '1',
      type: '88',
      chartData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          top: 20,
          left: 50,
          data: []
        },
        xData: [],
        series: [
          {
            name: '',
            type: 'line',
            data: []
          },
          {
            name: '',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  watch: {
    type(newValue, oldValue) {
      this.handle()
    },
    dimension(newValue, oldValue) {
      this.handle()
    }
  },
  created() {
    this.handle()
  },
  methods: {
    handle() {
      this.chartData.series[0].data = []
      this.chartData.series[1].data = []
      switch (this.dimension) {
        case '1': {
          this.chartData.legend.data = ['本日', '昨日']
          this.chartData.xData = time.hour
          // this.chartData.series[0].name = '本日'
          // this.chartData.series[1].name = '昨日'
          this.compare(time.hour)
          break
        }
        case '2': {
          this.chartData.legend.data = ['本月', '上月']
          this.chartData.xData = time.days
          // this.chartData.series[0].name = '本月'
          // this.chartData.series[1].name = '上月'
          this.compare(time.days)
          break
        }
        case '3': {
          this.chartData.legend.data = ['本年', '上年']
          this.chartData.xData = time.month
          // this.chartData.series[0].name = '本年'
          // this.chartData.series[1].name = '上年'
          this.compare(time.month)
          break
        }
      }
      this.chartData.series[0].name = this.chartData.legend.data[0]
      this.chartData.series[1].name = this.chartData.legend.data[1]
    },
    compare(times) {
      let body = {
        dimension: this.dimension,
        type: this.type
      }
      this.$api.energyhome.compare(body).then(res => {
        let nowArr = res.data.filter(item => item.label === '1') //本
        let lastArr = res.data.filter(item => item.label === '0') //上
        this.formatEchartData(nowArr, 0, times)
        this.formatEchartData(lastArr, 1, times)
      })
    },
    formatEchartData(arr, type, times) {
      let tmp = times.map(item => {
        return 0
      })
      arr.forEach(item => {
        if (this.dimension === '1') {
          let index = parseInt(item.x)
          tmp[index] = item.strY
        } else {
          let index = parseInt(item.x)
          tmp[index - 1] = item.strY
        }
      })
      this.chartData.series[type].data = tmp
    },
    handleCommand(command) {
      this.type = command
      if (this.type === '88') {
        this.name = '电力'
        this.unit = '千瓦时'
      } else {
        this.name = '水'
        this.unit = '立方米'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical {
  height: 100%;
  .el-card {
    height: 100%;
    /deep/.el-card__header {
      padding: 0px 20px !important;
      height: 40px;
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }
    }
    /deep/.el-card__body {
      padding: 0px;
      min-height: 350px;
      height: calc(100% - 40px);
    }
  }
}
</style>
