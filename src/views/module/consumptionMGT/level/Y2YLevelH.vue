<template>
  <div
    class="view"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="ruleForm" :inline="true" style="height:50px">
      <el-form-item>
        <el-select
          v-model="type"
          size="mini"
          @change="handle"
          style="width:80px;"
        >
          <el-option label="综合" value="0"></el-option>
          <el-option label="电" value="88"></el-option>
          <el-option label="水" value="89"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-select v-model="dimension" size="mini" style="width:80px;">
            <el-option value="2" label="日"></el-option>
            <el-option value="3" label="月"></el-option>
            <el-option value="4" label="年"></el-option>
          </el-select>
          <el-date-picker
            size="mini"
            v-model="time"
            style="width:150px"
            v-if="dimension === '2'"
            value-format="yyyyMMdd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            v-else-if="dimension === '3'"
            v-model="time"
            style="width:150px"
            type="month"
            value-format="yyyyMM"
            placeholder="选择月"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            value-format="yyyy"
            style="width:150px"
            v-else-if="dimension === '4'"
            v-model="time"
            type="year"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-if="dimension === '2'"
            v-model="compare"
            size="mini"
            style="width:110px;"
          >
            <el-option label="上月本日" value="1"></el-option>
            <el-option label="上年本日" value="2"></el-option>
            <el-option label="环比" value="3"></el-option>
          </el-select>
          <el-select
            v-else-if="dimension === '3'"
            v-model="compare"
            size="mini"
            style="width:110px;"
          >
            <el-option label="同比" value="1"></el-option>
            <el-option label="环比" value="2"></el-option>
          </el-select>
          <el-select
            v-else-if="dimension === '4'"
            v-model="compare"
            size="mini"
            style="width:110px;"
          >
            <el-option label="同比" value="1"></el-option>
            <el-option label="环比" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            size="mini"
            style="width:150px;"
            disabled
            v-model="comparetime"
            v-if="dimension === '2'"
            value-format="yyyyMMdd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            style="width:150px;"
            disabled
            v-model="comparetime"
            v-if="dimension === '3'"
            value-format="yyyyMM"
            type="month"
            placeholder="选择月份"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            value-format="yyyy"
            disabled
            style="width:150px"
            v-else-if="dimension === '4'"
            v-model="comparetime"
            type="year"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>

        <el-button
          icon="el-icon-search"
          size="mini"
          @click="handle"
          type="primary"
        >
          查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="content">
      <RegionTree class="tree" @nodeClick="nodeClick"></RegionTree>
      <div class="contenttable">
        <div class="top">
          <el-card>
            <div slot="header">
              <span>分类分时能耗</span>
              <span style="font-size:12px;color:#999">(单位：{{ unit }})</span>
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
import Echart from '@/components/Echart'
import RegionTree from '@/views/common/RegionTree'
import CommonTable from '@/views/common/Table'
export default {
  components: {
    RegionTree,
    Echart,
    CommonTable
  },
  data() {
    return {
      loading: false,
      regionid: this.$cookie.get('regionid'),
      regionName: this.$cookie.get('regionName'),
      dimension: '3',
      time: this.$moment().format('YYYYMM'),
      type: '0',
      comparetime: '',
      compare: '1',
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
      unit: '',
      options: {
        loading: false,
        index: true
      },
      tableData: [],
      columns: [
        {
          label: '用能单位',
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
  computed: {},
  created() {
    this.$nextTick(() => {
      // this.handle()
      this.formattime()
    })
  },
  watch: {
    dimension(newValue, oldValue) {
      //切换日月年，重置对比条件
      this.compare = '1'
      switch (newValue) {
        case '2':
          this.time = this.$moment().format('YYYYMMDD')
          break
        case '3':
          this.time = this.$moment().format('YYYYMM')
          break
        case '4':
          this.time = this.$moment().format('YYYY')
          break
      }
    },
    time(newValue, oldValue) {
      this.handle()
    },
    compare(newValue, oldValue) {
      this.handle()
    }
  },
  methods: {
    formattime() {
      if (this.dimension === '2') {
        if (this.compare === '1') {
          //上月本日
          this.comparetime = this.$moment(this.time)
            .add(-1, 'M')
            .format('YYYYMMDD')
        } else if (this.compare === '2') {
          this.comparetime = this.$moment(this.time)
            .add(-1, 'y')
            .format('YYYYMMDD')
        } else if (this.compare === '3') {
          this.comparetime = this.$moment(this.time)
            .add(-1, 'd')
            .format('YYYYMMDD')
        }
      } else if (this.dimension === '3') {
        if (this.compare === '1') {
          let y = parseInt(this.time.substr(0, 4))

          let m = this.time.substr(4, 2)

          this.comparetime = y - 1 + m
        } else if (this.compare === '2') {
          let y1 = parseInt(this.time.substr(0, 4))
          let m1 = parseInt(this.time.substr(4, 2))
          let y2 = this.time.substr(0, 4)
          let m2 = this.time.substr(4, 2)
          if (m2 === '01') {
            this.comparetime = y1 - 1 + '12'
          } else if (m1 < 10) {
            this.comparetime = (y2 + '0' + m1 - 1).toString()
          } else {
            this.comparetime = (y2 + m1 - 1).toString()
          }
        }
      } else if (this.dimension === '4') {
        this.comparetime = this.$moment(this.time)
          .add(-1, 'y')
          .format('YYYY')
      }
    },
    handle() {
      this.formattime()
      this.loading = true
      let body = {
        deptId: this.regionid,
        time: this.time,
        dimension: this.dimension,
        type: this.type,
        comparetime: this.comparetime
      }
      switch (this.type) {
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
      this.chartData.legend.data = [this.time, this.comparetime]
      this.$api.energyhome.statics(body).then(res => {
        console.log(res)
        this.chartData.xData = res.data.map(item => {
          return item.label
        })
        let data1 = res.data.map(item => {
          return item.yArrays[0]
        })
        this.chartData.series[0] = {
          name: this.time,
          type: 'bar',
          data: data1
        }
        let data2 = res.data.map(item => {
          return item.yArrays[1]
        })
        this.chartData.series[1] = {
          name: this.comparetime,
          type: 'bar',
          data: data2
        }
        this.columns[3].label = this.compare === '1' ? '同比' : '环比'
        this.columns[1].label = `${this.time}(${this.unit})`
        this.columns[2].label = `${this.comparetime}(${this.unit})`
        this.tableData = res.data.map(item => {
          return {
            name: item.label,
            value1: item.yArrays[0],
            value2: item.yArrays[1],
            rate:
              (item.yArrays[0] - item.yArrays[1] / item.yArrays[1]).toFixed(2) +
              '%'
          }
        })
        console.log(this.chartData)
      })
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    nodeClick(data) {
      console.log(data)
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
      }
    }
  }
}
</style>
