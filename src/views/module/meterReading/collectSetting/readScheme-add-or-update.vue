<template>
  	<el-dialog
    	:title="isAdd ? '新增' : '修改'"
    	:close-on-click-modal="false"
    	:visible.sync="visible">
    	<el-form :model="dataForm" :inline="true" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" size="small">
    		<el-form-item label="采集方案" prop="schemeid">
        		<el-select v-model="dataForm.schemeid" placeholder="请选择采集方案" @change="schemeChangeHandler" :disabled="!isAdd">
			      	<el-option v-for="item in schemeList" :key="item.schemeid" :label="item.schemedesc" :value="item.schemeid"></el-option>
			    </el-select>
      		</el-form-item>
      		<el-form-item label="数据类型" prop="datatype">
        		<el-select v-model="dataForm.datatype" placeholder="请选择数据类型" :disabled="!isAdd">
			      	<el-option v-for="item in datatypeList" :key="item.datatype" :label="item.datadesc" :value="item.datatype"></el-option>
			    </el-select>
      		</el-form-item>
      		<el-form-item label="采集周期类型" prop="collectcyctype">
        		<el-select v-model="dataForm.collectcyctype" placeholder="请选择采集周期类型">
			      	<el-option v-for="item in collectcyctypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    </el-select>
      		</el-form-item>
      		<el-form-item label="采集周期间隔" prop="collectcyc">
        		<el-input-number v-model="dataForm.collectcyc" :min="1" :max="99"></el-input-number>
      		</el-form-item>
      		<el-form-item label="采集参考时间" prop="collectreftime">
        		<el-date-picker v-model="dataForm.collectreftime" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期"></el-date-picker>
      		</el-form-item>
      		<el-form-item label="最大采集周期" prop="maxcollectcyc">
        		<el-input-number v-model="dataForm.maxcollectcyc" :min="1" :max="99"></el-input-number>
      		</el-form-item>
      		<el-form-item style="display: block;padding-left: 80px;">
        		<el-button @click="visible = false">取消</el-button>
      			<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      		</el-form-item>
    	</el-form>
    </el-dialog>
</template>

<script>
	export default{
		data(){
			return{
				visible: false ,
				isAdd :true ,
				dataForm: {
		          	schemeid: 1,
		          	datatype :'',
		          	collectcyctype : '',
		          	collectreftime : '',
		          	collectcyc : '',
		          	maxcollectcyc : ''
		        },
		        schemeList : [],
		        datatypeList : [],
		        collectcyctypeList : [{key : '分钟' ,value : 0},{key : '小时' ,value : 1},{key : '日' ,value : 2},{key : '月' ,value : 3}]
			}
		},
		mounted(){
			this.init()
		},
		methods : {
			init(row){
				if(row){
					this.isAdd = false
				}else{
					this.isAdd = true
				}
		        this.visible = true
		        this.$nextTick(() => {
		          this.$refs['dataForm'].resetFields()
		        })
				
		        this.$http.ajaxGet('/hes/collectscheme/list',{},(res)=>{
		        	this.schemeList = res.list;
		        	if(row){
			        	this.dataForm.schemeid = row.schemeid
			        	this.dataForm.datatype = row.datatype
			        	this.dataForm.collectcyctype = row.collectcyctype
			        	this.dataForm.collectcyc = row.collectcyc
			        	this.dataForm.collectreftime = row.collectreftime
			        	this.dataForm.maxcollectcyc = row.maxcollectcyc
			        	this.loadDataType(row.schemeid)
			        }else{
			        	this.loadDataType(this.dataForm.schemeid)
			        }
		        })
			},
			schemeChangeHandler(schemeid){
				this.dataForm.datatype = null
	        	this.loadDataType(schemeid)
			},
			loadDataType(schemeid){
	        	this.schemeList.some((item) => {
	        		if(item.schemeid == schemeid){
	        			var protocolid = item.protocolid
	        			this.$http.ajaxGet('/hes/selectDataType/list',{ protocolid : protocolid },(res)=>{
			        		this.datatypeList = res.list;
			        	})
	        			return true;
	        		}
	        	})
			},
			dataFormSubmit () {
				this.$http.ajaxPost(`/hes/schemeDetail/${this.isAdd ? 'insert' : 'update'}`,this.dataForm,(data)=>{
	              	this.$message({
	                  	message: '操作成功',
	                  	type: 'success',
	                  	duration: 1500,
	                  	onClose: () => {
	                    	this.visible = false
	                    	this.$emit('refreshDataList')
	                  	}
	                })
        		},(msg)=>{
        				this.$message.error(msg)
        		})
			}
		}
	}
</script>

<style>
</style>