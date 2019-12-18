<template>
  <el-dialog
    title="下发--设置"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" size="small">
    		<el-form-item label="终端地址" prop="commaddress">
				  <el-select v-model="dataForm.rtuAddrs" multiple placeholder="请选择" style="width: 100%;">
				    <el-option
				      v-for="item in rtuAddrs"
				      :key="item.rtuid"
				      :label="item.rtuAddr"
				      :value="item.rtuid">
				    </el-option>
				  </el-select>
      		</el-form-item>
	    	<el-form-item label="主用ip地址" prop="mainIp" v-if="dataForm.fn==='0403'">
	        	<el-input v-model="dataForm.mainIp" placeholder="主用ip地址"></el-input>
	      	</el-form-item>
	    	<el-form-item label="主用端口" prop="mainPort" v-if="dataForm.fn==='0403'">
	    		<el-input-number v-model="dataForm.mainPort" :min="0" :max="65535" label="主用端口"></el-input-number>
	     	</el-form-item>
	    	<el-form-item label="备用ip地址" prop="secondIp" v-if="dataForm.fn==='0403'">
	        	<el-input v-model="dataForm.secondIp" placeholder="备用ip地址"></el-input>
	      	</el-form-item>
	    	<el-form-item label="备用端口" prop="secondPort" v-if="dataForm.fn==='0403'">
	    		<el-input-number v-model="dataForm.secondPort" :min="0" :max="65535" label="备用端口"></el-input-number>
	     	</el-form-item>
	    	<el-form-item label="APN" prop="secondIp" v-if="dataForm.fn==='0403'">
	        <el-input v-model="dataForm.apn" placeholder="APN"></el-input>
	      </el-form-item>
	    	<el-form-item label="复位方式" v-if="showResetType">
	      	<el-radio-group v-model="dataForm.resetType">
	      		<el-radio style="display:block;height:35px;margin-left: 30px;" @change="resetTypeChange"
	      			v-for="item in resetTypes" :key="item.key" :label="item.key">{{item.label}}</el-radio>
	      	</el-radio-group>
	      </el-form-item>
	    	<el-form-item label="时间" v-if="dataForm.fn==='0531'">
	        <el-input v-model="dataForm.rtuDate" placeholder="时间格式:2018-10-01 01:00:32" style="width: 80%;"></el-input>
				  <el-tooltip effect="dark" placement="top-start">
				    	<div slot="content">系统时间</div>
				    	<el-button @click="()=>{dataForm.rtuDate = this.formatDate(new Date())}" icon="el-icon-time"></el-button>
				  </el-tooltip>
	      </el-form-item>
		    <!--<el-form-item label="1号任务" v-if="dataForm.fn==='04'">
		    		<el-select v-model="dataForm.schemeid1" clearable  placeholder="请选择1号任务模板名称" style="width: 90%;" >
					    <el-option v-for="item in taskSchemeList" :label="item.disc" :value="item.schemeid" :key="item.schemeid">
					    </el-option>
				    </el-select>
	      </el-form-item>  
		    <el-form-item label="2号任务" v-if="dataForm.fn==='04'">
		    		<el-select v-model="dataForm.schemeid2" clearable  filterable placeholder="请选择2号任务模板名称" style="width: 90%;">
					    <el-option v-for="item in taskSchemeList" :label="item.disc" :value="item.schemeid":key="item.schemeid">
					    </el-option>
				    </el-select>
	      </el-form-item> 
		    <el-form-item label="3号任务" v-if="dataForm.fn==='04'">
		    		<el-select v-model="dataForm.schemeid3" clearable  filterable placeholder="请选择3号任务模板名称" style="width: 90%;">
					    <el-option v-for="item in taskSchemeList" :label="item.disc" :value="item.schemeid":key="item.schemeid">
					    </el-option>
				    </el-select>
	      </el-form-item> 
		    <el-form-item label="4号任务" v-if="dataForm.fn==='04'">
		    		<el-select v-model="dataForm.schemeid4" clearable  filterable placeholder="请选择4号任务模板名称" style="width: 90%;">
					    <el-option v-for="item in taskSchemeList" :label="item.disc" :value="item.schemeid":key="item.schemeid">
					    </el-option>
				    </el-select>
	      </el-form-item> -->
</el-collapse>
</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
  	name:'control-rtu-send',
  	computed:{
  		showResetType(){
  			return this.dataForm.fn==='0101' || this.dataForm.fn==='0102' ||this.dataForm.fn==='0103'||this.dataForm.fn==='0104'
  		}
  	},
    data () {
      return {
        visible: false,
    		rtuAddrs: [],
      	resetTypes : [{key:'0101',label:'硬件初始化'},{key:'0102',label:'数据区初始化'},
      						{key:'0103',label:'恢复至出厂配置'},{key:'0104',label:'参数（除与系统主站通信有关的）及全体数据区初始化'}],
        dataForm: {
          rtuAddrs: [],
          fn: '0403',
          mainIp:'60.191.107.133',
          mainPort :18888,
          secondIp: '0.0.0.0',
          secondPort: 0,
          apn:'cmnet',
          resetType:'',
          rtuDate : '',
          taskid : null
        },
        taskSchemeList : [],
        dataRule: {
          mainIp: [
            { required: true, message: '主用ip不能为空', trigger: 'blur' }
          ],
          mainPort: [
            { required: true, message: '主用端口不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      	init (rtus,fn) {
	        this.visible = true
	        this.rtuAddrs = rtus
	        this.dataForm.rtuAddrs = rtus
	        this.dataForm.fn = fn
	        //this.loadTaskTemplate();
      	},
      	dataFormSubmit () {
	        this.$refs['dataForm'].validate((valid) => {
	          if (valid) {
	          	var vm = this;
	            this.visible = false
            	var tmp = this.dataForm.rtuAddrs.map(function(item,index){
            		return vm.wrapperObj(item)
            	});
            	this.$emit('sendAction',tmp)
	          }
	        })
      },
      wrapperObj(item){
      	var data = this.dataForm;
      	var value = null
      	var sendParam = { 
      			rtuid : item.rtuid,
      			rtuAddr :item.rtuAddr,
      			key: this.dataForm.fn
      	}
      	if(this.dataForm.fn === '0403'){
      		sendParam.value = data.mainIp+';'+ data.mainPort+';'+ data.secondIp+';'+ data.secondPort+';'+data.apn
      		sendParam.mainIp = data.mainIp
	      	sendParam.mainPort = data.mainPort
	      	sendParam.secondIp = data.secondPort
	      	sendParam.secondPort = data.secondPort
	      	sendParam.apn = data.apn
      	}else if(this.dataForm.fn === '0531'){
      		sendParam.value = data.rtuDate
      		sendParam.rtuDate = data.rtuDate
    			sendParam.sysDate = this.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
    			sendParam.subMins = ((new Date().getTime() - new Date(data.rtuDate).getTime()) / (1000*60)).toFixed(2)
      	}
      	return sendParam
      },
      resetTypeChange(value){
      	this.dataForm.fn = value;
      }
    }
  }
</script>
<style>
	.demo-block-control {
    border-top: 1px solid #eaeefb;
    height: 44px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    margin-top: -1px;
    color: #d3dce6;
    cursor: pointer;
    position: relative;
}
</style>