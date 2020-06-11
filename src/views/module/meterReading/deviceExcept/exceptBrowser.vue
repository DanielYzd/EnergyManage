<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：告警明细查询
-->
<template>
	<div>
		<el-form ref="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item label="所属单元" v-model="dataForm.regionName" @getRegion="getSelectRegion">
			</region-select-item>
			<el-form-item label="发生时间">
				<el-date-picker v-model="dataForm.datatime" type="daterange" style="width: 220px;"
					value-format="yyyy-MM-dd" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"
					:default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="事件状态">
				<el-select v-model="dataForm.status" placeholder="操作类型" clearable style="width:220px">
					<el-option v-for="item in statusList" :key="item.value" :label="item.key" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="事件类型">
				<el-select v-model="dataForm.eventitemid" placeholder="发送状态" clearable style="width:220px">
					<el-option v-for="item in eventitemidList" :key="item.eventitemid" :label="item.disc"
						:value="item.eventitemid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="用户名称">
				<el-input v-model="dataForm.hm" placeholder="用户名称" clearable style="width:220px"></el-input>
			</el-form-item>
			<el-form-item label="手机号码">
				<el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 220px;" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()" type="primary">查询</el-button>
			</el-form-item>
		</el-form>
		<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols" v-bind:tbconfig="tbconfig" ref="dataTable"></hltable>
	</div>
</template>

<script>
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
export default {
  data() {
    return {
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -15), 'yyyy-MM-dd'),
          tool.formatDate(tool.addDay(new Date(), 1), 'yyyy-MM-dd')
        ],
        hm: '',
        telephone: '',
        status: null,
        eventitemid: null
      },
      tburl: '/event/query/list',
      tbconfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 0,
        isShowPage: true
      },
      tbcols: [
        { prop: 'hm', label: '户名', width: 160 },
        { prop: 'telephone', label: '手机号', width: 90 },
        { prop: 'commaddress', label: '表通信地址', width: 90 },
        { prop: 'eventtime', label: '事件发生时间', width: 120 },
        { prop: 'eventItemName', label: '事件类型', width: 120 },
        { prop: 'statusName', label: '事件状态', width: 90 },
        { prop: 'content', label: '事件内容' }
      ],
      statusList: [
        { value: 0, key: '发生' },
        { value: 1, key: '恢复' }
      ],
      eventitemidList: []
    }
  },
  components: {
    hltable,
    'region-select-item': regionSelect
  },
  mounted() {
    this.getEvtItemList()
    this.getDataList()
  },
  methods: {
    getEvtItemList() {
      this.$http.ajaxGet('/event/selectEventItem', {}, res => {
        this.eventitemidList = res.data
      })
    },
    getDataList(isGrid) {
      this.loadGridData()
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    getParams() {
      return {
        regionid: this.dataForm.regionid,
        datatime: this.dataForm.datatime[0] + ' 00:00:00',
        datatime2: this.dataForm.datatime[1] + ' 00:00:00',
        hm: this.dataForm.hm || null,
        telephone: this.dataForm.telephone || null,
        status: this.dataForm.status,
        eventitemid: this.dataForm.eventitemid
      }
    },
    loadGridData() {
      this.$refs.dataTable.loadData(this.getParams())
    }
  }
}
</script>

<style></style>
