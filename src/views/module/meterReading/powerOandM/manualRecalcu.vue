<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item label="所属单元" v-model="dataForm.regionName" @getRegion="getSelectRegion">
			</region-select-item>
			<el-form-item label="用户名称">
				<el-input v-model="dataForm.hm" placeholder="用户名称" clearable style="width:220px"></el-input>
			</el-form-item>
			<el-form-item label="手机号码">
				<el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 220px;" clearable></el-input>
			</el-form-item>
			<el-form-item label="表通信地址">
				<el-input v-model="dataForm.commaddress" placeholder="表通信地址" style="width: 220px;" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>

				
			</el-form-item>
		</el-form>
		<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols" ref="dataTable" v-bind:tbconfig="tbconfig" @selections="
        data => {
          this.dataListSelections = data
        }
      ">
			<template slot="toolbar">
				<el-button size="mini" v-if="isAuth('pob:meter:save')" type="primary" @click="addOrUpdateHandle()">重算
				</el-button>
				<el-button size="mini" v-if="isAuth('pob:meter:save')" type="primary" @click="testSchedulerTask()">
					触发定时任务
				</el-button>
			</template>
		</hltable>
		<calc-add v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></calc-add>
	</div>
</template>

<script>
import calcAdd from './calc-add'
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
export default {
  data() {
    return {
      dataForm: {
        hm: '',
        telephone: null,
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        commaddress: ''
      },
      tburl: '/pob/meter/selectMeterLeft',
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 4,
        isShowPage: true,
        buttons: [
          {
            label: '重算',
            handler: (row, refTable) => {
              var _this = refTable.multipleTable.$parent.$parent
              _this.openCalcDialog([row])
            }
          }
        ]
      },
      tbcols: [
        // { prop: 'pointid', label: '表计编码', width: 70 },
        { prop: 'disc', label: '表名', width: 220 },
        { prop: 'commaddress', label: '表通信地址', width: 120 },
        { prop: 'typeName', label: '表类型' },
        { prop: 'customerid', label: '用户编码', width: 70 },
        { prop: 'hm', label: '户名' },
        { prop: 'telephone', label: '手机号' },
        // { prop: 'regionName', label: '所属区域' }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      batchAddVisible: false
    }
  },
  components: {
    calcAdd,
    hltable,
    'region-select-item': regionSelect
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        hm: this.dataForm.hm,
        telephone: this.dataForm.telephone,
        regionid: this.dataForm.regionid,
        commaddress: this.dataForm.commaddress
      })
    },
    addOrUpdateHandle() {
      if (this.dataListSelections.length === 0) {
        this.$message.info('请先选择表计')
        return
      }
      this.openCalcDialog(this.dataListSelections)
    },
    openCalcDialog(rows) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(rows)
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    testSchedulerTask() {
      this.$http.ajaxGet('/sys/calc/testSchedulerTask', {}, res => {
        this.$message.success('定时任务执行成功，请稍后重新查询数据!')
      })
    }
  }
}
</script>

<style></style>
