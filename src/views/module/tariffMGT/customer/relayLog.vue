<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：拉闸合闸记录
-->
<template>
	<div>
		<el-form ref="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
        	<el-form-item label="操作时间">
	    		<el-date-picker v-model="dataForm.operateDate" type="daterange"  
	    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
  					start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
	    	</el-form-item>
	    	<el-form-item label="操作类型">
	    		<el-select v-model="dataForm.operateType" placeholder="操作类型" clearable style="width:220px">
			      <el-option v-for="item in optTypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    </el-select>
	    	</el-form-item>
	    	<el-form-item label="操作结果">
	    		<el-select v-model="dataForm.operateResult" placeholder="发送状态" clearable style="width:220px">
			      <el-option v-for="item in optStatusList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    </el-select>
	    	</el-form-item>
	    	<el-form-item label="操作途径">
	    		<el-select v-model="dataForm.optChannel" placeholder="操作途径" clearable style="width:220px">
			      <el-option v-for="item in optChannelList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    </el-select>
	    	</el-form-item>
	    	<el-form-item label="用户名称">
	    		<el-input v-model="dataForm.hm" placeholder="用户名称" clearable style="width:220px"></el-input>
	    	</el-form-item>
	    	<el-form-item label="手机号码">
	    		<el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 220px;" clearable></el-input>
	    	</el-form-item>
		    <el-form-item style="float: right;">
		       <el-button-group>
				  	<el-button @click="getDataList()" type="primary">查询</el-button>
				</el-button-group>
		    </el-form-item>
		</el-form>
		<table style="width: 100%;height: 30px;line-height: 30px; text-align: center;color:#82848A ; border: 1px solid #15a193;margin-bottom: 10px;font-weight: 600;">
			<tr>
				<td>操作总次数 ：{{sum}} 次</td>
				<td style="color: #13CE66;">执行成功次数 ：{{sumOk}} 次</td>
				<td style="color: #DD6161;">执行失败次数 ：{{sumFail}} 次</td>
			</tr>
		</table>
		<div  style='height: 300px' id="chart" ></div>
		<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols"  v-bind:tbconfig="tbconfig" ref="dataTable"></hltable>
	</div>
</template>

<script>
  	import regionSelect from '@/views/modules/pob/region-select'
	import hltable from '@/components/hltable'
	import tool from '@/utils/tool'
	import {loadLineChart} from '@/utils/myEcharts'
	export default {
		data(){
			return {
				dataForm : {
					regionid : this.$cookie.get("regionid"),
					regionName : this.$cookie.get("regionName"),
					operateDate : [tool.formatDate(tool.addDay(new Date(),-15),'yyyy-MM-dd'),tool.formatDate(tool.addDay(new Date(),1),'yyyy-MM-dd')],
					hm :'',
					telephone : '',
					operateType : null,
					operateResult : null,
					optChannel : null
				},
				tburl :'/ppf/switchOpt/list',
		      	tbconfig:{
		      		isShowSelection : false,
		            isShowRowIndex : true ,
		      		//ajaxMethod : 'ajaxPost',
		      		rowButtonType: 0,
		            isShowPage :true
		      	},
		      	tbcols :[
		      		{prop:"hm", label:"户名",width:220}
			      	,{prop:"telephone", label:"手机号",width:90}
			      	,{prop:"commaddress", label:"表通信地址"}
			      	,{prop:"operateAccount", label:"操作方式及帐号"}
			      	,{prop:"operateDate", label:"操作时间",width:140}
			      	,{prop:"operateTypeName", label:"命令类型"}
			      	,{prop:"operateResultName", label:"操作结果"}
			      	,{prop:"failReason", label:"失败原因"}
			      	,{prop:"sendMsg", label:"发送报文"}
			      	,{prop:"acceptMsg", label:"返回报文"}
			    ],
				optStatusList : [{value:1,key : '操作成功'},{value:2,key : '操作失败'}],
				optTypeList : [{value:0,key : '合闸命令'},{value:1,key : '拉闸命令'}],
				optChannelList : [{value:1,key : 'web手动'},{value:2,key : '微信充值自动'},{value:3,key : '定时自动'}],
				sum : 0 ,
				sumOk : 0 ,
				sumFail : 0
			}
		},
		components:{
			hltable,
			'region-select-item' : regionSelect
		},
		computed: {
			documentClientHeight(){
		        return this.$store.state.common.documentClientHeight
		    }
		},
		mounted () {
//			var height = this.documentClientHeight - this.$refs.form.$el.offsetHeight - 60 - 160
//			if(height<240){
//				height = 240
//			}
//	        this.contentViewHeight = height +"px"
	      	this.getDataList()
	    },
		methods : {
			getDataList(){
				this.loadGridData()
				this.loadCharts()
			},
		    getSelectRegion(data){
		       	this.dataForm.regionid = data.id
		       	this.dataForm.regionName = data.label;
		       	this.getDataList();
		    },
		    getParams(){
		    	return {
		    		regionid: this.dataForm.regionid,
		    		operateDate : this.dataForm.operateDate[0]+" 00:00:00" ,
		    		operateDate2 : this.dataForm.operateDate[1]+" 00:00:00" ,
		    		hm: this.dataForm.hm || null,
	            	telephone: this.dataForm.telephone || null,
	            	operateType: this.dataForm.operateType ,
	            	operateResult: this.dataForm.operateResult,
	            	optChannel: this.dataForm.optChannel
		    	}
		    },
		    loadGridData(){
		    	this.$refs.dataTable.loadData(this.getParams());
		    },
		    loadCharts(){
	    		this.$http.ajaxPost('/ppf/switchOpt/count',this.getParams(),(res)=>{
	    			this.showCharts(res.data)
	    		})
		    },
			showCharts(list){
	    		var data0 = [];
	    		var sum = 0,sumOk =0;
    			var xAxis = list.map((item,index)=>{
    				data0.push(item.numOk)
    				sum += item.num;
    				sumOk += item.numOk
    				return item.datatime
    			})
    			this.sum = sum 
    			this.sumOk  = sumOk 
    			this.sumFail = sum - sumOk
    			loadLineChart({
		        	domId : "chart",
					title : "拉闸合闸情况",
					xAxis : xAxis,
					data : [data0],
					titlePostion : 'center'
		        })
			}
		}
	}
</script>

<style>
</style>