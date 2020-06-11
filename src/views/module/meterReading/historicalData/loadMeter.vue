<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
    >
      <region-select-item
        label="所属单元"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
      ></region-select-item>
      <hl-date-picker
        label="查询时间"
        v-model="dataForm.datatime"
      ></hl-date-picker>
      <el-time-select
        v-model="dataForm.time"
        style="width: 110px;"
        size="small"
        :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '23:45'
        }"
        placeholder="选择时刻"
      >
      </el-time-select>
      <el-form-item label="表通信地址">
        <el-input
          v-model="dataForm.commaddress"
          placeholder="表通信地址"
          class="formItem"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tbUrl"
      v-bind:tbcols="tbCols"
      ref="dataTable"
      v-bind:tbstyle="tbStyle"
      v-bind:tbconfig="tbConfig"
      @dataDetail="dataDetail"
    />
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
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataForm: {
        datatime: tool.formatDate(new Date(), 'yyyy-MM-dd'),
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        time: '00:00'
      },
      tbCols: [
        { prop: 'pointName', label: '表计名称', width: '70' },
        { prop: 'commaddress', label: '表通信地址', width: '90' },
        { prop: 'hm', label: '户名', 'min-width': '120' },
        { prop: 'datatime', label: '时间', width: '90' },
        {
          prop: 'startBm',
          label: '电压',
          children: [
            { prop: 'ua', label: 'A相', width: '50' },
            { prop: 'ub', label: 'B相', width: '50' },
            { prop: 'uc', label: 'C相', width: '50' }
          ]
        },
        {
          prop: 'startBm',
          label: '电流',
          children: [
            { prop: 'ia', label: 'A相', width: '50' },
            { prop: 'ib', label: 'B相', width: '50' },
            { prop: 'ic', label: 'C相', width: '50' }
          ]
        },
        { prop: 'p', label: '总有功功率', width: '80' },
        { prop: 'q', label: '总无功功率', width: '80' },
        { prop: 'pf', label: '总功率因数', width: '80' }
      ],
      tbUrl: '/data/load/list',
      tbConfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 3,
        isShowPage: true
      },
      tbStyle: {
        'margin-top': '10px',
        width: '100%'
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
    queryDate() {
      return this.dataForm.datatime + ' ' + this.dataForm.time + ':00 '
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        datatime: this.queryDate,
        commaddress: this.dataForm.commaddress,
        regionid: this.dataForm.regionid
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    dataDetail(row) {
      var name = 'pointLoad'
      var newTabs = this.mainTabs.filter(item => item.name !== name)
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs
      }
      this.$router.push({
        name: name,
        params: {
          customerid: row.customerid,
          pointid: row.pointid,
          datatime: row.datatime
        }
      })
    }
  }
}
</script>

<style></style>
