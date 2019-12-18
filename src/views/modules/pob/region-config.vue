<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
		    <el-form-item>
		        <el-button @click="getDataList()" type="primary">刷新</el-button>
		        <el-button v-if="isAuth('pob:region:save')" type="primary" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()">新增配置</el-button>
		    </el-form-item>
    	</el-form>
    	<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols" ref="dataTable" v-bind:tbconfig="tbconfig" 
    		@addOrUpdateHandle="addOrUpdateHandle" @deleteHandle="deleteHandle"
    		@selections="(data)=>{this.dataListSelections = data}"></hltable>
    	<region-config-one v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></region-config-one>
	</div>
</template>

<script>
	import regionSelect from '@/views/modules/pob/region-select'
	import hltable from '@/components/hltable'
	import regionConfigOne from './region-config-one'
	export default {
    data () {
      return {
        dataForm: {
          	searchWord: '',
          	loopUsedType : null,
          	regionid : this.$cookie.get("regionid"),
			regionName : this.$cookie.get("regionName")
        },
        tburl :'/pob/region/regionConfig/list',
      	tbconfig:{
      		isShowSelection : true,
            isShowRowIndex : true ,
      		rowButtonType: 1,
      		hasUpdateAuth : this.isAuth('pob:region:save'),
      		hasDeleteAuth : this.isAuth('pob:region:delete'),
            isShowPage :false
      	},
      	tbcols :[{prop:"regionName", label:"应用区域(包含子区域)",width:140}
	      	,{prop:"circleName", label:"结算周期",width:120}
	      	,{prop:"updateDate", label:"最后修改时间"}
	      	,{prop:"createDate", label:"创建时间"}],
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      hltable,'region-select-item':regionSelect,'region-config-one':regionConfigOne
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      	getDataList () {
      		this.$refs.dataTable.loadData({
            	'regionid': this.dataForm.regionid
          	});
      	},
      	addOrUpdateHandle (row) {
      		var vm = this
        	this.addOrUpdateVisible = true
        	this.$nextTick(() => {
          		this.$refs.addOrUpdate.init(row?row.id:null)
        	})
      	},
      	getSelectRegion(data){
			this.dataForm.regionid = data.id
	       	this.dataForm.regionName = data.label;
	       	this.getDataList();
		},
      	deleteHandle (row) {
      		var vm = this
        	var ids = row ? [row.id] : this.dataListSelections.map(item => {
          		return item.id
        	})
        	var len = ids.length;
        	this.$confirm(`确定${len == 1 ? '删除' : '批量删除'} ${len}条记录?`, '删除提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          dangerouslyUseHTMLString: true,
	          type: 'warning'
	        }).then(() => {
	          vm.$http.ajaxPost('/pob/region/config/delete',ids,function(res){
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