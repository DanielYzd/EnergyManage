<template>
  <div class="sublevel">
    <div class="left">
      <div style="position:absolute; width:100%;">
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
            <div style="line-height:30px;margin-right:30px;">已挂载子级</div>
            <el-button
              size="mini"
              type="primary"
              :disabled="this.selectionValue.length === 0"
              >批量卸载</el-button
            >
          </template>
        </common-table>
      </div>
    </div>
    <div class="right">
      <div style="position:absolute; width:100%;">
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
            <div style="line-height:30px;margin-right:30px;">待挂载子级</div>
            <el-input
              size="mini"
              clearable
              v-model="linename"
              prefix-icon="el-icon-search"
              placeholder="输入名称搜索"
              style="width:150px;margin-right:10px;"
              @keyup.enter.native="queryparentchildnode"
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
      this.queryparentchildnode()
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
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'linename',
          label: '分线名称'
        },
        {
          prop: 'archivetype',
          label: '子级类别',
          render: (h, parmas) => {
            return [
              h('span', {
                style: 'fontSize: 22px'
              }),
              h('span', '分线')
            ]
          }
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
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'linename',
          label: '分线名称'
        },
        {
          prop: 'archivetype',
          label: '子级类别',
          render: (h, parmas) => {
            return [
              h('span', {
                style: 'fontSize: 22px'
              }),
              h('span', '分线')
            ]
          }
        }
      ],
      selectionValue: [],
      selectionValue1: [],
      linename: ''
    }
  },
  created() {
    this.queryparentchildnode()
  },
  methods: {
    //查询待挂载的子级
    queryparentchildnode() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        notype: 2,
        linename: this.linename ? this.linename : 'admin'
      }
      this.$api.transformer.queryparentchildnode(body).then(res => {
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
      this.queryparentchildnode()
    },
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      this.queryparentchildnode()
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
  height: 100%;
  .left {
    flex: 1;
    margin-right: 20px;
    position: relative;
  }
  .right {
    flex: 1;
    position: relative;
  }
}
</style>
