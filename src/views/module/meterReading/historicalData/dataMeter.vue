<!--
	描述：用户抄表
-->
<template>
  <div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
      <region-select-item label="所属单元" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
      <el-form-item label="能源类型">
        <el-select v-model="dataForm.type" placeholder="请选择能源类型" style="width:80px;">
          <!--multiple-->
          <el-option v-for="item in meterTypeList" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计周期">
        <el-select v-model="dataForm.schemeid" placeholder="请选择统计周期" style="width: 115px;">
          <el-option :key="1" label="小时" :value="1"></el-option>
          <el-option :key="2" label="日" :value="2"></el-option>
          <el-option :key="3" label="月" :value="3"></el-option>
          <el-option :key="4" label="自定义时段" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <hl-date-picker v-if="dataForm.schemeid === 1 || dataForm.schemeid === 2" v-model="dataForm.datatime">
      </hl-date-picker>
      <el-time-select v-if="dataForm.schemeid === 1" v-model="dataForm.time" style="width: 115px;" size="small"
        :picker-options="{
          start: '00:00',
          step: '01:00',
          end: '23:00'
        }" placeholder="选择时刻">
      </el-time-select>
      <el-date-picker v-if="dataForm.schemeid === 3" v-model="dataForm.datatime" type="month" placeholder="选择月份"
        style="width: 130px;" value-format="yyyy-MM" format="yyyy-MM" size="small">
      </el-date-picker>
      <el-date-picker v-model="dataForm.dates" type="daterange" v-if="dataForm.schemeid === 4" style="width: 220px;"
        value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" start-placeholder="开始日期" end-placeholder="结束日期"
        :default-time="['00:00:00', '00:00:00']">
      </el-date-picker>

      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="text" @click="searchmore()">高级筛选</el-button>
      </el-form-item>
      <br />
      <transition name="el-fade-in-linear">
        <div v-show="searchVisible">
          <el-form-item>
            <el-select v-model="dataForm.dataFilterType" placeholder="请选择" style="width: 115px;">
              <el-option :key="0" label="全部显示" :value="0"></el-option>
              <el-option :key="1" label="只显示有数" :value="1"></el-option>
              <el-option :key="2" label="只显示缺数" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input v-model="dataForm.hm" placeholder="用户名称" clearable style="width:160px"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 160px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="表通信地址">
            <el-input v-model="dataForm.commaddress" placeholder="表通信地址" clearable></el-input>
          </el-form-item>
        </div>
      </transition>
    </el-form>
    <hltable v-bind:tburl="tbUrl" v-bind:tbcols="tbCols" ref="dataTable" v-bind:tbconfig="tbConfig"
      @dataDetail="energyDetail" />
  </div>
</template>

<script>
import regionSelect from '@/views/modules/pob/region-select'
import hlDatePicker from '@/components/hl-date-picker'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
export default {
  data() {
    return {
      tbConfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 3,
        isShowPage: true
      },
      searchVisible:false,
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataForm: {
        datatime: tool.formatDate(tool.addDay(new Date(), -1), 'yyyy-MM-dd'),
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        type: 0,
        time: '00:00',
        schemeid: 2,
        dataFilterType: 1,
        dates: [
          tool.formatDate(tool.addDay(new Date(), -15), 'yyyy-MM-dd'),
          tool.formatDate(tool.addDay(new Date(), 1), 'yyyy-MM-dd')
        ],
        hm: '',
        telephone: '',
        commaddress: ''
      }
    }
  },
  components: {
    hlDatePicker,
    hltable,
    'region-select-item': regionSelect
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
    tbUrl() {
      if (this.dataForm.schemeid === 4) {
        return '/data/readMetering/selectCustomerEnergyTimes'
      } else {
        return '/data/readMetering/list'
      }
    },
    energyUnit() {
      if (this.dataForm.type === 0 || this.dataForm.type === 3) {
        return '用量(kWh)'
      } else {
        return '用量(m³)'
      }
    },
    tbCols() {
      let cols = [
        // { prop: 'regionName', label: '所属区域', 'min-width': '120' },
        { prop: 'disc', label: '表计名称', width: '60' },
        { prop: 'commaddress', label: '表通信地址', width: '110' },
        { prop: 'hm', label: '户名', 'min-width': '120' },
        // { prop: 'datatimestr', label: '时间', width: '90' },
        { prop: 'datatime', label: '时间', width: '100' },
        { prop: 'startBm', label: '起始读数', width: '80' },
        { prop: 'endBm', label: '结束读数', width: '80' }
      ]
      if (this.dataForm.schemeid === 4) {
        cols.splice(5, 1)
      } else {
        cols.splice(4, 1)
      }
      if (this.dataForm.type == 1 || this.dataForm.type === 2) {
        cols.push({ prop: 'userEnergy', label: this.energyUnit, width: '80' })
      } else {
        cols = cols.concat([
          { prop: 'rate', label: '倍率', width: '80' },
          { prop: 'userEnergy', label: this.energyUnit, width: '80' }
        ])
      }
      return cols
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    searchmore(){
      this.searchVisible =!this.searchVisible
    },
    getDataList() {
      let queryDate = this.dataForm.datatime
      if (this.dataForm.schemeid === 1) {
        queryDate += ' ' + this.dataForm.time + ':00'
      } else if (this.dataForm.schemeid === 2) {
        queryDate += ' 00:00:00'
      } else if (this.dataForm.schemeid === 3) {
        queryDate = queryDate.substr(0, 7) + '-01 00:00:00'
      }
      var params = {
        regionid: this.dataForm.regionid,
        datatime: queryDate,
        schemeid: this.dataForm.schemeid,
        type: this.dataForm.type,
        hm: this.dataForm.hm,
        telephone: this.dataForm.telephone,
        commaddress: this.dataForm.commaddress,
        dataFilterType: this.dataForm.dataFilterType
      }
      if (this.dataForm.schemeid === 4) {
        params.datatime = this.dataForm.dates[0]
        params.datatime2 = this.dataForm.dates[1]
      }
      this.$refs.dataTable.loadData(params)
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    energyDetail(row) {
      var name = 'pointEnergy'
      var newTabs = this.mainTabs.filter(item => item.name !== name)
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs
      }
      this.$router.push({
        name: name,
        params: {
          customerid: row.customerid,
          pointid: row.pointid,
          datatime: row.datatime,
          schemeid: this.dataForm.schemeid
        }
      })
    }
  }
}
</script>

<style></style>
