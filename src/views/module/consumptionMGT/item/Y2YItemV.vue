<template>
  <div
    class="view"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" style="height:50px;">
      <el-form-item>
        <el-input v-model="dictId" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="mini" v-model="statictype" style="width:100px">
          <el-option value="1" label="同比"></el-option>
          <el-option value="2" label="环比"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="statictype === '1'">
        <el-date-picker
          style="width:150px"
          size="mini"
          v-model="time"
          type="month"
          placeholder="选择月"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="同比月数" v-if="statictype === '1'">
        <el-select v-model="compareNum" size="mini" style="width:80px">
          <el-option v-for="item in list" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="statictype === '2'">
        <el-select v-model="dimension" size="mini" style="width:100px;">
          <el-option label="逐时" value="1"></el-option>
          <el-option label="逐日" value="2"></el-option>
          <el-option label="逐月" value="3"></el-option>
          <el-option label="逐年" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-if="statictype === '2' && dimension === '1'"
          style="width:150px"
          size="mini"
          v-model="time"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-date-picker
          v-if="statictype === '2' && dimension === '2'"
          style="width:150px"
          size="mini"
          v-model="time"
          type="month"
          placeholder="选择月"
        >
        </el-date-picker>
        <el-date-picker
          v-if="statictype === '2' && (dimension === '3' || dimension === '4')"
          style="width:150px"
          size="mini"
          v-model="time"
          type="year"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        v-if="statictype === '2' && dimension === '4'"
        label="环比年数"
      >
        <el-select v-model="compareNum" size="mini" style="width:80px">
          <el-option v-for="item in list" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          size="mini"
          @click="handle"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="content">
      <RegionTree class="tree" @nodeClick="nodeClick"></RegionTree>
      <div class="contenttable">
        <div class="top">
          <el-card>
            <div slot="header">
              <span>分类分时能耗</span>
              <span style="font-size:12px;color:#999">(单位：千瓦时)</span>
              <!-- <div style="height:600px">11111111</div> -->
            </div>
            <Echart :isAxisChart="true" :chartData="chartData"></Echart>
          </el-card>
        </div>
        <div class="bottom">
          <common-table
            :options="options"
            :dataSource="tableData"
            :columns="columns"
          ></common-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegionTree from '@/views/common/RegionTree'
import Echart from '@/components/Echart'
import CommonTable from '@/views/common/Table'
export default {
  components: {
    RegionTree,
    Echart,
    CommonTable
  },
  data() {
    return {
      dictId: '102',
      statictype: '1',
      time: this.$moment().format(),
      list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      compareNum: '3',
      dimension: '2',
      valuetime: '',
      regionid: this.$cookie.get('regionid'),
      loading: false,
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
      options: {
        loading: false,
        index: true,
        maxHeight: 350
      },
      tableData: [],
      columns: [
        {
          label: '日期',
          prop: 'name'
        },
        {
          label: '',
          prop: 'value1'
        },
        {
          label: '',
          prop: 'value2'
        },
        {
          label: '',
          prop: 'rate'
        }
      ]
    }
  },
  watch: {
    statictype(newValue, oldValue) {
      this.handle()
    },
    time(newValue, oldValue) {
      this.handle()
    },
    dimension(newValue, oldValue) {
      this.handle()
    },
    compareNum(newValue, oldValue) {
      this.handle()
    }
  },
  created() {},
  methods: {
    formattime() {
      switch (this.dimension) {
        case '1':
          this.valuetime = this.$moment(this.time).format('YYYYMMDD')
          this.chartData.legend.data = ['本日', '昨日']
          break
        case '2':
          this.valuetime = this.$moment(this.time).format('YYYYMM')
          this.chartData.legend.data = ['本月', '上月']
          break
        case '3':
          this.valuetime = this.$moment(this.time).format('YYYY')
          this.chartData.legend.data = ['本年', '去年']
          break
        case '4':
          this.valuetime = this.$moment(this.time).format('YYYY')
          this.chartData.legend.data = ['本期', '同期']
          break
      }
    },
    handle() {
      let body = {}
      this.loading = true

      if (this.statictype === '2') {
        this.formattime()
        body = {
          statictype: this.statictype,
          time: this.valuetime,
          compareNum: this.compareNum,
          dimension: this.dimension,
          deptId: this.regionid,
          dictId: this.dictId
        }
        console.log(body)
      } else {
        this.chartData.legend.data = ['本期', '同期']
        body = {
          statictype: this.statictype,
          time: this.$moment(this.time).format('YYYYMM'),
          compareNum: this.compareNum,
          deptId: this.regionid,
          dictId: this.dictId
        }
        console.log(body)
      }
      this.$api.energyhome.itemportraitstatics(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.chartData.xData = res.data.map(item => {
            return item.name
          })
          let thisvallist = res.data.map(item => {
            return item.thisVal
          })
          this.chartData.series[0] = {
            name: this.chartData.legend.data[0],
            type: 'bar',
            data: thisvallist
          }
          let lastvallist = res.data.map(item => {
            return item.lastVal
          })
          this.chartData.series[1] = {
            name: this.chartData.legend.data[1],
            type: 'bar',
            data: lastvallist
          }
          this.columns[3].label = this.statictype === '1' ? '同比' : '环比'
          this.columns[1].label = '本期能耗(千瓦时)'
          this.columns[2].label = '同期能耗(千瓦时）'
          this.tableData = res.data.map(item => {
            return {
              name: item.name,
              value1: item.thisVal,
              value2: item.lastVal,
              rate:
                (
                  parseFloat(item.thisVal) -
                  parseFloat(item.lastVal) / parseFloat(item.lastVal)
                ).toFixed(2) + '%'
            }
          })
        }
      })

      //   this.$api.energyhome.portraitstatics(body).then(res => {
      //     console.log(res)
      //     if (res.code === 0) {
      //       this.chartData.xData = res.data.map(item => {
      //         return item.name
      //       })

      //       let thisvallist = res.data.map(item => {
      //         return item.thisVal
      //       })
      //       this.chartData.series[0] = {
      //         name: this.chartData.legend.data[0],
      //         type: 'bar',
      //         data: thisvallist
      //       }
      //       let lastvallist = res.data.map(item => {
      //         return item.lastVal
      //       })
      //       this.chartData.series[1] = {
      //         name: this.chartData.legend.data[1],
      //         type: 'bar',
      //         data: lastvallist
      //       }
      //       this.columns[3].label = this.statictype === '1' ? '同比' : '环比'
      //       this.columns[1].label = `本期能耗(${this.unit})`
      //       this.columns[2].label = `同期能耗(${this.unit})`
      //       this.tableData = res.data.map(item => {
      //         return {
      //           name: item.name,
      //           value1: item.thisVal,
      //           value2: item.lastVal,
      //           rate:
      //             (
      //               parseFloat(item.thisVal) -
      //               parseFloat(item.lastVal) / parseFloat(item.lastVal)
      //             ).toFixed(2) + '%'
      //         }
      //       })
      //     }
      //   })
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    nodeClick(data) {
      this.regionid = data.id
      this.handle()
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-divider--horizontal {
    margin: 0;
  }
  .content {
    margin-top: 10px;
    height: calc(100% - 51px);
    display: flex;
    .tree {
      width: 350px;
    }
    .contenttable {
      overflow: auto;
      flex: 1;

      display: flex;
      flex-direction: column;
      .top {
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
        flex: 1;
        // padding: 20px 0;
      }
    }
  }
}
</style>
