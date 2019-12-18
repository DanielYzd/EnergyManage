<template>
	<div>
		<div>
			<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
				<region-select  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select>
			    <el-form-item label="设备类型">
		      		<el-select v-model="type" clearable  placeholder="请选择" style="width: 230px" @change="colsTypeChange">
				    	<el-option v-for="item in meterTypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
					</el-select>
		      	</el-form-item>
			    <el-form-item style="float: right;">
			       <el-button @click="getDataList()">查询</el-button>
			    </el-form-item>
		    </el-form>
		</div>
		<div style="display: flex;">
			<div style="width: 280px;margin-right: 10px;min-height: 400px;">
				<hltable v-bind:tburl="rtuUrl" v-bind:tbcols="rtuCols" ref="rtuDataTable" v-bind:tbconfig="rtuConfig" @selections="selectChange"></hltable>
			</div>
			<div style="flex: 1;width: 100%;overflow-x: hidden;min-height: 400px;">
				<hltable v-bind:tburl="url" v-bind:tbcols="cols" ref="dataTable" v-bind:tbconfig="tbconfig"
    				@selections="(data)=>{this.dataListSelections = data}"></hltable>
			</div>
		</div>
    	<smart-home-ctrl-opt v-if="optDetailVisible" ref="optDetail" @sendAction="sendAction"></smart-home-ctrl-opt>
    	<hl-progress v-if="hlProgVisible" ref="hlProg" v-bind:url="remoteUrl" v-on:backfunc="showProgResult"></hl-progress>
	</div>
</template>

<script>
	import smartHomeCtrlOpt from './smart-home-ctrl-opt'
	import hlProgress from '@/components/hl-progress'
  	import regionSelect from '@/views/modules/pob/region-select'
	import hltable from '@/components/hltable'
	export default {
		data(){
			return {
				meterTypeList : [{key : '开关控制',value : 4},{key : '空调控制',value : 5}],
				loading : false,
				rtuLoading: false,
		        pageIndex: 1,
		        pageSize: 10,
		        totalPage: 0,
				regionList :null,
				fn : '0A10',
				remoteUrl : '',
				dataForm : {
					regionid : this.$cookie.get("regionid"),
					regionName : this.$cookie.get("regionName"),
					macSource : '',
					rtuAddr : null,
          			rtuid : null
				},
				rtuUrl : '/pob/rtu/list',
				rtuCols : [{prop:"commaddress", label:"终端地址",width:"140"}
					,{prop:"curstatusDesc", label:"终端状态",width:"70",tag: true,getColor:function(row){
		      				return row.curstatus === 1 ?'success' : 'warning'
		      		}
				}],
				rtuConfig : {
		      		isShowSelection : true,
		            isShowRowIndex : false ,
		            pageMode : 1 ,
		            isShowPage :true
		      	},
				url :'/remote/smartHome/swtichList',
		      	tbconfig:{
		      		isShowSelection : true,
		            isShowRowIndex : true ,
		      		rowButtonType: 4,
		      		buttons : this.getOptBtns(),
		            isShowPage :true
		      	},
		        isAllCols : 1 ,
		        type : 4,
        		rtuList : [],
        		flag : null,
		        isShowMoreConditions : true ,
		        dataListSelections: [],
        		optDetailVisible: false,
	        	hlProgVisible :false
			}
		},
		components:{
			smartHomeCtrlOpt,
			hlProgress,
			hltable,regionSelect
		},
		mounted () {
	      this.getDataList()
	    },
	    computed:{
	    	cols(){
	    		if(this.type === 4){
		    		return [
		      		{prop:"pointName", label:"面板开关名称",width:"150"}
		      		,{prop:"commaddress", label:"MAC地址",width:"150"}
		      		,{prop:"macSource", label:"网关MAC",width:"150"}
		      		,{prop:"loopMark", label:"回路标识",width:"90"}
		      		,{prop:"statusName", label:"回路状态",width:"100"}
		      		,{prop:"statusChangeDate", label:"状态变更时间",width:"100"}]
	    		}else if(this.type === 5){
	    			return [
			      		{prop:"pointName", label:"空调开关名称",width:"150"}
			      		,{prop:"commaddress", label:"MAC地址",width:"150"}
			      		,{prop:"gateChangeDate", label:"状态变更时间",width:"100"}]
	    		}
	    	}
	    },
		methods : {
			getDataList(){
				this.loading = true
				this.btnFlag = -1 
	      		this.loadRtuGrid()
	      		this.loadMeterGrid()
			},
			loadRtuGrid(){
				this.$refs.rtuDataTable.loadData({
	            	'regionid': this.dataForm.regionid,
	            	'type' : 6 //智能家居网关
	          	});
			},
			loadMeterGrid(){
				this.$refs.dataTable.loadData({
	            	'regionid': this.dataForm.regionid,
	            	'rtuid': this.dataForm.rtuid,
	            	'macSource' : this.dataForm.macSource,
		            'type': this.type
	          	});
			},
			getOptBtns(){
				return [{
		      			label : '控制',
		      			handler : (row,refTable) => {
		      				var _this = refTable.multipleTable.$parent.$parent
		      				_this.handlerDetail(row)
		      			}
		      		}]
			},
			handlerDetail(row){
        		this.optDetailVisible = true
        		this.$nextTick(() => {
          			this.$refs.optDetail.init({
						pointid :row.pointid,
						pointName :row.pointName,
						type : this.type,
						loopMark : row.loopMark,
						commaddress : row.commaddress ,
						macSource : row.macSource ,
						pointName : row.pointName 
					})
        		})
			},
		    getSelectRegion(data){
		       	this.dataForm.regionid = data.id
		       	this.dataForm.regionName = data.label;
				this.dataForm.rtuid = null;
		       	this.getDataList();
		    },
		    colsTypeChange(value){
		       this.loadMeterGrid();
		    },
		    rtuTypeChange(value){
		    	this.rtuList.some(item=>{
		    		if(item.value === value){
		    			this.dataForm.rtuAddr = item.commaddress
		    			return true;
		    		}
		    	})
		    	this.getDataList();
		    },
		    showProgResult(commResult){
		    	var vm = this;
	        	var rtuid = commResult.rtuid
	        	var tableData = this.$refs.dataTable.tableData;
	        	var backResult = commResult.value;
	        	backResult.forEach((point,sub)=>{
	        		tableData.some((item,index) => {
		        		if(item.rtuid === rtuid && item.numberid === point.numberid){
		        			this.copyPointProperty(item,point)
		        			this.$set(tableData, index, item);
		        			return true;
		        		}
		        	})
	        	})
		    },
		    selectChange(value){
		    	let macSource = null 
		    	if(value.length>1){
		    		this.$refs.rtuDataTable.selectRow(value[0],false);
		    		this.$refs.rtuDataTable.selectRow(value[1],true);
		    		macSource = value[1].commaddress
		    	}else if(value.length == 1 ){
		    		macSource = value[0].commaddress
		    	}
		    	this.dataForm.macSource = macSource
	    		this.loadMeterGrid()
		    },
		    sendAction(params){
		    	this.hlProgVisible = true;
		    	var urlParams = this.$utils.queryParams(params)
		    	if(params.type === 4){
		    		this.remoteUrl = '/remote/smartHome/sendSwitchBoard?'+ urlParams
		    	}else{
		    		this.remoteUrl = '/remote/smartHome/sendAirBoard?'+ urlParams
		    	}
	          	this.$nextTick(() => {
		          this.$refs.hlProg.sendRequest(params);
		        })
		    }
		}
	}
</script>

<style>
</style>