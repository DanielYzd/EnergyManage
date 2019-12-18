<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
      labelWidth="85px"
    >
      <region-select-item
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        class="queryFormItem"
      ></region-select-item>
      <el-form-item label="计量标志" class="queryFormItem">
        <el-select
          v-model="dataForm.loopUsedType"
          clearable
          placeholder="计量标志"
          @change="getDataList"
          class="formItem"
        >
          <el-option
            v-for="item in loopUsedTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表通信地址" class="queryFormItem">
        <el-input
          v-model="dataForm.commaddress"
          placeholder="表通信地址"
          class="formItem"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="表计类型" class="queryFormItem">
        <el-select
          v-model="dataForm.type"
          placeholder="请选择"
          class="formItem"
          @change="getDataList()"
        >
          <el-option
            v-for="item in meterTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('pob:meter:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增</el-button
        >
        <el-button
          v-if="isAuth('pob:meter:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除</el-button
        >
        <!--<el-button v-if="isAuth('pob:customer:save')" type="primary" @click="batchAddHandle()" icon="el-icon-document">批量导入</el-button>-->
        <el-button
          v-if="isAuth('pob:meter:save')"
          type="warning"
          @click="changeCustomer()"
          >移户</el-button
        >
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tburl"
      v-bind:tbcols="tbcols"
      ref="dataTable"
      v-bind:tbconfig="tbconfig"
      @addOrUpdateHandle="addOrUpdateHandle"
      @deleteHandle="deleteHandle"
      @selections="
        data => {
          this.dataListSelections = data
        }
      "
    ></hltable>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <meter-change-customer
      v-if="addOrUpdateVisible"
      ref="customerChange"
      @refreshDataList="getDataList"
    ></meter-change-customer>
    <batch-add
      v-if="batchAddVisible"
      ref="batchAdd"
      @refreshDataList="getDataList"
    ></batch-add>
  </div>
</template>

<script>
import AddOrUpdate from './meter-add-or-update'
import meterChangeCustomer from './meter-change-customer'
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
import batchAdd from './archives-batch-add'
import globals from '@/utils/globals'
export default {
  data() {
    return {
      dataForm: {
        loopUsedType: null,
        type: 0,
        commaddress: '',
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName')
      },
      meterTypeList: this.$sysConfig.getMeterTypes(),
      tburl: '/pob/meter/list',
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 1,
        hasUpdateAuth: this.isAuth('pob:meter:update'),
        hasDeleteAuth: this.isAuth('pob:meter:delete'),
        isShowPage: true
      },
      loopUsedTypeList: globals.loopUsedTypeList,
      tbcols: [
        { prop: 'regionName', label: '所属区域' },
        { prop: 'disc', label: '表计名称', width: 220 },
        { prop: 'commaddress', label: '表通信地址', width: 120 },
        { prop: 'typeName', label: '表类型' },
        { prop: 'ctName', label: 'CT' },
        { prop: 'ptName', label: 'PT' },
        { prop: 'rate', label: '倍率' },
        { prop: 'instLocation', label: '安装位置' },
        { prop: 'loopUsedTypeName', label: '计量回路标志' },
        { prop: 'mesureLocalIdStr', label: '计量位置' }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      batchAddVisible: false
    }
  },
  components: {
    AddOrUpdate,
    hltable,
    meterChangeCustomer,
    'region-select-item': regionSelect,
    batchAdd
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$refs.dataTable.loadData({
        type: this.dataForm.type,
        commaddress: this.dataForm.commaddress,
        loopUsedType: this.dataForm.loopUsedType,
        regionid: this.dataForm.regionid
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row ? row.pointid : null)
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    // 批量导入
    batchAddHandle() {
      this.batchAddVisible = true
      this.$nextTick(() => {
        this.$refs.batchAdd.init()
      })
    },
    changeCustomer() {
      if (this.dataListSelections.length !== 1) {
        this.$message.info('请先选择一条表计信息')
        return
      }
      var pointid = this.dataListSelections[0].pointid
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.customerChange.init(pointid)
      })
    },
    deleteHandle(row) {
      var ids = row
        ? [row.pointid]
        : this.dataListSelections.map(item => {
            return item.pointid
          })
      var len = ids.length
      this.$confirm(
        `确定${len == 1 ? '删除' : '批量删除'} ${len}条记录?`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/pob/meter/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>

<style>
/* .queryFormItem{
		width: 25%;
	} */
</style>
