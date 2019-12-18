<template>
  <div style="height:100%" ref="echart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      } // 对象的默认值，引用类型需要通过default函数返回，防止其他地方引用改变默认值
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    },
    isCollapse() {
      return this.$store.state.common.sidebarFold
    }
  },
  watch: {
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
    },
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },
  data() {
    return {
      echart: null,
      axisOption: {
        // 显示图例
        legend: {
          textStyle: {
            color: '#333'
          }
        },
        // 触发类型
        tooltip: {
          trigger: 'axis'
        },
        // 偏离
        grid: {
          left: '10%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3'
              }
            }
          }
        ],
        color: [
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#c14089'
        ],
        series: [],
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ['line', 'bar'],
              show: true
            },
            dataZoom: {
              show: false
            },
            dataView: {
              show: false
            },
            restore: {
              show: false
            },
            saveAsImage: {
              show: true
            }
          }
        }
      },
      normalOption: {
        // 图例
        // legend: {
        //   textStyle: {
        //     color: '#333'
        //   }
        // },
        // 触发
        tooltip: {
          trigger: 'item'
        },
        color: [
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#c14089'
        ],
        series: [],
        label: {}
      }
    }
  },

  methods: {
    initChart() {
      this.initChartData()
      if (this.echart) {
        this.echart.setOption(this.options, true)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options, true)
      }
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
      }
    },
    resizeChart() {
      this.echart ? this.echart.resize() : ''
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.initChart()
  },
  // 避免内存泄漏
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>
