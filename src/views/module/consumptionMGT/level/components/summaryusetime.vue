<template>
  <el-card>
    <div slot="header">
      <span>分类分时能耗</span>
      <span style="font-size:12px;color:#999">(单位：{{ unit }})</span>
      <!-- <div style="height:600px">11111111</div> -->
    </div>
    <Echart :isAxisChart="true" :chartData="chartData"></Echart>
  </el-card>
</template>

<script>
import Echart from '@/components/Echart'
import time from '@/utils/time.js'
export default {
  components: {
    Echart
  },
  data() {
    return {
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
        series: []
      },
      unit: ''
    }
  },
  created() {
    this.chartData.xData = time.hour
  },
  methods: {
    summaryusetime(body) {
      console.log(body)
      switch (body.type) {
        case '0':
          this.unit = '千克标准煤'
          break
        case '88':
          this.unit = '千瓦时'
          break
        case '89':
          this.unit = '立方米'
          break
      }
      this.$api.classificationenergy.categorytime(body).then(res => {
        if (res.code === 0) {
          this.chartData.legend.data = res.data.map(item => {
            return item.label === '88' ? '电' : '水'
          })
          this.chartData.series = res.data.map(item => {
            return {
              name: item.label === '88' ? '电' : '水',
              type: 'bar',
              data: item.yArrays
            }
          })
          console.log(this.chartData)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  height: 100%;
  /deep/.el-card__header {
    padding: 12.5px;
  }
  /deep/.el-card__body {
    padding: 0;
    height: calc(100% - 43px);
    overflow: auto;
  }
}
</style>
