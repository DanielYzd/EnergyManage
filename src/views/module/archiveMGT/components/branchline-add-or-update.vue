<template>
  <div class="addorupdate">
    <div class="title">线路信息</div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="线路名称" prop="linename">
            <el-input
              v-model="ruleForm.linename"
              size="mini"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="线路编码" prop="linecode">
            <el-input
              v-model="ruleForm.linecode"
              size="mini"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="电压等级" prop="voltagelevel">
            <el-input
              type="number"
              v-model="ruleForm.voltagelevel"
              size="mini"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建档时间" prop="createtime">
            <el-date-picker
              size="small"
              v-model="ruleForm.createtime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button size="mini" @click="cancle()">取消</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="deleteline"
          v-show="this.id"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    branchlineData: {
      type: Array
    },
    id: {
      type: String
    }
  },
  watch: {
    branchlineData(newValue, oldValue) {
      console.log(newValue)
      if (newValue.length > 0) {
        let { linename, linecode, voltagelevel, createtime } = newValue[0]
        this.ruleForm = {
          linename,
          linecode,
          voltagelevel,
          createtime
        }
      } else {
        this.ruleForm = {
          linename: '',
          linecode: '',
          voltagelevel: 0,
          createtime: ''
        }
      }
    },
    id(newValue, oldValue) {
      this.id = newValue
    }
  },
  data() {
    return {
      ruleForm: {
        linename: '',
        linecode: '',
        voltagelevel: 0,
        createtime: ''
      },
      rules: {
        linename: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        linecode: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        voltagelevel: [
          { required: true, message: '请输入电压等级', trigger: 'blur' }
        ],
        createtime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.branchlineData.length > 0) {
      let {
        linename,
        linecode,
        voltagelevel,
        createtime
      } = this.branchlineData[0]
      this.ruleForm = {
        linename,
        linecode,
        voltagelevel,
        createtime
      }
    } else {
      this.ruleForm = {
        linename: '',
        linecode: '',
        voltagelevel: 0,
        createtime: ''
      }
    }

    console.log(this.ruleForm)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('confirm', this.ruleForm, this.branchlineData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancle() {
      this.$emit('cancle')
    },
    deleteline() {
      console.log(this.id)
      this.$emit('deleteline', this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.addorupdate {
  display: flex;
  flex-direction: column;
  .title {
    border-left: 3px solid #ccc;
    padding: 5px;
  }
  .el-form {
    border-bottom: 1px solid #ccc;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-input {
    width: 220px;
  }
}
</style>
