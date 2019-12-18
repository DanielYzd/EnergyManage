<template>
  <el-dialog
    :title="!dataForm.priceid ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" size="small" label-width="140px">
	  		<region-select-item  label="应用区域" v-model="dataForm.regionName" @getRegion="getSelectRegion" prop="regionName"></region-select-item>
    			<el-form-item label="容量单价名称" prop="disc">
        		<el-input v-model="dataForm.disc" placeholder="容量单价名称" clearable></el-input>
      		</el-form-item>
      		<el-form-item label="容量单价类型">
					  <el-select :disabled="disabledSelect" v-model="dataForm.type" placeholder="容量单价类型"  style="width:220px">
				      <el-option v-for="item in typeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
				    </el-select>
      		</el-form-item>
      		<template v-if="dataForm.type === 0 ">
		      		<el-form-item label="变压器每月容量费" prop="capacityCharge">
		        		<el-input-number v-model="dataForm.capacityCharge" :min="1" :precision="2" :step="1" placeholder="变压器每月容量费" clearable></el-input-number>
		      		</el-form-item>
		      		<el-form-item label="变压器容量" prop="transformerCapacity">
		        		<el-input-number v-model="dataForm.transformerCapacity" :min="1" :precision="2" :step="1" placeholder="变压器容量" clearable></el-input-number>
		      		</el-form-item>
		      		<el-form-item label="功率因素" prop="powerFactor">
		        		<el-input-number v-model="dataForm.powerFactor" :min="0.1"  :precision="2" :step="1" placeholder="功率因素" clearable></el-input-number>
		      		</el-form-item>
		      		<el-form-item label="日工作时长" prop="dailyWorkingHours">
		        		<el-input-number v-model="dataForm.dailyWorkingHours" :min="1" :precision="2" :step="1" placeholder="日工作时长" clearable></el-input-number>
		      		</el-form-item>
		      		<el-form-item label="月工作日数" prop="monthlyWorkingDays">
		        		<el-input-number v-model="dataForm.monthlyWorkingDays" :min="1" :precision="2" :step="1" placeholder="月工作日数" clearable></el-input-number>
		      		</el-form-item>
		      		<el-form-item label="百分比例(%)" prop="percentage">
		        		<el-input-number v-model="dataForm.percentage" :min="1" :precision="2" :step="1" placeholder="百分比例" clearable></el-input-number>
		      		</el-form-item>
      		</template>
      				<el-form-item label="容量单价" prop="univalentCapacity" v-if="dataForm.type === 1 ">
		        		<el-input-number v-model="dataForm.univalentCapacity" :min="1" :precision="2" :step="1" placeholder="容量单价" clearable></el-input-number>
		      		</el-form-item>
	      	<el-form-item>
	        	<el-button @click="visible = false">取消</el-button>
	      		<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
	      	</el-form-item>
		</el-form>
  </el-dialog>
</template>

<script>
  	import { treeDataTranslate } from '@/utils'
		import regionSelect from '@/views/modules/pob/region-select'
  	export default {
    	data () {
      	return {
      		disabledSelect : false,
        	visible: false,
        	typeList : [{value:0,key:'单价容量'},{value:1,key:'装机容量'}],
        	dataForm: {
		        id : '',
		        disc : '',
		        type : 0 ,
		        capacityCharge : '',
		        transformerCapacity : '',
		        powerFactor : '',
		        dailyWorkingHours : '',
		        monthlyWorkingDays : '',
		        percentage : '',
		        univalentCapacity : '',
		        regionid : '',
						regionName : ''
        	},
        	dataRule: {
          		disc: [{ required: true, message: '必须填入容量单价名称', trigger: 'blur' }],
	            regionName: [{ required: true, message: '所属区域不能为空', trigger: 'blur' }],
	            capacityCharge: [{ required: true, message: '变压器每月容量费', trigger: 'blur' }],
	            transformerCapacity: [{ required: true, message: '变压器容量', trigger: 'blur' }],
	            powerFactor: [{ required: true, message: '功率因素', trigger: 'blur' }],
	            dailyWorkingHours: [{ required: true, message: '日工作时长', trigger: 'blur' }],
	            monthlyWorkingDays: [{ required: true, message: '月工作日数', trigger: 'blur' }],
	            percentage: [{ required: true, message: '百分比例', trigger: 'blur' }]	            
        	}
      	}
    },
    components: {
      'region-select-item':regionSelect
    },
    computed:{
//  	priceUnit (){
//  		if(this.dataForm.type === 0 || this.dataForm.type === 3){
//  			return ' 元/千瓦时';
//  		}else if(this.dataForm.type === 1 || this.dataForm.type === 2){
//  			return ' 元/立方米';
//  		}
//  	}
    },
    methods: {
      	init (id) {
      		this.disabledSelect = false;
      		this.dataForm.id = id;
	        this.visible = true;
	        this.$nextTick(() => {
	          this.$refs['dataForm'].resetFields()
	        })
	        if (this.dataForm.id) {
						var vm = this;
      			this.$http.ajaxGet('/dcs/capacity/list', {'id': this.dataForm.id},(res)=>{
	        		let data = res.list[0];
	        		vm.disabledSelect = true;
					vm.dataForm.id = data.id;
	        		vm.dataForm.type = data.type;
	        		vm.dataForm.disc = data.disc;
	        		vm.dataForm.regionName = data.regionName;
	        		vm.dataForm.regionid = data.regionId;
	        		vm.dataForm.capacityCharge = data.capacityCharge;
	        		vm.dataForm.transformerCapacity = data.transformerCapacity; 
	        		vm.dataForm.powerFactor = data.powerFactor;
	        		vm.dataForm.dailyWorkingHours = data.dailyWorkingHours;
	        		vm.dataForm.monthlyWorkingDays = data.monthlyWorkingDays;
	        		vm.dataForm.percentage = data.percentage*100;
	        		vm.dataForm.univalentCapacity = data.univalentCapacity;
    				})
	        }
      	},
				getSelectRegion(data){
					this.dataForm.regionid = data.id
			    this.dataForm.regionName = data.label;
				},
      	dataFormSubmit () {
        		this.$refs['dataForm'].validate((valid) => {
          	if (!valid) {
          		return;
          	}
          	var form0 = {
          		regionId : this.dataForm.regionid,
          		disc : this.dataForm.disc,
          		type : this.dataForm.type,
          		capacityCharge : this.dataForm.capacityCharge,
          		transformerCapacity : this.dataForm.transformerCapacity,
          		powerFactor : this.dataForm.powerFactor,
          		dailyWorkingHours : this.dataForm.dailyWorkingHours,
          		monthlyWorkingDays : this.dataForm.monthlyWorkingDays,
          		percentage : this.dataForm.percentage/100,
          		univalentCapacity : null
          	};
          	
          	var form1 = {
          		id : this.dataForm.id,
          		regionId : this.dataForm.regionid,
          		disc : this.dataForm.disc,
          		type : this.dataForm.type,
          		univalentCapacity : this.dataForm.univalentCapacity,
          	};
          	var form = this.dataForm.type=='0' ? form0 : form1;
          	this.$http.ajaxPost(`/dcs/capacity/${!this.dataForm.id ? 'save' : 'update'}`,form,()=>{
          		this.$message.success('保存成功')
          		this.visible = false
              this.$emit('refreshDataList')
          	},()=>{
          		this.$message.error('保存失败')
          	})
        })
      }
    }
  }
</script>
<style>

</style>