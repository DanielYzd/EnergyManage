<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="gridTitle">
          <span>分项能耗日电量对比图</span>
          <set-query-date
            class="setQueryBtn"
            ref="dayEnergyTypeQueryBtn"
            v-bind:comparenType="'onlyDayBetween'"
            @callback="callbackQueryDayCompare"
          ></set-query-date>
          <span
            class="setQueryBtn"
            v-on:click="queryDayEnergyType"
          ><i class="el-icon-refresh"></i></span>
        </div>
        <el-carousel
          trigger="click"
          :autoplay="false"
          height="300"
          style="min-width:460px;height:300px"
          arrow="always"
        >
          <el-carousel-item>
            <div
              class="divChart"
              id="dayEnergyTypeChart"
            ></div>
          </el-carousel-item>
          <el-carousel-item>
            <hltable
              v-bind:tbstyle="tbstyle"
              v-bind:tburl="tburl"
              v-bind:tbcols="dayCols"
              v-bind:tbconfig="tbconfig"
              ref="dayEnergyTypeTable"
            ></hltable>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="24">
        <div class="gridTitle">
          <span>分项能耗月电量对比图</span>
          <set-query-date
            class="setQueryBtn"
            ref="monthEnergyTypeQueryBtn"
            v-bind:comparenType="'onlyYear'"
            @callback="callbackQueryDayCompare"
          ></set-query-date>
          <span
            class="setQueryBtn"
            v-on:click="queryMonthEnergyType"
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
              id="monthEnergyTypeChart"
            ></div>
          </el-carousel-item>
          <el-carousel-item>
            <hltable
              v-bind:tbstyle="tbstyle"
              v-bind:tburl="tburl"
              v-bind:tbcols="dayCols"
              v-bind:tbconfig="tbconfig"
              ref="monthEnergyTypeTable"
            ></hltable>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="24">
        <div class="gridTitle">
          <span>{{dataForm.thisYear}}年分项能耗季度电量占比图</span>
          <set-query-date
            class="setQueryBtn"
            ref="quarterEnergyTypeQueryBtn"
            v-bind:comparenType="'onlyQuarter'"
            @callback="callbackQueryDayCompare"
          ></set-query-date>
          <span
            class="setQueryBtn"
            v-on:click="queryQuarterEnergyType"
          ><i class="el-icon-refresh"></i></span>
        </div>
        <el-carousel
          trigger="click"
          :autoplay="false"
          height="300"
          style="min-width:460px;height:300px"
          arrow="always"
        >
          <el-carousel-item>
            <div
              class="divChart"
              id="quarterEnergyTypeChart"
            ></div>
          </el-carousel-item>
          <el-carousel-item>
            <hltable
              v-bind:tbstyle="tbstyle"
              v-bind:tburl="tburl"
              v-bind:tbcols="dayCols"
              v-bind:tbconfig="tbconfig"
              ref="quarterEnergyTypeTable"
            ></hltable>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="24">
        <div class="gridTitle">
          <span>近5年各分项能耗对比图</span>
          <span
            class="setQueryBtn"
            v-on:click="queryYearEnergyType"
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
              id="yearEnergyTypeChart"
            ></div>
          </el-carousel-item>
          <el-carousel-item>
            <hltable
              v-bind:tbstyle="tbstyle"
              v-bind:tburl="tburl"
              v-bind:tbcols="dayCols"
              v-bind:tbconfig="tbconfig"
              ref="yearEnergyTypeTable"
            ></hltable>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import hltable from "@/components/hltable";
import tool from "@/utils/tool";
import globals from "@/utils/globals";
import {
  loadLineChart,
  loadBarChart,
  creatMutilSeriesChartOption,
  renderEchart,
  getColor,
  legendStyle,
  itemStyle
} from "@/utils/myEcharts";
import setQueryDate from "./setQueryDate";
const seriesCenter = [
  ["13%", "50%"],
  ["35%", "50%"],
  ["57%", "50%"],
  ["80%", "50%"]
];
const quarterName = globals.quarterName;
const monthName = globals.monthName;
const valueUnit = "万kWh";
export default {
  data() {
    return {
      dataForm: {
        regionid: null,
        thisDates: null,
        thisYear: tool.formatDate(new Date(), "yyyy")
      },
      tburl: "",
      tbconfig: {
        isShowSelection: false,
        isShowRowIndex: false,
        rowButtonType: 0,
        isShowPage: true,
        hideShowExcel: true
      },
      tbstyle: {
        width: "100%",
        height: "300px",
        "overflow-y": "hidden"
      },
      dayCols: [
        { prop: "datatime", label: "时间", width: 80 },
        { prop: "eleValue", label: "电量", width: 100 }
      ],
      energyTypes: []
    };
  },
  components: {
    hltable,
    "set-query-date": setQueryDate
  },
  computed: {},
  watch: {
    energyTypes: function(value, oldvalue) {
      this.createColumns();
    }
  },
  mounted() {
    //this.init();
  },
  activated() {},
  methods: {
    createColumns() {
      let tmpArray = [{ prop: "datatime", label: "时间", width: 80 }];
      this.energyTypes.forEach((item, index) => {
        tmpArray.push({
          prop: "eleValue" + index,
          label: item + "电量",
          width: 100
        });
      });
      this.dayCols = tmpArray;
    },
    init(regionid) {
      this.dataForm.regionid = parseInt(regionid);
      setTimeout(() => {
        this.queryDayEnergyType();
        this.queryMonthEnergyType();
        this.queryQuarterEnergyType();
      }, 800);
      setTimeout(() => {
        this.queryYearEnergyType();
      }, 1000);
    },
    /**
     * 日电量
     */
    queryDayEnergyType() {
      let vm = this;
      var params = {};
      if (!vm.dataForm.thisDates) {
        let tmp = this.$refs.dayEnergyTypeQueryBtn.createOnlyDayBetweenCompareParams();
        vm.dataForm.thisDates = tmp.thisDates;
      }
      params.thisDates = vm.dataForm.thisDates;
      params.url = "/energy/compare/dayEnergyType";
      params.rendDomId = "dayEnergyTypeChart";
      params.rendTable = vm.$refs.dayEnergyTypeTable;
      params.xAxis = tool.getIntervalStr(
        "MM-dd",
        params.thisDates[0],
        params.thisDates[1]
      );
      params.urlParams = {
        regionid: vm.dataForm.regionid,
        startDate: params.thisDates[0],
        endDate: params.thisDates[1]
      };
      params.seriesType = "line";
      params.getLabel = function(src) {
        return src.substring(5, 10);
      };
      this.showDayCompareMultiLineChart(params);
    },
    /**
     * 月电量
     */
    queryMonthEnergyType() {
      let vm = this;
      var params = {};
      if (!vm.dataForm.thisYear) {
        let tmp = this.$refs.monthEnergyTypeQueryBtn.createOnlyYearParams();
        vm.dataForm.thisYear = tmp.thisYear;
      }
      params.urlParams = {
        regionid: vm.dataForm.regionid,
        thisYear: vm.dataForm.thisYear
      };
      params.url = "/energy/compare/monthEnergyType";
      params.rendDomId = "monthEnergyTypeChart";
      params.rendTable = vm.$refs.monthEnergyTypeTable;
      params.xAxis = monthName;
      params.seriesType = "bar";
      params.getLabel = function(src) {
        return src.substring(5, 7) + "月";
      };
      params.startZero = true;
      this.showDayCompareMultiLineChart(params);
    },
    showDayCompareMultiLineChart(compareParams) {
      let vm = this;
      let params = compareParams.urlParams;
      vm.$http.ajaxGet(compareParams.url, compareParams.urlParams, res => {
        let data = res.data;
        let table = [];
        let _xAxis = compareParams.xAxis;
        let legend = [];
        let series = [];
        let seriesObj = {};
        let max = 0,
          min = 99999999,
          min99999 = 99999999;
        data.forEach((item, index) => {
          if (legend.indexOf(item.name) == -1) {
            legend.push(item.name);
          }
          let _series = {
            name: item.name,
            type: compareParams.seriesType,
            data: []
          };
          _xAxis.forEach((ax, rowIndex) => {
            if (!table[rowIndex]) {
              table.push({});
            }
            table[rowIndex].datatime = ax;
            let has = item.value.some(tmp => {
              if (ax == compareParams.getLabel(tmp.DATATIME)) {
                let value = tmp.Z_DL_P;
                _series.data.push(value);
                max = value > max ? value : max;
                min = value < min ? value : min;
                table[rowIndex]["eleValue" + index] = value;
                return true;
              }
            });
            if (!has) {
              _series.data.push("-");
            }
          });
          series.push(_series);
        });
        vm.energyTypes = legend;
        let option = creatMutilSeriesChartOption({
          legend: legend,
          xAxis: _xAxis,
          hideTools: true,
          yAxisUnit: valueUnit,
          startZero: compareParams.startZero === true ? true : false,
          min: parseInt(min) == min99999 ? 0 : parseInt(min),
          series: series
        });
        option.legend = Object.assign(legendStyle(), {
          data: option.legend.data
        });
        option.gird = vm.getChartGrid;
        renderEchart(compareParams.rendDomId, option);
        compareParams.rendTable.loadLocalData(table);
      });
    },
    /**
     * 季度电量占比
     */
    queryQuarterEnergyType() {
      let vm = this;
      var params = {};
      if (!vm.dataForm.thisYear) {
        let tmp = this.$refs.quarterEnergyTypeQueryBtn.createOnlyQuarterParams();
        vm.dataForm.thisYear = tmp.thisYear;
      }
      params.urlParams = {
        regionid: vm.dataForm.regionid,
        thisYear: vm.dataForm.thisYear
      };
      params.url = "/energy/compare/monthEnergyType";
      params.rendDomId = "quarterEnergyTypeChart";
      params.rendTable = vm.$refs.quarterEnergyTypeTable;
      params.title = quarterName;
      params.seriesType = "bar";
      params.getQuarterIndex = function(src, quarterIndex) {
        let month = parseInt(src.substring(5, 7));
        if (month >= 1 && month <= 3) {
          return 0;
        } else if (month >= 4 && month <= 6) {
          return 1;
        } else if (month >= 7 && month <= 9) {
          return 2;
        } else if (month >= 10 && month <= 12) {
          return 3;
        }
      };
      this.queryQuarterEnergyTypeAction(params, () => {
        params.rendTable.doLayout();
      });
    },
    /**
     * 年电量占比
     */
    queryYearEnergyType() {
      let vm = this;
      let url = "/energy/compare/yearEnergyType";
      let thisYear = tool.formatDate(new Date(), "yyyy");
      let preCount = 4;
      let preYear = tool.formatDate(
        tool.addYear(new Date(), -1 * preCount),
        "yyyy"
      );
      let xAxis = tool.getIntervalStr("yyyy", preYear, thisYear);
      let urlParams = {
        regionid: vm.dataForm.regionid,
        thisYear: thisYear,
        preCount: preCount
      };
      let tableData = [];
      let series = vm.energyTypes.map((item, index) => {
        return vm.createYearStackBarSeries(item, index, xAxis.length);
      });
      vm.$http.ajaxGet(url, urlParams, res => {
        let data = res.data;
        xAxis.forEach((category, catIndex) => {
          let row = {
            datatime: category
          };
          data[category].forEach(item => {
            series.some((ser, index) => {
              if (ser.name === item.name) {
                ser.data[catIndex] = item.Z_DL_P || "-";
                row["eleValue" + index] = item.Z_DL_P;
                return true;
              }
            });
          });
          tableData.push(row);
        });
        let option = vm.createYearChartOption({
          category: xAxis,
          series: series
        });
        renderEchart("yearEnergyTypeChart", option);
        vm.$refs.yearEnergyTypeTable.loadLocalData(tableData);
      });
    },
    queryQuarterEnergyTypeAction(params, callback) {
      let vm = this;
      let seriesData = [[], [], [], []];
      let legend = [];
      let table = [
        { datatime: quarterName[0] },
        { datatime: quarterName[1] },
        { datatime: quarterName[2] },
        { datatime: quarterName[3] }
      ];
      vm.$http.ajaxGet(params.url, params.urlParams, res => {
        let data = res.data;
        data.forEach(item => {
          let cat = item.name;
          legend.push(cat);
          let dataValues = item.value;
          let quarterCatArray = [
            { name: cat, value: 0 }, // 第1季度
            { name: cat, value: 0 }, // 第2季度
            { name: cat, value: 0 }, // 第3季度
            { name: cat, value: 0 } // 第4季度
          ];
          dataValues.forEach(i => {
            let quarterIndex = params.getQuarterIndex(i.DATATIME);
            quarterCatArray[quarterIndex].value += i.Z_DL_P;
          });
          seriesData[0].push(quarterCatArray[0]);
          seriesData[1].push(quarterCatArray[1]);
          seriesData[2].push(quarterCatArray[2]);
          seriesData[3].push(quarterCatArray[3]);
          vm.energyTypes.some((item, index) => {
            if (cat === item) {
              table[0]["eleValue" + index] = quarterCatArray[0].value.toFixed(
                3
              );
              table[1]["eleValue" + index] = quarterCatArray[1].value.toFixed(
                3
              );
              table[2]["eleValue" + index] = quarterCatArray[2].value.toFixed(
                3
              );
              table[3]["eleValue" + index] = quarterCatArray[3].value.toFixed(
                3
              );
              return true;
            }
          });
        });
        let series = [];
        let titles = [];
        seriesCenter.forEach((item, index) => {
          let seriesTitle = vm.createrPieSeries({
            name: params.title[index],
            center: item,
            data: seriesData[index]
          });
          series.push(seriesTitle.subSeries);
          titles.push(seriesTitle.subTitle);
        });
        var option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: Object.assign(legendStyle(), {
            data: legend
          }),
          title: titles,
          grid: vm.getChartGrid(),
          series: series
        };
        renderEchart(params.rendDomId, option);
        params.rendTable.loadLocalData(table);
        if (callback) {
          callback();
        }
      });
    },
    getChartGrid() {
      return {
        left: "2%",
        right: 150,
        bottom: "3%",
        top: 15,
        containLabel: true
      };
    },
    createrPieSeries(params) {
      let vm = this;
      return {
        subTitle: {
          top: 10,
          text: params.name,
          x: params.center[0],
          textAlign: "center"
        },
        subSeries: {
          name: params.name,
          type: "pie",
          radius: "55%",
          center: params.center,
          data: params.data,
          itemStyle: itemStyle()
        }
      };
    },
    callbackQueryDayCompare(params) {
      if (params.comparenType == "onlyDayBetween") {
        this.dataForm.thisDates = params.thisDates;
        this.queryDayEnergyType();
      } else if (params.comparenType == "onlyYear") {
        this.dataForm.thisYear = params.thisYear;
        this.queryMonthEnergyType();
      } else if (params.comparenType == "onlyQuarter") {
        this.dataForm.thisYear = params.thisYear;
        this.queryQuarterEnergyType();
      }
    },
    createYearStackBarSeries(name, index, dataLength) {
      let vm = this;
      let emptyDatas = [];
      for (let i = 0; i < dataLength; i++) {
        emptyDatas.push("-");
      }
      return {
        name: name,
        type: "bar",
        stack: "总量",
        label: {
          normal: {
            show: true,
            position: "insideRight"
          }
        },
        data: emptyDatas,
        itemStyle: {
          normal: {
            color: function(params) {
              return getColor({ dataIndex: params.seriesIndex });
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      };
    },
    createYearChartOption(params) {
      let vm = this;
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: Object.assign(legendStyle(), {
          data: vm.energyTypes
        }),
        grid: vm.getChartGrid(),
        xAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} " + valueUnit
          }
        },
        yAxis: {
          type: "category",
          data: params.category
        },
        series: params.series
      };
    }
  }
};
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
}
.childChart {
  width: 100%;
  height: 350px;
  margin-bottom: 10px;
  background-color: #f3f3f3;
}
.divChart {
  width: 100%;
  height: 300px;
}
</style>