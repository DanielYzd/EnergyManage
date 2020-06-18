<template>
  <el-dialog
  custom-class="dialogcommon"
    title="通讯窗口"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="stopProg"
    :modal="false"
  >
    <el-card id="dialog" class="box-card">
      <div slot="header" class="clearfix">
        <span>发送帧数：</span>
        <el-badge :value="scount" style="width:150px;"></el-badge>
        <span>接受帧数：</span>
        <el-badge :value="rcount" style="width:150px;"></el-badge>
        <span style="text-align:center;">
          <el-button
            type="success"
            @click="reSend"
            :disabled="callStatus.loading"
            size="mini"
            >重发</el-button
          >
          <el-button
            type="warning"
            @click="stopProg"
            :disabled="!callStatus.loading"
            size="mini"
            >停止</el-button
          >
        </span>
      </div>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table :data="commResult" style="width: 100%" size="mini">
            <el-table-column
              prop="rtuAddr"
              label="终端地址"
              min-width="90"
            ></el-table-column>
            <el-table-column
              prop="successDesc"
              label="结果"
              min-width="160"
            ></el-table-column>
            <!--<el-table-column prop="taskid" label="taskid" min-width="160"></el-table-column>-->
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="!callStatus.loading"
                  @click="reTryHandle(scope.row)"
                  >重试</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :span="24"
          style="text-align:center;margin-top:6px;margin-bottom:6px;"
        >
          <el-progress :percentage="callStatus.percentage"></el-progress>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" style="text-align:center;">
          <el-input
            type="textarea"
            v-bind:style="{ height: winStyle.textAreaHeight + 'px' }"
            :rows="7"
            placeholder="报文"
            v-model="msg"
          ></el-input>
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  name: 'hl-progress',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      param: null,
      commResult: [],
      visible: false,
      myTaskid: null,
      msg: '',
      scount: '0',
      rcount: '0',
      callStatus: {
        loading: false,
        percentage: 0,
        status: 'success',
        intervalHandler: ''
      },
      winStyle: {
        width: 530,
        height: 384,
        textAreaHeight: 160
      },
      winIndex: null,
      communicationData: [
        {
          comaddress: '',
          result: '',
          msg: {
            sendMsg: '',
            revcMsg: ''
          }
        }
      ]
    }
  },
  watch: {
    taskid: function (value, oldvalue) {
      this.myTaskid = value
      this.show()
      this.initData()
    }
  },
  methods: {
    show: function () {
      this.visible = true
    },
    initData: function () {
      this.scount = this.commResult.length
      this.rcount = '0'
      // this.msg='';
      // this.communicationData = this.commResult;
      this.callStatus.loading = true
      this.callStatus.percentage = 0
      var vm = this
      var taskids = this.commResult.map(function (item, index) {
        if (vm.msg.length === 0) {
          vm.msg = '发送: ' + item.sendMsg
        } else {
          vm.msg = vm.msg + '\n发送: ' + item.sendMsg
        }
        return item.taskid
      })
      this.progressAjax(taskids)
      this.proging()
    },
    reTryHandle (row) {
      var param = { sendMsg: row.sendMsg, rtuAddr: row.rtuAddr }
      var reTryUrl = '/remote/prog/transSend'
      this.$http({
        url: this.$http.adornUrl(reTryUrl),
        method: 'get',
        params: this.$http.adornParams(param, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var newTaskid = data.taskid
          this.msg = this.msg + '\n发送: ' + row.sendMsg
          this.commResult.some((item, index) => {
            if (item.rtuAddr === row.rtuAddr) {
              item.taskid = newTaskid
              item.successDesc = ''
              item.recvMsg = null
              this.$set(this.commResult, index, item)
              return true
            }
          })
          this.callStatus.loading = true
          this.callStatus.percentage = 0
          this.progressAjax([newTaskid])
          this.proging()
        }
      })
    },
    progressAjax (taskids) {
      var vm = this
      this.$http({
        url: this.$http.adornUrl('/remote/prog/rtu'),
        method: 'post',
        data: this.$http.adornData(taskids, false)
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            var resultList = data.data
            var noReqTaskIds = []
            for (var j = 0; j < this.commResult.length; j++) {
              var comm = this.commResult[j]
              for (var i = 0; i < resultList.length; i++) {
                var item = resultList[i]
                if (
                  comm.rtuAddr === item.rtuAddr &&
                  item.recvMsg &&
                  item.taskid === comm.taskid
                ) {
                  comm.recvMsg = item.recvMsg
                  comm.success = item.success
                  comm.value = item.value
                  comm.rtuid = item.rtuid
                  comm.successDesc = '通讯成功！'
                  vm.$set(this.commResult, j, comm)
                  vm.rcount++
                  vm.msg = vm.msg + '\n接收 : ' + item.recvMsg
                  console.log(comm)
                  this.$emit('backfunc', comm)
                }
              }
              if (!comm.recvMsg) {
                noReqTaskIds.push(comm.taskid)
              }
            }
            if (noReqTaskIds.length > 0 && vm.callStatus.loading) {
              setTimeout(function () {
                vm.progressAjax(noReqTaskIds)
              }, 1000)
            } else {
              vm.callStatus.loading = false
              vm.proging()
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    stopProg: function () {
      var vm = this
      vm.callStatus.loading = false
      vm.proging()
    },
    reSend () {
      let vm = this
      this.commResult.forEach(function (item, index) {
        item.recvMsg = null
        item.sendMsg = null
        item.taskid = null
        vm.$set(vm.commResult, index, item)
      })
      this.sendRequest(this.param)
    },
    proging () {
      var vm = this
      if (vm.callStatus.loading) {
        vm.callStatus.percentage = 0
        vm.callStatus.intervalHandler = setInterval(function () {
          var tmp = vm.callStatus.percentage + 2
          if (tmp >= 100) {
            vm.callStatus.loading = false
            vm.callStatus.percentage = 100
            vm.callStatus.status = 'success'
            window.clearInterval(vm.callStatus.intervalHandler)
          } else {
            vm.callStatus.percentage = tmp
          }
        }, 1000)
      } else {
        vm.callStatus.percentage = 100
        vm.callStatus.status = 'success'
        window.clearInterval(vm.callStatus.intervalHandler)
      }
    },
    openFailAlert: function (errMsg) {
      var vm = this
      this.$alert(errMsg, '发送失败', {
        confirmButtonText: '确定',
        type: 'error',
        customClass: 'dialogBackColor',
        confirmButtonClass: 'el-button--danger',
        callback: function (action) {
          vm.callStatus.loading = false
        }
      })
    },
    sendRequest (param) {
      this.msg = ''
      this.param = param
      this.$http({
        url: this.$http.adornUrl(this.url),
        method: 'post',
        data: this.$http.adornData(param, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.commResult = data.data
          this.show()
          this.initData()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    sendRequestPost (param) {
      this.msg = ''
      this.param = param
      this.$http.ajaxPost(this.url, this.param, data => {
        if (data && data.code === 0) {
          this.commResult = data.data
          this.show()
          this.initData()
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>


