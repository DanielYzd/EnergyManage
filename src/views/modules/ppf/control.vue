<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<el-row>
				<el-col :span="8">
					<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
				</el-col>
			    <el-col :span="8">
			    	<el-form-item label="开关状态">
			    		<el-select v-model="dataForm.useenergyStatus" placeholder="表计拉合闸状态" style="width: 220px;" clearable>
					      <el-option v-for="item in energyStatusList" :key="item.value" :label="item.key" :value="item.value"></el-option>
					    </el-select>
			    	</el-form-item>
				</el-col>
			    <el-col :span="8">
			    	<el-form-item label="账户余额">
			    		<el-input placeholder="请输入金额" v-model="dataForm.syje" style="width: 220px;" clearable>
					    <el-select v-model="dataForm.syjeCond" slot="prepend" placeholder="请选择" style="width: 100px;">
					      <el-option label="大于等于" value="1"></el-option>
					      <el-option label="小于" value="2"></el-option>
					    </el-select>
					  </el-input>
			    	</el-form-item>
				</el-col>
	    	</el-row>
			<el-row>
			    <el-col :span="8">
			    	<el-form-item label="用户名称">
			    		<el-input v-model="dataForm.hm" placeholder="用户名称" style="width: 220px;" clearable></el-input>
			    	</el-form-item>
				</el-col>
			    <el-col :span="8">
			    	<el-form-item label="手机号码">
			    		<el-input v-model="dataForm.telephone" placeholder="手机号码" style="width: 220px;" clearable></el-input>
			    	</el-form-item>
				</el-col>
			    <el-col :span="8">
			    	<el-form-item label="结算周期">
			    		<el-select v-model="dataForm.schemeid" placeholder="结算周期" style="width: 220px;" clearable>
					      <el-option v-for="item in schemeidList" :key="item.value" :label="item.key" :value="item.value"></el-option>
					    </el-select>
			    	</el-form-item>
				</el-col>
	    	</el-row>
			<el-row>
			    <el-col :span="24">
			    	<el-form-item style="float: right;">
				       <el-button @click="getDataList()">查询</el-button>
				       <el-button type="primary"  @click="batchSendSms()" :loading="loading">批量短信催费</el-button>
				       <el-button type="warning"  @click="batchSwitch(0)" :loading="loading">批量合闸</el-button>
				       <el-button type="danger"  @click="batchSwitch(1)" :loading="loading">批量拉闸</el-button>
				    </el-form-item>
				</el-col>
	    	</el-row>
	    </el-form>
	    <hltable v-bind:tburl="url" v-bind:tbcols="cols" ref="dataTable" v-bind:tbconfig="tbconfig" 
			@selections="(data)=>{this.dataListSelections = data}"></hltable>
	    <div style="margin-left: 30%;width: 100%;" v-if="showGrid === false">
	    	<el-button size="mini" @click="getDataList()">全部</el-button>
	    	<el-button size="mini" type="warning" @click="getDataList(1)">余额不足</el-button>
	    	<el-button size="mini" type="danger" @click="getDataList(-1)">欠费</el-button>
		</div>
	    <ul class="doorplate-list" v-if="showGrid === false">
		  <li v-for="(item,index) in dataList">
		    <el-checkbox class="checkradio"  v-model="item.checked" @change="changeHandler($event,item)" ></el-checkbox>
		    <div class="doorplate-content" @click="moneyDetail(item)">
		    	<icon-svg name="doorplate" class="doorplate" :class="[{ notEnough: item.syje < item.bjje }, { arrears: item.syje < item.tzje }]"></icon-svg>
		    </div>
		    <div class="customerInfo">{{item.hm}}</div>
		    <!--<div class="meter-info">{{item.hh}}</div>-->
		    <div class="money-info">{{item.syje}}<span style="font-size: 10px;margin-left: 10px;">元</span></div>
		    	<el-button-group class="opt-button">
				  <el-button size="small" style="background-color: #78a355;color: #fff;" @click="payHandler(0,item)">缴费</el-button>
				  <el-button size="small" style="background-color: #6d8346;color: #fff;" @click="payHandler(1,item)">催费</el-button>
				  <el-button size="small" style="background-color: #769149;color: #fff;" @click="controlHandler(item)">拉合闸</el-button>
				</el-button-group>
		  </li>
		  <div v-if="dataList.length == 0">
		  	<div style="color: #CF9236;font-size: 16px;margin-bottom: 10px;">没有费控用户。</div>
		  	<div>提示：请在“档案管理”--“基础档案”功能中，修改用户档案，开启的“主站费控”</div>
		  </div>
		</ul>
		<el-pagination background  v-if="showGrid === false"
		      @size-change="sizeChangeHandle"
		      @current-change="currentChangeHandle"
		      :current-page="pageIndex"
		      :page-sizes="[10, 20, 50, 100]"
		      :page-size="pageSize"
		      :total="totalPage"
		      layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<pay-or-remind ref="pay" v-if="payVisible"  @refreshDataList="getDataList"></pay-or-remind>
		<control-on-off ref="controlOnOff" v-if="controlVisible"></control-on-off>
	</div>
</template>

<script>
	import payOrRemind from './pay-or-remind'
	import controlOnOff from './control-on-off'
	import regionSelect from '@/views/modules/pob/region-select'
	import hltable from '@/components/hltable'
	export default {
		data(){
			return {
				loading : false,
				rtuLoading: false,
				dataList : null,
				dataList: [],
		        pageIndex: 1,
		        pageSize: 10,
		        totalPage: 0,
				energyStatusList : [{value:0,key : '合闸状态'},{value:3,key : '拉闸状态'}],
				schemeidList : [{value:2,key : '日'},{value:3,key : '月'}],
				showGrid :true ,
				dataForm : {
					regionid : this.$cookie.get("regionid"),
					regionName : this.$cookie.get("regionName"),
          			syje : null,
          			useenergyStatus : null,
          			syjeCond : "1",
          			hm :'',
          			telephone : '' ,
          			schemeid : 2
				},
				url :'/ppf/customer/list',
		      	tbconfig:{
		      		isShowSelection : true,
		            isShowRowIndex : true ,
		      		rowButtonType: 4,
		      		btnWidth : 350 ,
		      		buttons : [{
		      			label : '缴费',
		      			handler : (row,refTable) => {
		      				var _this = refTable.multipleTable.$parent.$parent
		      				_this.payHandler(0,row)
		      			}
		      		},{
		      			label : '短信催费',
		      			handler : (row,refTable) => {
		      				var _this = refTable.multipleTable.$parent.$parent
		      				_this.payHandler(1,row)
		      			}
		      		},{
		      			label : '退补调剂',
		      			handler : (row,refTable) => {
		      				var _this = refTable.multipleTable.$parent.$parent
		      				_this.payHandler(2,row)
		      			}
		      		},{
		      			label : '拉闸合闸',
		      			handler : (row,refTable) => {
		      				var _this = refTable.multipleTable.$parent.$parent
		      				_this.controlHandler(row)
		      			}
		      		}],
		            isShowPage :true
		      	},
		      	cols :[
		      		{prop:"hm", label:"用户",width:"100"}
		      		,{prop:"telephone", label:"手机号码",width:"100"}
		      		,{prop:"syje", label:"账户余额(元)",width:"130",tag: true,getColor:function(row){
		      			if(row.syje > row.bjje){
		      				return 'success'
		      			}else if(row.syje < row.bjje  && row.syje >= 0 ){
		      				return 'warning'
		      			}else if(row.syje < 0 ){
		      				return 'danger'
		      			}else{
		      				return 'info'
		      			}
		      		}}
		      		,{prop:"jssj", label:"最后结算日期",width:"120"}
		      		,{prop:"commaddress", label:"表计通信地址"}
		      		,{prop:"useenergyStatusName", label:"当前开关状态",width:"120",tag: true,getColor:function(row){
		      		return row.useenergyStatus === 0 ?'success' : 'warning'
		      		}}],
		        dataListSelections: [],
	        	hlProgVisible :false,
	        	payVisible : false,
	        	controlVisible : false,
	        	moneyVisible  :false
			}
		},
		components:{
			hltable,payOrRemind,controlOnOff,
			'region-select-item' : regionSelect
		},
	    computed: {
	      	mainTabs: {
	        	get () { return this.$store.state.common.mainTabs },
	        	set (val) { this.$store.commit('common/updateMainTabs', val) }
	      	}
	    },
		mounted () {
	      this.getDataList()
	    },
		methods : {
			getDataList(){
				this.$refs.dataTable.loadData({
	            	'regionid': this.dataForm.regionid,
	            	'syjeCond' : this.dataForm.syjeCond,
	            	'syje' : this.dataForm.syje || null,
	            	'hm' : this.dataForm.hm || null,
	            	'schemeid' : this.dataForm.schemeid ,
	            	'telephone' : this.dataForm.telephone || null,
	          	})
			},
			getDataList2(){
				this.loading = true
		        this.$http({
		          url: this.$http.adornUrl('/ppf/customer/list'),
		          method: 'get',
		          params: this.$http.adornParams({
		            'page': this.pageIndex,
		            'limit': this.pageSize,
		            'regionid': this.dataForm.regionid
		          })
		        }).then(({data}) => {
		          if (data && data.code === 0) {
		            this.dataList = data.page.list
		            this.totalPage = data.page.totalCount
		          } else {
		            this.dataList = []
		            this.totalPage = 0
		          }
		          this.loading = false
		        }).catch( (error)=> {
		          this.loading = false
		  		})
			},
		    getSelectRegion(data){
		       this.dataForm.regionid = data.id
		       this.dataForm.regionName = data.label;
		       this.getDataList();
		    },
		    changeHandler($event,row){
		    	if($event){
		    		this.dataListSelections.push(row)
		    	}else{
		    		var index = this.dataListSelections.indexOf(row)
		    		this.dataListSelections.splice(index,1);
		    		var index2 = this.dataList.indexOf(row)
		    		row.checked = false;
		    		this.$set(this.dataList, index2, row);
		    	}
		    },
		    sizeChangeHandle (val) {
		        this.pageSize = val
		        this.pageIndex = 1
		        this.getDataList()
		    },
		    currentChangeHandle (val) {
		        this.pageIndex = val
		        this.getDataList()
		    },
		    payHandler(optType,customerInfo){
		    	this.payVisible = true;
		    	this.$nextTick(() => {
		    		this.$refs.pay.init(optType,customerInfo)
		    	})
		    },
		    controlHandler(customerInfo){
		    	this.controlVisible = true;
		    	this.$nextTick(() => {
		    		this.$refs.controlOnOff.init(customerInfo)
		    	})
		    },
		    batchSendSms(){
		    	var rows = this.dataListSelections;
		    	if(rows.length == 0){
		    		this.$message.error("至少选择一条记录")
		    		return;
		    	}
		    	this.loading = true
		    	var customerIds = []
		    	rows.forEach(item=>{
		    		customerIds.push(item.customerid);
		    	})
		    	this.$http.ajaxPost('/ppf/customer/lessMoneySms',customerIds,(resOk)=>{
	    			this.$message.success('批量发送成功')
	    			this.loading = false
	    		},(resError)=>{
	    			this.$message.error(resError.msg)
	    			this.loading = false
	    		})
		    },
		    batchSwitch(optType){
		    	var rows = this.dataListSelections;
		    	if(rows.length == 0){
		    		this.$message.error("至少选择一条记录")
		    		return;
		    	}
		        this.loading = true
		    	var pointIds = []
		    	rows.forEach(item=>{
		    		pointIds.push(item.pointid);
		    	})
		    	var params = {
					pointIds : pointIds.join(','),
					switchType :  optType
				}
		    	this.$http.ajaxGet('/remote/rtu/switchDoExt',params,(resOk)=>{
					var isOptSuccess = resOk.data.success;
				    this.$message.success('命令发送成功，请稍后查询最新开关状态')
		        	this.loading = false
					this.getDataList()
    			},(errorMsg)=>{
    				this.$message.error(resError.msg)
    				this.loading = false
    			})
		    },
		    moneyDetail(customerInfo){
		    	var name = "customermoney"
		        var newTabs = this.mainTabs.filter(item => item.name !== name)
		        if (newTabs.length >= 1) {
		          this.mainTabs = newTabs
		        } 
		        this.$router.push({ name: name,params: customerInfo})
		    }
		}
	}
</script>

<style>
	/*@font-face {
		font-family:lcd;
		src: url(../../../../font/LCD-N.TTF);
	}*/
	.doorplate-list{
		overflow: hidden;
	    list-style: none;
	    padding: 0;
	    /*border: 1px solid #eaeefb;*/
	    border-radius: 4px;
	}
	.doorplate-list li {
	    float: left;
	    min-width: 280px;
	    height: 240px;
	    text-align: center;
	    color: #666;
	    font-size: 13px;
	    transition: color .15s linear;
	    border: 1px solid #eee;
	    margin-right: -1px;
	}
	.doorplate{
		font-size: 200px;
		color: #46485f;
		height: 160px;
		cursor: pointer;
	}
	.notEnough{
		color: #e6a23c;
	}
	.arrears{
		color: #f56c6c;
	}
	.money-info{
		/*color: #45b97c;*/
		color: #F0F0F0;
		font-size: 16px;
		margin-top: 10px;
	}
	.checkradio{
		margin-top: 10px;
	}
	.doorplate-content{
		height: 30px;
		color: #757575;
	}
	.doorplate-content .name{
		color: #757575;
		font-size: 10px;
	}
	.doorplate-content .data{
		color: #17B3A3;
		font-size: 12px;
		padding-top: 10px;
	}
	.customerInfo{
		margin-top: 12px;
		font-size: 16px;
		color: #e8e0e0;
		font-weight: 700;
	}
	.opt-button{
		padding:10px 15px;
		margin-top: 55px;
		padding: 6px 12px !important;
		font-size: 12px;
		color: #11C26D;
	}
</style>