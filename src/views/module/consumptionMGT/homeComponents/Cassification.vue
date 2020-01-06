<template>
  <div class="classification">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span style="height:40px;line-height:40px;"
          >能耗分类
          <span style="height:40px;line-height:40px;font-size:12px;color:#999">
            (单位：千克标准煤)
          </span>
        </span>
        <el-tabs style="float:right;height:20px;" v-model="dimension">
          <el-tab-pane label="逐时" name="1"></el-tab-pane>
          <el-tab-pane label="逐日" name="2"></el-tab-pane>
          <el-tab-pane label="逐月" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <Echart :isAxisChart="true" :chartData="chartData"></Echart>
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
      dimension: '1',
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
        title: {
          text: '',
          top: 15,
          right: 300,
          textStyle: {
            color: '#333',
            fontSize: 16
          }
        },
        legend: {
          top: 20,
          left: 50,
          data: ['水', '电']
        },
        xData: [],
        series: [
          {
            name: '水',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            data: []
          },
          {
            name: '电',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            data: []
          }
        ]
      }
    }
  },
  watch: {
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
          this.chartData.xData = time.hour
          this.chartData.title.text = `时数据：0时~${time.hour.length - 1}时`
          this.category(time.hour)
          break
        }
        case '2': {
          this.chartData.xData = time.days
          this.chartData.title.text = `日数据：1日~${time.days.length}日`
          this.category(time.days)
          break
        }
        case '3': {
          this.chartData.xData = time.month
          this.chartData.title.text = `月数据：1月~${time.month.length}月`
          this.category(time.month)
          break
        }
      }
    },
    category(times) {
      let body = {
        dimension: this.dimension
      }
      this.$api.energyhome.category(body).then(res => {
        //根据水或者电遍历数组
        let waterArr = res.data.filter(item => item.label === '88') //电
        let electricArr = res.data.filter(item => item.label === '89') //水
        this.formatEchartData(waterArr, 1, times)
        this.formatEchartData(electricArr, 0, times)
      })
    },
    //arr 表示水或电的数组 type表示水或者电 水0 电1 times表示hours，days，month
    formatEchartData(arr, type, times) {
      let tmp = []
      for (let i = 1; i <= times.length; i++) {
        i = i < 10 ? String('0' + i) : String(i)
        tmp.push(i)
      }
      console.log(tmp) //得到字符串为月份的数组
      let tmp2 = tmp.map(item => {
        if (arr.length > 0) {
          arr.forEach(element => {
            if (element.x === item) {
              item = element.strY
            } else {
              item = 0
            }
          })
        } else {
          item = 0
        }
        return item
      })
      console.log(tmp2) //得到echarts展示的数据
      this.chartData.series[type].data = tmp2
    }
  }
}
</script>

<style lang="scss" scoped>
.classification {
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
