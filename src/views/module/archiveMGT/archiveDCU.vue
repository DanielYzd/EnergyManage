<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
    >
      <region-select
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        clearable
      ></region-select>
      <el-form-item>
        <el-select
          v-model="selectedItem"
          placeholder="请选择"
          @change="selectedChange"
        >
          <el-option
            v-for="item in itemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.searchWord"
          placeholder="终端地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('pob:rtu:save')"
          :disabled="selectedItem != 0"
          type="primary"
          @click="addOrUpdateHandle()"
          icon="el-icon-circle-plus-outline"
          >新增</el-button
        >
        <el-button
          v-if="isAuth('pob:rtu:delete')"
          :disabled="selectedItem != 0 || dataListSelections.length <= 0"
          type="danger"
          @click="deleteHandle()"
          icon="el-icon-delete"
          >删除</el-button
        >
        <el-button
          v-if="isAuth('pob:rtu:save')"
          :disabled="selectedItem == 0 || selectedItem == 2"
          type="primary"
          @click="bacthCallHandle()"
          >召读</el-button
        >
        <!--<el-button v-if="isAuth('pob:rtu:save')" :disabled="selectedItem==0" type="danger" @click="addOrUpdateHandle()">设置</el-button>-->
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="url"
      v-bind:tbcols="cols"
      ref="rtuTable"
      v-bind:tbstyle="tbstyle"
      v-bind:tbconfig="tbconfig"
      @addOrUpdateHandle="addOrUpdateHandle"
      @deleteHandle="deleteHandle"
      @callHandle="callHandle"
      @sendHandle="sendHandle"
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
    <hl-progress
      v-if="hlProgVisible"
      ref="hlProg"
      v-bind:url="remoteUrl"
      v-on:backfunc="showProgResult"
    ></hl-progress>
    <!--v-bind:message="rtuMsg" v-bind:taskid="taskid"  v-bind:rtucommaddr="rtuCommAddr"-->
    <control-rtu-send
      v-if="rtuSendVisible"
      ref="rtuSend"
      @sendAction="sendHandleAction"
    ></control-rtu-send>
    <!--<rtu-task v-if="taskVisible" ref="rtuTask"></rtu-task>-->
  </div>
</template>

<script>
import hltable from '@/components/hltable'
import hlProgress from '@/components/hl-progress'
import AddOrUpdate from '@/views/modules/pob/rtu-add-or-update'
import controlRtuSend from './control-rtu-send'
/*import rtuTask from './rtu-task'*/
import merge from 'lodash/merge'
import regionSelect from '@/views/modules/pob/region-select'
export default {
  components: {
    AddOrUpdate,
    hltable,
    hlProgress,
    regionSelect,
    controlRtuSend
  },
  data() {
    return {
      selectedItem: 0,
      taskType: 0, // 0 召读；1下发
      itemList: [
        { value: 0, label: '基本参数' },
        { value: 1, label: '通讯参数' },
        { value: 2, label: '终端复位' },
        { value: 3, label: '终端对时' }
      ],
      fn: '',
      tbstyle: {
        width: '100%'
      },
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 1,
        isShowPage: true
      },
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        searchWord: ''
      },
      url: '/pob/rtu/list',
      remoteUrl: '/remote/rtu/call',
      cols: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      hlProgVisible: false,
      rtuSendVisible: false,
      taskVisible: false
    }
  },
  mounted() {
    this.selectedChange(0)
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.$refs.rtuTable.loadData({
        commaddress: this.dataForm.searchWord,
        regionid: this.dataForm.regionid
      })
    },
    selectedChange(value) {
      if (value === 0) {
        this.tbconfig.rowButtonType = 1
        this.cols = [
          { prop: 'commaddress', label: '终端地址', showRadio: false },
          { prop: 'protocolidDesc', label: '规约类型' },
          { prop: 'readschemeidDesc', label: '抄表方案' },
          {
            prop: 'curstatusDesc',
            label: '终端状态',
            tag: true,
            getColor: function(row) {
              return row.curstatus === 1 ? 'success' : 'warning'
            }
          },
          { prop: 'onlinetime', label: '最后在线时间' },
          { prop: 'mins', label: '累计离线分钟数' }
        ]
      } else if (value === 1) {
        this.fn = '0403'
        this.tbconfig.rowButtonType = 2
        this.cols = [
          { prop: 'commaddress', label: '终端地址' },
          {
            prop: 'curstatusDesc',
            label: '终端状态',
            tag: true,
            getColor: function(row) {
              return row.curstatus === 1 ? 'success' : 'warning'
            }
          },
          { prop: 'mainIp', label: '主用IP地址' },
          { prop: 'mainPort', label: '主用端口' },
          { prop: 'secondIp', label: '备用IP地址' },
          { prop: 'secondPort', label: '备用端口' },
          { prop: 'apn', label: 'APN' },
          { prop: 'result', label: '操作结果' }
        ]
      } else if (value === 2) {
        this.fn = '0101'
        this.tbconfig.rowButtonType = 2
        this.cols = [
          { prop: 'commaddress', label: '终端地址' },
          {
            prop: 'curstatusDesc',
            label: '终端状态',
            tag: true,
            getColor: function(row) {
              return row.curstatus === 1 ? 'success' : 'warning'
            }
          },
          { prop: 'result', label: '终端复位结果' }
        ]
        // let tableData = this.$refs.rtuTable.tableData
      } else if (value === 3) {
        this.tbconfig.rowButtonType = 2
        this.fn = '0531'
        this.cols = [
          { prop: 'commaddress', label: '终端地址' },
          {
            prop: 'curstatusDesc',
            label: '终端状态',
            tag: true,
            getColor: function(row) {
              return row.curstatus === 1 ? 'success' : 'warning'
            }
          },
          { prop: 'sysDate', label: '系统时间' },
          { prop: 'rtuDate', label: '终端时间' },
          { prop: 'subMins', label: '差值(分钟)' },
          { prop: 'result', label: '操作结果' }
        ]
        let tableData = this.$refs.rtuTable.tableData
        tableData.forEach(item => {
          item.sysDate = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        })
      }
    },
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row ? row.rtuid : null, this.fn)
      })
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    deleteHandle(row) {
      var id = row ? row.rtuid : null
      var rtuAddres = ''
      if (id) {
        this.$refs.rtuTable.tableData.some(item => {
          if (item.rtuid === id) {
            rtuAddres = item.commaddress
            return true
          }
        })
      } else {
        var tmp = this.dataListSelections.map(item => {
          return item.commaddress
        })
        rtuAddres = tmp.join(',')
      }
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.rtuid
          })
      this.$confirm(
        `确定对[终端地址为${rtuAddres}]进行<b style="color:red">“${
          id ? '删除' : '批量删除'
        }”</b>操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/pob/rtu/delete'),
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
    },
    bacthCallHandle() {
      this.remoteUrl = '/remote/rtu/call'
      this.taskType = 0
      var ids = this.dataListSelections.map((item, index) => {
        item.mainIp = ''
        item.mainPort = ''
        item.secondIp = ''
        item.secondPort = ''
        item.apn = ''
        this.$set(this.dataListSelections, index, item)
        return { rtuid: item.rtuid, key: this.fn }
      })
      this.hlProgVisible = true
      this.$nextTick(() => {
        this.$refs.hlProg.sendRequest(ids)
      })
    },
    callHandle(row) {
      if (this.fn === '0101') {
        this.$message.error('复位不支持召读！')
        return
      }
      this.remoteUrl = '/remote/rtu/call'
      this.taskType = 0
      var rtuid = row.rtuid
      var tableData = this.$refs.rtuTable.tableData
      tableData.some((item, index) => {
        if (item.rtuid === rtuid) {
          item.mainIp = ''
          item.mainPort = ''
          item.secondIp = ''
          item.secondPort = ''
          item.apn = ''
          item.result = ''
          this.$set(tableData, index, item)
          return true
        }
      })
      var tmp = []
      tmp.push({ rtuid: row.rtuid, key: this.fn })
      this.hlProgVisible = true
      this.$nextTick(() => {
        this.$refs.hlProg.sendRequest(tmp)
      })
    },
    sendHandle(row) {
      this.rtuSendVisible = true
      this.$nextTick(() => {
        this.$refs.rtuSend.init(
          [{ rtuid: row.rtuid, rtuAddr: row.commaddress }],
          this.fn
        )
      })
    },
    sendHandleAction(sendRtuData) {
      var vm = this
      var tableData = this.$refs.rtuTable.tableData
      sendRtuData.forEach(rtuData => {
        tableData.some((item, index) => {
          if (item.commaddress === rtuData.rtuAddr) {
            var tt = merge(rtuData, item)
            vm.$set(tableData, index, tt)
            return true
          }
        })
      })
      this.remoteUrl = '/remote/rtu/send'
      this.taskType = 1
      this.hlProgVisible = true
      console.log(sendRtuData)
      this.$nextTick(() => {
        this.$refs.hlProg.sendRequest(sendRtuData)
      })
    },
    showProgResult(commResult) {
      var vm = this
      var rtuid = commResult.rtuid
      var backResult = commResult.value
      var tableData = this.$refs.rtuTable.tableData
      backResult.forEach(value => {
        tableData.some((item, index) => {
          if (item.rtuid !== rtuid) {
            return
          }
          vm.convertObj(value, item, index)
          return true
        })
      })
    },
    convertObj(data, item, index) {
      var vm = this
      var tableData = this.$refs.rtuTable.tableData
      var result = data.value
      if (this.fn === '0403') {
        if (vm.taskType === 0) {
          var tmp = result.split(';')
          item.mainIp = tmp[0].split(':')[1]
          item.mainPort = tmp[1].split(':')[1]
          item.secondIp = tmp[2].split(':')[1]
          item.secondPort = tmp[3].split(':')[1]
          item.apn = tmp[4].split(':')[1]
          item.result = '成功'
        } else {
          item.result = result
        }
        this.$set(tableData, index, item)
      }
      if (this.fn === '0101') {
        item.result = result === '正确' ? '复位成功' : '复位失败'
        this.$set(tableData, index, item)
        return true
      }
      if (this.fn === '0531') {
        if (this.taskType === 0) {
          let tmp = result.split(';')
          let callDate =
            '20' +
            tmp[0].substr(2, 2) +
            '-' +
            tmp[1].substr(2, 2) +
            '-' +
            tmp[2].substr(2, 2) +
            ' ' +
            tmp[3].substr(2, 2) +
            ':' +
            tmp[4].substr(2, 2) +
            ':' +
            tmp[5].substr(2, 2)
          item.sysDate = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          item.subMins = (
            (new Date().getTime() - new Date(callDate).getTime()) /
            (1000 * 60)
          ).toFixed(2)
          item.rtuDate = callDate
          item.result = '成功'
        } else {
          item.result = '成功'
        }
        this.$set(tableData, index, item)
        return true
      }
    }
  }
}
</script>

<style></style>
