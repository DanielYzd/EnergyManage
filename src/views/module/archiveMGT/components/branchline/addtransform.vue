<template>
  <div class="addorupdate">
    <div class="title">变压器信息</div>
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
          <el-form-item prop="transcode" label="变压器编号">
            <el-input size="small" v-model="ruleForm.transcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="transname" label="变压器名称">
            <el-input size="small" v-model="ruleForm.transname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="transtype" label="变压器型号">
            <el-input size="small" v-model="ruleForm.transtype"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ratedcapacity" label="额定容量">
            <el-input
              type="number"
              size="small"
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
              v-model="ruleForm.ratedvoltage"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ratedcurrent" label="额定电流">
            <el-input
              size="small"
              type="number"
              v-model="ruleForm.ratedcurrent"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="noloadloss" label="空载损耗">
            <el-input size="small" v-model="ruleForm.noloadloss"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="loadloss" label="负载损耗">
            <el-input size="small" v-model="ruleForm.loadloss"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供电形式" prop="supplymode">
            <el-select size="small" v-model="ruleForm.supplymode">
              <el-option label="专变" :value="0"></el-option>
              <el-option label="公变" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="operationdate" label="投运时间" size="small">
            <!-- <el-input size="small" v-model="ruleForm.operationdate"></el-input> -->
            <el-date-picker
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
            <el-input size="small" v-model="ruleForm.factory"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="serialnumber" label="出厂编号">
            <el-input size="small" v-model="ruleForm.serialnumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="createtime" label="建档时间">
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
        <el-col :span="12">
          <el-form-item label="安装地址" prop="installlocation">
            <el-input
              type="textarea"
              size="small"
              v-model="ruleForm.installlocation"
            ></el-input>
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
        pcode: '',
        archivetype: '',
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
        installlocation: '',
        id: 0
      },
      pcodeArray: [],
      rules: {
        pcode: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        transname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        transcode: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        operationdate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
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
        console.log(res)
        this.ruleForm = { ...res.data }
      })
    } else {
      this.ruleForm.archivetype = this.node.archivetype
      this.ruleForm.pcode = ''
      this.ruleForm.transcode = ''
      this.ruleForm.transname = ''
      this.ruleForm.transtype = ''
      this.ruleForm.ratedcapacity = ''
      this.ruleForm.ratedvoltage = ''
      this.ruleForm.ratedcurrent = ''
      this.ruleForm.noloadloss = ''
      this.ruleForm.loadloss = ''
      this.ruleForm.supplymode = 0
      this.ruleForm.operationdate = ''
      this.ruleForm.factory = ''
      this.ruleForm.serialnumber = ''
      this.ruleForm.createtime = ''
      this.ruleForm.installlocation = ''
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
        this.ruleForm.archivetype = this.node.archivetype
        this.ruleForm.pcode = ''
        this.ruleForm.transcode = ''
        this.ruleForm.transname = ''
        this.ruleForm.transtype = ''
        this.ruleForm.ratedcapacity = ''
        this.ruleForm.ratedvoltage = ''
        this.ruleForm.ratedcurrent = ''
        this.ruleForm.noloadloss = ''
        this.ruleForm.loadloss = ''
        this.ruleForm.supplymode = 0
        this.ruleForm.operationdate = ''
        this.ruleForm.factory = ''
        this.ruleForm.serialnumber = ''
        this.ruleForm.createtime = ''
        this.ruleForm.installlocation = ''
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
            this.$api.newbranchline.modifytrans(this.ruleForm).then(res => {
              console.log(res)
              this.$emit('refresh')
            })
          } else {
            this.$api.newbranchline.addtrans(this.ruleForm).then(res => {
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
