<template>
  <el-dialog
    title="远程拉闸合闸"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="display: flex;min-height: 330px;">
      <el-card class="box-card" style="width: 40%;min-width: 180px;">
        <el-form
          :model="dataForm"
          label-width="100px"
          label-position="left"
          size="small"
        >
          <el-form-item label="门牌号">
            <el-input v-model="dataForm.doorplate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="户名">
            <el-input v-model="dataForm.hm" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="dataForm.address" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
              v-model="dataForm.telephone"
              :disabled="true"
              style="width: 80%;"
            ></el-input>
          </el-form-item>
          <el-form-item label="所有表计">
            <el-radio-group
              v-model="selectedMeter.pointid"
              @change="pointChange"
            >
              <el-radio
                style="width: 80%;display: block;margin-top: 10px;margin-left: 30px;"
                v-for="(meter, index) in meterList"
                :label="meter.pointid"
                :key="index"
                >{{ meter.disc }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card" style="flex:1;margin-left: 10px;">
        <div>
          当前开关状态：
          <el-button type="success" v-if="selectedMeter.status === 0" circle
            >开</el-button
          >
          <el-button type="info" v-if="selectedMeter.status === 1" circle
            >关</el-button
          >
        </div>
        <div class="singleMeter">
          <div class="meterStatus">
            <icon-svg
              v-if="selectedMeter.status === 0"
              class="meterOn"
              name="lightOn"
            ></icon-svg>
            <icon-svg
              v-if="selectedMeter.status === 1"
              name="lightOff"
            ></icon-svg>
          </div>
          <div class="meterAddress"></div>
          <el-button-group class="meter-button" style="margin-top: 50px;">
            <el-button
              type="success"
              @click="controlHander(0)"
              :loading="isRunning"
              >合闸</el-button
            >
            <el-button
              type="info"
              @click="controlHander(1)"
              :loading="isRunning"
              >拉闸</el-button
            >
          </el-button-group>
        </div>
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
const SWITCH_ON = 0
const SWITCH_OFF = 1
export default {
  data() {
    return {
      visible: false,
      isRunning: false,
      meterTypeList: [
        { key: '电', value: 0 },
        { key: '水', value: 1 },
        { key: '气', value: 2 }
      ], //,{key : '热',value : 3}
      dataForm: {
        hm: '',
        doorplate: '',
        telephone: '',
        address: ''
      },
      meterList: [],
      selectedMeter: {
        status: 0,
        pointid: null
      }
    }
  },
  methods: {
    init(customerInfo) {
      this.visible = true
      this.selectedMeter.pointid = null
      if (customerInfo) {
        this.dataForm.customerid = customerInfo.customerid
        this.dataForm.doorplate = customerInfo.doorplate
        this.dataForm.hm = customerInfo.hm
        this.dataForm.telephone = customerInfo.telephone
        this.dataForm.address = customerInfo.address
        this.dataForm.balance = customerInfo.syje
      }
      this.$nextTick(() => {
        this.$http.ajaxGet(
          `/pob/meter/customerMeters/${this.dataForm.customerid}`,
          {},
          resOk => {
            if (resOk.code === 0) {
              this.meterList = resOk.data
            }
          },
          resError => {
            this.$message.error(resError.msg)
          }
        )
      })
    },
    pointChange(value) {
      this.meterList.some(item => {
        if (item.pointid === value) {
          this.selectedMeter.status =
            item.useenergyStatus !== SWITCH_OFF ? SWITCH_ON : SWITCH_OFF
          return true
        }
      })
    },
    meterTypeChange() {},
    dataFormSubmit() {},
    controlHander(value) {
      if (!this.selectedMeter.pointid) {
        this.$message.error('没有选择远程控制的表计!')
        return
      }
      this.isRunning = true
      var url = '/remote/rtu/switchDoExt'
      var params = {
        pointIds: [this.selectedMeter.pointid].join(','),
        switchType: value
      }
      this.$http.ajaxGet(
        url,
        params,
        resOk => {
          var isOptSuccess = resOk.data.success
          if (isOptSuccess) {
            this.$message({
              message: '操作成功!',
              type: 'success'
            })
          } else {
            this.$message.error('操作失败!')
          }
          this.selectedMeter.status = value
          this.isRunning = false
        },
        errorMsg => {
          this.$message.error('请求超时,超过50秒无响应!')
          this.isRunning = false
        }
      )
    }
  }
}
</script>

<style scoped>
.el-dialog__body {
  padding: 10px 20px;
}
.el-input.is-disabled .el-input__inner {
  color: #45c2b5;
}
.singleMeter {
  /*float: left;*/
  min-width: 200px;
  height: 220px;
  text-align: center;
  color: #666;
  font-size: 13px;
  transition: color 0.15s linear;
  /*border: 1px solid #eee;*/
  margin-right: -1px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(../../../../static/img/digitalScreen.png);
}
.meterStatus {
  padding-top: 35px;
  font-size: 50px;
  height: 110px;
}
.meterAddress {
  padding-top: 40px;
  height: 60px;
}
.meterOn {
  color: #67c23a;
}
</style>
