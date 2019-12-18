<template>
	<el-dialog title="下发" :close-on-click-modal="false" :visible.sync="visible">
    	<el-form :model="dataForm" :inline="true" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="180px" size="small">
	      	<el-form-item label="开关名称">
	        	<el-input v-model="dataForm.pointName" disabled  style="width: 200px;"></el-input>
	      	</el-form-item>
	      	<el-form-item label="开关MAC地址">
	        	<el-input v-model="dataForm.commaddress" disabled style="width: 200px;"></el-input>
	      	</el-form-item>
	      	<el-form-item label="网关MAC地址">
	        	<el-input v-model="dataForm.macSource" disabled style="width: 200px;"></el-input>
	      	</el-form-item>
	      	<br>
	      	<template v-if="dataForm.type === 4">
		      	<el-form-item label="开关回路标识" v-if="dataForm.type === 4">
		      		<el-select v-model="dataForm.loopMark" placeholder="请选择" style="width: 200px" disabled>
				    	<el-option v-for="item in loopMarkList" :key="item.value" :label="item.key" :value="item.value"></el-option>
					</el-select>
		      	</el-form-item>
		  		<el-form-item>
	        		<el-button-group v-if="dataForm.optModeType === 1">
					  <el-button type="primary" @click="dataFormSubmit(0)">开</el-button>
					  <el-button type="primary" @click="dataFormSubmit(1)">关</el-button>
					</el-button-group>
	      		</el-form-item>
	      	</template>
	      	<br>
	      	<template v-if="dataForm.type === 5">
		      	<el-form-item label="操作类型">
					<el-select v-model="dataForm.optModeType" placeholder="请选择" style="width: 200px" v-if="dataForm.type === 5">
				    	<el-option v-for="item in optModeTypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
					</el-select>
		      	</el-form-item>
	      	</template>
      		<el-form-item  v-if="dataForm.type === 5">
	      		<el-button-group v-if="dataForm.optModeType === 1">
				  <el-button type="primary" @click="dataFormSubmit(0)">打开</el-button>
				  <el-button type="primary" @click="dataFormSubmit(1)">关闭</el-button>
				</el-button-group>
	      		<el-button-group v-if="dataForm.optModeType === 2">
				  <el-button type="primary" @click="dataFormSubmit(0)">自动</el-button>
				  <el-button type="primary" @click="dataFormSubmit(1)">制冷</el-button>
				  <el-button type="primary" @click="dataFormSubmit(2)">除湿</el-button>
				  <el-button type="primary" @click="dataFormSubmit(3)">送风</el-button>
				  <el-button type="primary" @click="dataFormSubmit(4)">制暖</el-button>
				</el-button-group>
	    		<el-form-item v-if="dataForm.optModeType === 3" label="温度" prop="optModeValue">
			        <el-input-number v-model="dataForm.optModeValue"  :min="16" :max="31" label="请输入开户金额">
			        </el-input-number>
			        <el-button type="primary" @click="dataFormSubmit(dataForm.optModeValue)">发送命令</el-button>
	      		</el-form-item>
	      		<el-button-group v-if="dataForm.optModeType === 4">
				  <el-button type="primary" @click="dataFormSubmit(0)">自动</el-button>
				  <el-button type="primary" @click="dataFormSubmit(1)">1档</el-button>
				  <el-button type="primary" @click="dataFormSubmit(2)">2档</el-button>
				  <el-button type="primary" @click="dataFormSubmit(3)">3档</el-button>
				</el-button-group class="btnClass">
	      		<el-button-group v-if="dataForm.optModeType === 5">
				  <el-button type="primary" @click="dataFormSubmit(0)">自动摆风</el-button>
				  <el-button type="primary" @click="dataFormSubmit(1)">手动摆风</el-button>
				</el-button-group>
			</el-form-item>		<br>			
      		<el-form-item class="btnClass">
        		<el-button @click="visible = false">关闭本页</el-button>
      		</el-form-item>
	    </el-form>
	</el-dialog>
</template>

<script>
	export default{
		data(){
			return{
				visible : false,
				loopMarkList : [{key : 'A路',value : 'A'},{key : 'B路',value : 'B'},{key : 'C路',value : 'C'}],
				switchTypeList : [{key : '打开',value : 0},{key : '关闭',value : 1}],
				optModeTypeList : [{key : '开关命令',value : 1},{key : '模式命令',value : 2},{key : '温度命令',value : 3},{key : '风速命令',value : 4}
					,{key : '风向命令',value : 5}],
				dataForm :{
					pointName : '',
					loopMark : 'A',
					macSource : '',
					commaddress : '',
					type : 5,
					switchType : 0,
					optModeType : 1,
					optModeValue : 0
				}
			}
		},
		methods : {
			init(params){debugger
				this.visible = true
				this.dataForm.pointid = params.pointid
				this.dataForm.type = params.type
				this.dataForm.loopMark = params.loopMark
				this.dataForm.commaddress = params.commaddress
				this.dataForm.pointName = params.pointName
				this.dataForm.macSource = params.macSource
			},
			dataFormSubmit(optModeValue){
	      		this.visible = false
	      		var params = { 
	      			pointIds : this.dataForm.pointid,
	      			seconds : 0,
	      			type : this.dataForm.type
	      		}
	      		if(this.dataForm.type === 4){
	      			params = Object.assign(params,{loopMark : this.dataForm.loopMark,switchType : optModeValue})
	      		}else{
	      			params = Object.assign(params,{mode : this.dataForm.optModeType,modeParams : optModeValue})
	      		}
	      		this.$emit('sendAction',params)
			}
		}
	}
</script>

<style>
	.btnClass{
		margin-left: 200px;
	}
</style>