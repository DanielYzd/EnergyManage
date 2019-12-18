<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：告警统计
-->
<template>
	<div>
		<el-form ref="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
        	<el-form-item label="发生时间">
	    		<el-date-picker v-model="dataForm.datatime" type="daterange"  
	    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
  					start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
	    	</el-form-item>
		    <el-form-item style="float: right;">
				<el-button @click="getDataList()" type="primary">查询</el-button>
		    </el-form-item>
		</el-form>
		<div style="width: 100%;height: 300px;" id="chartDate"></div>
		<div style="width: 100%;height: 300px;margin-top: 15px;" id="chartEvtItem"></div>
	</div>
</template>

<script>
  	import regionSelect from '@/views/modules/pob/region-select'
	import hltable from '@/components/hltable'
	import tool from '@/utils/tool'
	import {loadLineChart,loadBarChart} from '@/utils/myEcharts'
	export default {
		data(){
			return {
				dataForm : {
					regionid : this.$cookie.get("regionid"),
					regionName : this.$cookie.get("regionName"),
					datatime : [tool.formatDate(tool.addDay(new Date(),-30),'yyyy-MM-dd'),tool.formatDate(tool.addDay(new Date(),1),'yyyy-MM-dd')],
					hm :'',
					telephone : '',
					status : null,
					eventitemid : null
				},
				statusList : [{value:0,key : '发生'},{value:1,key : '恢复'}],
				eventitemidList : []
			}
		},
		components:{
			'region-select-item' : regionSelect
		},
		mounted () {
			this.getEvtItemList()
			this.getDataList()
	    },
		methods : {
			getEvtItemList(){
		        this.$http.ajaxGet('/event/selectEventItem',{},(res)=>{
		        	this.eventitemidList = res.data;
		        })
			},
			getDataList(){
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
		    		datatime : this.dataForm.datatime[0]+" 00:00:00" ,
		    		datatime2 : this.dataForm.datatime[1]+" 00:00:00" ,
		    		hm: this.dataForm.hm || null,
	            	telephone: this.dataForm.telephone || null,
	            	status: this.dataForm.status ,
	            	eventitemid: this.dataForm.eventitemid
		    	}
		    },
		    loadCharts(){
	    		this.$http.ajaxGet('/event/countRtuEvtByDate',this.getParams(),(res)=>{
	    			this.showCharts(res.list)
	    		})
	    		this.$http.ajaxGet('/event/countRtuEvtByEventId',this.getParams(),(res)=>{
	    			this.showChartEvtItem(res.list)
	    		})
		    },
			showCharts(list){
	    		var data0 = [];
	    		var sum = 0,sumOk =0;
    			var xAxis = list.map((item,index)=>{
    				data0.push(item.num)
    				sum += item.num;
    				return item.datatime
    			})
    			this.sum = sum 
    			this.sumOk  = sumOk 
    			this.sumFail = sum - sumOk
    			loadLineChart({
		        	domId : "chartDate",
					title : "每天异常事件数量情况",
					xAxis : xAxis,
					data : [data0],
					grid :true,
					titlePostion : 'center'
		        })
			},
			showChartEvtItem(list){
	    		var yAxis = [];
    			var xAxis = list.map((item,index)=>{
    				yAxis.push(item.num)
    				return item.evtItemName
    			})
    			loadBarChart({
		        	domId : "chartEvtItem",
					title : "异常事件类型统计情况",
					xAxis : xAxis,
					yAxis : yAxis,
					grid :true,
					titlePostion : 'center'
		        })
			}
		}
	}
</script>

<style>
</style>