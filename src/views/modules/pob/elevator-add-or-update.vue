<template>
	<el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" size="small" label-width="140px">
      	<region-select-item  label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion" prop="regionName"></region-select-item>
    	<el-form-item label="电梯标识" prop="disc">
        	<el-input v-model="dataForm.disc" placeholder="电梯名称"></el-input>
      	</el-form-item>
      	<el-form-item label="分摊模式">
        	<el-radio-group v-model="dataForm.shareMode">
		      	<el-radio :label="0">不分摊</el-radio>
		      	<el-radio :label="1">按楼层</el-radio>
		      	<el-radio :label="2">按面积</el-radio>
		    </el-radio-group>
      	</el-form-item>
      	<el-form-item>
        	<el-button @click="visible = false">取消</el-button>
      		<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      	</el-form-item>
    </el-form>
   </el-dialog>
</template>

<script>
	import regionSelect from '@/views/modules/pob/region-select'
	export default {
	    data () {
	      	return {
		      	visible :false,
		      	isShow :false,
		        dataForm:{
		        	id:null,
		        	disc : '',
		        	shareMode : 0,
		        	regionid : null,
		        	regionName : null
		      	},
		      	data : [],
		        dataRule: {
		          	disc: [{ required: true, message: '电梯标识不能为空', trigger: 'blur' },
		            	{ min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }]
		        }
	       }
	    },
    	components: {
      		'region-select-item':regionSelect
    	},
	    methods: {
	      	init (id) {
	        	this.visible = true
	        	this.dataForm.id = id || null
	        	if(!this.dataForm.id){
			        this.$nextTick(() => {
			          this.$refs['dataForm'].resetFields()
			        })
			        return;
	        	}
	        	let url = `/pob/pobElevator/info/${this.dataForm.id }`
	      		this.$http.ajaxGet(url,{},(data)=>{
	      			this.dataForm.disc = data.elevator.disc
                	this.dataForm.regionid = data.elevator.regionid
                	this.dataForm.regionName = data.elevator.regionName
                	this.dataForm.shareMode = data.elevator.shareMode
	      		})
	      	},
			getSelectRegion(data){
				this.dataForm.regionid = data.id
		    	this.dataForm.regionName = data.label;
			},
	      	dataFormSubmit(){
	      		let url = `/pob/pobElevator/${!this.dataForm.id ? 'save' : 'update'}`
	      		var form = {
	      			'id': this.dataForm.id,
	      			'regionid': this.dataForm.regionid,
                	'disc': this.dataForm.disc,
                	'shareMode': this.dataForm.shareMode,
	      		}
	      		this.$http.ajaxPost(url,form,(data)=>{
	      			this.$message({
	                  message: '操作成功',
	                  type: 'success',
	                  duration: 1500,
	                  onClose: () => {
	                    this.visible = false
	                    this.$emit('refreshDataList')
	                  }
	                })
	      		})
	      	}
	    }
  	}
</script>

<style>
</style>