<template>
	<div>
		<div class="tableTitle">
    		<span>采集方案定义</span>
  		</div>
		<hltable v-bind:tburl="tbUrl" v-bind:tbcols="tbCols" ref="dataTable" v-bind:tbconfig="tbConfig" @selections="selectChange"/>
		<div class="tableTitle">
    		<span>采集方案明细</span>
    		<el-button style="float: right; padding-right: 10px;" type="text" @click="addOrUpdateHandle()">新增</el-button>
  		</div>
		<hltable v-bind:tburl="detailUrl" v-bind:tbcols="detailCols" ref="detailTable" v-bind:tbconfig="detailConfig"
			@addOrUpdateHandle="addOrUpdateHandle" @deleteHandle="deleteHandle"/>
    	<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import hltable from '@/components/hltable'
	import AddOrUpdate from './readScheme-add-or-update'
	export default{
		components:{
			AddOrUpdate,hltable
		},
		data(){
			return{
				addOrUpdateVisible : false ,
	        	tbUrl :'/hes/collectscheme/list',
		      	tbConfig:{
		      		isShowSelection : true,
		            isShowRowIndex : true ,
		      		rowButtonType: 0,
		            isShowPage :false
		      	},
		      	tbCols :[
		      		{prop:"schemedesc", label:"方案描述",width:220}
		      		,{prop:"protocolName", label:"规约名称",width:200}
			      	,{prop:"starttime", label:"启用时间",width:90}],
	        	detailUrl :'/hes/collectschemeDetail/list',
		      	detailConfig:{
		      		isShowSelection : true,
		            isShowRowIndex : true ,
		      		rowButtonType: 1,
		            isShowPage :false
		      	},
		      	detailCols :[
		      		{prop:"datatypeName", label:"数据类型"}
		      		,{prop:"collectcyctypeName", label:"采集周期",width:200}
			      	,{prop:"collectcyc", label:"采集周期间隔",width:160}
			      	,{prop:"maxcollectcyc", label:"最大周期间隔",width:160}
			      	,{prop:"collectreftime", label:"采集参考时间",width:160}
			      	]
			}
		},
		mounted(){
			this.getDataList()
		},
		methods : {
			getDataList(){
				this.$refs.dataTable.loadData();
				this.$refs.detailTable.loadData({
					schemeid : 1
				});
			},
			addOrUpdateHandle(row){
				this.addOrUpdateVisible = true
        		this.$nextTick(() => {
          			this.$refs.addOrUpdate.init(row)
        		})
			},
			deleteHandle (row) {
				this.$confirm('确定删除记录?', '删除提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          dangerouslyUseHTMLString: true,
		          type: 'warning'
		        }).then(() => {
		        	let params = {
		        		schemeid : row.schemeid ,
		        		datatype :row.datatype
		        	}
		        	this.$http.ajaxGet('/hes/schemeDetail/delete',params,(data)=>{
			              	this.$message({
			                  message: '删除成功',
			                  type: 'success',
			                  duration: 1500,
			                  onClose: () => {
			                    this.getDataList()
			                  }
			               	})
		              	},(msg)=>{
		        			this.$message.error(msg)
		        		}
		        	)
		        })
			},
		    selectChange(value){
		    	var schemeid = null
		    	if(value.length>1){
		    		this.$refs.dataTable.selectRow(value[0],false);
		    		this.$refs.dataTable.selectRow(value[1],true);
		    		schemeid = value[1].schemeid
		    	}else{
		    		schemeid = value[0].schemeid
		    	}
	    		this.$refs.detailTable.loadData({
	            	schemeid : schemeid
	          	});
		    }
		}
	}
</script>

<style>
	.tableTitle{
		height: 40px;
		line-height: 40px;
		padding-left: 10px;
		font-weight: 600;
		color: #909399;
	}
</style>