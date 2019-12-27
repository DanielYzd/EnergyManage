<template>
  <div class="sublevel">
    <div class="left">
      <common-table
        :dataSource="tableData"
        :options="options"
        :pagination="pagination"
        :columns="columns"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @selection-change="handleSelectionChange"
      >
        <template slot="toolbar">
          <div style="line-height:30px;margin-right:30px;">已挂载电表</div>
          <el-button
            size="mini"
            type="primary"
            :disabled="this.selectionValue.length === 0"
            >批量卸载</el-button
          >
        </template>
      </common-table>
    </div>
    <div class="right">
      <common-table
        :dataSource="tableData1"
        :options="options1"
        :pagination="pagination1"
        :columns="columns1"
        @handleSizeChange="handleSizeChange1"
        @handleIndexChange="handleIndexChange1"
        @selection-change="handleSelectionChange1"
      >
        <template slot="toolbar">
          <div style="line-height:30px;margin-right:30px;">待挂载电表</div>
          <el-input
            size="mini"
            clearable
            v-model="linename"
            prefix-icon="el-icon-search"
            placeholder="输入名称搜索"
            style="width:150px;margin-right:10px;"
            @keyup.enter.native="querymeterchildnode"
          ></el-input>
          <el-button
            size="mini"
            type="primary"
            :disabled="this.selectionValue1.length === 0"
            >批量挂载</el-button
          >
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/views/common/Table'
export default {
  components: {
    CommonTable
  },
  computed: {
    // id() {
    //   return this.$parent.$parent.$parent.id
    // },
    type() {
      return this.$parent.$parent.$parent.type
    },
    id: {
      get() {
        return this.$parent.$parent.$parent.id
      },
      set(val) {
        return val
      }
    }
  },
  watch: {
    id(newValue, oldValue) {
      this.querymeterchildnode()
      this.afterlineresultmeter()
    }
  },
  data() {
    return {
      tableData: [],
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
          prop: 'pointid',
          label: 'ID'
        },
        {
          prop: 'disc',
          label: '表计名称'
        },
        {
          prop: 'typeName',
          label: '子级类别'
        }
      ],
      tableData1: [],
      options1: {
        loading: false,
        index: false,
        maxHeight: 650,
        mutiSelect: true
      },
      pagination1: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      columns1: [
        {
          prop: 'pointid',
          label: 'ID'
        },
        {
          prop: 'disc',
          label: '表计名称'
        },
        {
          prop: 'typeName',
          label: '子级类别'
        }
      ],
      selectionValue: [],
      selectionValue1: [],
      linename: ''
    }
  },
  created() {
    this.querymeterchildnode()
    this.afterlineresultmeter()
  },
  methods: {
    //查询已挂载的表计
    afterlineresultmeter() {
      this.options.loading = true

      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        serachkind: 1, //serachkind查询类型4变压器,1电表，2子集,3终端
        archivetype: this.type,
        id: this.id
      }
      this.$api.branchline.afterlineresultmeter(body).then(res => {
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    //查询待挂载表计
    querymeterchildnode() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        notype: 1,
        metername: this.metername ? this.metername : 'admin'
      }
      this.$api.transformer.querymeterchildnode(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options1.loading = false
          this.tableData1 = res.page.list
          this.pagination1.total = res.page.totalCount
        }
      })
    },
    handleSizeChange() {},
    handleIndexChange() {},
    handleSelectionChange() {},
    handleSizeChange1(numPerPage) {
      this.pagination1.numPerPage = numPerPage
      this.querymeterchildnode()
    },
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      this.querymeterchildnode()
    },
    handleSelectionChange1(value) {
      this.selectionValue1 = value
    }
  }
}
</script>

<style lang="scss" scoped>
.sublevel {
  display: flex;
  .left {
    flex: 1;
    margin-right: 20px;
  }
  .right {
    flex: 1;
  }
}
</style>
