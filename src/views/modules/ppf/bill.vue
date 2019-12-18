<!--
	描述：抄表账单
-->
<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<el-row>
				<el-col :span="8">
					<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
				</el-col>
			    <el-col :span="8">
			    	<el-form-item v-if="dataForm.schemeid === 2 " label="查询时间">
			    		<el-date-picker v-model="dataForm.datatime" type="daterange"  
			    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
		  					start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
						</el-date-picker>
			    	</el-form-item>
			    </el-col>
				<el-col :span="8">
				    <el-form-item label="结算周期">
			    		<el-select v-model="dataForm.schemeid" placeholder="请选择" style="width: 220px;" @change="changeHandler">
						    <el-option :key=2 label="日" :value=2></el-option>
						    <el-option :key=3 label="月" :value=3></el-option>
						  </el-select>
			    	</el-form-item>
			    </el-col>
	    	</el-row>
			<el-row>
				<el-col :span="8">
					<el-date-picker v-if="dataForm.schemeid === 3" v-model="monthDate" type="month" placeholder="选择月份"  style="width: 220px;"
						value-format="yyyy-MM" format="yyyy-MM" size="small" @change="changeHandler"></el-date-picker>
			    </el-col>
			    <el-col :span="8">
			    	<el-form-item label="用户名称">
			    		<el-input v-model="dataForm.hm" placeholder="用户名称" clearable style="width: 220px;"></el-input>
			    	</el-form-item>
			    </el-col>
			    <el-col :span="8">
			    	<el-form-item label="手机号码">
			    		<el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 220px;" clearable></el-input>
			    	</el-form-item>
			    </el-col>
			    <el-col :span="8">
				    <el-form-item >
				       <el-button @click="getDataList()">查询</el-button>
				    </el-form-item>
			    </el-col>
	    	</el-row>
	    </el-form>
	    <div style="width: 100%;height: 400px;">
	    	<table style="width: 100%;text-align: center;border: 1px solid #11C26D;">
	    		<tr height="60">
	    			<td width="200px">logo</td>
	    			<td>国网华立缴费通知单</td>
	    		</tr>
	    	</table>
	    	<table style="width: 100%;text-align: left;padding-left: 20px;">
	    		<tr height="60">
	    			<td width="33%">户名</td>
	    			<td width="33%">联系电话</td>
	    			<td width="33%">用户地址</td>
	    		</tr>
	    	</table>
	    	<table style="width: 100%;text-align: left;padding-left: 20px;">
	    		<tr height="60" style="border: 1px solid #11C26D;">
	    			<td width="33%">户名</td>
	    			<td width="33%">联系电话</td>
	    			<td width="33%">用户地址</td>
	    		</tr>
	    	</table>
	    </div>
	</div>
</template>

<script>
	import hltable from '@/components/hltable'
	import hlDatePicker from '@/components/hl-date-picker'
	import regionSelect from '@/views/modules/pob/region-select'
	import tool from '@/utils/tool'
	export default{
		data(){
			return{
				dataForm :{
					regionid : this.$cookie.get("regionid"),
					regionName : this.$cookie.get("regionName"),
					datatime : [tool.formatDate(tool.addDay(new Date(),-1),'yyyy-MM-dd'),tool.formatDate(tool.addDay(new Date(),1),'yyyy-MM-dd')],
					schemeid : 2
				},
				tbCols : [{prop:"hm", label:"户名",width:'60'},
					{prop:"telephone", label:"手机号",width:40},
					{prop:"jssj", label:"结算日期",width:'60'},
					{prop:"syje", label:"剩余金额(元)",width:'60'},
		 			{prop:"jsylEle", label:"用电量(kWh)",width:'50'},
		 			{prop:"jsjeEle", label:"用电费(元)",width:'50'},
		 			{prop:"jsylWat", label:"用水量(m³)",width:'50'},
		 			{prop:"jsjeWat", label:"用水费(元)",width:'50'},
		 			{prop:"jsylGas", label:"用气量(m³)",width:'50'},
		 			{prop:"jsjeGas", label:"用气费(元)",width:'50'}
		 			//,{prop:"calcdate", label:"计算时间",width:'50'}
		 			],
	        	tbUrl :'/ppf/calc/history',
	        	tbConfig : {
	        		isShowSelection : false,
	            	isShowRowIndex : true ,
	            	rowButtonType : 3,
		            isShowPage :true
	        	},
	        	tbStyle :{
	        		'margin-top':'10px',
	        		width : "100%"
	        	},
	        	monthDate : tool.formatDate(tool.addDay(new Date(),-30),'yyyy-MM') ,
	        	startDate : '',
	        	endDate : ''
			}
		},
		components:{
			hltable,hlDatePicker,
			'region-select-item' : regionSelect
		},
	    computed: {
	      	mainTabs: {
	        	get () { return this.$store.state.common.mainTabs },
	        	set (val) { this.$store.commit('common/updateMainTabs', val) }
	      	}
	    },
		mounted(){
			//this.changeHandler()
			//this.getDataList()
		},
		methods:{
			getDataList(){
				this.$refs.dataTable.loadData({
						regionid :this.dataForm.regionid,
						datatime : this.dataForm.datatime[0],
						datatime2 : this.dataForm.datatime[1],
						hm : this.dataForm.hm,
						telephone : this.dataForm.telephone,
						schemeid : this.dataForm.schemeid
				});
			},
		    getSelectRegion(data){
		       this.dataForm.regionid = data.id
		       this.dataForm.regionName = data.label;
		       this.getDataList();
		    },
		    changeHandler(){
		    	var tmp = [];
		    	if(this.dataForm.schemeid === 3){
		    		tmp[0] = tool.formatDate(new Date(this.monthDate),'yyyy-MM-dd');
		    		tmp[1] = tool.formatDate(new Date(this.monthDate),'yyyy-MM-dd');
		    		this.dataForm.datatime = tmp 
				}
		    },
		    energyDetail(row){
		    	var name = "pointEnergy"
		        var newTabs = this.mainTabs.filter(item => item.name !== name)
		        if (newTabs.length >= 1) {
		          this.mainTabs = newTabs
		        } 
		        this.$router.push({ name: name,params: { customerid : row.customerid ,pointid : row.pointid ,datatime :row.datatime }})
		    }
		}
	}
</script>

<style>
</style>