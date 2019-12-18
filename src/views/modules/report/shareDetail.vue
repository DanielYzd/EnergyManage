<template>
		<div>
  <el-tabs v-model="type" @tab-click="handleClick">
    <el-tab-pane label="累加表计" name="0"></el-tab-pane>
    <el-tab-pane label="累减表计" name="1"></el-tab-pane>
  </el-tabs>
	    <hltable v-bind:tburl="url" v-bind:tbcols="cols" ref="dataTable" v-bind:tbconfig="tbconfig" ></hltable>
	</div>
</template>

<script>
	import hltable from '@/components/hltable'
	import tool from '@/utils/tool'
	export default{
		data(){
			return{
		        queryForm : {
          			formulaid:'',
          			startTime:'',
          			endTime:'',
          			},
				url :'/report/share/detail',
				type : 0
			}
		},
	    components: {
			hltable
	    },
	    computed:{
	      	tbconfig(){
	      		return {
		      		isShowSelection : false,
		            isShowRowIndex : true ,
		            isShowPage :false
		      	}
	      	},
	      	cols (){
	      		let cols =   [
	      		{prop:"disc", label:"表计名称",width:'120'}
	      		,{prop:"instLocation", label:"安装位置",width:'120'}
	      		,{prop:"zBm", label:"起码",width:'120'}
	      		,{prop:"zBM2", label:"止码",width:'120'}
	      		,{prop:"rate", label:"倍率",width:'120'}
	      		,{prop:"zDlP", label:"电量",width:'120'}]
	      		return cols
	      	}
	    },
		mounted(){
			this.init();
		},
		methods: {
			init(){
				var params = this.$route.params;
				this.queryForm.formulaid = params.formulaid;
				this.queryForm.startTime = params.startTime;
				this.queryForm.endTime = params.endTime;
				this.getDataList();
			},
			handleClick(tab, event) {
//				var vm = this;
//				if(tab.type==0){
//					vm.type=0
//				}else{
//					vm.url='/report/share/detail/subs'
//				}
//				console.log(vm.url);
				this.getDataList();
			},
			getDataList() {
				this.$refs.dataTable.loadData({
					formulaid: this.queryForm.formulaid,
					startTime: this.queryForm.startTime,
					endTime: this.queryForm.endTime,
					type : this.type
				})
			}
		}
		}</script>

<style>
.formWidth{
	width: 150px;
}
</style>