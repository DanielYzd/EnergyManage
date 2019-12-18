<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：短信发送记录
-->
<template>
	<div>
		<el-form ref="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
        	<el-form-item label="发送时间">
	    		<el-date-picker v-model="dataForm.fssj" type="daterange"  
	    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
  					start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
	    	</el-form-item>
	    	<el-form-item label="发送状态">
	    		<el-select v-model="dataForm.fszt" placeholder="发送状态" clearable style="width: 220px;">
			      <el-option v-for="item in sendStatusList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    </el-select>
	    	</el-form-item>
	    	<el-form-item label="用户名称">
	    		<el-input v-model="dataForm.hm" placeholder="用户名称" clearable style="width: 220px;"></el-input>
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
		<table style="width: 100%;height: 40px;line-height: 40px; text-align: center;color:#82848A ; border: 1px solid #15a193;margin-bottom: 10px;font-weight: 600;">
			<tr>
				<td>短信总条数 ：{{sum}} 条</td>
				<td style="color: #13CE66;">发送成功条数 ：{{sumOk}} 条</td>
				<td style="color: #DD6161;">发送失败条数 ：{{sumFail}} 条</td>
			</tr>
		</table>
		<div style='height: 300px' id="chart" ></div>
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
					fssj : [tool.formatDate(tool.addDay(new Date(),-15),'yyyy-MM-dd'),tool.formatDate(tool.addDay(new Date(),1),'yyyy-MM-dd')],
					hm :'',
					telephone : '',
					fszt : null
				},
				tburl :'/ppf/sms/list',
		      	tbconfig:{
		      		isShowSelection : false,
		            isShowRowIndex : true ,
		      		rowButtonType: 0,
		            isShowPage :true
		      	},
		      	tbcols :[
		      		{prop:"hm", label:"户名",width:60}
			      	,{prop:"sjh", label:"手机号",width:60}
			      	,{prop:"fssj", label:"发送时间",width:60}
			      	,{prop:"fsnr", label:"发送内容"}
			      	,{prop:"fsztName", label:"发送状态",width:60,tag: true,getColor:function(row){
		      		return row.fszt === 1 ?'success' : 'warning'
		      		}}
			    ],
				sendStatusList : [{value:1,key : '发送成功'},{value:2,key : '发送失败'}],
				contentViewHeight : '',
				isGrid :false,
				sumOk :0,
				sum : 0,
				sumFail : 0
			}
		},
		computed: {
			documentClientHeight: {
		        get () { return this.$store.state.common.documentClientHeight }
		    }
		},
		components:{
			hltable,
			'region-select-item' : regionSelect
		},
		mounted () {
	        var height = this.documentClientHeight - this.$refs.form.$el.offsetHeight - 60 - 160
	        this.contentViewHeight = height +"px"
	      	this.getDataList()
	    },
		methods : {
			getDataList(isGrid){
				this.isGrid = isGrid;
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
		    		fssj : this.dataForm.fssj[0]+" 00:00:00" ,
		    		fssj2 : this.dataForm.fssj[1]+" 00:00:00" ,
		    		hm: this.dataForm.hm || null,
	            	telephone: this.dataForm.telephone || null,
	            	fszt: this.dataForm.fszt
		    	}
		    },
		    loadGridData(){
		    	this.$refs.dataTable.loadData(this.getParams());
		    },
		    loadCharts(){
	    		this.$http.ajaxPost('/ppf/sms/count',this.getParams(),(res)=>{
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
					title : "短信发送情况",
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