<template>
  <div v-bind:style="tbstyle" class="gContent">
    <!--<el-row :gutter="20">
		<el-col :span="24">-->
    <div style="display:flex;margin-bottom:10px;">
        <div v-if="!tbconfig.hideShowExcel">
          <!-- <el-tooltip effect="dark" content="导出为Excel" placement="top-start"> -->
            <el-button size="mini" type="primary" @click="outExeclDialog">
              <!-- <icon-svg style="font-size:20px" name="excel"></icon-svg> -->
              导出
            </el-button>
          <!-- </el-tooltip> -->
         </div>
         <div style="margin-left:10px;">
             <slot name="toolbar"> </slot>
         </div>
    </div>
  
    <el-table :id="tableId" v-loading="dataListLoading" ref="multipleTable" :data="tableData"
      @selection-change="selectionChangeHandle" border stripe tooltip-effect="dark" :show-overflow-tooltip="true"
      highlight-current-row size="small" :height="tableHeight" style="width:100%;">
      <el-table-column v-if="tbconfig.isShowSelection" type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column v-if="tbconfig.isShowRowIndex" type="index" header-align="center" align="center" width="60"
        :fixed="tbcols[0].fixed" label="序号"></el-table-column>
      <el-table-column v-for="(item, index) in tbcols" :key="index" :prop="item.prop" :label="item.label"
        :fixed="item.fixed" :min-width="item.width ? item.width : 120" show-overflow-tooltip align="center" sortable>
        <el-table-column v-for="(child, tc) in item.children" :key="tc" :prop="child.prop" :label="child.label"
          :min-width="child.width ? child.width : 120" show-overflow-tooltip align="center">
        </el-table-column>
        <template slot-scope="scope">
          <el-tag size="small" :type="item.getColor(scope.row) || 'success'" v-if="item.tag === true">
            {{ scope.row[item.prop] }}</el-tag>
          <label v-if="item.tag !== true">{{ scope.row[item.prop] }}</label>
        </template>
      </el-table-column>
      <el-table-column v-if="
          tbconfig.rowButtonType === 1 &&
            (config.hasUpdateAuth || config.hasDeleteAuth)
        " fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="config.hasUpdateAuth" size="small" @click="addOrUpdateHandle(scope.row)">修改
          </el-button>
          <el-button type="text" v-if="config.hasDeleteAuth" size="small" @click="deleteHandle(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="tbconfig.rowButtonType === 2" fixed="right" header-align="center" align="center"
        width="120" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="callHandle(scope.row)">召读</el-button>
          <el-button type="text" size="mini" @click="sendHandle(scope.row)">设置</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="tbconfig.rowButtonType === 3" fixed="right" header-align="center" label="操作" align="center"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dataDetail(scope.row)">更多</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="tbconfig.rowButtonType === 4" fixed="right" header-align="center" align="center"
        :width="tbconfig.btnWidth">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" round v-for="(item, index) in tbconfig.buttons" :key="index"
            @click="item.handler(scope.row, $refs)">{{ item.label }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: inline-block;width: 100%;">
      <el-pagination background v-if="paginationShow && tbconfig.isShowPage && this.pageMode === 0"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 200, 500]" :page-size="pageSize" @click="jumpPage(currentPage)"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount" style="float: right;">
      </el-pagination>
      <el-pagination v-if="tbconfig.isShowPage && this.pageMode === 1" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="pageSize" small layout="prev, pager, next" :total="totalCount"
        style="float: right;"></el-pagination>

    </div>
    <!--</el-col>-->
    <div>
      <el-dialog title="数据导出类型" :visible.sync="dialogVisible">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="exportExcel(0)">全部导出</el-button>
          <el-button type="primary" @click="exportExcel(1)">当前页导出</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="gt-hidden">
      <form style="MARGIN: 0px; PADDING-LEFT: 0px; WIDTH: 0px; PADDING-RIGHT: 0px; HEIGHT: 0px; PADDING-TOP: 0px"
        :id="excelFormId" name="export_form" action="" target="export_iframe" height="0" width="0">
        <input id="isExport" value="true" type="hidden" name="isExport" />
        <input id="excelHeads" value="" type="hidden" name="excelHeads" />
        <input type="hidden" name="fileName" value=" " />
        <input type="hidden" name="token" value="" />
        <template v-for="(value, key) in tbparams">
          <input type="hidden" :name="key" :value="value" />
        </template>
      </form>
      <iframe style="WIDTH: 0px; HEIGHT: 0px" id="export_iframe" height="0" border="0" frameBorder="0" width="0"
        name="export_iframe" scrolling="no">
      </iframe>
    </div>
    <!--</el-row>-->
  </div>
</template>

<script>
export default {
  name: 'hltable',
  props: {
    tburl: {
      type: String,
      required: true
    },
    tbcols: {
      type: Array,
      required: true
    },
    tbstyle: {
      type: Object,
      default: function() {
        return {
          width: '100%'
        }
      }
    },
    tbconfig: {
      type: Object,
      default: function() {
        return {
          isShowSelection: true,
          isShowRowIndex: true,
          rowButtonType: 0,
          pageMode: 0,
          isShowPage: true,
          isShowExcel: true
        }
      }
    }
  },
  data: function() {
    return {
      dataListLoading: false,
      tableData: [],
      dialogVisible: false,
      dataListSelections: [],
      tbparams: {},
      //默认每页数据量
      pageSize: 10,
      //当前页码
      currentPage: 1,
      //查询的页码
      start: 1,
      //默认数据总数
      totalCount: 1,
      paginationShow: false,
      loadDataCallBack: null
    }
  },
  computed: {
    tableHeight() {
      let th =
        this.tbstyle && this.tbstyle.height ? this.tbstyle.height : undefined
      return th
    },
    tableId() {
      return 'tableId_' + new Date().getTime()
    },
    pageMode() {
      return this.tbconfig.pageMode || 0
    },
    excelFormId() {
      return 'export_form_' + new Date().getTime()
    },
    config() {
      let cf = this.tbconfig
      if (cf.hasUpdateAuth == undefined) {
        cf.hasUpdateAuth = true
      }
      if (cf.hasDeleteAuth == undefined) {
        cf.hasDeleteAuth = true
      }
      return cf
    }
  },
  watch: {
    tbparams: function(value, oldvalue) {
      //this.$set(this.currentPage,1)
    }
  },
  methods: {
    /**
     * 对 Table 进行重新布局
     */
    doLayout() {
      this.$refs.multipleTable.doLayout()
    },
    parseParam(param, key) {
      // var vm = this
      var paramStr = ''
      if (
        param instanceof String ||
        param instanceof Number ||
        param instanceof Boolean
      ) {
        paramStr += '&' + key + '=' + encodeURIComponent(param)
      }
      return paramStr.substr(1)
    },
    outExeclDialog() {
      var vm = this
      vm.dialogVisible = true
    },
    exportExcel(flag, columnInfo) {
      var vm = this
      var tmp = vm.tbparams
      var url = window.SITE_CONFIG['baseUrl'] + vm.tburl
      var excelName = vm.tbparams.excelName ? vm.tbparams.excelName : 'excel'
      var exelForm = document.getElementById(this.excelFormId)
      exelForm.action = url
      var methond = 'get'
      exelForm.method = methond
      if (flag == 0) {
        exelForm.page.value = 1
        exelForm.limit.value = vm.totalCount
      } else {
        exelForm.page.value = tmp.page
        exelForm.limit.value = tmp.limit
      }
      exelForm.excelHeads.value = columnInfo ? columnInfo : this.getColumnInfo()
      exelForm.fileName.value = excelName
      exelForm.token.value = this.$cookie.get('token')
      vm.dialogVisible = false
      exelForm.submit()
    },
    getColumnInfo() {
      var tmp = []
      this.tbcols.forEach((item, index) => {
        var children = item.children
        if (children) {
          var label = item.label
          children.forEach((v, i) => {
            tmp.push(v.prop + ',' + v.label + label)
          })
        } else {
          tmp.push(item.prop + ',' + item.label)
        }
      })
      return tmp.join('@')
    },
    //每页显示数据量变更
    handleSizeChange(val) {
      this.pageSize = val
      this.load()
    },
    //页码变更
    handleCurrentChange(val) {
      this.currentPage = val
      this.load()
    },
    loadLocalData(data) {
      if (Array.isArray(data)) {
        this.tableData = data
        this.doLayout()
      }
    },
    //从服务器读取数据
    load() {
      // var data = []
      let _params = this.tbparams

      _params.page = this.currentPage // (pageNum-1)*pageSize;
      _params.limit = this.tbconfig.isShowPage ? this.pageSize : 999999
      this.dataListLoading = true
      let ajaxMethod = 'ajaxGet' //this.tbconfig.ajaxMethod ||
      var vm = this
      this.$http[ajaxMethod](
        this.tburl,
        _params,
        data => {
          vm.tableData = data.list || data.page.list
          vm.totalCount = data.page ? data.page.totalCount : data.list.length
          vm.dataListLoading = false
          if (vm.loadDataCallBack) {
            vm.loadDataCallBack(data)
          }
        },
        data => {
          vm.dataListLoading = false
          vm.$message.error(data.msg || '加载数据失败，请联系管理员')
        }
      )
    },
    changeUrl(url) {
      this.tburl = url
    },
    //从服务器读取数据
    loadData(params, callBackFun, pageNum, pageSize) {
      this.tbparams = params ? params : {}
      if (pageSize) {
        this.pageSize = pageSize
      }
      this.loadDataCallBack = callBackFun
      this.paginationShow = false
      this.handleCurrentChange(1)
      this.$nextTick(function() {
        this.paginationShow = true
      })
    },
    addOrUpdateHandle(row) {
      this.$emit('addOrUpdateHandle', row)
    },
    deleteHandle(row) {
      this.$emit('deleteHandle', row)
    },
    callHandle(row) {
      this.$emit('callHandle', row)
    },
    sendHandle(row) {
      this.$emit('sendHandle', row)
    },
    dataDetail(row) {
      this.$emit('dataDetail', row)
    },
    getCurrentRow(index) {},
    selectionChangeHandle(val) {
      this.dataListSelections = val
      this.$emit('selections', val)
    },
    clearSelection() {
      this.dataListSelections = null
      this.$refs.multipleTable.clearSelection()
    },
    selectRow(rows, isSelected) {
      this.$refs.multipleTable.toggleRowSelection(rows, isSelected)
    }
  }
}
</script>

<style>
.gContent {
  width: 100%;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto !important;
}
.gt-hidden {
  height: 0;
}
</style>
