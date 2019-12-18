<!--
	作者：378357088@qq.com
	时间：2018-08-24
	描述：功能定位：
-->
<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
    >
      <region-select-item
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
      ></region-select-item>
      <el-form-item>
        <el-input
          style="width:400px;"
          placeholder="请输入"
          v-model="dataForm.searchWord"
          class="input-with-select"
          clearable
        >
          <el-select
            v-model="searchSelect"
            slot="prepend"
            placeholder="请选择"
            style="width: 130px;"
          >
            <el-option label="户名" value="1"></el-option>
            <el-option label="手机号" value="2"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('pob:customer:save')"
          @click="addOrUpdateHandle()"
          icon="el-icon-circle-plus-outline"
          type="primary"
          >新增</el-button
        >
        <el-button
          v-if="isAuth('pob:customer:save')"
          type="primary"
          @click="batchAddHandle()"
          icon="el-icon-document"
          >批量导入</el-button
        >
        <el-button
          v-if="isAuth('pob:customer:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          icon="el-icon-delete"
          >批量删除</el-button
        >
        <!--<el-button type="info" :icon="isShoreMode?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShoreMode = !isShoreMode">更多</el-button>-->
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tburl"
      v-bind:tbcols="tbcols"
      ref="dataTable"
      v-bind:tbstyle="tbstyle"
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
    <batch-add
      v-if="batchAddVisible"
      ref="batchAdd"
      @refreshDataList="getDataList"
    ></batch-add>
  </div>
</template>

<script>
import regionSelect from '@/views/modules/pob/region-select'
import AddOrUpdate from './archives-add-or-update'
import batchAdd from './archives-batch-add'
import hltable from '@/components/hltable'
export default {
  components: {
    AddOrUpdate,
    'region-select-item': regionSelect,
    hltable,
    batchAdd
  },
  computed: {
    // 计算属性的 getter
  },
  data() {
    return {
      isShoreMode: false,
      searchSelect: '1',
      meterTypeList: [
        { key: '电', value: 0 },
        { key: '水', value: 1 },
        { key: '气', value: 2 }
      ], //,{key : '热',value : 3}
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        searchWord: '',
        hm: '',
        telephone: '',
        type: [0, 1, 2]
      },
      tburl: '/pob/customerUnion/list',
      tbstyle: {
        width: '100%'
      },
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 1,
        hasUpdateAuth: this.isAuth('pob:customer:update'),
        hasDeleteAuth: this.isAuth('pob:customer:delete'),
        isShowPage: true
      },
      tbcols: [
        { prop: 'regionName', label: '所属区域' },
        { prop: 'disc', label: '户名', width: 220 },
        //,{prop:"doorplate", label:"门牌号",width:200}
        { prop: 'telephone', label: '手机号', width: 130 },
        {
          prop: 'ppfstatusName',
          label: '主站计费',
          width: 90,
          tag: true,
          getColor: function(row) {
            if (row.ppfstatus === 0) {
              return 'warning'
            } else {
              return 'info'
            }
          }
        },
        { prop: 'starttime', label: '计费开始日期', width: 120 },
        { prop: 'checkOutTime', label: '计费结束日期', width: 120 },
        { prop: 'unitPriceNameEle', label: '电价' },
        { prop: 'unitPriceNameWat', label: '水价' }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      batchAddVisible: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid,
        type: this.dataForm.type.join(),
        hm: this.searchSelect === '1' ? this.dataForm.searchWord : null,
        telephone: this.searchSelect === '2' ? this.dataForm.searchWord : null
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row ? row.customerid : null)
      })
    },
    // 批量导入
    batchAddHandle() {
      this.batchAddVisible = true
      this.$nextTick(() => {
        this.$refs.batchAdd.init()
      })
    },
    // 删除
    deleteHandle(row) {
      var ids = row
        ? [row.customerid]
        : this.dataListSelections.map(item => {
            return item.customerid
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
        this.$http.ajaxPost(
          '/pob/customerUnion/delete',
          ids,
          () => {
            this.$message.success('操作成功')
            this.getDataList()
          },
          data => {
            this.$message.error(data.msg)
          }
        )
      })
    }
  }
}
</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
