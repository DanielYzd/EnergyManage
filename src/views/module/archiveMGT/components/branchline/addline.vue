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
          <el-form-item label="档案类型" prop="archivetype">
            <el-input
              v-model="ruleForm.archivetype"
              size="mini"
              disabled
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="pcode">
            <el-select v-model="ruleForm.pcode" size="mini" clearable>
              <el-option
                v-for="item in pcodeArray"
                :key="item.pcode"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col
          :span="18"
          style="display:flex;align-items:center; justify-content:center;"
        >
          <el-form-item>
            <el-button
              size="mini"
              @click="deletetransline"
              type="danger"
              v-if="Object.keys(this.node).length > 1"
              >删除</el-button
            >
            <el-button size="mini" @click="cancle">取消</el-button>
            <el-button type="primary" size="mini" @click="submit('ruleForm')"
              >确认</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <mount
      v-if="Object.keys(this.node).length > 1"
      :ruleForm="ruleForm"
    ></mount>
  </div>
</template>

<script>
import mount from './mount'
export default {
  components: {
    mount
  },
  props: {
    node: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        archivetype: '',
        pcode: '',
        linename: '',
        linecode: '',
        voltagelevel: 0,
        createtime: '',
        mountstatus: 0,
        id: 0
      },

      pcodeArray: [],
      rules: {
        linename: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        linecode: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        pcode: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        voltagelevel: [
          { required: true, message: '请输入电压等级', trigger: 'blur' }
        ],
        createtime: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.searchpcode(this.node.archivetype)
    if (Object.keys(this.node).length > 1) {
      let body = {
        id: this.node.id
      }
      this.$api.newbranchline.queryonedocument(body).then(res => {
        this.ruleForm = { ...res.data }
      })
    } else {
      this.ruleForm.archivetype = this.node.archivetype
      this.ruleForm.pcode = ''
      this.ruleForm.linename = ''
      this.ruleForm.linecode = ''
      this.ruleForm.createtime = ''
      this.voltagelevel = 0
    }
  },
  watch: {
    node(newValue, oldValue) {
      this.node = newValue
      this.searchpcode(newValue.archivetype)

      if (Object.keys(newValue).length > 1) {
        let body = {
          id: newValue.id
        }
        this.$api.newbranchline.queryonedocument(body).then(res => {
          this.ruleForm = { ...res.data }
        })
      } else {
        this.ruleForm.archivetype = newValue.archivetype
        this.ruleForm.pcode = ''
        this.ruleForm.linename = ''
        this.ruleForm.linecode = ''
        this.ruleForm.createtime = ''
        this.ruleForm.voltagelevel = 0
      }
    }
  },
  methods: {
    cancle() {
      this.$emit('empty')
    },
    searchpcode(archivetype) {
      let body = { archivetype }
      this.$api.newbranchline.searchpcode(body).then(res => {
        this.pcodeArray = res.data.map(item => {
          return { label: item.pname, value: item.pcode.toString() }
        })
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (Object.keys(this.node).length > 1) {
            //   archive/transformer/modifylines
            this.$api.newbranchline.modifylines(this.ruleForm).then(res => {
              console.log(res)
              this.$emit('refresh')
            })
          } else {
            this.$api.newbranchline.addline(this.ruleForm).then(res => {
              console.log(res)
              let id = res.id
              this.$emit('refresh', id)
            })
          }
        }
      })
    },
    deletetransline() {
      this.$api.newbranchline.deletetransline(this.node.id).then(res => {
        console.log(res)
        this.$emit('empty')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addorupdate {
  display: flex;
  flex-direction: column;
  .title {
    border-left: 3px solid rgb(113, 156, 124);
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
  .el-select {
    width: 220px;
  }
}
</style>
