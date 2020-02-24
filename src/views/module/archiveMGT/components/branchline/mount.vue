<template>
  <div class="mount">
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
          <div style="line-height:30px;margin-right:10px;">已挂载表计</div>
          <el-button
            type="primary"
            size="mini"
            @click="dismountitemlinestransmeter"
            >卸载</el-button
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
          <div style="line-height:30px;margin-right:10px;">待挂载表计</div>
          <el-button
            type="primary"
            size="mini"
            @click="mountitelinestransmmeter"
            >挂载</el-button
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
  data() {
    return {
      id: '',
      type: '',
      tableData: [],
      options: {
        loading: false,
        index: false,
        maxHeight: 450,
        mutiSelect: true
      },
      pagination: {
        total: 0,
        pageNum: 1,
        numPerPage: 10,
        small: true
      },
      columns: [
        {
          label: 'ID',
          prop: 'pointid'
        },
        {
          label: '表计名称',
          prop: 'disc'
        },
        {
          label: '表计类别',
          prop: 'typeName'
        }
      ],
      tableData1: [],
      options1: {
        loading: false,
        index: false,
        maxHeight: 450,
        mutiSelect: true
      },
      pagination1: {
        total: 0,
        pageNum: 1,
        numPerPage: 10,
        small: true
      },
      columns1: [
        {
          label: 'ID',
          prop: 'pointid'
        },
        {
          label: '表计名称',
          prop: 'disc'
        },
        {
          label: '表计类别',
          prop: 'typeName'
        }
      ],
      selectionValue: [],
      selectionValue1: []
    }
  },
  props: {
    ruleForm: {
      type: Object
    }
  },
  watch: {
    ruleForm: {
      handler: function(val, oldval) {
        if (val != oldval) {
          this.$nextTick(() => {
            console.log(val)
            // if (val != oldval) {
            //   console.log(oldval)
            // }
            if (val.archivetype) {
              this.id = val.id
              this.type = val.archivetype
              this.linestransmeter()
              this.querymeterchildnode()
            }
          })
        }
      },
      immediate: true, //关键
      deep: true
    }
  },
  methods: {
    linestransmeter() {
      this.options.loading = true
      let body = {
        id: this.id,
        archivetype: this.type,
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage
      }
      this.$api.newbranchline.linestransmeter(body).then(res => {
        this.options.loading = false
        this.tableData = res.page.list
        this.pagination.total = res.page.totalCount
      })
    },
    querymeterchildnode() {
      this.options1.loading = true
      let body = {
        id: this.id,
        notetype: this.type,
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage
      }
      this.$api.newbranchline.querymeterchildnode(body).then(res => {
        this.options1.loading = false
        this.tableData1 = res.page.list
        this.pagination1.total = res.page.totalCount
      })
    },
    handleSizeChange(numPerPage) {
      this.pagination.numPerPage = numPerPage
      this.linestransmeter()
    },
    handleIndexChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.linestransmeter()
    },
    handleSelectionChange(value) {
      this.selectionValue = value
    },
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
    },
    mountitelinestransmmeter() {
      let rgtstrs = this.selectionValue1.map(item => {
        return { id: item.pointid }
      })
      console.log(rgtstrs)
      let body = {
        rgtstrs,
        translines: {
          archivetype: this.type,
          id: this.id
        }
      }
      this.mount(body)
    },
    dismountitemlinestransmeter() {
      let rgtstrs = this.selectionValue.map(item => {
        return { id: item.pointid }
      })
      console.log(rgtstrs)
      let body = {
        rgtstrs,
        translines: {
          archivetype: this.type,
          id: this.id
        }
      }
      this.dismount(body)
    },
    mount(body) {
      this.$api.newbranchline.mountitelinestransmmeter(body).then(res => {
        console.log(res)
        this.linestransmeter()
        this.querymeterchildnode()
      })
    },
    dismount(body) {
      this.$api.newbranchline.dismountitemlinestransmeter(body).then(res => {
        this.linestransmeter()
        this.querymeterchildnode()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mount {
  display: flex;
  overflow: auto;

  .left {
    flex: 1;
    margin-right: 20px;
  }
  .right {
    flex: 1;
  }
}
</style>
