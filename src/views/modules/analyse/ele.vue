<!--
	描述：用能分析
-->
<template>
  <div v-loading="loading">
    <table style="width:100%">
      <tr>
        <td style="width:400px;">
          <el-form
            ref="form"
            :inline="true"
            :model="dataForm"
            size="small"
            labelWidth="90px"
          >
            <region-select-item
              label="所属区域"
              v-model="dataForm.regionName"
              @getRegion="getSelectRegion"
            ></region-select-item>
            <el-form-item>
              <el-button-group>
                <el-button
                  @click="reQuery()"
                  type="primary"
                >刷新</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </td>
        <td>
          <table class="tableWrapper">
            <tr>
              <td>{{dataForm.thisYear}}年累计 用电量 ：{{sum}} 万kWh</td>
              <td style="color: #13CE66;">平均 日用电量：{{dayAvg}} 万kWh</td>
              <td style="color: #DD6161;">平均 月用电量：{{monthAvg}} 万kWh</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="changeTabs"
    >
      <el-tab-pane
        label="同比环比分析"
        style="min-width:920px;"
        name="compareTab"
      >
        <div v-if="showStyle ==='chart'">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="gridTitle">
                <span>日电量同比</span>
                <set-query-date
                  class="setQueryBtn"
                  ref="dayCompareYearQueryBtn"
                  v-bind:comparenType="'day'"
                  @callback="callbackQueryDayCompare"
                ></set-query-date>
                <span
                  class="setQueryBtn"
                  v-on:click="showDayCompareYear"
                ><i class="el-icon-refresh"></i></span>
              </div>
              <el-carousel
                trigger="click"
                :autoplay="false"
                height="300"
                style="min-width:460px;overflow-y:hidden;height:300px"
                arrow="always"
              >
                <el-carousel-item>
                  <div
                    class="divChart"
                    id="dayCompareMultiLine"
                  ></div>
                </el-carousel-item>
                <el-carousel-item>
                  <hltable
                    v-bind:tbstyle="tbstyle"
                    v-bind:tburl="tburl"
                    v-bind:tbcols="dayCols"
                    v-bind:tbconfig="tbconfig"
                    ref="dayTable"
                  ></hltable>
                </el-carousel-item>
              </el-carousel>

            </el-col>
            <el-col :span="12">
              <div class="gridTitle">
                <span>日电量环比</span>
                <set-query-date
                  class="setQueryBtn"
                  ref="dayCompareMonthQueryBtn"
                  v-bind:comparenType="'dayCompareMonth'"
                  @callback="callbackQueryDayCompare"
                ></set-query-date>
                <span
                  class="setQueryBtn"
                  v-on:click="showDayCompareMonth"
                ><i class="el-icon-refresh"></i></span>
              </div>
              <el-carousel
                trigger="click"
                :autoplay="false"
                height="300px"
                style="min-width:460px;"
                arrow="always"
              >
                <el-carousel-item>
                  <div
                    class="divChart"
                    id="dayCompareMonthMultiLine"
                  ></div>
                </el-carousel-item>
                <el-carousel-item>
                  <hltable
                    v-bind:tbstyle="tbstyle"
                    v-bind:tburl="tburl"
                    v-bind:tbcols="dayCompareMonthCols"
                    v-bind:tbconfig="tbconfig"
                    ref="dayCompareMonthTable"
                  ></hltable>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <!-- 月电量同比 -->
            <el-col :span="12">
              <div class="gridTitle">
                <span>月电量同比</span>
                <set-query-date
                  class="setQueryBtn"
                  v-bind:comparenType="'month'"
                  ref="monthCompareQueryBtn"
                  @callback="callbackQueryDayCompare"
                ></set-query-date>
                <span
                  class="setQueryBtn"
                  v-on:click="showMonthCompareMultiBarChart"
                ><i class="el-icon-refresh"></i></span>
              </div>
              <el-carousel
                trigger="click"
                :autoplay="false"
                height="300px"
                style="min-width:460px;"
                arrow="always"
              >
                <el-carousel-item>
                  <div
                    class="divChart"
                    id="monthCompareMultiBar"
                  ></div>
                </el-carousel-item>
                <el-carousel-item>
                  <hltable
                    v-bind:tbstyle="tbstyle"
                    v-bind:tburl="tburl"
                    v-bind:tbcols="dayCols"
                    v-bind:tbconfig="tbconfig"
                    ref="monthCompareTable"
                  ></hltable>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <!-- 季度电量同比 -->
            <el-col :span="12">
              <div class="gridTitle">
                <span>季度电量同比</span>
                <set-query-date
                  class="setQueryBtn"
                  v-bind:comparenType="'quarter'"
                  ref="quarterCompareQueryBtn"
                  @callback="callbackQueryDayCompare"
                ></set-query-date>
                <span
                  class="setQueryBtn"
                  v-on:click="showQuarterCompareMultiBarChart"
                ><i class="el-icon-refresh"></i></span>
              </div>
              <el-carousel
                trigger="click"
                :autoplay="false"
                height="300px"
                style="min-width:460px;"
                arrow="always"
              >
                <el-carousel-item>
                  <div
                    class="divChart"
                    id="quarterCompareMultiBar"
                  ></div>
                </el-carousel-item>
                <el-carousel-item>
                  <hltable
                    v-bind:tbstyle="tbstyle"
                    v-bind:tburl="tburl"
                    v-bind:tbcols="dayCols"
                    v-bind:tbconfig="tbconfig"
                    ref="quarterCompareTable"
                  ></hltable>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <el-col :span="12">
              <div class="gridTitle">
                <span>季度电量占比饼图</span>
                <set-query-date
                  class="setQueryBtn"
                  v-bind:comparenType="'quarterPie'"
                  ref="quarterPieCompareQueryBtn"
                  @callback="callbackQueryDayCompare"
                ></set-query-date>
                <span
                  class="setQueryBtn"
                  v-on:click="showQuarterCompareMultiPieChart"
                ><i class="el-icon-refresh"></i></span>
              </div>
              <el-carousel
                trigger="click"
                :autoplay="false"
                height="300px"
                style="min-width:460px;"
                arrow="always"
              >
                <el-carousel-item>
                  <div
                    class="divChart"
                    id="quarterCompareMultiPie"
                  ></div>
                </el-carousel-item>
                <el-carousel-item>
                  <hltable
                    v-bind:tbstyle="tbstyle"
                    v-bind:tburl="tburl"
                    v-bind:tbcols="pieCols"
                    v-bind:tbconfig="tbconfig"
                    ref="quarterPieCompareTable"
                  ></hltable>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <el-col :span="12">
              <div class="gridTitle">
                <span>最近5年电量</span>
                <span
                  class="setQueryBtn"
                  v-on:click="showYearCompareMultiBarChart"
                ><i class="el-icon-refresh"></i></span>
              </div>
              <el-carousel
                trigger="click"
                :autoplay="false"
                height="300px"
                style="min-width:460px;"
                arrow="always"
              >
                <el-carousel-item>
                  <div
                    class="divChart"
                    id="yearCompareMultiBar"
                  ></div>
                </el-carousel-item>
                <el-carousel-item>
                  <hltable
                    v-bind:tbstyle="tbstyle"
                    v-bind:tburl="tburl"
                    v-bind:tbcols="yearCols"
                    v-bind:tbconfig="tbconfig"
                    ref="yearCompareTable"
                  ></hltable>
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </div>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <div class="gridTitle">
              <span style="color: #FFD700">用户累计用电量最大前15名</span>
            </div>
            <hltable
              v-bind:tburl="maxminUrl"
              v-bind:tbcols="maxminCols"
              v-bind:tbconfig="maxminConfig"
              ref="maxDataTable"
              @dataDetail="energyDetail"
            ></hltable>
          </el-col>
          <el-col :span="12">
            <div class="gridTitle">
              <span style="color: #00FFFF;">用户累计用电量最小前15名</span>
            </div>
            <hltable
              v-bind:tburl="maxminUrl"
              v-bind:tbcols="maxminCols"
              v-bind:tbconfig="maxminConfig"
              ref="minDataTable"
              @dataDetail="energyDetail"
            ></hltable>
          </el-col>
        </el-row> -->
      </el-tab-pane>
      <el-tab-pane
        label="子区域比较分析"
        name="childRegionTab"
      >
        <energy-child-region ref="childRegion"></energy-child-region>
      </el-tab-pane>
      <el-tab-pane
        label="分项能耗分析"
        name="energyTypeTab"
      >
        <energy-type-analysis ref="energyType"></energy-type-analysis>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import echarts from 'echarts'
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
import {
  loadLineChart,
  loadBarChart,
  creatMutilSeriesChartOption,
  renderEchart,
  getColor
} from '@/utils/myEcharts'
import energyTypeAnalysis from './energyTypeAnalysis'
import energyChildRegion from './energyChildRegion'
import setQueryDate from './setQueryDate'
const valueUnit = '万kWh'
export default {
  data () {
    return {
      loading: false,
      activeName: 'compareTab',
      tabShowType: 'chart',
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -30), 'yyyy-MM-dd'),
          tool.formatDate(new Date(), 'yyyy-MM-dd')
        ],
        thisDates: null,
        compareDates: null,
        dayCompareMonthDates: null,
        dayCompareMonthDates2: null,
        thisYear: 0,
        compareYear: 0,
        quarterThisYear: 0,
        quarterCompareYear: 0,
        quarterPieThisYear: 0,
        quarterPieCompareYear: 0,
        isDoPage: true,
        schemeid: 2
      },
      showStyle: 'chart',
      startMonth: tool.formatDate(tool.addDay(new Date(), -30 * 12), 'yyyy-MM'),
      endMonth: tool.formatDate(tool.addDay(new Date(), 1), 'yyyy-MM'),
      tburl: '/data/stat/selectTypeEnergyDay',
      tbconfig: {
        isShowSelection: false,
        isShowRowIndex: false,
        rowButtonType: 0,
        isShowPage: true,
        hideShowExcel: true
      },
      tbstyle: {
        width: '100%',
        height: '300px',
        'overflow-y': 'hidden'
      },
      dayCols: [
        { prop: 'datatime', label: '时间', width: 80 },
        { prop: 'eleValue', label: '电量', width: 100 },
        { prop: 'compareEleValue', label: '同比电量' },
        { prop: 'compareRate', label: '同比增长率' }
      ],
      dayCompareMonthCols: [
        { prop: 'datatime', label: '日期', width: 120 },
        { prop: 'eleValue', label: '电量', width: 140 },
        { prop: 'compareEleValue', label: '环比电量' },
        { prop: 'compareRate', label: '环比增长率' }
      ],
      yearCols: [
        { prop: 'datatime', label: '时间', width: 80 },
        { prop: 'eleValue', label: '电量', width: 100 },
        { prop: 'compareRate', label: '环比增长率' }
      ],
      maxminUrl: '/data/stat/selectCustomerMaxMinEnergy',
      maxminCols: [
        { prop: 'hm', label: '户名', width: 220 },
        { prop: 'telephone', label: '手机号', width: 90 },
        { prop: 'energyVal', label: '电量(kWh)' }
      ],
      maxminConfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 3,
        isShowPage: false
      },
      sum: 0,
      dayAvg: 0,
      monthAvg: 0,
      maxDatatime: '',
      needReloadCompare: true,
      needReloadChildRegion: true,
      needReloadEnergyType: true
    }
  },
  components: {
    hltable,
    'region-select-item': regionSelect,
    'energy-type-analysis': energyTypeAnalysis,
    'energy-child-region': energyChildRegion,
    'set-query-date': setQueryDate
  },
  computed: {
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    pieCols () {
      let vm = this
      return [
        { prop: 'datatime', label: '季度', width: 100 },
        {
          prop: 'eleValue',
          label: vm.dataForm.quarterPieThisYear + '季度电量',
          width: 140
        },
        { prop: 'pieRate', label: '占比' },
        {
          prop: 'compareEleValue',
          label: vm.dataForm.quarterPieCompareYear + '季度电量'
        },
        { prop: 'comparePieRate', label: '占比' }
      ]
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList (isGrid) {
      this.loading = true
      // this.loadGridData();
      // this.loadCharts();
      setTimeout(() => {
        this.showDayCompareYear()
        this.showDayCompareMonth()
        this.showMonthCompareMultiBarChart()
        this.showQuarterCompareMultiBarChart()
        this.showQuarterCompareMultiPieChart()
        this.showYearCompareMultiBarChart()
      }, 800)
      this.queryAvg()
      this.needReloadCompare = false
    },
    // 同比环比增长率=（本期数－同期数）÷同期数×100%
    calcCompareRate (thisPeriodValue, historyPeriodValue) {
      thisPeriodValue = thisPeriodValue || 0
      historyPeriodValue = historyPeriodValue || 0
      if (historyPeriodValue === 0 && thisPeriodValue === 0) {
        return '0%'
      }
      if (historyPeriodValue === 0 && thisPeriodValue !== 0) {
        return '100%'
      }
      return (
        (
          ((thisPeriodValue - historyPeriodValue) / historyPeriodValue) *
          100
        ).toFixed(2) + '%'
      )
    },
    // 占比率
    calcPieRate (itemVal, sumVal) {
      itemVal = itemVal || 0
      sumVal = sumVal || 0
      if (sumVal === 0) {
        return '0%'
      }
      return ((itemVal / sumVal) * 100).toFixed(2) + '%'
    },
    callbackQueryDayCompare (params) {
      if (params.comparenType == 'day') {
        this.dataForm.thisDates = params.thisDates
        this.dataForm.compareDates = params.compareDates
        this.showDayCompareYear()
      } else if (params.comparenType === 'dayCompareMonth') {
        this.dataForm.dayCompareMonthDates = params.thisDates
        this.dataForm.dayCompareMonthDates2 = params.compareDates
        this.showDayCompareMonth()
      } else if (params.comparenType === 'month') {
        this.dataForm.thisYear = params.thisYear
        this.dataForm.compareYear = params.compareYear
        this.showMonthCompareMultiBarChart()
      } else if (params.comparenType === 'quarter') {
        this.dataForm.quarterThisYear = params.thisYear
        this.dataForm.quarterCompareYear = params.compareYear
        this.showQuarterCompareMultiBarChart()
      } else if (params.comparenType === 'quarterPie') {
        this.dataForm.quarterPieThisYear = params.thisYear
        this.dataForm.quarterPieCompareYear = params.compareYear
        this.showQuarterCompareMultiPieChart()
      }
    },
    /**
     * 日电量同比曲线
     */
    showDayCompareYear () {
      let vm = this
      var params = {}
      if (!vm.dataForm.thisDates || !vm.dataForm.compareDates) {
        let tmp = this.$refs.dayCompareYearQueryBtn.createDayCompareYearParams()
        params = tmp
      } else {
        params = {
          thisDates: vm.dataForm.thisDates,
          compareDates: vm.dataForm.compareDates,
          comparenType: 'day'
        }
      }
      let _legend = [
        params.thisDates[0].substring(0, 4),
        params.compareDates[0].substring(0, 4)
      ]
      this.showDayCompareMultiLineChart(
        params,
        'dayCompareMultiLine',
        _legend,
        vm.$refs.dayTable
      )
    },
    /**
     * 日环比曲线
     */
    showDayCompareMonth () {
      let vm = this
      var params = {}
      if (
        !vm.dataForm.dayCompareMonthDates ||
        !vm.dataForm.dayCompareMonthDates2
      ) {
        let tmp = this.$refs.dayCompareMonthQueryBtn.createDayCompareMonthParams()
        params = tmp
      } else {
        params = {
          thisDates: vm.dataForm.dayCompareMonthDates,
          compareDates: vm.dataForm.dayCompareMonthDates2,
          comparenType: 'dayCompareMonth'
        }
      }
      let _legend = [
        params.thisDates[0].substring(0, 7),
        params.compareDates[0].substring(0, 7)
      ]
      this.showDayCompareMultiLineChart(
        params,
        'dayCompareMonthMultiLine',
        _legend,
        this.$refs.dayCompareMonthTable
      )
    },
    showDayCompareMultiLineChart (
      compareParams,
      rendDomId,
      _legend,
      dayTableRefs
    ) {
      let vm = this
      let params = {
        regionid: vm.dataForm.regionid,
        startDate: compareParams.thisDates[0],
        endDate: compareParams.thisDates[1],
        compStartDate: compareParams.compareDates[0],
        compEndDate: compareParams.compareDates[1]
      }
      vm.$http.ajaxGet('/energy/compare/day', params, res => {
        let data = res.data
        let table = []
        let _xAxis = []
        if (compareParams.comparenType === 'day') {
          _xAxis = tool.getIntervalStr(
            'MM-dd',
            compareParams.thisDates[0],
            compareParams.thisDates[1]
          )
        } else if (compareParams.comparenType === 'dayCompareMonth') {
          _xAxis = tool.getIntervalStr(
            'dd',
            compareParams.thisDates[0],
            compareParams.thisDates[1]
          )
        }
        let _series = [
          {
            name: _legend[0],
            type: 'line',
            data: []
          },
          {
            name: _legend[1],
            type: 'line',
            data: []
          }
        ]
        let max = 0,
          min = 99999999
        data[0].forEach(item => {
          let value = item.Z_DL_P
          _series[0].data.push(value)
          _series[1].data.push('-')
          let category = item.DATATIME.substring(5, 10)
          if (compareParams.comparenType === 'dayCompareMonth') {
            category = item.DATATIME.substring(8, 10)
          }
          max = value > max ? value : max
          min = value < min ? value : min

          table.push({
            datatime: category,
            eleValue: value,
            compareEleValue: '',
            compareRate: ''
          })
        })
        data[1].forEach(item => {
          let index = -1
          let category = item.DATATIME.substring(5, 10)
          index = _xAxis.indexOf(category)
          if (compareParams.comparenType === 'dayCompareMonth') {
            category = item.DATATIME.substring(8, 10)
            index = _xAxis.indexOf(category)
          }
          if (index == -1) {
            return
          }
          let value = item.Z_DL_P
          if (index < _series[1].data.length) {
            _series[1].data[index] = value
            table[index].compareEleValue = value
            table[index].compareRate = vm.calcCompareRate(
              table[index].eleValue,
              table[index].compareEleValue
            )
          } else {
            _series[1].data.push(value)
            table.push({
              datatime: category,
              eleValue: '',
              compareEleValue: value,
              compareRate: vm.calcCompareRate('', value)
            })
          }
          max = value > max ? value : max
          min = value < min ? value : min
        })
        let option = creatMutilSeriesChartOption({
          legend: _legend,
          xAxis: _xAxis,
          yAxisUnit: valueUnit,
          min: parseInt(min),
          series: _series
        })
        renderEchart(rendDomId, option)
        dayTableRefs.loadLocalData(table)
      })
    },
    /**
     * 月同比
     */
    showMonthCompareMultiBarChart () {
      let vm = this
      let tableRefs = vm.$refs.monthCompareTable
      if (!vm.dataForm.thisYear || !vm.dataForm.compareYear) {
        let tmp = this.$refs.monthCompareQueryBtn.createMonthCompareParams()
        vm.dataForm.thisYear = tmp.thisYear
        vm.dataForm.compareYear = tmp.compareYear
      }
      var params = {
        regionid: vm.dataForm.regionid,
        startDate: vm.dataForm.thisYear + '-01-01',
        endDate: vm.dataForm.compareYear + '-01-01'
      }
      let legend = [
        this.dataForm.thisYear + '',
        this.dataForm.compareYear + ''
      ]
      let xAxis = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
      ]
      let seriesData0 = [],
        seriesData1 = []
      let table = []
      vm.$http.ajaxGet('/energy/compare/month', params, res => {
        let data = res.data
        xAxis.forEach(category => {
          var tmp = {
            datatime: category,
            eleValue: 0,
            compareEleValue: 0
          }
          if (data[0].length > 0) {
            let has = data[0].some(i => {
              let cat = i.DATATIME.substring(5, 7)
              if (parseInt(cat) == parseInt(category)) {
                seriesData0.push(i.Z_DL_P)
                tmp.eleValue = i.Z_DL_P
                return true
              }
            })
            if (!has) {
              seriesData0.push(0)
            }
          }
          if (data[1].length > 0) {
            let has = data[1].some(i => {
              let cat = i.DATATIME.substring(5, 7)
              if (parseInt(cat) == parseInt(category)) {
                seriesData1.push(i.Z_DL_P)
                tmp.compareEleValue = i.Z_DL_P
                return true
              }
            })
            if (!has) {
              seriesData1.push(0)
            }
          }
          tmp.compareRate = vm.calcCompareRate(
            tmp.eleValue,
            tmp.compareEleValue
          )
          table.push(tmp)
        })
        let option = creatMutilSeriesChartOption({
          legend: legend,
          xAxis: xAxis,
          yAxisUnit: valueUnit,
          startZero: true,
          series: [
            {
              name: legend[0],
              type: 'bar',
              data: seriesData0
            },
            {
              name: legend[1],
              type: 'bar',
              data: seriesData1
            }
          ]
        })
        renderEchart('monthCompareMultiBar', option)
        tableRefs.loadLocalData(table)
      })
    },
    showQuarterCompareMultiBarChart () {
      let vm = this
      let tableRefs = vm.$refs.quarterCompareTable
      if (!vm.dataForm.quarterThisYear || !vm.dataForm.quarterCompareYear) {
        let tmp = this.$refs.quarterCompareQueryBtn.createQuarterCompareParams()
        vm.dataForm.quarterThisYear = tmp.thisYear
        vm.dataForm.quarterCompareYear = tmp.compareYear
      }
      var params = {
        regionid: vm.dataForm.regionid,
        thisYear: vm.dataForm.quarterThisYear,
        compareYear: vm.dataForm.quarterCompareYear
      }
      let legend = [
        this.dataForm.quarterThisYear + '',
        this.dataForm.quarterCompareYear + ''
      ]
      let seriesData0 = [],
        seriesData1 = []
      let table = []
      let xAxis = ['第1季度', '第2季度', '第3季度', '第4季度']
      vm.$http.ajaxGet('/energy/compare/quarter', params, res => {
        let data = res.data
        xAxis.forEach(category => {
          var tmp = {
            datatime: category,
            eleValue: '',
            compareEleValue: ''
          }
          if (data[0].length > 0) {
            data[0].forEach(i => {
              let cat = i.DATATIME
              if (cat == category) {
                seriesData0.push(i.Z_DL_P)
                tmp.eleValue = i.Z_DL_P
                return false
              }
            })
          }
          if (data[1].length > 0) {
            data[1].forEach(i => {
              let cat = i.DATATIME
              if (cat == category) {
                seriesData1.push(i.Z_DL_P)
                tmp.compareEleValue = i.Z_DL_P
                return false
              }
            })
          }
          tmp.compareRate = vm.calcCompareRate(
            tmp.eleValue,
            tmp.compareEleValue
          )
          table.push(tmp)
        })
        let option = creatMutilSeriesChartOption({
          legend: legend,
          xAxis: xAxis,
          yAxisUnit: valueUnit,
          startZero: true,
          series: [
            {
              name: legend[0],
              type: 'bar',
              data: seriesData0
            },
            {
              name: legend[1],
              type: 'bar',
              data: seriesData1
            }
          ]
        })
        renderEchart('quarterCompareMultiBar', option)
        tableRefs.loadLocalData(table)
      })
    },
    showQuarterCompareMultiPieChart () {
      let vm = this
      let tableRefs = vm.$refs.quarterPieCompareTable
      if (
        !vm.dataForm.quarterPieThisYear ||
        !vm.dataForm.quarterPieCompareYear
      ) {
        let tmp = this.$refs.quarterPieCompareQueryBtn.createQuarterPieCompareParams()
        vm.dataForm.quarterPieThisYear = tmp.thisYear
        vm.dataForm.quarterPieCompareYear = tmp.compareYear
      }
      var params = {
        regionid: vm.dataForm.regionid,
        thisYear: vm.dataForm.quarterPieThisYear,
        compareYear: vm.dataForm.quarterPieCompareYear
      }
      let legend = [
        this.dataForm.quarterPieThisYear + '',
        this.dataForm.quarterPieCompareYear + ''
      ]
      let seriesData0 = [],
        seriesData1 = []
      let table = []
      let xAxis = ['第1季度', '第2季度', '第3季度', '第4季度']
      let seriesData0ValueSum = 0
      let seriesData1ValueSum = 0
      vm.$http.ajaxGet('/energy/compare/quarter', params, res => {
        let data = res.data
        xAxis.forEach(category => {
          var tmp = {
            datatime: category,
            eleValue: '',
            compareEleValue: ''
          }
          if (data[0].length > 0) {
            data[0].forEach(i => {
              let cat = i.DATATIME
              if (cat == category) {
                seriesData0.push({
                  name: cat,
                  value: i.Z_DL_P
                })
                tmp.eleValue = i.Z_DL_P
                seriesData0ValueSum += i.Z_DL_P
                return false
              }
            })
          }
          if (data[1].length > 0) {
            data[1].forEach(i => {
              let cat = i.DATATIME
              if (cat == category) {
                seriesData1.push({
                  name: cat,
                  value: i.Z_DL_P
                })
                tmp.compareEleValue = i.Z_DL_P
                seriesData1ValueSum += i.Z_DL_P
                return false
              }
            })
          }
          table.push(tmp)
        })
        table.forEach(tmp => {
          tmp.pieRate = vm.calcPieRate(tmp.eleValue, seriesData0ValueSum)
          tmp.comparePieRate = vm.calcPieRate(
            tmp.compareEleValue,
            seriesData0ValueSum
          )
        })

        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'left',
            data: legend
          },
          series: [
            {
              name: legend[0],
              type: 'pie',
              radius: '65%',
              center: ['20%', '50%'],
              data: seriesData0,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return getColor(params)
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            {
              name: legend[1],
              type: 'pie',
              radius: '65%',
              center: ['70%', '50%'],
              data: seriesData1,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return getColor(params)
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        renderEchart('quarterCompareMultiPie', option)
        tableRefs.loadLocalData(table)
      })
    },
    showYearCompareMultiBarChart () {
      let vm = this
      let tableRefs = vm.$refs.yearCompareTable
      let thisYear = tool.formatDate(new Date(), 'yyyy')
      let preCount = 4
      let preYear = tool.formatDate(
        tool.addYear(new Date(), -1 * preCount),
        'yyyy'
      )
      let xAxis = tool.getIntervalStr('yyyy', preYear, thisYear)
      var params = {
        regionid: vm.dataForm.regionid,
        thisYear: thisYear,
        preCount: preCount
      }
      let seriesData = []
      let table = []
      let seriesDataValueSum = 0
      vm.$http.ajaxGet('/energy/compare/year', params, res => {
        let data = res.data
        xAxis.forEach(category => {
          var tmp = {
            datatime: category,
            eleValue: 0,
            compareEleValue: 0
          }
          if (data.length > 0) {
            let has = data.some(i => {
              let cat = i.DATATIME
              if (cat == category) {
                seriesData.push(i.Z_DL_P)
                tmp.eleValue = i.Z_DL_P
                seriesDataValueSum += i.Z_DL_P
                return true
              }
            })
            if (!has) {
              seriesData.push(0)
            }
          }
          table.push(tmp)
        })
        for (var i = 1, len = table.length; i < len; i++) {
          table[i].compareRate = vm.calcCompareRate(
            table[i].eleValue,
            table[i - 1].eleValue
          )
        }
        vm.sum = table[4].eleValue
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ' + valueUnit
          },
          xAxis: {
            type: 'category',
            data: xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: seriesData,
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#17b3a3'
                }
              }
            }
          ]
        }
        renderEchart('yearCompareMultiBar', option)
        tableRefs.loadLocalData(table)
      })

      this.loading = false
    },
    getSelectRegion (data) {
      if (this.dataForm.regionid !== data.id) {
        this.needReloadCompare = true
        this.needReloadChildRegion = true
        this.needReloadEnergyType = true
      }
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.changeTabs()
    },
    changeTabs () {
      if (this.activeName === 'compareTab' && this.needReloadCompare) {
        this.getDataList()
        this.needReloadCompare = false
      } else if (
        this.activeName === 'childRegionTab' &&
        this.needReloadChildRegion
      ) {
        this.$refs.childRegion.init(
          this.dataForm.regionid,
          this.dataForm.regionName
        )
        this.needReloadChildRegion = false
      } else if (
        this.activeName === 'energyTypeTab' &&
        this.needReloadEnergyType
      ) {
        this.$refs.energyType.init(this.dataForm.regionid)
        this.needReloadEnergyType = false
      }
    },
    reQuery () {
      this.needReloadCompare = true
      this.needReloadChildRegion = true
      this.needReloadEnergyType = true
      this.changeTabs()
    },
    queryAvg () {
      let vm = this
      vm.$http.ajaxGet(
        '/energy/compare/avg',
        {
          regionid: vm.dataForm.regionid
        },
        res => {
          let data = res.data
          vm.dayAvg = data.dayAvg
          vm.monthAvg = data.monthAvg
        }
      )
    }
  }
}
</script>

<style>
.gridTitle {
  display: block;
  width: 100%;
  height: 30px;
  background-color: #17b3a3;
  line-height: 30px;
  text-align: center;
  color: white;
  font-weight: bold;
  border-radius: 4px;
}
.childChart {
  width: 100%;
  height: 350px;
  margin-bottom: 10px;
  background-color: #f3f3f3;
}
.leftChart {
  display: flex;
}
.rightChart {
  width: 300px;
}
.setQueryBtn {
  z-index: 99999;
  float: right;
  margin-right: 10px;
  cursor: pointer;
  font-size: 18px;
}
.divChart {
  width: 100%;
  height: 300px;
}
.tableWrapper {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #82848a;
  border: 1px solid #15a193;
  border-radius: 4px;
  margin-bottom: 10px;
  font-weight: 600;
}
</style>