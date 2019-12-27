<template>
  <div class="form">
    <el-form
      :rules="rules"
      :model="ruleForm"
      ref="ruleForm"
      label-width="140px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="transcode" label="变压器编号">
            <el-input
              size="small"
              v-model="ruleForm.transcode"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="transname" label="变压器名称">
            <el-input
              size="small"
              v-model="ruleForm.transname"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="transtype" label="变压器型号">
            <el-input
              size="small"
              v-model="ruleForm.transtype"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ratedcapacity" label="额定容量">
            <el-input
              type="number"
              size="small"
              disabled
              v-model="ruleForm.ratedcapacity"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="ratedvoltage" label="额定电压">
            <el-input
              size="small"
              type="number"
              disabled
              v-model="ruleForm.ratedvoltage"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ratedcurrent" label="额定电流">
            <el-input
              size="small"
              type="number"
              disabled
              v-model="ruleForm.ratedcurrent"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="noloadloss" label="空载损耗">
            <el-input
              size="small"
              disabled
              v-model="ruleForm.noloadloss"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="loadloss" label="负载损耗">
            <el-input
              size="small"
              disabled
              v-model="ruleForm.loadloss"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供电形式" prop="supplymode">
            <el-select size="small" v-model="ruleForm.supplymode" disabled>
              <el-option label="专变" :value="0"></el-option>
              <el-option label="公变" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="operationdate" label="投运时间" size="small">
            <el-date-picker
              disabled
              size="small"
              v-model="ruleForm.operationdate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="factory" label="厂家名称">
            <el-input
              size="small"
              v-model="ruleForm.factory"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="serialnumber" label="出厂编号">
            <el-input
              size="small"
              v-model="ruleForm.serialnumber"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="createtime" label="建档时间">
            <el-input
              size="small"
              v-model="ruleForm.createtime"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装地址" prop="installlocation">
            <el-input
              type="textarea"
              size="small"
              disabled
              v-model="ruleForm.installlocation"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    transformData: {
      type: Array
    }
  },
  data() {
    return {
      type: '',
      ruleForm: {
        archivetype: 4,
        transcode: '',
        transname: '',
        transtype: '',
        ratedcapacity: '',
        ratedvoltage: '',
        ratedcurrent: '',
        noloadloss: '',
        loadloss: '',
        mountstatus: 0,
        supplymode: 0,
        operationdate: '',
        factory: '',
        serialnumber: '',
        createtime: '',
        installlocation: ''
      },
      rules: {
        transname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        transcode: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        operationdate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    transformData(newValue, oldValue) {
      if (newValue.length > 0) {
        let {
          transcode,
          transname,
          transtype,
          ratedcapacity,
          ratedvoltage,
          ratedcurrent,
          noloadloss,
          loadloss,
          mountstatus,
          supplymode,
          operationdate,
          factory,
          serialnumber,
          createtime,
          installlocation
        } = newValue[0]
        this.ruleForm = {
          transcode,
          transname,
          transtype,
          ratedcapacity,
          ratedvoltage,
          ratedcurrent,
          noloadloss,
          loadloss,
          mountstatus,
          supplymode,
          operationdate,
          factory,
          serialnumber,
          createtime,
          installlocation
        }
      }
    }
  },
  created() {
    console.log(this.transformData)
    if (this.transformData.length > 0) {
      let {
        transcode,
        transname,
        transtype,
        ratedcapacity,
        ratedvoltage,
        ratedcurrent,
        noloadloss,
        loadloss,
        mountstatus,
        supplymode,
        operationdate,
        factory,
        serialnumber,
        createtime,
        installlocation
      } = this.transformData[0]
      this.ruleForm = {
        transcode,
        transname,
        transtype,
        ratedcapacity,
        ratedvoltage,
        ratedcurrent,
        noloadloss,
        loadloss,
        mountstatus,
        supplymode,
        operationdate,
        factory,
        serialnumber,
        createtime,
        installlocation
      }
    }
    // if (JSON.stringify(this.parentForm) == '{}') {
    //   this.type = 'add'
    // } else {
    //   // this.ruleForm = { ...this.parentForm }
    //   this.ruleForm = JSON.parse(JSON.stringify(this.parentForm))
    //   this.type = 'update'
    // }
  },
  methods: {
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       this.ruleForm.ratedcapacity = parseInt(this.ruleForm.ratedcapacity)
    //       this.ruleForm.ratedvoltage = parseInt(this.ruleForm.ratedvoltage)
    //       this.ruleForm.ratedcurrent = parseInt(this.ruleForm.ratedcurrent)
    //       this.$emit('confirm', this.ruleForm, this.type)
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    // back() {
    //   this.$emit('back')
    // },
    // dateChange(val) {
    //   console.log(val)
    //   this.ruleForm.operationdate = val
    // }
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 30px;
  .el-form-item {
    display: flex;
    margin-bottom: 15px;
    /deep/.el-form-item__content {
      width: 100%;
      // overflow: hidden;
      margin-left: 0px !important;
      .el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
