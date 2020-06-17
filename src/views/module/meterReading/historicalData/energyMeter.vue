<!--
	作者：378357088@qq.com
	时间：2018-12-28
	描述：查询所有计量点电量，并提供电量录入、excel导入
-->
<template>
  <div>
    <el-form :inline="true" :model="queryForm" @keyup.enter.native="getDataList()" size="small" labelWidth="90px">
      <region-select-item label="所属单元" v-model="queryForm.regionName" @getRegion="getSelectRegion"></region-select-item>

      <el-form-item label="统计周期">
        <el-select v-model="queryForm.schemeid" placeholder="请选择" class="formItem">
          <el-option :key="1" label="小时" :value="1"></el-option>
          <el-option :key="2" label="日" :value="2"></el-option>
          <el-option :key="3" label="月" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="能源类型">
        <el-select v-model="queryForm.type" placeholder="请选择" class="formItem" @change="getDataList()">
          <el-option v-for="item in meterTypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="getDataList()" icon="el-icon-search">查询</el-button>
        <el-button type="text" @click="searchVisible=!searchVisible">高级筛选</el-button>
      </el-form-item>
      <br />
      <el-collapse-transition>
        <div v-show="searchVisible">
          <el-form-item label="数据时间">
            <div style="display: inline-block;">
              <el-date-picker v-if="queryForm.schemeid === 1" v-model="queryForm.datatime" type="date"
                placeholder="选择日期与时间" style="width: 140px;" size="small"></el-date-picker>
              <el-time-select v-if="queryForm.schemeid === 1" style="width: 100px;" v-model="queryForm.time"
                :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="选择时间"></el-time-select>
            </div>
            <el-date-picker v-if="queryForm.schemeid === 2" v-model="queryForm.datatime" type="date" placeholder="选择日期"
              style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small"></el-date-picker>
            <el-date-picker v-if="queryForm.schemeid === 3" v-model="queryForm.monthDate" type="month"
              placeholder="选择月份" style="width: 220px;" value-format="yyyy-MM" format="yyyy-MM" size="small">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="计量标志">
            <el-select v-model="queryForm.loopUsedType" clearable placeholder="计量标志" class="formItem"
              @change="getDataList">
              <el-option v-for="item in loopUsedTypeList" :key="item.value" :label="item.key" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表通信地址">
            <el-input v-model="queryForm.commaddress" placeholder="表通信地址" class="formItem" clearable></el-input>
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
    <hltable v-bind:tburl="url" v-bind:tbcols="cols" ref="dataTable" v-bind:tbconfig="tbconfig"></hltable>
  </div>
</template>

<script>
import hlDatePicker from '@/components/hl-date-picker'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
import regionSelect from '@/views/modules/pob/region-select'
import globals from '@/utils/globals'
export default {
  data() {
    return {
      inputAddVisible: false,
      meterList: [],
       searchVisible:false,
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataTypeList: [
        { key: '自动采集', value: 0 },
        { key: '手动录入', value: 2 }
      ],
      queryForm: {
        dataattribute: '',
        commaddress: '',
        hm: '',
        loopUsedType: '',
        type: 0,
        monthDate: tool.formatDate(tool.addDay(new Date(), -1), 'yyyy-MM'),
        datatime: tool.formatDate(tool.addDay(new Date(), -1), 'yyyy-MM-dd'),
        time: '00:00',
        schemeid: 2,
        regionName: this.$cookie.get('regionName'),
        regionid: this.$cookie.get('regionid')
      },
      loopUsedTypeList: globals.loopUsedTypeList,
      url: '/data/pointsEnergy/list'
    }
  },
  components: {
    hlDatePicker,
    'region-select-item': regionSelect,
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
    tbconfig() {
      let isHas = this.isAuth('runmain:input:add')
      let buttons = [
        {
          label: '用能曲线',
          handler: (row, refTable) => {
            var _this = refTable.multipleTable.$parent.$parent
            _this.energyDetail(row)
          }
        }
      ]
      // if(isHas){
      // 	buttons.push({
      // 		label : '用能录入',
      // 		handler : (row,refTable) => {
      // 			var _this = refTable.multipleTable.$parent.$parent
      // 			_this.inputHandler(row)
      // 		}
      // 	})
      // }
      return {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 4,
        btnWidth: 120,
        buttons: buttons,
        isShowPage: true
      }
    },
    cols() {
      let cols = [
        // { prop: 'regionName', label: '所属区域' },
        { prop: 'pointName', label: '表计名称' },
        { prop: 'commaddress', label: '表通信地址', width: 120 }
        //,{prop:"loopUsedTypeName", label:"计量回路标志",width:80}
      ]
      if (this.queryForm.type == 0) {
        cols = cols.concat([
          { prop: 'rate', label: '倍率', width: 60 },
          { prop: 'zDlp', label: '电量总(kWh)' },
          { prop: 'jDlp', label: '电量尖(kWh)' },
          { prop: 'fDlp', label: '电量峰(kWh)' },
          { prop: 'pDlp', label: '电量平(kWh)' },
          { prop: 'gDlp', label: '电量谷(kWh)' }
        ])
      } else if (this.queryForm.type == 1 || this.queryForm.type === 2) {
        cols.push({ prop: 'flowV', label: '流量(m³)', width: '80' })
      } else {
        cols = cols.concat([{ prop: 'hotV', label: '热量(kWh)', width: '80' }])
      }
      return cols
    },
    queryDatatime() {
      let queryDate = null
      let schemeid = this.queryForm.schemeid
      if (schemeid === 1) {
        queryDate = this.queryForm.datatime + ' ' + this.queryForm.time + ':00'
      } else if (schemeid === 2) {
        queryDate = this.queryForm.datatime + ' 00:00:00'
      } else if (schemeid === 3) {
        queryDate = this.queryForm.monthDate + '-01 00:00:00'
      }
      return queryDate
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        commaddress: this.queryForm.commaddress,
        hm: this.queryForm.hm,
        loopUsedType: this.queryForm.loopUsedType,
        type: this.queryForm.type,
        datatime: this.queryDatatime,
        schemeid: this.queryForm.schemeid,
        regionid: this.queryForm.regionid,
        dataattribute: this.queryForm.dataattribute
      })
    },
    getSelectRegion(data) {
      this.queryForm.regionid = data.id
      this.queryForm.regionName = data.label
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
          datatime: this.queryDatatime,
          schemeid: this.queryForm.schemeid
        }
      })
    },
    inputHandler(row) {
      var name = 'inputAdd2'
      var newTabs = this.mainTabs.filter(item => item.name !== name)
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs
      }
      this.$router.push({
        name: name,
        params: {
          customerid: row.customerid,
          pointid: row.pointid,
          datatime: this.queryDatatime,
          schemeid: this.queryForm.schemeid
        }
      })
    }
  }
}
</script>

<style>
.formItem {
  width: 220px;
}
</style>
