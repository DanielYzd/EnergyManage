<template>
  <el-dialog title="下发" :close-on-click-modal="false" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :inline="true"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="180px"
      size="small"
    >
      <el-form-item label="表名">
        <el-input
          v-model="dataForm.disc"
          disabled
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="表类型">
        <el-input
          v-model="dataForm.typeName"
          disabled
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="终端地址" prop="rtuid">
        <el-input
          v-model="dataForm.rtuAddr"
          disabled
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="表序号" prop="numberid">
        <el-input-number
          v-model="dataForm.numberid"
          disabled
          :min="1"
          :max="1000"
          label="请输入表序号"
          style="width: 200px;"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="表通信地址" prop="commaddress">
        <el-input
          v-model="dataForm.commaddress"
          disabled
          placeholder="表通信地址"
          clearable
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="通信端口号">
        <el-select v-model="dataForm.com">
          <el-option
            v-for="item in portTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通信速率">
        <el-select v-model="dataForm.bps">
          <el-option
            v-for="item in commRateList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通信规约">
        <el-select v-model="dataForm.protocol">
          <el-option
            v-for="item in protocolList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拉合闸密级">
        <el-input-number
          v-model="dataForm.secretLevel"
          :min="0"
          :max="100"
          label="拉合闸密级"
          style="width: 200px;"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="拉合闸密码">
        <el-input
          v-model="dataForm.secretCode"
          placeholder="拉合闸密码"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input
          v-model="dataForm.hm"
          disabled
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 35%;">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit(0)">保存</el-button>
        <el-button type="primary" @click="dataFormSubmit(1)"
          >保存并下发</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import hlProgress from '@/components/hl-progress'
export default {
  name: 'meter-params-add',
  data() {
    return {
      loading: false,
      activeNames: ['1'],
      visible: false,
      dataForm: {
        pointid: 0,
        rtuid: 0,
        disc: '',
        typeName: '',
        hm: '',
        numberid: 1,
        protocol: 30, // 默认值	DL/T 645—2007
        com: 2, // 默认值	485端口1
        bps: 3, // 默认值	2400
        integernum: 0,
        decimalnum: 0,
        commaddress: '',
        colAddr: '000000000000',
        meterPwd: '000000000000',
        bigclass: null,
        subclass: null,
        secretLevel: 2,
        secretCode: 0
      },
      regionList: [],
      rtuList: [],
      meterTypeList: [
        { key: '电', value: 0 },
        { key: '水', value: 1 },
        { key: '气', value: 2 },
        { key: '热', value: 3 }
      ],
      energyTypeList: [],
      portTypeList: [
        { value: 1, key: 'COM1' },
        { value: 2, key: '485端口1' },
        { value: 3, key: '485端口2' },
        { value: 31, key: '载波' }
      ],
      commRateList: [
        { value: 0, key: '默认速率' },
        { value: 1, key: '600' },
        { value: 2, key: '1200' },
        { value: 3, key: '2400' },
        { value: 4, key: '4800' },
        { value: 5, key: '7200' },
        { value: 6, key: '9600' },
        { value: 7, key: '19200' }
      ],
      protocolList: [
        { value: 1, key: 'DL/T 645—1997' },
        { value: 30, key: 'DL/T 645—2007' },
        { value: 32, key: '水气热表CJ/T 188-2004' },
        { value: 2, key: '交流采样装置通信协议' }
      ], //
      dataRule: {
        commaddress: [
          { required: true, message: '表地址不能为空', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        rtuid: [
          { required: true, message: '终端地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.pointid = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.pointid) {
        this.$http({
          url: this.$http.adornUrl(`/pob/point/info/${this.dataForm.pointid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.regionName = data.point.regionName
            this.dataForm.regionId = data.point.regionid
            this.dataForm.pointid = data.point.pointid
            this.dataForm.numberid = data.point.numberid
            this.dataForm.disc = data.point.disc
            this.dataForm.hm = data.point.hm
            this.dataForm.commaddress = data.point.commaddress
            this.dataForm.customerid = data.point.customerid
            this.dataForm.typeName = data.point.typeName
            this.dataForm.type = data.point.type
            this.dataForm.rtuid = data.point.rtuid
            this.dataForm.rtuAddr = data.point.rtuAddr
            this.dataForm.bps = data.point.bps
            this.dataForm.com = data.point.com
            this.dataForm.protocol = data.point.protocol
            this.dataForm.meterPwd = data.point.meterPwd
            this.dataForm.tariffNum = data.point.tariffNum
            this.dataForm.colAddr = data.point.colAddr
            this.dataForm.bigclass = data.point.bigclass
            this.dataForm.subclass = data.point.subclass
            this.dataForm.integernum = data.point.integernum
            this.dataForm.decimalnum = data.point.decimalnum
            this.dataForm.secretLevel = data.point.secretLevel
            this.dataForm.secretCode = data.point.secretCode
            if (data.point.rtuid) {
              var tmp = {
                rtuid: data.point.rtuid,
                commaddress: data.point.rtuAddr
              }
              if (
                this.rtuList.findIndex(function(item) {
                  return item.rtuid == data.point.rtuid
                }) == -1
              ) {
                this.rtuList.push(tmp)
              }
            }
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit(flag) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          var pointParam = {
            pointid: this.dataForm.pointid,
            customerid: this.dataForm.customerid,
            rtuid: this.dataForm.rtuid,
            type: this.dataForm.type,
            numberid: this.dataForm.numberid,
            commaddress: this.dataForm.commaddress,
            bps: this.dataForm.bps,
            com: this.dataForm.com,
            protocol: this.dataForm.protocol,
            meterPwd: this.dataForm.meterPwd,
            tariffNum: this.dataForm.tariffNum,
            colAddr: this.dataForm.colAddr,
            bigclass: this.dataForm.bigclass,
            subclass: this.dataForm.subclass,
            integernum: this.dataForm.integernum,
            decimalnum: this.dataForm.decimalnum,
            secretLevel: this.dataForm.secretLevel,
            secretCode: this.dataForm.secretCode
          }
          this.$http({
            url: this.$http.adornUrl('/pob/point/save'),
            method: 'post',
            data: this.$http.adornData(pointParam)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  if (flag === 1) {
                    this.$emit('sendAction', [data.point.pointid])
                  }
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
<style></style>
