<!--
	作者：378357088@qq.com
	时间：2018-10-09
	描述：交易记录
-->
<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion" style="width: 25%;"></region-select-item>
        	<el-form-item label="交易时间" style="width: 25%;">
	    		<el-date-picker v-model="dataForm.datatime" type="daterange"  
	    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
  					start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
				</el-date-picker>
	    	</el-form-item>
	    	<el-form-item label="交易方式" style="width: 25%;">
	    		<el-select v-model="dataForm.czfs" placeholder="交易方式" style="width: 220px;" clearable>
			      <el-option v-for="item in rechargeModeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    </el-select>
	    	</el-form-item>
	    	<el-form-item label="用户名称" style="width: 25%;">
	    		<el-input v-model="dataForm.hm" placeholder="用户名称" style="width: 220px;" clearable></el-input>
	    	</el-form-item>
	    	<el-form-item label="手机号码" style="width: 25%;">
	    		<el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 220px;" clearable></el-input>
	    	</el-form-item>
	    	<el-form-item label="资金流向" style="width: 25%;">
	    		<el-select v-model="dataForm.moneyFlow" placeholder="请选择" style="width: 220px;" clearable>
				    <el-option :key=0 label="流入" :value=0></el-option>
				    <el-option :key=1 label="流出" :value=1></el-option>
				  </el-select>
	    	</el-form-item>
		    <el-form-item style="float: right;width: 200px;">
		       <el-button @click="getDataList()" type="primary">查询</el-button>
		    </el-form-item>
		</el-form>
		<table style="width: 100%;height: 40px;line-height: 40px; text-align: center;color:#82848A ; border: 1px solid #15a193;font-weight: 600;">
			<tr>
				<td>结余金额合计：{{totalMoney}} 元</td>
				<td style="color: #13CE66;">资金流入 ：{{totalIn}} 元</td>
				<td style="color: #DD6161;">资金流出 ：{{totalOut}} 元</td>
			</tr>
		</table>
		<div :style='{height: contentViewHeight}' id="chart" ></div>
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
					datatime : [tool.formatDate(tool.addDay(new Date(),-15),'yyyy-MM-dd'),tool.formatDate(new Date(),'yyyy-MM-dd')],
					hm :'',
					telephone : '',
					czfs : null ,
					moneyFlow : null
				},
				totalMoney : 0,
				totalIn : 0,
				totalOut : 0,
				tburl :'/ppf/recharge/detail',
		      	tbconfig:{
		      		isShowSelection : false,
		            isShowRowIndex : true ,
		      		rowButtonType: 0,
		            isShowPage :true
		      	},
		      	tbcols :[
		      		{prop:"hm", label:"户名",width:180}
			      	,{prop:"telephone", label:"手机号",width:90}
			      	,{prop:"beforeCash", label:"交易前帐号余额"}
			      	,{prop:"czsj", label:"交易时间"}
			      	,{prop:"czje", label:"交易金额"}
			      	,{prop:"afterCash", label:"交易后帐号金额"}
			      	,{prop:"czfsName", label:"交易方式"}
			      	,{prop:"account", label:"操作账号"}
			      	,{prop:"adjustReason", label:"备注"}
			    ],
			    contentViewHeight : '240px',
				rechargeModeList : [{value:0,key : '现金'},{value:3,key : '支付宝'},{value:4,key : '微信'}]
			}
		},
		components:{
			hltable,
			'region-select-item' : regionSelect
		},
		mounted () {
	      this.getDataList()
	    },
		methods : {
			getDataList(){
				this.$refs.dataTable.loadData({
	            	'regionid': this.dataForm.regionid,
	            	'datatime':this.dataForm.datatime[0],
	            	'datatime2':this.dataForm.datatime[1],
	            	'hm': this.dataForm.hm || null,
	            	'telephone': this.dataForm.telephone || null,
	            	'czfs': this.dataForm.czfs,
	            	'moneyFlow' : this.dataForm.moneyFlow || null
	          	},(pageData)=>{
	          		if(pageData.page){
	          			this.totalMoney = pageData.page.extInfo.totalMoney||0;
	          			this.totalIn = pageData.page.extInfo.totalIn||0;
	          			this.totalOut = pageData.page.extInfo.totalOut||0;
	          			this.showCharts(pageData.page.extInfo.sumList)
	          		}
	          	});
			},
		    getSelectRegion(data){
		       	this.dataForm.regionid = data.id
		       	this.dataForm.regionName = data.label;
		       	this.getDataList();
		    },
			showCharts(list){
	    		var data0 = [],data1 = [];
    			var xAxis = list.map((item,index)=>{
    				data0.push(item.in)
    				data1.push(item.out)
    				return item.datatime
    			})
    			let legendData = ['资金流入','资金流出']
    			loadLineChart({
		        	domId : "chart",
					title : "资金流入流出情况曲线",
					xAxis : xAxis,
					data : [data0,data1],
					yAxisUnit : '元',
					legend : legendData ,
					titlePostion : 'center'
		        })
			}
		}
	}
</script>

<style>
</style>