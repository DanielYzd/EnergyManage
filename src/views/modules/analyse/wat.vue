<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：拉闸合闸记录
-->
<template>
	<div>
		<el-form ref="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"  style="width: 25%;"></region-select-item>
	    	<el-form-item label="统计周期" style="width: 25%;">
	    		<el-select v-model="dataForm.schemeid" placeholder="请选择" style="width: 220px;">
				    <el-option :key=2 label="日" :value=2></el-option>
				    <el-option :key=3 label="月" :value=3></el-option>
				  </el-select>
	    	</el-form-item>
        	<el-form-item label="查询时间" style="width: 25%;">
	    		<el-date-picker v-if="dataForm.schemeid === 2" v-model="dataForm.datatime" type="daterange"  
	    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
  					start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
				<el-date-picker v-if="dataForm.schemeid === 3" v-model="startMonth" type="month" placeholder="开始月份"style="width: 120px;" value-format="yyyy-MM" format="yyyy-MM"></el-date-picker>
				<el-date-picker v-if="dataForm.schemeid === 3" v-model="endMonth" type="month" placeholder="结束月份"style="width: 120px;" value-format="yyyy-MM" format="yyyy-MM"></el-date-picker>
	    	</el-form-item>
		    <el-form-item style="float: right;width: 220px;">
		       <el-button-group>
				  	<el-button @click="getDataList()" type="primary">查询</el-button>
				</el-button-group>
		    </el-form-item>
		</el-form>
		<table style="width: 100%;height: 30px;line-height: 30px; text-align: center;color:#82848A ; border: 1px solid #15a193;margin-bottom: 10px;font-weight: 600;">
			<tr>
				<td>时间段累计 用水量 ：{{sum}} 万m³</td>
				<td style="color: #13CE66;">平均每{{schemeName}} 用水量：{{avg}} 万m³</td>
				<td style="color: #DD6161;">{{maxDatatime}}{{schemeName}} 用水量最大：{{max}} 万m³</td>
			</tr>
		</table>
		<div style='width:100%;height:300px;' id="chart" ></div>
		<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols"  v-bind:tbconfig="tbconfig" ref="dataTable"></hltable>
		<el-row :gutter="20">
		  	<el-col :span="12">
		  		<div class="gridTitle"><span style="color: #FFD700">用户累计用水量最大前15名</span></div>
		  		<hltable v-bind:tburl="maxminUrl" v-bind:tbcols="maxminCols"  v-bind:tbconfig="maxminConfig" ref="maxDataTable" @dataDetail="energyDetail"></hltable>
		  	</el-col>
		  	<el-col :span="12">
		  		<div class="gridTitle"><span style="color: #00FFFF;">用户累计用水量最小前15名</span></div>
		  		<hltable v-bind:tburl="maxminUrl" v-bind:tbcols="maxminCols"  v-bind:tbconfig="maxminConfig" ref="minDataTable" @dataDetail="energyDetail"></hltable>
		  	</el-col>
		</el-row>
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
					datatime : [tool.formatDate(tool.addDay(new Date(),-30),'yyyy-MM-dd'),tool.formatDate(new Date(),'yyyy-MM-dd')],
					isDoPage : true,
					schemeid : 2
				},
				startMonth : tool.formatDate(tool.addDay(new Date(),-30*12),'yyyy-MM'),
				endMonth : tool.formatDate(tool.addDay(new Date(),1),'yyyy-MM'),
				tburl :'/data/stat/selectTypeEnergyDay',
		      	tbconfig:{
		      		isShowSelection : false,
		            isShowRowIndex : true ,
		      		rowButtonType: 0,
		            isShowPage :true
		      	},
		      	tbcols :[
		      		{prop:"regionName", label:"区域名称",width:220}
			      	,{prop:"datatime", label:"时间",width:140}
			      	,{prop:"watValue", label:"水量 (万m³)"}
			    ],
			    maxminUrl : '/data/stat/selectCustomerMaxMinEnergy',
			    maxminCols :[
			    	{prop:"hm", label:"户名",width:220}
			      	,{prop:"telephone", label:"手机号",width:90}
			      	,{prop:"energyVal", label:"水量(m³)"}
			    ],
			    maxminConfig:{
		      		isShowSelection : false,
		            isShowRowIndex : true ,
		      		rowButtonType: 3,
		            isShowPage :false
		      	},
				sum : 0,
				avg : 0,
				max : 0,
				maxDatatime : ''
			}
		},
		components:{
			hltable,
			'region-select-item' : regionSelect
		},
		computed: {
		   	schemeName(){
		   		if(this.dataForm.schemeid === 2){
		   			return '日'
		   		}else{
		   			return '月'
		   		}
		   	},
		   	chartTitle(){
		   		return this.dataForm.datatime[0] + '至' + this.dataForm.datatime[1] + '每'+ this.schemeName + '用水量曲线'
		   	}
		},
		mounted () {
	      	this.getDataList()
	    },
		methods : {
			getDataList(isGrid){
				this.loadGridData()
				this.loadCharts()
			},
		    getSelectRegion(data){
		       	this.dataForm.regionid = data.id
		       	this.dataForm.regionName = data.label;
		       	this.getDataList();
		    },
		    changeScheme(){
		    	if(this.dataForm.schemeid === 3){
		    		this.dataForm.datatime[0] = this.startMonth+"-01"
		    		this.dataForm.datatime[1] = this.endMonth+"-01"
		    	}
		    },
		    getParams(){
		    	this.changeScheme()
		    	return {
		    		regionid: this.dataForm.regionid,
		    		startDate : this.dataForm.datatime[0]+" 00:00:00" ,
		    		endDate : this.dataForm.datatime[1]+" 00:00:00" ,
	            	schemeid: this.dataForm.schemeid,
	            	isDoPage : this.dataForm.isDoPage ,
	            	type : 1 
		    	}
		    },
		    loadGridData(){
		    	this.dataForm.isDoPage = true
		    	var params = this.getParams();
		    	this.$refs.dataTable.loadData(params);
		    	params.maxMinFlag = "max"
		    	this.$refs.maxDataTable.loadData(params);
		    	params.maxMinFlag = "min"
		    	this.$refs.minDataTable.loadData(params);
		    },
		    loadCharts(){
		    	this.dataForm.isDoPage = false
	    		this.$http.ajaxGet('/data/stat/selectTypeEnergyDay',this.getParams(),(res)=>{
	    			this.showCharts(res.page.list)
	    		})
		    },
			showCharts(list){
	    		var data0 = [];
	    		var sum = 0,max =0,maxDatatime = null;
	    		var count = 0 ;
    			var xAxis = list.map((item,index)=>{
    				let val = item.watValue;
    				data0.push(val)
    				if(val && val >0){
    					sum += val;
    					count++
	    				if(val > max){
	    					max = val
	    					maxDatatime = item.datatime
	    				}
    				}
    				return item.datatime
    			})
    			this.sum = sum.toFixed(3) 
    			this.max  = max 
    			this.avg = count==0 ? 0: (sum / count).toFixed(3)
    			this.maxDatatime = maxDatatime
    			loadLineChart({
		        	domId : "chart",
					title : this.chartTitle,
					xAxis : xAxis,
					data : [data0],
					yAxisUnit : ['用水量 ( 万 m³ )'],
					titlePostion : 'center',
					meterType : 1
		        })
			},
		    energyDetail(row){
		    	var name = "pointEnergy"
		        var newTabs = this.mainTabs.filter(item => item.name !== name)
		        if (newTabs.length >= 1) {
		          this.mainTabs = newTabs
		        } 
		        this.$router.push({ name: name,params: { customerid : row.customerid ,pointid : null ,datatime :this.dataForm.datatime[0] }})
		    }
		}
	}
</script>

<style>
	.gridTitle{
		display: block;
		width: 100%;
		height: 30px;
		background-color: #4e72b8;
		line-height: 30px;
		text-align: center;
		color: white; 
		font-weight: bold;
	}
</style>