<template>
  <div>
    <div>
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
        size="small"
        label-width="85px"
      >
        <region-select-item
          label="所属区域"
          v-model="dataForm.regionName"
          @getRegion="getSelectRegion"
        ></region-select-item>
        <!-- <el-form-item label="终端地址" style="width: 25%;" prop="rtuid">
          <el-select
            v-model="dataForm.rtuid"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="输入终端地址"
            :remote-method="remoteMethod"
            @change="rtuTypeChange"
            :loading="rtuLoading"
            style="width: 100%"
          >
            <el-option
              v-for="item in rtuList"
              :key="item.rtuid"
              :label="item.commaddress"
              :value="item.rtuid"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="表计类型">
          <el-select
            v-model="type"
            clearable
            placeholder="请选择"
            class="formItem"
            @change="colsTypeChange"
          >
            <el-option
              v-for="item in meterTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表通信地址">
          <el-input
            v-model="dataForm.commaddress"
            placeholder="表通信地址"
            class="formItem"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary" icon="el-icon-search"
            >查询</el-button
          >
          <el-button
            v-if="isAuth('meterCommunication:operation1')"
            type="warning"
            icon="el-icon-arrow-up"
            @click="batchCallHandle()"
            >批量召读</el-button
          >
          <el-button
            v-if="isAuth('meterCommunication:operation2')"
            type="warning"
            icon="el-icon-arrow-down"
            @click="batchSendHandle()"
            >批量下发</el-button
          >
          <el-button
            v-if="isAuth('pob:meter:save')"
            type="success"
            icon="el-icon-download"
            @click="outExcel"
            >导出模板</el-button
          >
          <el-upload
            style="display: inline-block;"
            :action="upLoadUrl"
            :file-list="upLoadFileList"
            :onSuccess="handlerSuccess"
            accept=".xls"
            :auto-upload="true"
            :show-file-list="false"
          >
            <el-button size="small" type="success" icon="el-icon-upload2"
              >批量导入</el-button
            >
          </el-upload>
          <!-- <el-button v-if="isAuth('pob:meter:save')" type="primary" @click="callNumberid(0)">召读表序号</el-button>
          <el-button v-if="isAuth('pob:meter:save')" type="warning" @click="callNumberid(1)">清除表地址</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex;">
      <div style="width: 250px;margin-right: 10px;min-height: 400px;">
        <hltable
          v-bind:tburl="rtuUrl"
          v-bind:tbcols="rtuCols"
          ref="rtuDataTable"
          v-bind:tbconfig="rtuConfig"
          @selections="selectChange"
        ></hltable>
      </div>
      <div style="flex: 1;width: 100%;overflow-x: hidden;min-height: 400px;">
        <hltable
          v-bind:tburl="url"
          v-bind:tbcols="cols"
          ref="dataTable"
          v-bind:tbconfig="tbconfig"
          @callHandle="callHandle"
          @sendHandle="sendHandle"
          @selections="
            data => {
              this.dataListSelections = data
            }
          "
        ></hltable>
      </div>
    </div>
    <meter-params-add
      v-if="addOrUpdateVisible"
      ref="meterAdd"
      @refreshDataList="loadMeterGrid"
      @sendAction="sendAction"
    ></meter-params-add>
    <meter-params-call
      v-if="callVisible"
      ref="meterCall"
      @refreshDataList="loadMeterGrid"
      @sendAction="rtuCallNumberidAction"
    ></meter-params-call>
    <hl-progress
      v-if="hlProgVisible"
      ref="hlProg"
      v-bind:url="remoteUrl"
      v-on:backfunc="showProgResult"
    ></hl-progress>
  </div>
</template>

<script>
import meterParamsAdd from './meter-params-add'
import meterParamsCall from './meter-params-call'
import hlProgress from '@/components/hl-progress'
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
export default {
  data() {
    return {
      meterTypeList: this.$sysConfig.getAllMeterTypes(),
      loading: false,
      rtuLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      regionList: null,
      fn: '0A10',
      remoteUrl: '',
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        rtuAddr: null,
        commaddress: '',
        rtuid: null
      },
      rtuUrl: '/pob/rtu/list',
      rtuCols: [
        { prop: 'commaddress', label: '终端地址', width: '100' },
        {
          prop: 'curstatusDesc',
          label: '终端状态',
          width: '90',
          tag: true,
          getColor: function(row) {
            return row.curstatus === 1 ? 'success' : 'warning'
          }
        }
      ],
      rtuConfig: {
        isShowSelection: true,
        isShowRowIndex: false,
        pageMode: 1,
        isShowPage: true
      },
      url: '/pob/point/list',
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 2,
        isShowPage: true
      },
      cols: [
        //{prop:"rtuAddr", label:"终端地址",width:"120"},
        { prop: 'disc', label: '表计名称', width: '150' },
        { prop: 'commaddress', label: '表通讯地址', width: '150' },
        { prop: 'numberid', label: '终端内序号', width: '110' },
        { prop: 'comDesc', label: '通讯端口号', width: '110' },
        { prop: 'bpsDesc', label: '通讯速率', width: '100' },
        { prop: 'protocolDesc', label: '通讯规约类型', width: '140' },
        { prop: 'meterPwd', label: '表通讯密码', width: '120' },
        { prop: 'tariffNum', label: '费率数', width: '90' },
        { prop: 'integernum', label: '整数位个数', width: '110' },
        { prop: 'decimalnum', label: '小数位个数', width: '110' },
        { prop: 'colAddr', label: '采集器通讯地址', width: '140' },
        { prop: 'bigclass', label: '用户大类号', width: '110' },
        { prop: 'subclass', label: '用户小类号', width: '110' }
      ],
      isAllCols: 1,
      type: '',
      rtuList: [],
      flag: null,
      isShowMoreConditions: true,
      dataListSelections: [],
      upLoadUrl: '',
      upLoadFileList: [],
      addOrUpdateVisible: false,
      hlProgVisible: false,
      rtuSendVisible: false,
      callVisible: false
    }
  },
  components: {
    meterParamsAdd,
    meterParamsCall,
    hlProgress,
    hltable,
    'region-select-item': regionSelect
  },
  mounted() {
    this.upLoadUrl = this.$http.adornUrl(
      `/pob/insertTemplate/batchImportPoint?token=${this.$cookie.get('token')}`
    )
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.loading = true
      this.btnFlag = -1
      //this.loadRtu()
      this.loadRtuGrid()
      setTimeout(() => {
        this.loadMeterGrid()
      }, 300)
    },
    loadRtuGrid() {
      this.$refs.rtuDataTable.loadData({
        regionid: this.dataForm.regionid
      })
    },
    loadMeterGrid() {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid,
        rtuid: this.dataForm.rtuid,
        commaddress: this.dataForm.commaddress,
        type: this.type
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.dataForm.rtuid = null
      this.getDataList()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.rtuLoading = true
        setTimeout(() => {
          this.rtuLoading = false
          this.loadRtu(query)
        }, 200)
      } else {
        this.rtuList = []
      }
    },
    loadRtu(rtuAddr) {
      var params = {
        regionid: this.dataForm.regionid,
        page: 1,
        limit: 50,
        commaddress: rtuAddr
      }
      this.$http.ajaxGet(this.rtuUrl, params, data => {
        if (data && data.code === 0) {
          this.rtuList = data.page.list
        }
      })
    },
    batchCallHandle() {
      this.callHandlerAction(this.dataListSelections)
    },
    callHandle(row) {
      var rows = [row]
      this.callHandlerAction(rows)
    },
    callHandlerAction(rows) {
      if (this.btnFlag === 0 || this.btnFlag === 1) {
        this.$message.error('请重新查询后操作!')
        return
      }
      if (!rows || rows.length == 0) {
        this.$message.error('请选择一条记录!')
        return
      }
      var tmp = []
      var tableData = this.$refs.dataTable.tableData
      var checked = rows.some((row, index) => {
        if (!row.rtuid || (!row.numberid && row.numberid !== 0)) {
          this.$message.error('选择的表计中没有设置终端地址!')
          return true
        }
        tmp.push(row.pointid)
        var i = tableData.indexOf(row)
        this.copyPointProperty(row, {})
        this.$set(tableData, i, row)
      })
      if (!checked) {
        this.callAction(tmp)
      }
    },
    callNumberid(flag) {
      this.btnFlag = flag
      this.callVisible = true
      let rtuAddr = this.dataForm.rtuAddr
      if (!rtuAddr && this.dataListSelections.length > 0) {
        this.dataListSelections.some(item => {
          if (item.rtuAddr) {
            rtuAddr = item.rtuAddr
            return true
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.meterCall.init(flag, rtuAddr)
      })
    },
    rtuCallNumberidAction(actionFlag, rtuid, rtuAddr, numberid) {
      var row = { rtuid: rtuid, rtuAddr: rtuAddr, numberid: numberid }
      this.$refs.dataTable.tableData = [row]
      this.hlProgVisible = true
      if (actionFlag === 0) {
        this.remoteUrl =
          '/remote/rtu/callPointParamByRtuNumberid?rtuAddr=' +
          rtuAddr +
          '&numberid=' +
          numberid
        this.$nextTick(() => {
          this.$refs.hlProg.sendRequestPost()
        })
      } else {
        this.remoteUrl =
          '/remote/rtu/sendPointParamByRtuNumberid?rtuAddr=' + rtuAddr
        this.$nextTick(() => {
          this.$refs.hlProg.sendRequestPost({
            numberid: numberid,
            com: 1,
            bps: 0,
            protocol: 2,
            tariffNum: 4,
            integernum: 0,
            decimalnum: 1,
            bigclass: 0,
            subclass: 0,
            commaddress: '000000000000'
          })
        })
      }
    },
    callAction(pointIdArray) {
      this.hlProgVisible = true
      this.remoteUrl = '/remote/rtu/callPointParam'
      this.$nextTick(() => {
        this.$refs.hlProg.sendRequest(pointIdArray)
      })
    },
    batchSendHandle() {
      var rows = this.dataListSelections
      if (!rows || rows.length === 0) {
        this.$message.error('至少选择一条表计记录!')
        return
      }
      var tmp = []
      var tableData = this.$refs.dataTable.tableData
      var checked = rows.some((row, index) => {
        if (!row.rtuid || (!row.numberid && row.numberid !== 0)) {
          this.$message.error('选择的表计中没有设置终端地址!')
          return true
        }
        tmp.push(row.pointid)
      })
      if (!checked) {
        this.sendAction(tmp)
      }
    },
    sendHandle(pointParam) {
      if (this.btnFlag === 0 || this.btnFlag === 1) {
        this.$message.error('请重新查询后操作!')
        return
      }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.meterAdd.init(pointParam.pointid)
      })
    },
    sendAction(pointIdArray) {
      if (this.btnFlag === 0 || this.btnFlag === 1) {
        this.$message.error('请重新查询后操作!')
        return
      }
      this.hlProgVisible = true
      this.remoteUrl = '/remote/rtu/sendPointParam'
      this.$nextTick(() => {
        this.$refs.hlProg.sendRequest(pointIdArray)
      })
    },
    colsTypeChange(value) {
      this.loadMeterGrid()
    },
    rtuTypeChange(value) {
      this.rtuList.some(item => {
        if (item.value === value) {
          this.dataForm.rtuAddr = item.commaddress
          return true
        }
      })
      this.getDataList()
    },
    showProgResult(commResult) {
      var vm = this
      var rtuid = commResult.rtuid
      var tableData = this.$refs.dataTable.tableData
      var backResult = commResult.value
      backResult.forEach((point, sub) => {
        tableData.some((item, index) => {
          if (item.rtuid === rtuid && item.numberid === point.numberid) {
            this.copyPointProperty(item, point)
            this.$set(tableData, index, item)
            return true
          }
        })
      })
    },
    selectChange(value) {
      let rtuid = null
      if (value.length > 1) {
        this.$refs.rtuDataTable.selectRow(value[0], false)
        this.$refs.rtuDataTable.selectRow(value[1], true)
        rtuid = value[1].rtuid
      } else if (value.length == 1) {
        rtuid = value[0].rtuid
      }
      this.dataForm.rtuid = rtuid
      this.loadMeterGrid()
    },
    copyPointProperty(item, point) {
      item.commaddress = point.commaddress
      item.protocol = point.protocol
      item.protocolDesc = point.protocolDesc
      item.bpsDesc = point.bpsDesc
      item.comDesc = point.comDesc
      item.meterPwd = point.meterPwd
      item.tariffNum = point.tariffNum
      item.colAddr = point.colAddr
      item.bigclass = point.bigclass
      item.subclass = point.subclass
      item.integernum = point.integernum
      item.decimalnum = point.decimalnum
    },
    outExcel() {
      let excelColInfo =
        'regionName,所属区域@pointid,表计编码@rtuAddr,终端地址@' +
        this.$refs.dataTable.getColumnInfo() +
        '@secretLevel,密级@secretCode,拉合闸密码@'
      this.$refs.dataTable.exportExcel(0, excelColInfo)
    },
    handlerSuccess(res, file, fileList) {
      this.upLoadFileList = []
      if (res.code === 0) {
        this.$message({
          message: '恭喜你，导入成功',
          type: 'success'
        })
      } else {
        this.$message.error(res.msg || '导入失败!')
      }
    }
  }
}
</script>

<style></style>
