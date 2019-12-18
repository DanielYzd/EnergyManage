<template>
	<div>
    <div style="display: flex;">
	    <el-card class="box-card" style="width: 30%;min-width: 180px;">
	  		<el-form :model="dataForm" label-width="80px" label-position="left" size="small">
	  			<el-form-item label="门牌号">
		    		<el-input v-model="dataForm.doorplate"  :disabled="true"></el-input>
		  		</el-form-item>
				<el-form-item label="户名">
		    		<el-input v-model="dataForm.hm"  :disabled="true"></el-input>
		  		</el-form-item>
				<el-form-item label="地址">
		    		<el-input v-model="dataForm.address"  :disabled="true"></el-input>
		  		</el-form-item>
				<el-form-item label="手机号码">
		    		<el-input v-model="dataForm.telephone"  :disabled="true"></el-input>
		  		</el-form-item>
				<el-form-item label="账户余额">
		    		<el-input v-model="dataForm.balance"  :disabled="true"></el-input>
		  		</el-form-item>
		  	</el-form>
		</el-card>
		
	<el-card class="box-card" style="flex:1;margin-left: 10px;" id="ppfDetail" >
		</el-card>
    </div>
		
	<hltable v-bind:tburl="tbUrl" v-bind:tbcols="tbCols" ref="dataTable"
			    		 v-bind:tbstyle="tbStyle" v-bind:tbconfig="tbConfig"/>
	</div>		    		 
</template>

<script>
	import {loadLineChart} from '@/utils/myEcharts'
	import hltable from '@/components/hltable'
	import tool from '@/utils/tool'
	export default{
		data(){
			return{
				visible : false,
				dataForm : {
					hm:'',
					doorplate:'',
					telephone:'',
					address : ''
				},
				activeName : 'first',
				tbCols : [{prop:"jssj", label:"结算日期",width:'60'},
							{prop:"syje", label:"剩余金额(元)",width:'60'},
				 			{prop:"jsylEle", label:"用电量(kWh)",width:'50'},
				 			{prop:"jsjeEle", label:"用电费(元)",width:'50'},
				 			{prop:"jsylWat", label:"用水量(m³)",width:'50'},
				 			{prop:"jsjeWat", label:"用水费(元)",width:'50'}
				 			//{prop:"jsylGas", label:"用气量",width:'50'},
				 			//{prop:"jsjeGas", label:"用气费",width:'50'},
				 			//,{prop:"calcdate", label:"计算时间",width:'50'}
				 			],
	        	tbUrl :'/ppf/calc/detail',
	        	tbConfig : {
	        		isShowSelection : false,
	            	isShowRowIndex : true ,
	            	rowButtonType : 0,
            		isShowPage :true
	        	},
	        	tbStyle :{
	        		'margin-top':'10px',
	        		width : "100%"
	        	}
			}
		},
		components:{
			hltable
		},
		mounted () {
	      this.init();
	    },
		methods:{
			init(){
				var customerInfo = this.$route.params
				if(customerInfo && customerInfo.customerid){
					this.dataForm.customerid = customerInfo.customerid;
					this.dataForm.doorplate = customerInfo.doorplate;
					this.dataForm.hm = customerInfo.hm;
					this.dataForm.telephone = customerInfo.telephone;
					this.dataForm.address = customerInfo.address;
					this.dataForm.balance = customerInfo.syje||'0' +' 元';
					
					this.loadCharts(customerInfo.customerid);
					this.$refs.dataTable.loadData({
						customerid :customerInfo.customerid
					});
				}
			},
			loadCharts(customerid){
				var now = new Date()
	    		var startDate = tool.formatDate(tool.addDay(now,-30),'yyyy-MM-dd 00:00:00')
	    		var endDate = tool.formatDate(now,'yyyy-MM-dd 00:00:00')
	    		
	    		var urlEnergyDay = '/ppf/calc/detail'
	    		var param = {
	    			startDate : startDate,
	    			endDate : endDate,
	    			customerid : customerid,
	    			page : 1,
	    			limit : 99999
	    		}
	    		this.$http.ajaxGet(urlEnergyDay,param,(res)=>{
	    			var data0 = [],data1=[],data2=[];
	    			var xAxis = res.page.list.map((item,index)=>{
	    				data0.push(item.jsylEle)
	    				data1.push(item.jsylWat)
	    				//data2.push(item.jsylGas)
	    				return item.jssj
	    			})
	    			loadLineChart({
			        	domId : "ppfDetail",
						title : "用户最近30天能耗曲线",
						xAxis : xAxis,
						data : [data0,data1],
						legend : ['用电量','用水量'],
						titlePostion : 'center',
						meterType : 0
			        })
	    		})
			}
		}
	}
</script>

<style>
</style>