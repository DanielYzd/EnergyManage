<template>
  <el-dialog
    :title="this.flag === 0 ? '召读指定表序号' : '清除表地址'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="140px"
      size="small"
    >
      <el-form-item label="终端地址" prop="rtuAddr">
        <el-input v-model="dataForm.rtuAddr" placeholder="终端地址"></el-input>
        <!-- <el-select
          v-model="dataForm.rtuid"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入终端地址"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in rtuList"
            :key="item.rtuid"
            :label="item.commaddress"
            :value="item.rtuid"
          >
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="表序号" prop="numberid">
        <el-input-number
          v-model="dataForm.numberid"
          require
          :min="1"
          :max="1000"
          label="请输入表序号"
        ></el-input-number>
      </el-form-item>
      <el-form-item v-if="this.flag === 1">
        <label
          >同一终端下存在相同表地址，会导致该表地址的数据抄不到，可使用此清除命令，去掉表地址重复的表序号！</label
        >
      </el-form-item>
      <el-form-item>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      flag: 0,
      rtuList: [],
      dataForm: {
        rtuAddr: '',
        rtuid: null,
        numberid: null
      },
      loading: false,
      pointid: null
    }
  },
  methods: {
    init(flag, rtuAddr) {
      this.flag = flag
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (rtuAddr) {
        this.dataForm.rtuAddr = rtuAddr
      }
    },
    dataFormSubmit() {
      if (!this.dataForm.rtuAddr || !this.dataForm.numberid) {
        this.$message.error('必须填入终端地址 和 表序号!')
        return
      }
      this.visible = false
      this.loadRtu(this.dataForm.rtuAddr, true)
    },
    loadRtu(rtuAddr, isCallback) {
      var params = {
        regionid: this.dataForm.regionid,
        page: 1,
        limit: 50,
        commaddress: rtuAddr
      }
      this.$http.ajaxGet('/pob/rtu/list', params, data => {
        if (data && data.code === 0) {
          this.rtuList = data.page.list
          if (isCallback && this.rtuList.length > 0) {
            this.$emit(
              'sendAction',
              this.flag,
              this.rtuList[0].rtuid,
              this.dataForm.rtuAddr,
              this.dataForm.numberid
            )
          }
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.loadRtu(query)
        }, 200)
      } else {
        this.rtuList = []
      }
    }
  }
}
</script>

<style></style>
