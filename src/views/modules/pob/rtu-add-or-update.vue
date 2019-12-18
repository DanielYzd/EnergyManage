<template>
  <el-dialog
    :title="!dataForm.rtuid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" size="small">
	   <!-- <el-collapse v-model="activeNames">
  			<el-collapse-item title="基本信息" name="1">-->
    			<el-form-item label="终端地址" prop="commaddress">
        		<el-input v-model="dataForm.commaddress" placeholder="终端地址" style="width:80%"></el-input>
				    <el-button @click="()=>{dataForm.commaddress = getRtuAddress()}"  icon="el-icon-back"></el-button>
      		</el-form-item>
      		<region-select prop="regionName" label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select>
  		<!--</el-collapse-item>
		  <el-collapse-item title="更多信息" name="2">-->
	  		<el-form-item label="终端类型" prop="type">
	        	<el-select v-model="dataForm.type" style="width: 100%;">
			      	<el-option v-for="item in rtuTypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
			    	</el-select>
		    </el-form-item>
	    	<el-form-item label="终端规约" prop="protocolid" >
	        <el-select v-model="dataForm.protocolid" placeholder="终端规约" style="width: 80%;" >
			      <el-option v-for="item in protocolList" :key="item.protocolid" :label="item.protocolName" :value="item.protocolid"></el-option>
			    </el-select>
	      </el-form-item>
	    	<el-form-item label="采集方案" prop="readschemeid" v-if="dataForm.type != 6">
	        <el-select v-model="dataForm.readschemeid" placeholder="采集方案" style="width: 80%;" clearable>
			      <el-option v-for="item in readschemeList" :key="item.schemeid" :label="item.schemedesc" :value="item.schemeid"></el-option>
			    </el-select>
	     </el-form-item>
	      <el-form-item label="高级密码" prop="passwordH">
	        <el-input v-model="dataForm.passwordH" placeholder="高级密码"></el-input>
	      </el-form-item>
	      <el-form-item label="低级密码" prop="passwordL">
	        <el-input v-model="dataForm.passwordL" placeholder="低级密码"></el-input>
	      </el-form-item>
		  <!--</el-collapse-item>-->
</el-collapse>
</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import regionSelect from '@/views/modules/pob/region-select'
  export default {
    data () {
      return {
      	activeNames: ['1'],
        visible: false,
        dataForm: {
          rtuid: 0,
          commaddress:'',
          readschemeid :1,
          regionName: '',
          regionid: '',
          protocolid: 10,
          passwordH:'000',
          passwordL:'000',
          type : 5
        },
        regionList: [],
        rtuTypeList : [{value:2,key:'负控终端'},{value:4,key:'I型集中器'},{value:5,key:'II型集中器'},{value:6,key:'智能家居网关'}],
        readschemeList : [],
        regionListTreeProps: {
          label: 'label',
          children: 'children'
        },
        dataRule: {
          commaddress: [
            { required: true, message: '终端地址不能为空', trigger: 'blur' },
            { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
          ],
          regionName: [
            { required: true, message: '所属区域不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      regionSelect
    },
    computed:{
    	protocolList(){
    		if(this.dataForm.type === 6){
    			this.dataForm.readschemeid =null
    			this.dataForm.protocolid = 30
	    			return [{
	        	'protocolid' :30,
	        	'protocolName' :'智能家居网关协议书'
	        }]
    		}else{
    			this.dataForm.protocolid = 10
    				return [{
	        	'protocolid' :10,
	        	'protocolName' :'国网规约(Q/GDW 1376.1-2013)'
	        },{
	        	'protocolid' :20,
	        	'protocolName':'南网规约'
	        }]
    		}
    	}
    },
    methods: {
      init (id) {
        this.dataForm.rtuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$http.ajaxGet('/hes/collectscheme/list',{},(res)=>{
        	this.readschemeList = res.list;
        })
        if (this.dataForm.rtuid) {
            this.$http({
              url: this.$http.adornUrl(`/pob/rtu/info/${this.dataForm.rtuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.regionName = data.rtu.regionName
                this.dataForm.commaddress = data.rtu.commaddress
                this.dataForm.readschemeid = data.rtu.readschemeid
                this.dataForm.protocolid = data.rtu.protocolid
                this.dataForm.type = data.rtu.type
                this.dataForm.passwordH = data.rtu.passwordH
                this.dataForm.passwordL = data.rtu.passwordL
              }
            })
          }
      },
			getSelectRegion(data){
				this.dataForm.regionid = data.id
		    this.dataForm.regionName = data.label;
			},
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/pob/rtu/${!this.dataForm.rtuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'rtuid': this.dataForm.rtuid || undefined,
                'regionid': this.dataForm.regionid,
                'commaddress': this.dataForm.commaddress,
                'type': this.dataForm.type,
                'readschemeid': this.dataForm.readschemeid,
                'protocolid': this.dataForm.protocolid,
                'passwordH': this.dataForm.passwordH,
                'passwordL': this.dataForm.passwordL
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
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