<template>
  <el-dialog
  custom-class="dialogcommon"
    title="迁移到指定用户"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :inline="true"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      label-width="140px"
    >
      <el-form-item label="表计名称" prop="disc">
        <el-input
          v-model="dataForm.disc"
          placeholder="表计名称"
          disabled
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item label="表通信地址" prop="commaddress">
        <el-input
          v-model="dataForm.commaddress"
          placeholder="表通信地址"
          disabled
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <region-select-item
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        prop="regionName"
      ></region-select-item>
      <el-form-item label="用户名称">
        <el-select
          v-model="dataForm.customerid"
          style="width:220px"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入"
          :remote-method="remoteMethod"
          :loading="opLoading"
        >
          <el-option
            v-for="item in customerList"
            :key="item.customerid"
            :label="item.disc"
            :value="item.customerid"
          ></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item style="margin-left: 40px;">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import regionSelect from '@/views/modules/pob/region-select'
export default {
  data() {
    return {
      loading: false,
      opLoading: false,
      visible: false,
      dataForm: {
        pointid: 0,
        disc: '',
        type: 0,
        commaddress: '',
        regionName: '',
        regionid: '',
        customerid: 0
      },
      customerList: []
    }
  },
  components: {
    'region-select-item': regionSelect
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
          url: this.$http.adornUrl(`/pob/meter/info/${this.dataForm.pointid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.regionName = data.meter.regionName
            this.dataForm.regionid = data.meter.regionid
            this.dataForm.disc = data.meter.disc
            this.dataForm.hm = data.meter.hm
            this.dataForm.commaddress = data.meter.commaddress
            this.dataForm.type = data.meter.type
            this.dataForm.customerid = data.meter.customerid
            this.remoteMethod()
          }
        })
      }
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.dataForm.mesureLocalId = null
      this.remoteMethod()
    },
    meterTypeChange(value) {
      if (value === 0) {
        this.dataForm.energyType = 1
      } else if (value === 1) {
        this.dataForm.energyType = 5
      } else if (value === 2) {
        this.dataForm.energyType = 7
      } else if (value === 3) {
        this.dataForm.energyType = 8
      }
    },
    remoteMethod(queryStr) {
      if (!this.dataForm.regionid) {
        this.$message({
          message: '请先选择所属区域进行',
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.opLoading = true
      setTimeout(() => {
        this.opLoading = false
        this.loadCustomer(queryStr)
      }, 1000)
    },
    loadCustomer(query) {
      var params = {
        hm: query,
        regionid: this.dataForm.regionid,
        page: 1,
        limit: 50
      }
      this.$http.ajaxGet('/pob/customer/list', params, res => {
        this.customerList = res.page.list
      })
    },
    dataFormSubmit() {
      if (this.dataForm.customerid) {
        this.$http.ajaxGet(
          '/pob/meter/changeCustomer',
          {
            pointid: this.dataForm.pointid,
            customerid: this.dataForm.customerid,
            regionid: this.dataForm.regionid
          },
          res => {
            this.$message.success('操作成功!')
            this.visible = false
            this.$emit('refreshDataList')
          }
        )
      }
    }
  }
}
</script>
<style></style>
