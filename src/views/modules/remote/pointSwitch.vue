<template>
  <div>
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
          style="width: 25%;"
        ></region-select-item>
        <el-form-item label="表计类型" style="width: 25%;">
          <el-select
            v-model="dataForm.type"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in meterTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button @click="getDataList()">查询</el-button>
          <el-button
            v-if="isAuth('pob:meter:save')"
            type="primary"
            @click="batchHandler(1)"
            >拉闸</el-button
          >
          <el-button
            v-if="isAuth('pob:meter:save')"
            type="primary"
            @click="batchHandler(0)"
            >合闸</el-button
          >
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
          @selections="
            data => {
              this.dataListSelections = data;
            }
          "
        ></hltable>
      </div>
    </div>
    <point-switch-update
      v-if="addOrUpdateVisible"
      ref="meterAdd"
      @refreshDataList="loadPoint"
      @sendAction="sendAction"
    ></point-switch-update>
    <hl-progress
      v-if="hlProgVisible"
      ref="hlProg"
      v-bind:url="remoteUrl"
      v-on:backfunc="showProgResult"
    ></hl-progress>
  </div>
</template>

<script>
import pointSwitchUpdate from './pointSwitch-update'
import hlProgress from '@/components/hl-progress'
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
const SWITCH_ON = 0,
  SWITCH_OFF = 1
export default {
  data () {
    return {
      meterTypeList: this.$sysConfig.getAllMeterTypes(),
      loading: false,
      rtuLoading: false,
      optSwitch: 0,
      remoteUrl: '',
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        rtuAddr: null,
        rtuid: null,
        type: ''
      },
      rtuUrl: '/pob/rtu/list',
      rtuCols: [
        { prop: 'commaddress', label: '终端地址', width: '100' },
        {
          prop: 'curstatusDesc',
          label: '终端状态',
          width: '90',
          tag: true,
          getColor: function (row) {
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
        rowButtonType: 4,
        btnWidth: 150,
        buttons: [
          {
            label: '拉闸',
            handler: (row, refTable) => {
              var _this = refTable.multipleTable.$parent.$parent
              _this.sendHandle(row, SWITCH_OFF)
            }
          },
          {
            label: '合闸',
            handler: (row, refTable) => {
              var _this = refTable.multipleTable.$parent.$parent
              _this.sendHandle(row, SWITCH_ON)
            }
          }
        ],
        isShowPage: true
      },
      cols: [
        // {prop:"rtuAddr", label:"终端地址",width:"120"},
        { prop: 'disc', label: '表计名称', width: '150' },
        { prop: 'commaddress', label: '表通讯地址', width: '120' },
        { prop: 'numberid', label: '表序号', width: '60' },
        { prop: 'comDesc', label: '通讯端口号', width: '80' },
        { prop: 'bpsDesc', label: '通讯速率', width: '80' },
        { prop: 'protocolDesc', label: '通讯规约类型', width: '120' },
        { prop: 'secretLevel', label: '密级', width: '60' },
        { prop: 'secretCode', label: '拉合闸密码', width: '80' },
        {
          prop: 'useenergyStatusName',
          label: '当前开关状态',
          width: '120',
          tag: true,
          getColor: function (row) {
            return row.useenergyStatus === 0 ? 'success' : 'warning'
          }
        }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      hlProgVisible: false,
      rtuSendVisible: false
    }
  },
  components: {
    pointSwitchUpdate,
    hlProgress,
    hltable,
    'region-select-item': regionSelect
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.loadRtu()
      this.loadPoint()
    },
    loadPoint () {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid,
        rtuid: this.dataForm.rtuid || null,
        type: this.dataForm.type
      })
    },
    getSelectRegion (data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.dataForm.rtuid = null
      this.getDataList()
    },
    loadRtu () {
      this.$refs.rtuDataTable.loadData({
        regionid: this.dataForm.regionid ? this.dataForm.regionid : null
      })
    },
    batchHandler (optSwitch) {
      var rows = this.dataListSelections
      if (!rows || rows.length === 0) {
        this.$message.error('至少选择一条表计记录!')
        return
      }
      this.optSwitch = optSwitch
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
    sendHandle (pointParam, optSwitchType) {
      this.addOrUpdateVisible = true
      this.optSwitch = optSwitchType
      this.$nextTick(() => {
        this.$refs.meterAdd.init(pointParam.pointid)
      })
    },
    sendAction (pointIdArray) {
      this.hlProgVisible = true
      this.remoteUrl =
        '/remote/rtu/switchDo?pointIds=' +
        pointIdArray.join(',') +
        '&switchType=' +
        this.optSwitch
      this.$nextTick(() => {
        this.$refs.hlProg.sendRequest({})
      })
    },
    selectChange (value) {
      if (value.length > 1) {
        this.$refs.rtuDataTable.selectRow(value[0], false)
        this.$refs.rtuDataTable.selectRow(value[1], true)
        this.dataForm.rtuid = value[1].rtuid
      } else if (value.length == 1) {
        this.dataForm.rtuid = value[0].rtuid
      } else {
        this.dataForm.rtuid = ''
      }
      this.loadPoint()
    },
    showProgResult (commResult) {
      var vm = this
      var rtuid = commResult.rtuid
      var pointid = commResult.extInfo
      var tableData = this.$refs.dataTable.tableData
      var backResult = commResult.value
      var isOk = commResult.success
      if (isOk) {
        let params = {
          pointIds: pointid,
          switchType: this.optSwitch
        }
        this.$http.ajaxGet(
          '/remote/rtu/updatePointUseEnergyStatus',
          params,
          null
        )
      }
      tableData.some((item, index) => {
        if (item.rtuid === rtuid && item.pointid === pointid) {
          if (!vm.cols[9]) {
            vm.cols.push({ prop: 'optResult', label: '操作结果', width: '90' })
          }
          item.optResult = isOk ? '操作成功' : '操作失败'
          if (isOk) {
            item.useenergyStatus = this.optSwitch
            item.useenergyStatusName =
              this.optSwitch === SWITCH_ON ? '合闸' : '拉闸'
          }
          this.$set(tableData, index, item)
          return true
        }
      })
    }
  }
}
</script>

<style></style>
