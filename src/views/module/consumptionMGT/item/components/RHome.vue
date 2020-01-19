<template>
  <el-card>
    <div slot="header">
      <span>分项能耗同比</span>
      <span style="font-size:12px;color:#999">(单位：千瓦时)</span>
    </div>
    <Echart :isAxisChart="true" :chartData="chartData"></Echart>
  </el-card>
</template>

<script>
import Echart from '@/components/Echart'
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
      }
    }
  },
  methods: {
    itemtime(body) {
      this.$api.energyhome.itemtime(body).then(res => {
        console.log(res)
        this.chartData.legend.data = res.data.map(item => {
          return item.label
        })
        this.chartData.xData = res.data[0].xArrays
        this.chartData.series = res.data.map(item => {
          return {
            name: item.label,
            type: 'bar',
            stack: '总计',
            areaStyle: {},
            data: item.yArrays
          }
        })
        console.log(this.chartData)
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
