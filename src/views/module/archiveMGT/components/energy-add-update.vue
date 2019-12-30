<template>
  <div class="addorupdate">
    <div class="title">档案信息</div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="160px"
    >
      <el-row>
        <el-col :span="11">
          <region-select-item
            label="所属区域"
            :size="size"
            v-model="ruleForm.regionName"
            @getRegion="getSelectRegion"
          ></region-select-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="建筑编号" prop="buildingcode">
            <el-input v-model="ruleForm.buildingcode" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="建筑名称" prop="buildingname">
            <el-input v-model="ruleForm.buildingname" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="建筑简称" prop="buildingshort">
            <el-input v-model="ruleForm.buildingshort" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="建筑类型" prop="buildingtype">
            <el-select v-model="ruleForm.buildingtype" size="mini">
              <el-option
                v-for="item in buildingtypeArray"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="建筑功能" prop="buildingfun">
            <el-input v-model="ruleForm.buildingfun" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="建筑面积" prop="buildingarea">
            <el-input v-model="ruleForm.buildingarea" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="特殊区域面积" prop="specialarea">
            <el-input v-model="ruleForm.specialarea" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="高度" prop="buildingheight">
            <el-input
              v-model="ruleForm.buildingheight"
              type="number"
              size="mini"
              min="1"
              max="99"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="层数" prop="floornumber">
            <el-input
              v-model="ruleForm.floornumber"
              type="number"
              size="mini"
              min="1"
              max="100"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="地上层数" prop="groundnum">
            <el-input
              v-model="ruleForm.groundnum"
              size="mini"
              type="number"
              min="1"
              max="100"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="地下层数" prop="undergroundnum">
            <el-input
              v-model="ruleForm.undergroundnum"
              size="mini"
              type="number"
              min="1"
              max="100"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="竣工日期" prop="completiondate">
            <el-date-picker
              v-model="ruleForm.completiondate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="使用日期" prop="useddate">
            <el-date-picker
              v-model="ruleForm.useddate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="使用人数" prop="usernumber">
            <el-input
              type="number"
              v-model="ruleForm.usernumber"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="建档时间" prop="createtime">
            <el-date-picker
              v-model="ruleForm.createtime"
              type="datetime"
              placeholder="选择日期时间"
              size="mini"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
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
              type="danger"
              size="mini"
              v-show="this.type === 'edit'"
              @click="deletebuilding"
              >删除</el-button
            >
            <el-button size="mini" @click="cancle">取消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="submitForm('ruleForm')"
              >确认</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import regionSelect from '@/views/modules/pob/region-select'
export default {
  components: {
    'region-select-item': regionSelect
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    parentData: {
      type: Object
    }
  },
  data() {
    return {
      size: 'mini',
      buildingtypeArray: [],
      initform: {},
      ruleForm: {
        archivetype: 2,
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        buildingcode: '', //建筑编号
        buildingname: '',
        buildingshort: '',
        buildingtype: '',
        buildingfun: '',
        buildingarea: '',
        specialarea: '',
        buildingheight: '',
        floornumber: '',
        groundnum: '',
        undergroundnum: '',
        completiondate: '',
        useddate: '',
        usernumber: '',
        createtime: '',
        mountstatus: 0,
        id: 0
      },
      rules: {
        regionName: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        buildingcode: [
          { required: true, message: '请输入建筑编号', trigger: 'blur' }
        ],
        buildingname: [
          { required: true, message: '请输入建筑名称', trigger: 'blur' }
        ],
        buildingtype: [
          { required: true, message: '请选择建筑类型', trigger: 'change' }
        ],
        createtime: [
          {
            required: true,
            message: '请选择创建日期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    console.log(this.$cookie.get('regionName'))
    console.log(this.$cookie.get('regionid'))
    this.queryallbuildingkind()
    this.initform = JSON.parse(JSON.stringify(this.ruleForm))
    console.log(this.parentData)
    if (Object.keys(this.parentData).length > 0) {
      this.ruleForm = JSON.parse(JSON.stringify(this.parentData))
    } else {
      console.log('init')
      this.ruleForm = JSON.parse(JSON.stringify(this.initform))
    }
  },
  watch: {
    parentData(newValue, oldValue) {
      if (Object.keys(newValue).length > 0) {
        this.ruleForm = JSON.parse(JSON.stringify(newValue))
      }
    }
  },
  methods: {
    getSelectRegion(data) {
      this.ruleForm.regionid = data.id
      this.ruleForm.regionName = data.label
      // this.getDataList()
    },
    queryallbuildingkind() {
      this.$api.building.queryallbuildingkind().then(res => {
        console.log(res)
        this.buildingtypeArray = res.data.map(item => {
          return { label: item.slabel, value: item.id }
        })
      })
    },
    cancle() {
      this.$emit('cancle')
    },
    deletebuilding() {
      this.$emit('deletebuilding')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.buildingheight = parseInt(this.ruleForm.buildingheight)
          this.ruleForm.floornumber = parseInt(this.ruleForm.floornumber)
          this.ruleForm.groundnum = parseInt(this.ruleForm.groundnum)
          this.ruleForm.undergroundnum = parseInt(this.ruleForm.undergroundnum)
          this.ruleForm.usernumber = parseInt(this.ruleForm.usernumber)
          this.ruleForm.regionid = parseInt(this.ruleForm.regionid)
          this.$emit('confirm', this.ruleForm, this.type)
        } else {
          console.log('error submit!!')
          return false
        }
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
    border-left: 3px solid #ccc;
    padding: 5px;
  }
  .el-form {
    border-bottom: 1px solid #ccc;
    /deep/.el-form-item {
      // width: 100%;
      // display: flex;
      margin-bottom: 15px;
      .el-form-item__label {
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 30px !important;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .el-form-item__content {
        line-height: 30px !important;
        position: relative;
        font-size: 12px;
      }
      .el-input {
        width: 210px;
      }
      .el-select {
        width: 210px;
      }
    }
  }
}
</style>
