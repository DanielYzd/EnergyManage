<template>
	<div>
		<el-form :inline="true" label-width="80px" label-position="left" size="small">
			<el-form-item label="所有表计">
				<el-select v-model="dataForm.selectedPointid" style="width: 130px;">
					<el-option @change="pointChange(meter.pointid, meter.type)" v-for="(meter, index) in meterList"
						:value="meter.pointid" :key="meter.index" :label="meter.disc"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="查询时间">
				<el-date-picker v-model="dataForm.datatime" @change="onPick" type="daterange" style="width: 230px;"
					value-format="yyyy-MM-dd" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"
					:default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-radio-group v-model="dataForm.chartType" @change="loadCharts">
					<el-radio v-for="(item, index) in chartList" :key="index" :label="index">{{ item }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button style="margin-left: 20px;" type="primary" @click="loadData()">刷新</el-button>
				<el-button style="margin-left: 20px;" type="primary" @click="queryBmData()">查看电量</el-button>
			</el-form-item>
		</el-form>
		<el-card class="box-card" style="height: 300px;margin-bottom: 10px;">
			<div style="display: flex;width: 100%;height: 270px;">
				<div id="pointLoad" style="flex:1;width: 100%;height: 300px;
					margin: -15px !important;"></div>
				<div style="margin-left: 10px;width: 310px;">
					<el-form label-width="140px">
						<el-form-item label="最大功率发生时间">
							<el-input v-model="max.maxPDate" disabled></el-input>
						</el-form-item>
						<el-form-item label="最大功率">
							<el-input v-model="max.maxP" disabled></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-card>
		<hltable v-bind:tburl="tbUrl" v-bind:tbcols="tbCols" ref="dataTable" v-bind:tbstyle="tbStyle"
			v-bind:tbconfig="tbConfig" />
	</div>
</template>

<script>
import { loadLineChart } from '@/utils/myEcharts'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
export default {
  data() {
    return {
      visible: false,
      chartList: ['功率', '电压', '电流', '功率因数'],
      dataForm: {
        hm: '',
        doorplate: '',
        telephone: '',
        address: '',
        selectedPointid: 0,
        selectedPointType: 0,
        schemeid: 2,
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -15), 'yyyy-MM-dd'),
          tool.formatDate(new Date(), 'yyyy-MM-dd')
        ],
        chartType: 0
      },
      meterList: [],
      tbCols: [
        { prop: 'datatime', label: '时间', width: '100' },
        { prop: 'ua', label: 'A相电压', width: '50' },
        { prop: 'ub', label: 'B相电压', width: '50' },
        { prop: 'uc', label: 'C相电压', width: '50' },
        { prop: 'ia', label: 'A相电流', width: '50' },
        { prop: 'ib', label: 'B相电流', width: '50' },
        { prop: 'ic', label: 'C相电流', width: '50' },
        { prop: 'p', label: '总有功功率', width: '80' },
        { prop: 'q', label: '总无功功率', width: '80' },
        { prop: 'pf', label: '总功率因数', width: '80' }
      ],
      tbUrl: '/data/load/pointlist',
      tbConfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 0,
        isShowPage: true
      },
      tbStyle: {
        //'margin-top':'10px',
        width: '100%'
        /*'height':'360px'
	        		,'overflow-y': 'scroll'*/
      },
      max: {
        maxP: '',
        maxPDate: ''
      }
    }
  },
  components: {
    hltable
  },
  computed: {
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    colName() {
      let type = this.dataForm.selectedPointType
      if (type === 0) return '电'
      if (type === 1) return '水'
      if (type === 2) return '气'
    },
    endDate() {
      return tool.formatDate(
        tool.addMonth(this.dataForm.datatime, 1),
        'yyyy-MM-dd'
      )
    }
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      var params = this.$route.params
      if (!params.customerid && !params.pointid) {
        //this.$router.push({ name: "home"})
        return
      }
      this.meterList = []
      this.dataForm.customerid = params.customerid
      this.dataForm.selectedPointid = params.pointid
        ? parseInt(params.pointid)
        : null
      this.dataForm.selectedPointid = parseInt(params.pointid)
      if (params.datatime) {
        var tmpDate = new Date(params.datatime)
        this.dataForm.datatime = [
          tool.formatDate(tmpDate, 'yyyy-MM-dd 00:00:00'),
          tool.formatDate(tool.addDay(tmpDate, 1), 'yyyy-MM-dd 00:00:00')
        ]
      }
      if (params.customerid) {
        this.queryType = 0
        this.loadCustomerInfo()
      } else if (params.pointid) {
        this.queryType = 1
        this.loadMeterInfo()
      }
    },
    loadMeterInfo() {
      this.$http.ajaxGet(
        `/pob/meter/info/${this.dataForm.selectedPointid}`,
        {},
        res => {
          this.meterList = [res.meter]
          this.loadData()
        }
      )
    },
    loadCustomerInfo() {
      this.$http.ajaxGet(
        `/pob/customer/info/${this.dataForm.customerid}`,
        {},
        res => {
          var customerInfo = res.customer
          if (customerInfo) {
            this.dataForm.customerid = customerInfo.customerid
            this.dataForm.doorplate = customerInfo.doorplate
            this.dataForm.hm = customerInfo.disc
            this.dataForm.telephone = customerInfo.telephone
            this.dataForm.address = customerInfo.address
            this.meterList = customerInfo.eleMeters
            this.dataForm.selectedPointType = 0
            this.loadData()
          }
        }
      )
    },
    loadData() {
      var intervalDays = tool.getIntervalDays(
        new Date(this.dataForm.datatime[0]),
        new Date(this.dataForm.datatime[1])
      )
      if (intervalDays > 60) {
        this.$message.error('查询时间间隔不能超过60天')
        return
      }
      this.loadCharts(0)
      this.$refs.dataTable.loadData({
        pointid: this.dataForm.selectedPointid,
        datatime: this.dataForm.datatime[0],
        datatime2: this.dataForm.datatime[1],
        type: 0,
        isDoPage: true
      })
    },
    loadCharts(chartType) {
      var param = {
        pointid: this.dataForm.selectedPointid,
        datatime: this.dataForm.datatime[0],
        datatime2: this.dataForm.datatime[1],
        type: 0,
        isDoPage: false
      }
      this.$http.ajaxGet(this.tbUrl, param, res => {
        this.max.maxP = res.page.maxP + ' kW'
        this.max.maxPDate = res.page.maxPDate
        let data0 = [],
          data1 = [],
          data2 = []
        let legendData = ['有功功率', '无功功率'],
          yAxisUnit = '单位 : 千瓦(kW)'
        if (chartType === 1) {
          legendData = ['A相电压', 'B相电压', 'C相电压']
          yAxisUnit = '单位 : V'
        } else if (chartType === 2) {
          legendData = ['A相电流', 'B相电流', 'C相电流']
          yAxisUnit = '单位 : A'
        } else if (chartType === 3) {
          legendData = ['总功率因数']
          yAxisUnit = null
        }
        var list = res.page.list
        var xAxis = list.map((item, index) => {
          if (chartType === 0) {
            data0.push(item.p)
            data1.push(item.q)
          } else if (chartType === 1) {
            data0.push(item.ua)
            data1.push(item.ub)
            data2.push(item.uc)
          } else if (chartType === 2) {
            data0.push(item.ia)
            data1.push(item.ib)
            data2.push(item.ic)
          } else if (chartType === 3) {
            data0.push(item.pf)
          }
          return item.datatimeStr
        })
        let data = []
        if (data0.length > 0) {
          data.push(data0)
        }
        if (data1.length > 0) {
          data.push(data1)
        }
        if (data2.length > 0) {
          data.push(data2)
        }
        loadLineChart({
          domId: 'pointLoad',
          xAxis: xAxis,
          data: data,
          isArea: false,
          grid: true,
          yAxisUnit: yAxisUnit,
          title:
            this.dataForm.hm + this.chartList[this.dataForm.chartType] + '曲线',
          titlePostion: 'center',
          legend: legendData,
          meterType: 3
        })
      })
    },
    onPick(value) {
      if (!value || value.length == 0) return
      this.loadData()
    },
    pointChange(pointid, type) {
      this.params.pointid = pointid
      this.params.type = type
      this.dataForm.selectedPointType = type
      this.loadData()
    },
    queryBmData() {
      var name = 'pointEnergy'
      var newTabs = this.mainTabs.filter(item => item.name !== name)
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs
      }
      this.$router.push({
        name: name,
        params: {
          customerid: this.dataForm.customerid,
          pointid: this.dataForm.selectedPointid,
          datatime: this.dataForm.datatime[0],
          schemeid: 2
        }
      })
    }
  }
}
</script>

<style></style>
