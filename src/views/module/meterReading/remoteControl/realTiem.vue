<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
    >
      <region-select-item
        label="所属单元"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
      ></region-select-item>
      <el-form-item label="终端地址">
        <el-select
          v-model="dataForm.rtuid"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="模糊搜索终端地址"
          :remote-method="remoteMethod"
          @change="colsTypeChange"
          :loading="rtuLoading"
        >
          <el-option
            v-for="item in rtuList"
            :key="item.rtuid"
            :label="item.commaddress"
            :value="item.rtuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="能源类型">
        <el-select
          v-model="type"
          clearable
          placeholder="请选择"
          style="width: 230px"
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
          style="width: 220px;"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('pob:meter:save')" @click="selectAll"
          >全选</el-button
        > -->
       
      </el-form-item>
    </el-form>
    <common-table
      :dataSource="dataList"
      :options="options"
      :pagination="pagination"
      :columns="columns"
      @handleSizeChange="sizeChangeHandle"
      @handleIndexChange="currentChangeHandle"
      @selection-change="handleSelectionChange"
    >
    <template slot="toolbar">
       <el-button
          v-if="isAuth('pob:meter:save')"
          type="primary"
          size="mini"
          @click="batchCallHandle(129)"
          >召读当前表码</el-button
        >
        <el-button
          v-if="isAuth('pob:meter:save')"
          type="primary"
          size="mini"
          @click="batchCallHandle(25)"
          >召读当前负荷</el-button
        >
    </template>
    </common-table>
    <!-- <div v-loading="loading">
      <ul class="meter-list">
        <li v-for="(item, index) in dataList" :key="index">
          <el-checkbox
            class="checkradio"
            v-model="item.checked"
            @change="changeHandler($event, item)"
          ></el-checkbox>
          <div class="data-content">
            <div class="name">{{ item.name }}</div>
            <div class="data">{{ item.value }}</div>
          </div>
          <el-button-group>
            <el-button
              icon="el-icon-d-arrow-left"
              class="switch-button"
              @click="subCounter(item, index)"
            ></el-button>
            <el-button
              icon="el-icon-d-arrow-right"
              class="switch-button"
              @click="addCounter(item, index)"
            ></el-button>
          </el-button-group>
          <table border="0" style="margin-left: 60px;margin-top: 15px;">
            <tr>
              <td>终端地址 :</td>
              <td>{{ item.rtuAddr }}</td>
            </tr>
            <tr>
              <td>表序号 :</td>
              <td>{{ item.numberid }}</td>
            </tr>
            <tr>
              <td>表通讯地址 :</td>
              <td>{{ item.commaddress }}</td>
            </tr>
          </table>

          <el-button
            round
            icon="el-icon-arrow-up"
            class="call-button"
            @click="callHandle([item])"
            >召读</el-button
          >
        </li>
      </ul>
    </div> -->
    <!-- <el-pagination
      background
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination> -->
    <hl-progress
      v-if="hlProgVisible"
      ref="hlProg"
      v-bind:url="remoteUrl"
      v-on:backfunc="showProgResult"
    ></hl-progress>
  </div>
</template>

<script>
import hlProgress from '@/components/hl-progress'
import regionSelect from '@/views/modules/pob/region-select'
import CommonTable from '@/views/common/Table.vue'
export default {
  data() {
    return {
      meterTypeList: this.$sysConfig.getAllMeterTypes(),
      loading: false,
      rtuLoading: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      regionList: null,
      fn: '0A10',
      remoteUrl: '',
      counter: 0,
      dataForm: {
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        commaddress: '',
        rtuid: null
      },
      regionListTreeProps: {
        label: 'label',
        children: 'children'
      },
      isAllCols: '0',
      type: '',
      rtuList: [],
      isShowMoreConditions: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      hlProgVisible: false,
      rtuSendVisible: false,
      options: {
        loading: false,
        index: false,
        maxHeight: 650,
        mutiSelect: true
      },
      pagination: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      columns: [
        {
          prop: 'rtuAddr',
          label: '终端地址',
          width:'160'
        },
        {
          prop: 'numberid',
          label: '表序号',
          width:'100'
        },
        {
          prop: 'commaddress',
          label: '表通讯地址',
          width:'200'
        },
        {
          prop: 'val',
          label: '返回值'
        },
        {
          button: true,
          label: '操作',
          width: '200px',
          fixed: 'right',
          group: [
            {
              // you can props => type size icon disabled plain
              name: '召读',
              type: 'success',
              icon: 'el-icon-edit',
              value: '召读',
              plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this.callHandle([row])
              }
            }
          ]
        }
      ]
    }
  },
  components: {
    hlProgress,
    'region-select-item': regionSelect,
    CommonTable
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      // this.pageSize = parseInt(this.$el.offsetWidth / 280) * 2
      this.options.loading = true
      this.dataListSelections = []
      this.$http({
        url: this.$http.adornUrl('/pob/point/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pagination.pageNum,
          limit: this.pagination.numPerPage,
          regionid: this.dataForm.regionid,
          commaddress: this.dataForm.commaddress,
          rtuid: this.dataForm.rtuid ? this.dataForm.rtuid : null,
          type: this.type
        })
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.pagination.total = data.page.totalCount
          } else {
            this.dataList = []
            this.pagination.total = 0
          }
          this.options.loading = false
        })
        .catch(error => {
          console.log(error)
          this.options.loading = false
        })
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.getDataList()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.rtuLoading = true
        setTimeout(() => {
          this.rtuLoading = false
          this.$http({
            url: this.$http.adornUrl('/pob/rtu/list'),
            method: 'get',
            params: this.$http.adornParams({
              regionid: this.dataForm.regionid,
              page: 1,
              limit: 10,
              commaddress: query
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.rtuList = data.page.list
            }
          })
        }, 200)
      } else {
        this.rtuList = []
      }
    },
    batchCallHandle(fn) {
      this.callHandle(this.dataListSelections, fn)
    },
    callHandle(rows, fn) {
      var tmp = []
      // var tableData = this.dataList
      // console.log(tableData)
      var checked = rows.forEach((row, index) => {
        console.log('遍历数组。row。。。')
        console.log(row)
        this.copyPointProperty(row, '')
        if (row.rtuid) {
          tmp.push(row.pointid)
          var i = this.dataList.indexOf(row)
          this.$set(this.dataList, i, row)
        }
      })
      console.log(checked)
      if (!checked) {
        this.callAction(tmp, fn)
      }
    },
    callAction(pointIdArray, fn) {
      if (pointIdArray && pointIdArray.length > 0) {
        this.hlProgVisible = true
        this.remoteUrl = '/remote/rtu/callCurrentBm?fn=' + fn
        this.$nextTick(() => {
          this.$refs.hlProg.sendRequest(pointIdArray)
        })
      } else {
        this.$message.warning('请选择表计!')
      }
    },
    colsTypeChange(value) {
      this.getDataList()
    },
    showProgResult(commResult) {
      //   var vm = this
      var rtuid = commResult.rtuid
      var tableData = this.dataList
      var fnValueList = commResult.value
      if (fnValueList.length === 0) {
        return
      }
      tableData.some((item, index) => {
        var tmp = []
        fnValueList.forEach((fnVal, i) => {
          if (item.rtuid === rtuid && item.numberid === fnVal.pn) {
            tmp.push(fnVal.value)
            // this.copyPointProperty(item,fnVal.value)
            // this.$set(tableData, index, item);
            // return true;
          }
        })
        if (tmp.length > 0) {
          tmp.reverse()
          this.copyPointProperty(item, tmp.join(';'))
          this.$set(tableData, index, item)
        }
      })
    },
    copyPointProperty(item, val) {
      if (val.indexOf(';') === -1) {
        item.name = null
        item.value = null
        this.counter = 0
        return
      }
      item.val = val.split(';')
      this.counter = 2
      var kv = item.val[this.counter].split(' ')
      item.name = kv[0].replace('电能示值', '')
      item.value = kv[1]
    },
    changeHandler($event, row) {
      if ($event) {
        this.dataListSelections.push(row)
      } else {
        var index = this.dataListSelections.indexOf(row)
        this.dataListSelections.splice(index, 1)
        var index2 = this.dataList.indexOf(row)
        row.checked = false
        this.$set(this.dataList, index2, row)
      }
    },
    sizeChangeHandle(numPerPage) {
      this.pagination.numPerPage = numPerPage
      this.getDataList()
    },
    // 跳转下一页或指定页
    currentChangeHandle(pageNum) {
      this.pagination.pageNum = pageNum
      this.getDataList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.dataListSelections=val
    },
    // sizeChangeHandle(val) {
    //   this.pageSize = val
    //   this.pageIndex = 1
    //   this.getDataList()
    // },
    // currentChangeHandle(val) {
    //   this.pageIndex = val
    //   this.getDataList()
    // },
    addCounter(item, index) {
      if (!item.val) {
        return
      }
      var len = item.val.length
      if (this.counter < len - 1) {
        this.counter++
      } else {
        this.counter = 0
      }
      var kv = item.val[this.counter].split(' ')
      item.name = kv[0].replace('电能示值', '')
      item.value = kv[1]
      var tableData = this.dataList
      this.$set(tableData, index, item)
    },
    subCounter(item, index) {
      if (!item.val) {
        return
      }
      var len = item.val.length
      if (this.counter > 0) {
        this.counter--
      } else {
        this.counter = len - 1
      }
      var kv = item.val[this.counter].split(' ')
      item.name = kv[0].replace('电能示值', '')
      item.value = kv[1]
      var tableData = this.dataList
      this.$set(tableData, index, item)
    },
    selectAll() {
      var tableData = this.dataList
      var tmp = tableData.map((item, index) => {
        item.checked = true
        this.$set(tableData, index, item)
        return item
      })
      this.dataListSelections = tmp
    }
  }
}
</script>

<style>
/*@font-face {
		font-family:lcd;
		src: url(../../../../font/LCD-N.TTF);
	}*/
.meter-list {
  overflow: hidden;
  list-style: none;
  padding: 0;
  /*border: 1px solid #eaeefb;*/
  border-radius: 4px;
}
.meter-list li {
  float: left;
  min-width: 280px;
  height: 320px;
  text-align: center;
  color: #666;
  font-size: 10px;
  transition: color 0.15s linear;
  border: 1px solid #eee;
  margin-right: -1px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 200px 260px;
  background-image: url(../../../../../static/img/digitalScreen.png);
}
.checkradio {
  margin-top: 10px;
}
.data-content {
  height: 110px;
  width: 50%;
  margin-top: 20px;
  margin-left: 25%;
  padding-top: 15px;
  color: #757575;
  font-size: 10px;
  font-weight: 700;
}
.data-content .name {
  color: #757575;
  font-size: 10px;
  padding-top: 5px;
}
.data-content .data {
  color: #17b3a3;
  font-size: 10px;
  padding-top: 10px;
}
.switch-button {
  padding: 3px 10px !important;
}
.customer-info {
  margin-top: 10px;
  height: 12px;
  line-height: 12px;
  border: 1px solid #000000;
}
.customer-info span {
  width: 140px;
  display: inline-block;
  background-color: #000000;
  text-align: left !important;
}
.meter-info {
  margin-top: 5px;
  height: 14px;
}
.call-button {
  margin-top: 45px;
  padding: 6px 12px !important;
  font-size: 12px;
  color: #11c26d;
}
</style>
