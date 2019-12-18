<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="父级名称" prop="plabel">
            <el-input v-model="ruleForm.plabel" disabled></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="父级ID" prop="pcode">
            <el-input-number
              v-model="ruleForm.pcode"
              disabled
            ></el-input-number>
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- <el-form-item label="层级" prop="layer">
          <el-input-number v-model="ruleForm.layer" disabled></el-input-number>
        </el-form-item> -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="字典标签" prop="slabel">
            <el-input v-model="ruleForm.slabel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典值" prop="svalue">
            <el-input v-model="ruleForm.svalue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="ruleForm.notes"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
        <el-button type="primary" @click="cancle()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    nodeData: {
      type: Object
    },
    parentForm: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        plabel: '',
        pcode: 0,
        slabel: '',
        layer: 0,
        svalue: '',
        notes: ''
      },
      rules: {
        slabel: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        svalue: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
      }
    }
  },
  watch: {
    parentForm(newValue, oldValue) {
      this.ruleForm = newValue
    }
  },
  created() {
    this.ruleForm = this.parentForm
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   console.log(this.ruleForm)
          console.log(this.ruleForm)
          this.$emit('dictOperation', this.ruleForm)
          // this.$api.sys.dictOperation(this.ruleForm).then(res => {
          //   console.log(res)
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancle() {
      console.log((this.$parent.showType = ''))
      // console.log((this.$parent.btnDisabled = true))
    }
  }
}
</script>

<style lang="scss" scoped></style>
