<!--
	作者：378357088@qq.com
	时间：2018-12-28
	描述：单个计量点电量及曲线
-->
<template>
	<div>
    <div style="display: flex;">
	    <el-card class="box-card" style="width: 35%;min-width: 200px;">
	  		<el-form ref="form" :model="dataForm" label-width="95px" size="mini" :inline="true">
	  			<template v-if="queryType === 0">
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
					<el-form-item label="所有表计">
			    		<el-radio-group v-model="dataForm.selectedPointid">
		          			<el-radio  @change="pointChange(meter.pointid,meter.type)" style="display: inline-flex;margin-top: 10px;margin-left: 30px;" v-for="(meter, index) in meterList" :label="meter.pointid" :key="index">{{ meter.disc }}</el-radio>
		        		</el-radio-group>
		        	</el-form-item>
	        	</template>
	        	<template v-if="queryType === 1">
	        		<el-form-item :label="item.label" :prop="item.prop" v-for="(item,index) in meterInfo" :key="index">
		      			<el-input v-model="item[item.prop]" style="width:120px;" disabled></el-input>
	    			</el-form-item>
	        	</template>
	        	<el-form-item label="查询时间">
		    		<el-date-picker v-model="dataForm.datatime" type="daterange"
      					start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd 00:00:00" format="yyyy-MM-dd 00:00:00" :default-time="['00:00:00', '00:00:00']">
    				</el-date-picker>
		    	</el-form-item>
	    		<el-form-item label="查询方案" style="display: inline-block;">
	    			<el-select v-model="dataForm.schemeid" placeholder="请选择" style="width: 100px;">
		    			<el-option :key=1 label="小时" :value=1></el-option>
					    <el-option :key=2 label="日" :value=2></el-option>
					    <el-option :key=3 label="月" :value=3></el-option>
				  	</el-select>
				  	<el-button style="margin-left: 20px;" type="primary" @click="loadData()">刷新</el-button>
				  	<el-button style="margin-left: 20px;" type="warning" @click="querySslData()">查看负荷</el-button>
	    		</el-form-item>		
		  	</el-form>
		</el-card>
		<el-card class="box-card" style="flex:1;margin-left: 10px;" id="pointEnergy" >
		</el-card>
    </div>
	<hltable v-bind:tburl="tbUrl" v-bind:tbcols="tbCols" ref="dataTable" style="margin-top: 10px;"
		v-bind:tbconfig="tbConfig"/>
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
				queryType : 0 ,
          		meterInfo : [],
				dataForm : {
					hm:'',
					doorplate:'',
					telephone:'',
					address : '',
					selectedPointid : 0,
					selectedPointType : 0,
					schemeid : 2 ,
          			datatime : [tool.formatDate(tool.addDay(new Date(),-7),'yyyy-MM-dd'),
          				tool.formatDate(new Date(),'yyyy-MM-dd')]
				},
				meterList : [],
				tbCols : [],
	        	tbUrl :'/data/readMetering/list',
	        	contentViewHeight : '300px',
	        	tbConfig : {
	        		isShowSelection : false,
	            	isShowRowIndex : true ,
	            	rowButtonType : 0,
	            	isShowPage :true
	        	}
			}
		},
		components:{
			hltable
		},
		computed:{
			mainTabs: {
	        	get () { return this.$store.state.common.mainTabs },
	        	set (val) { this.$store.commit('common/updateMainTabs', val) }
	      	},
			colName(){
				let type = this.dataForm.selectedPointType;
				if(type === 0) return "电";
				if(type === 1) return "水";
				if(type === 2) return "气";
				if(type === 3) return "热";
			},
			documentClientHeight: {
		        get () { return this.$store.state.common.documentClientHeight }
		    }
		},
		activated () {
	      this.init();
	    },
		methods:{
			init(){
				var height = this.documentClientHeight - this.$refs.form.$el.offsetHeight  - 160 -50
	        	this.contentViewHeight = height +"px"
	        	
				var params = this.$route.params
				if(!params.customerid && !params.pointid ){
					return;
				}
				this.dataForm.meterList = []
				this.dataForm.customerid = params.customerid;
				this.dataForm.selectedPointid = params.pointid ? parseInt(params.pointid) : null
				if(params.datatime){
					var tmpDate = new Date(params.datatime)
					this.dataForm.datatime  = [tool.formatDate(tool.addDay(tmpDate,-15),'yyyy-MM-dd 00:00:00')
					,tool.formatDate(tool.addDay(tmpDate,1),'yyyy-MM-dd 00:00:00')]
					this.dataForm.schemeid = params.schemeid
				}
				if(params.customerid){
					this.queryType = 0
					this.loadCustomerInfo();
				}else if(params.pointid){
					this.queryType = 1
					this.loadMeterInfo();
				}
			},
			loadCustomerInfo(){
				this.$http.ajaxGet(`/pob/customer/info/${this.dataForm.customerid}`,{},(res)=>{
	    			var customerInfo = res.customer;
	    			if(customerInfo){
						this.dataForm.customerid = customerInfo.customerid;
						this.dataForm.doorplate = customerInfo.doorplate;
						this.dataForm.hm = customerInfo.disc;
						this.dataForm.telephone = customerInfo.telephone;
						this.dataForm.address = customerInfo.address;
						var tmp = customerInfo.eleMeters.concat(customerInfo.watMeters).concat(customerInfo.gasMeters).concat(customerInfo.hotMeters)
						this.meterList = tmp
						if( !this.dataForm.selectedPointid ){
							this.dataForm.selectedPointid = this.meterList[0].pointid
						}
						this.meterList.some(item =>{
							if(item.pointid === this.dataForm.selectedPointid){
								this.dataForm.selectedPointType = item.type
								return true;
							}
						})
						this.loadData()
					}
	    		})
			},
			loadMeterInfo(){
				this.$http.ajaxGet(`/pob/meter/info/${this.dataForm.selectedPointid}`,{},(res)=>{
					var meter = res.meter
					var infos = [{label:'所属区域',prop:'regionName',regionName:meter.regionName},
						{label:'表计名称',prop:'disc',disc:meter.disc},{label:'表通信地址',prop:'commaddress',commaddress:meter.commaddress},
		        		{label:'表计类型',prop:'typeName',typeName:meter.typeName},{label:'CT',prop:'ctName',ctName:meter.ctName},
		        		{label:'PT',prop:'ptName',ptName: meter.ptName},{label:'安装位置',prop:'instLocation',instLocation : meter.instLocation},
		        		{label:'计量回路',prop:'loopUsedTypeName',loopUsedTypeName:meter.loopUsedTypeName},
		        		{label:'计量区域',prop:'mesureLocalIdStr',mesureLocalIdStr:meter.mesureLocalIdStr}
					]
	    			this.meterInfo = infos
					this.loadData()
	    		})
			},
			loadData(){
				let params = {
							pointid :this.dataForm.selectedPointid ,
							schemeid:this.dataForm.schemeid,
							datatime : this.dataForm.datatime[0],
							datatime2 : this.dataForm.datatime[1],
							type : this.dataForm.selectedPointType
						}
				if(this.dataForm.selectedPointType === 0){
	      			this.tbCols  = [{prop:"datatime", label:"时间",width:'60'},
							{prop:"startBm", label:"起码",width:'60'},
				 			{prop:"endBm", label:"止码",width:'50'},
				 			{prop:"rate", label:"倍率",width:'50'},
				 			{prop:"userEnergy", label:"用量(kWh)",width:'50'}];
	      		}else{
	      			this.tbCols  = [{prop:"datatime", label:"时间",width:'60'},
							{prop:"startBm", label:"起码",width:'60'},
				 			{prop:"endBm", label:"止码",width:'50'},
				 			{prop:"userEnergy", label:"用量(m³)",width:'50'}];
	      		}
	      		var pageIndex = 1
				this.$refs.dataTable.loadData(params);
				params.page = 1;
				params.limit = 9999;
				this.$http.ajaxGet('/data/readMetering/list',params,(res)=>{
					this.loadCharts(res.page.list);
					
				})
			},
			loadCharts(list){
				var nameArray = ['用电量(kWh)','用水量(m³)','用气量(m³)','用热量(J)']
	    		var data0 = [];
    			var xAxis = list.map((item,index)=>{
    				data0.push(item.userEnergy)
    				let dt = ''
    				var t = new Date(item.datatime);
    				if(this.dataForm.schemeid === 1){
    					dt = tool.formatDate(t,'MM-dd hh:mm')
    				}else if(this.dataForm.schemeid === 2){
    					dt = tool.formatDate(t,'MM-dd')
    				}else if(this.dataForm.schemeid === 3){
    					dt = tool.formatDate(t,'yy-MM')
    				}
    				return dt
    			})
    			loadLineChart({
		        	domId : "pointEnergy",
					title : "用能曲线",
					xAxis : xAxis,
					data : [data0],
					titlePostion : 'center',
					yAxisUnit : nameArray[this.dataForm.selectedPointType],
					meterType : this.dataForm.selectedPointType
		        })
			},
			onPick(value){
				if(!value || value.length == 0) return;
				this.params.startDate = tool.formatDate(value[0],'yyyy-MM-dd 00:00:00')
				this.params.endDate = tool.formatDate(value[1],'yyyy-MM-dd 00:00:00')
				this.loadData()
			},
			pointChange(pointid,type){
				this.dataForm.selectedPointid = pointid
				this.dataForm.selectedPointType = type 
				this.loadData()
			},
			querySslData(){
				var name = "pointLoad"
		        var newTabs = this.mainTabs.filter(item => item.name !== name)
		        if (newTabs.length >= 1) {
		          this.mainTabs = newTabs
		        } 
		        this.$router.push({ name: name,params: { customerid : this.dataForm.customerid ,pointid : this.dataForm.selectedPointid ,datatime :this.dataForm.datatime[0]}})
			}
		}
	}
</script>

<style>
</style>