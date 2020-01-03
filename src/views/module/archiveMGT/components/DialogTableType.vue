<template>
  <div>
    <el-tag size="small">计量公式</el-tag>
    <el-row :gutter="20">
      <el-col :span="12">
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
            <el-button type="primary" size="mini" @click="unmountlinewater"
              >卸载</el-button
            >
          </template>
        </common-table>
      </el-col>
      <el-col :span="12">
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
            <el-button type="primary" size="mini" @click="mountlinewater"
              >挂载</el-button
            >
          </template>
        </common-table>
      </el-col>
    </el-row>
    <el-row style="display:flex;flex-direction:row-reverse;margin-top:10px;">
      <el-button type="primary" size="mini" @click="closeTypeTable">
        关闭
      </el-button>
    </el-row>
  </div>
</template>

<script>
import CommonTable from '@/views/common/Table'
export default {
  components: {
    CommonTable
  },
  props: {
    typerow: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      tableData1: [],
      options: {
        loading: false,
        index: false,
        maxHeight: 450,
        mutiSelect: true
      },
      options1: {
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
      pagination1: {
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
  created() {
    console.log(this.typerow)
    this.afterresultwater()
    this.querywaterchildnode()
  },
  methods: {
    closeTypeTable() {
      this.$emit('closeTypeTable')
    },
    handleSizeChange(numPerPage) {
      this.pagination.numPerPage = numPerPage
      this.afterresultwater()
    },
    handleIndexChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.afterresultwater()
    },
    handleSelectionChange(value) {
      this.selectionValue = value
    },
    handleSizeChange1(numPerPage) {
      this.pagination1.numPerPage = numPerPage
      this.querywaterchildnode()
    },
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      this.querywaterchildnode()
    },
    handleSelectionChange1(value) {
      this.selectionValue1 = value
    },
    afterresultwater() {
      this.options.loading = true
      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        id: this.typerow.id
      }
      this.$api.building.afterresultwater(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    querywaterchildnode() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        id: this.typerow.id
      }
      this.$api.building.querywaterchildnode(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options1.loading = false
          this.tableData1 = res.page.list
          this.pagination1.total = res.page.totalCount
        }
      })
    },
    mountlinewater() {
      console.log(this.selectionValue1)
      let list = this.selectionValue1.map(item => {
        return { id: item.pointid }
      })
      let body = {
        entrytypeid: {
          id: this.typerow.id
        },
        wateridlist: list
      }
      console.log(body)
      this.$api.building.mountlinewater(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.afterresultwater()
          this.querywaterchildnode()
        }
      })
    },
    unmountlinewater() {
      console.log(this.selectionValue)
      let list = this.selectionValue.map(item => {
        return { id: item.pointid }
      })
      let body = {
        entrytypeid: {
          id: this.typerow.id
        },
        wateridlist: list
      }
      console.log(body)
      this.$api.building.unmountlinewater(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.afterresultwater()
          this.querywaterchildnode()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
