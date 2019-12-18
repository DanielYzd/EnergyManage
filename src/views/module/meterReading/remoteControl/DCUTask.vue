<template>
	<div>
		<div>
			<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
				<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
			    <el-form-item style="float: right;">
			       <el-button @click="getDataList()">查询</el-button>
			       <el-button type="danger" @click="batchSendHandler()">下发</el-button>
        		   <el-button v-if="isAuth('pob:meter:save')" type="primary" @click="addBatchHandle()">批量增加</el-button>
        		   <el-button v-if="isAuth('pob:meter:save')" type="primary" @click="addOrUpdateHandle()">增加任务</el-button>
        		   <el-button v-if="isAuth('pob:meter:save')" type="warning" @click="deleteHandler()">删除任务</el-button>
			    </el-form-item>
		    </el-form>
		</div>
		<div style="display: flex;">
			<div style="width: 250px;margin-right: 10px;min-height: 400px;">
				<hltable v-bind:tburl="rtuUrl" v-bind:tbcols="rtuCols" ref="rtuDataTable" v-bind:tbconfig="rtuConfig" @selections="selectChange"></hltable>
			</div>
			<div style="flex: 1;width: 100%;overflow-x: hidden;min-height: 400px;">
				<hltable v-bind:tburl="url" v-bind:tbcols="cols" ref="dataTable" v-bind:tbconfig="tbconfig" 
					@callHandle="callHandle" @sendHandle="addOrUpdateHandle" @selections="(data)=>{this.dataListSelections = data}"></hltable>
			</div>
		</div>
    	<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @saveCallBack="saveCallBack"></add-or-update>
    	<add-batch v-if="addBatchVisible" ref="addBatch" @saveCallBack="loadRtuTask"></add-batch>
    	<hl-progress v-if="hlProgVisible" ref="hlProg" v-bind:url="remoteUrl" v-on:backfunc="showProgResult"></hl-progress>
	</div>
</template>

<script>
	import hlProgress from '@/components/hl-progress'
  	import regionSelect from '@/views/modules/pob/region-select'
	import AddOrUpdate from './rtuTask-add-or-update'
	import AddBatch from './rtuTask-add-batch'
	import hltable from '@/components/hltable'
	const OPT_CALL = 0;
	const OPT_SEND = 1;
	export default {
		data(){
			return {
				optType : OPT_CALL ,
				remoteUrl : '',
				dataForm : {
					regionid : this.$cookie.get("regionid"),
					regionName : this.$cookie.get("regionName"),
					rtuAddr : null,
          			rtuid : null
				},
				rtuUrl : '/pob/rtu/list',
				rtuCols : [{prop:"commaddress", label:"终端地址",width:"100"}
					,{prop:"curstatusDesc", label:"终端状态",width:"80",tag: true,getColor:function(row){
		      				return row.curstatus === 1 ?'success' : 'warning'
		      			}}],
				rtuConfig : {
		      		isShowSelection : true,
		            isShowRowIndex : false ,
		            pageMode : 1 ,
		            isShowPage :true
		      	},
				url :'/remote/task/detail',
		      	tbconfig:{
		      		isShowSelection : true,
		            isShowRowIndex : true ,
		      		rowButtonType: 2,
		            isShowPage :false
		      	},
		      	cols :[
		      		{prop:"commaddress", label:"终端地址",width:"70"}
		      		,{prop:"typeName", label:"任务类型",width:"70"}
		      		,{prop:"taskid", label:"任务号",width:"60"}
		      		,{prop:"iseffectName", label:"启用标志",width:"70",tag: true,getColor:function(row){
		      			return row.iseffect === 1 ?'success' : 'warning'
		      			}}
		      		,{prop:"disc", label:"任务模板"}
		      		,{prop:"din", label:"数据项数量",width:"85"}
		      		,{prop:"di", label:"模板数据项"}],
		        dataListSelections: [],
        		addOrUpdateVisible: false,
        		addBatchVisible :false ,
	        	hlProgVisible :false
			}
		},
		components:{
			AddOrUpdate,AddBatch,
			hlProgress,
			hltable,
			'region-select-item' : regionSelect
		},
		mounted () {
	      this.getDataList()
	    },
		methods : {
			getDataList(){
				this.btnFlag = -1 
	    		this.loadRtuTask()
	      		this.$refs.rtuDataTable.loadData({
	            	'regionid': this.dataForm.regionid
	          	});
			},
		    getSelectRegion(data){
		       	this.dataForm.regionid = data.id
		       	this.dataForm.regionName = data.label;
				this.dataForm.rtuid = null;
		       	this.getDataList();
		    },
		    addBatchHandle(){
		    	this.addBatchVisible = true
        		this.$nextTick(() => {
          			this.$refs.addBatch.init(this.dataForm.rtuAddr)
        		})
		    },
			addOrUpdateHandle(row){
				this.addOrUpdateVisible = true
        		this.$nextTick(() => {
          			this.$refs.addOrUpdate.init(row,this.dataForm.rtuAddr)
        		})
			},
			deleteHandler(){
				var len = this.dataListSelections.length
				if(len==0){
					this.$message.error("请选择需要删除的任务记录！")
					return ;
				}
				this.$confirm(`确定删除${len}记录?`, '删除提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          dangerouslyUseHTMLString: true,
		          type: 'warning'
		        }).then(() => {
		        	var params = []
		        	this.dataListSelections.forEach(item => {
		        		params.push({
		        			rtuid : item.rtuid,
		        			taskid : item.taskid,
		        			schemeid : item.schemeid
		        		});
		        	})
		        	this.$http.ajaxPost('/remote/task/delete',params,(data)=>{
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
		    callHandle (row) {
		    	var rows = [row]
		    	this.callHandlerAction(rows)
		    },
		    callHandlerAction(rows){
		    	this.hlProgVisible = true;
		    	this.optType = OPT_CALL;
	        	this.remoteUrl = '/remote/task/call'
	          	this.$nextTick(() => {
		          this.$refs.hlProg.sendRequest(rows);
		        })
		    },
		    sendAction(sendParam){
	        	this.hlProgVisible = true;
	        	this.optType = OPT_SEND;
	        	this.remoteUrl = '/remote/task/send'
	          	this.$nextTick(() => {
		          this.$refs.hlProg.sendRequest(sendParam);
		        })
		    },
		    showProgResult(commResult){
		    	var vm = this;
	        	var rtuid = commResult.rtuid
	        	var tableData = this.$refs.dataTable.tableData;
	        	var backResult = commResult.value;
	        	//this.hlProgVisible = false;
	        	if(this.optType === OPT_SEND){
	        		if(commResult.success){
	        			this.$message({
		                	message: '设置成功',
		                	type: 'success',
		                	duration: 1500
		             	})
	        		}else{
	        			this.$message.error('设置失败')
	        		}
	        		return ;
	        	}
	        	backResult.forEach((point,sub)=>{
	        		tableData.some((item,index) => {
		        		if(item.rtuid === rtuid && item.taskid === point.pn){
		        			if(point.value.length < 5){
		        				var tmp = point.value
		        				var row = tableData[index+1]
		        				row.iseffectName = tmp
		        				this.$set(tableData,index+1,row)
		        			}else{
		        				var tmp = JSON.parse(point.value)
			        			tmp.commaddress = item.commaddress 
			        			tmp.taskid = item.taskid
			        			tmp.disc = '召读返回'
			        			tableData.splice(index+1,0,tmp)
		        			}
		        			
		        			return true;
		        		}
		        	})
	        	})
		    },
		    selectChange(value){
		    	var rtuid = null
		    	if(value.length>1){
		    		this.$refs.rtuDataTable.selectRow(value[0],false);
		    		this.$refs.rtuDataTable.selectRow(value[1],true);
		    		this.dataForm.rtuid = value[1].rtuid
		    		this.dataForm.rtuAddr = value[1].commaddress
		    	}else if(value.length == 1 ){
		    		this.dataForm.rtuid = value[0].rtuid
		    		this.dataForm.rtuAddr = value[0].commaddress
		    	}
	    		this.loadRtuTask()
		    },
		    loadRtuTask(){
		    	this.$refs.dataTable.loadData({
	            	'regionid': this.dataForm.regionid||'',
	            	'rtuid' : this.dataForm.rtuid ||''
	          	});
		    },
		    saveCallBack(params){
		    	this.loadRtuTask();
		    	if(params){
		    		var tids = []
		    		tids.push(params[0].tid)
		    		this.sendAction(tids)
		    	}
		    },
		    batchSendHandler(){
	        	var params = []
	        	this.dataListSelections.forEach(item => {
	        		params.push(item.tid);
	        	})
		    	this.sendAction(params)
		    }
		}
	}
</script>

<style>
</style>