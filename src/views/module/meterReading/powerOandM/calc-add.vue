<template>
  <el-dialog
    custom-class="dialogcommon"
    title="添加重算任务"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      label-width="140px"
    >
      <el-form-item label="用户信息" prop="hms">
        <el-input v-model="dataForm.hms" placeholder="户名"></el-input>
      </el-form-item>
      <el-form-item label="表计名称" prop="pointNames">
        <el-input
          v-model="dataForm.pointNames"
          placeholder="表计名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="jobType">
        <el-select
          v-model="dataForm.jobType"
          placeholder="任务名称"
          style="width: 100%;"
          @change="handlerChange"
        >
          <el-option
            v-for="item in jobTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <hl-date-picker
        label="开始时间"
        v-model="dataForm.datatime"
      ></hl-date-picker>
      <hl-date-picker
        label="结束时间"
        v-model="dataForm.datatime2"
        disabled="true"
      ></hl-date-picker>
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
import hlDatePicker from '@/components/hl-date-picker'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        customerids: '',
        pointids: '',
        hms: '',
        pointNames: '',
        jobType: 0,
        datatime: null,
        datatime2: null
      },
      jobTypeList: [
        { value: 0, key: '计算费控用户扣费金额' },
        { value: 1, key: '计算计量点电量' }
      ]
    }
  },
  components: {
    hlDatePicker
  },
  methods: {
    init(rows) {
      this.visible = true
      this.dataForm.customerids = ''
      this.dataForm.pointids = ''
      this.dataForm.hms = ''
      var customerids = []
      var pointids = []
      var hms = []
      var pointNames = []
      rows.forEach(item => {
        if (item.customerid) {
          customerids.push(item.customerid)
        }
        if (item.hm) {
          hms.push(item.hm)
        }
        if (item.disc) {
          pointNames.push(item.disc)
        }
        if (item.pointid) {
          pointids.push(item.pointid)
        }
      })
      this.dataForm.customerids = customerids.join(',')
      this.dataForm.hms = hms.join(',')
      this.dataForm.pointNames = pointNames.join(',')
      this.dataForm.pointids = pointids.join(',')
    },
    handlerChange(value) {},
    dataFormSubmit() {
      if (this.dataForm.jobType === 0) {
        this.calcPpfMoney()
      } else if (this.dataForm.jobType === 1) {
        this.calcPointEnergy()
      }
    },
    calcPpfMoney() {
      let params = {
        customerids: this.dataForm.customerids,
        datatime: this.dataForm.datatime
      }
      this.$http.ajaxGet('/sys/calc/ppfMoney', params, res => {
        this.$message.success('任务添加成功，请稍后重新查询数据!')
        this.visible = false
      })
    },
    calcPointEnergy() {
      let params = {
        pointids: this.dataForm.pointids,
        datatime: this.dataForm.datatime,
        datatime2: this.dataForm.datatime2
      }
      this.$http.ajaxGet('/sys/calc/pointEnergy', params, res => {
        this.$message.success('任务添加成功，请稍后重新查询数据!')
        this.visible = false
      })
    }
  }
}
</script>
<style></style>
