<template>
  <el-card>
    <div slot="header">
      <span>分类能耗使用</span>
      <span style="font-size:12px;color:#999">(单位：千克标准煤)</span>
      <!-- <div style="height:600px">11111111</div> -->
    </div>
    <Echart :isAxisChart="false" :chartData="chartData"></Echart>
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
        legend: {
          //图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
          show: true,
          orient: 'vertical',
          right: '20',
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
            data: [],
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
  created() {},
  methods: {
    summaryuse(body) {
      console.log(body)
      this.$api.classificationenergy.summaryuse(body).then(res => {
        console.log(res)
        this.chartData.series[0].data = res.data.map(item => {
          return { name: item.label === '88' ? '电' : '水', value: item.strY }
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
