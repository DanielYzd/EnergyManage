<template>
  <div>
    <div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
        <region-select-item label="所属单元" v-model="dataForm.regionName" @getRegion="getSelectRegion">
        </region-select-item>
        <el-form-item label="能源类型">
          <el-select v-model="dataForm.type" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item, index) in meterTypeList" :key="index" :label="item.key" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
   
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
              
            <template slot="title">
               <el-tooltip content="点我展开与收缩" placement="left-start">
              <span style="color:#1679bd;font-size:16px;">终端信息</span>
               </el-tooltip>
            </template>
             
            <div>
              <hltable v-bind:tburl="rtuUrl" v-bind:tbcols="rtuCols" ref="rtuDataTable" v-bind:tbconfig="rtuConfig"
                @selections="selectChange"></hltable>
            </div>
          </el-collapse-item>
        </el-collapse>
    

      <div style="margin-top:20px;">
        <hltable v-bind:tburl="url" v-bind:tbcols="cols" ref="dataTable" v-bind:tbconfig="tbconfig" @selections="
            data => {
              this.dataListSelections = data
            }
          ">
          <template slot="toolbar">
            <el-button v-if="isAuth('pob:meter:save')" size="mini" type="primary" @click="batchHandler(1)">拉闸
            </el-button>
            <el-button v-if="isAuth('pob:meter:save')" size="mini" type="primary" @click="batchHandler(0)">合闸
            </el-button>
          </template>
        </hltable>
      </div>
    </div>
    <point-switch-update v-if="addOrUpdateVisible" ref="meterAdd" @refreshDataList="loadPoint" @sendAction="sendAction">
    </point-switch-update>
    <hl-progress v-if="hlProgVisible" ref="hlProg" v-bind:url="remoteUrl" v-on:backfunc="showProgResult"></hl-progress>
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
  data() {
    return {
      activeNames: ['1'],
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
        { prop: 'disc', label: '表计名称'  },
        { prop: 'commaddress', label: '表通讯地址' },
        // { prop: 'numberid', label: '表序号',  },
        // { prop: 'comDesc', label: '通讯端口号' },
        // { prop: 'bpsDesc', label: '通讯速率' },
        // { prop: 'protocolDesc', label: '通讯规约类型'},
        // { prop: 'secretLevel', label: '密级' },
        // { prop: 'secretCode', label: '拉合闸密码' },
        {
          prop: 'useenergyStatusName',
          label: '当前开关状态',
          width: '120',
          tag: true,
          getColor: function(row) {
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
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.loadRtu()
      this.loadPoint()
    },
    loadPoint() {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid,
        rtuid: this.dataForm.rtuid || null,
        type: this.dataForm.type
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.dataForm.rtuid = null
      this.getDataList()
    },
    loadRtu() {
      this.$refs.rtuDataTable.loadData({
        regionid: this.dataForm.regionid ? this.dataForm.regionid : null
      })
    },
    batchHandler(optSwitch) {
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
    sendHandle(pointParam, optSwitchType) {
      this.addOrUpdateVisible = true
      this.optSwitch = optSwitchType
      this.$nextTick(() => {
        this.$refs.meterAdd.init(pointParam.pointid)
      })
    },
    sendAction(pointIdArray) {
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
    selectChange(value) {
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
    showProgResult(commResult) {
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
