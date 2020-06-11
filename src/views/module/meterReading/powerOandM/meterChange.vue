<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：换表记录
-->
<template>
	<div>
		<el-form ref="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small"
			label-width="90px">
			<region-select-item label="所属单元" v-model="dataForm.regionName" @getRegion="getSelectRegion">
			</region-select-item>
			<el-form-item label="操作时间">
				<el-date-picker v-model="dataForm.datatime" type="daterange" style="width: 220px;"
					value-format="yyyy-MM-dd" format="yyyy-MM-dd" :default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="表类型">
				<el-select v-model="dataForm.type" placeholder="请选择" style="width:220px;" @change="getDataList()">
					<el-option v-for="item in meterTypeList" :key="item.value" :label="item.key" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="表通信地址">
				<el-input v-model="dataForm.commaddress" placeholder="表通信地址" clearable style="width: 220px;"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()" type="primary">查询</el-button>
				
			</el-form-item>
		</el-form>
		<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols" v-bind:tbconfig="tbconfig" ref="dataTable">
				<template slot="toolbar">
					<el-button size="mini" @click="changeOptHandler()" type="primary">换表</el-button>
				</template>
		</hltable>
		<meter-change-opt v-if="optVisible" ref="changeOpt" @refreshDataList="getDataList"></meter-change-opt>
	</div>
</template>

<script>
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
import meterChangeOpt from './meterChange-opt'
export default {
  data() {
    return {
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -30), 'yyyy-MM-dd'),
          tool.formatDate(tool.addDay(new Date(), 1), 'yyyy-MM-dd')
        ],
        hm: '',
        telephone: '',
        type: 0
      },
      tburl: '/app/meterChange/list',
      tbconfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 0,
        isShowPage: true
      },
      optVisible: false
    }
  },
  computed: {
    tbcols() {
      //if(this.dataForm.type === 0){
      return [
        { prop: 'regionName', label: '所属区域', width: 100 },
        //,{prop:"hm", label:"户名",width:100}
        //,{prop:"telephone", label:"手机号",width:100}
        //,{prop:"operateTypeName", label:"操作类型",width:80}
        { prop: 'pointName', label: '表计名称' },
        { prop: 'oldMetercode', label: '旧表通信地址' },
        { prop: 'newMetercode', label: '新表通信地址' },
        // ,{prop:"zyzbm", label:"正有总读数"}
        // ,{prop:"zyjbm", label:"正有尖读数"}
        // ,{prop:"zyfbm", label:"正有峰读数"}
        // ,{prop:"zypbm", label:"正有平读数"}
        // ,{prop:"zygbm", label:"正有谷读数"}
        // ,{prop:"fyzbm", label:"反有总读数"}
        // ,{prop:"fyjbm", label:"反有尖读数"}
        // ,{prop:"fyfbm", label:"反有峰读数"}
        // ,{prop:"fypbm", label:"反有平读数"}
        // ,{prop:"fygbm", label:"反有谷表码"}
        { prop: 'inputTime', label: '操作时间', width: 140 },
        { prop: 'account', label: '操作账号' }
      ]
      // }else {
      // 	return [{prop:"hm", label:"户名",width:100}
      //   	,{prop:"telephone", label:"手机号",width:100}
      //   	,{prop:"operateTime", label:"操作时间",width:140}
      //   	,{prop:"operateTypeName", label:"操作类型",width:80}
      //   	,{prop:"metercode", label:"表通信地址"}
      //   	,{prop:"flowV", label:"读数"}
      //   	,{prop:"account", label:"操作账号"}
      // 	]
      // }
    }
  },
  components: {
    hltable,
    meterChangeOpt,
    'region-select-item': regionSelect
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.loadGridData()
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    getParams() {
      return {
        regionid: this.dataForm.regionid || '',
        datatime: this.dataForm.datatime[0] + ' 00:00:00',
        datatime2: this.dataForm.datatime[1] + ' 00:00:00',
        hm: this.dataForm.hm || null,
        telephone: this.dataForm.telephone || null,
        type: this.dataForm.type
      }
    },
    loadGridData() {
      this.$refs.dataTable.loadData(this.getParams())
    },
    changeOptHandler() {
      this.optVisible = true
      this.$nextTick(() => {
        this.$refs.changeOpt.init()
      })
    }
  }
}
</script>

<style></style>
