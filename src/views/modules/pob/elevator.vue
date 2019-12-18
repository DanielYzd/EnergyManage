<!--
	作者：378357088@qq.com
	时间：2018-08-22
	描述：电梯
-->
<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
			<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
		    <el-form-item>
		        <el-button @click="getDataList()">查询</el-button>
		        <el-button v-if="isAuth('pob:elevator:add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
		        <el-button v-if="isAuth('pob:elevator:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
		    </el-form-item>
    	</el-form>
    	<hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols" ref="dataTable" v-bind:tbstyle="tbstyle" v-bind:tbconfig="tbconfig" 
    		@addOrUpdateHandle="addOrUpdateHandle" @deleteHandle="deleteHandle"
    		@selections="(data)=>{this.dataListSelections = data}"></hltable>
    	<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import hltable from '@/components/hltable'
	import AddOrUpdate from './elevator-add-or-update'
	import regionSelect from '@/views/modules/pob/region-select'
	export default {
	    data () {
	      return {
	        dataForm: {
	          searchWord: '',
	          regionid : null,
			  regionName : ''
	        },
	        tburl :'/pob/pobElevator/list',
	      	tbstyle:{
	      		width: '100%'
	      	},
	      	tbconfig:{
	      		isShowSelection : true,
	            isShowRowIndex : true ,
	      		rowButtonType: 1,
      			hasUpdateAuth : this.isAuth('pob:elevator:update'),
      			hasDeleteAuth : this.isAuth('pob:elevator:delete'),
	            isShowPage :true
	      	},
	      	tbcols :[{prop:"regionName", label:"所属楼栋"},{prop:"disc", label:"电梯标识"},{prop:"shareModeName", label:"分摊模式"}],
	    	dataList: [],
	        dataListSelections: [],
	        addOrUpdateVisible: false
	      }
	    },
	    components: {
	      	AddOrUpdate,
	      	hltable,
	      	'region-select-item':regionSelect
	    },
	    mounted () {
	      this.getDataList()
	    },
	    methods: {
	      	// 获取数据列表
	      	getDataList () {
	        	this.$refs.dataTable.loadData({
	    			regionid : this.dataForm.regionid
	    		});
	      	},
	      	// 新增 / 修改
	      	addOrUpdateHandle (row) {
	        	this.addOrUpdateVisible = true
	        	this.$nextTick(() => {
	          		this.$refs.addOrUpdate.init(row?row.id:null)
	        	})
	      	},
	      	getSelectRegion(data){
				this.dataForm.regionid = data.id
		       	this.dataForm.regionName = data.label;
		       	this.getDataList();
			},
	      	// 删除
	      	deleteHandle (row) {
		        var ids = row ? [row.id] : this.dataListSelections.map(item => {
		          return item.id
		        })
		        var len = ids.length;
	        	this.$confirm(`确定${len == 1 ? '删除' : '批量删除'} ${len}条记录?`, '删除提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          dangerouslyUseHTMLString: true,
		          type: 'warning'
		        }).then(() => {
		          	let url = '/pob/pobElevator/delete'
		      		this.$http.ajaxPost(url,ids,(data)=>{
		      			this.$message({
		                  message: '操作成功',
		                  type: 'success',
		                  duration: 1500,
		                  onClose: () => {
		                    this.getDataList()
		                  }
		                })
		      		})
		        })
	      }
	    }
  	}
</script>

<style>
</style>