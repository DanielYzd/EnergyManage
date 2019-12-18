<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
		    <el-form-item>
		        <el-button @click="getDataList()">查询</el-button>
		        <el-button v-if="isAuth('ppf:unitprice:add')" type="primary" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()">新增</el-button>
		    </el-form-item>
    	</el-form>
    	<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols" ref="dataTable" v-bind:tbconfig="tbconfig" 
    		@addOrUpdateHandle="addOrUpdateHandle" @deleteHandle="deleteHandle"
    		@selections="(data)=>{this.dataListSelections = data}"></hltable>
    	<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
  	import AddOrUpdate from './capacityPrice-add-or-update'
	import regionSelect from '@/views/modules/pob/region-select'
	import hltable from '@/components/hltable'
	export default {
    data () {
      return {
        dataForm: {
          	searchWord: '',
          	loopUsedType : null,
          	regionid : '',
			regionName : ''
        },
        tburl : '/dcs/capacity/list',
      	tbconfig:{
            isShowRowIndex : true ,
      		rowButtonType: 1,
      		hasUpdateAuth : this.isAuth('ppf:unitprice:update'),
      		hasDeleteAuth : this.isAuth('ppf:unitprice:delete'),
            isShowPage :false
      	},
      	tbcols :[{prop:"disc", label:"名称",width:140}
      		,{prop:"regionName", label:"应用区域",width:140}
	      	,{prop:"capacityCharge", label:"变压器每月容量费",width:120}
	      	,{prop:"transformerCapacity", label:"变压器容量"}
	      	,{prop:"powerFactor", label:"功率因素"}
	      	,{prop:"dailyWorkingHours", label:"日工作时长"}
	      	,{prop:"monthlyWorkingDays", label:"月工作日数"}
	      	,{prop:"percentage", label:"百分比例"}
	      	,{prop:"univalentCapacity", label:"容量单价"}],
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,hltable,'region-select-item':regionSelect
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      	getDataList () {
      		this.$refs.dataTable.loadData(
      			{'regionid': this.dataForm.regionid}
      		);
      	},
      	addOrUpdateHandle (row) {
       	    this.addOrUpdateVisible = true
        	this.$nextTick(() => {
          		this.$refs.addOrUpdate.init(row ? row.id : null);
        	})
      	},
      	getSelectRegion(data){
			this.dataForm.regionid = data.id
	       	this.dataForm.regionName = data.label;
	       	this.getDataList();
		},
      	deleteHandle (row) {
      		var vm = this;
        	this.$confirm('确定删除?', '删除提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          dangerouslyUseHTMLString: true,
	          type: 'warning'
	        }).then(() => {
	          vm.$http.ajaxGet('/dcs/capacity/delete/'+row.regionId,{},function(res){
	          	vm.$message.success('删除成功')
		        vm.getDataList()
	          },function(res){
	          	vm.$message.error('删除失败')
	          })
	        })
      	}
    }
  }
</script>

<style>
</style>