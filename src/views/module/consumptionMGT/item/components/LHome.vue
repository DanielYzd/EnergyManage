<template>
  <div class="lhome">
    <div class="top">
      <el-card>
        <div slot="header">
          <span>分项能耗同比</span>
          <span style="font-size:12px;color:#999">(单位：千瓦时)</span>
        </div>
        <Echart :isAxisChart="true" :chartData="chartData"></Echart>
      </el-card>
    </div>
    <div class="bottom">
      <el-card>
        <div slot="header">
          <span>分项能耗占比</span>
          <span style="font-size:12px;color:#999">(单位：千瓦时)</span>
        </div>
        <Echart :isAxisChart="false" :chartData="chartData2"></Echart>
      </el-card>
    </div>
  </div>
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
      },
      chartData2: {
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
  methods: {
    itemyoy(body) {
      this.$api.energyhome.itemyoy(body).then(res => {
        console.log(res)
        switch (body.dimension) {
          case '2':
            this.chartData.legend.data = ['本日', '昨日']
            break
          case '3':
            this.chartData.legend.data = ['本月', '上月']
            break
          case '4':
            this.chartData.legend.data = ['本年', '去年']
            break
        }
        let xlist = res.data.map(item => {
          return item.x
        })
        let thislist = res.data.map(item => {
          return item.thisVal
        })
        let lastlist = res.data.map(item => {
          return item.lastVal
        })
        this.chartData.xData = xlist
        this.chartData.series
        this.chartData.series[0] = {
          name: this.chartData.legend.data[0],
          type: 'bar',
          data: thislist
        }
        this.chartData.series[1] = {
          name: this.chartData.legend.data[1],
          type: 'bar',
          data: lastlist
        }
        let pieList = res.data.map(item => {
          return { name: item.name, value: item.thisVal }
        })
        this.chartData2.series[0].data = pieList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lhome {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    margin-top: 10px;
    flex: 1;
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
  }
  .bottom {
    margin-top: 10px;
    flex: 1;
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
  }
}
</style>
