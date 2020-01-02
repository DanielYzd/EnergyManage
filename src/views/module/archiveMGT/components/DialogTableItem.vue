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
            <el-radio
              v-model="type"
              label="add"
              style="line-height:30px;margin-right:10px;"
              >+公式</el-radio
            >
            <el-radio
              v-model="type"
              label="sub"
              style="line-height:30px;margin-right:10px;"
              >-公式</el-radio
            >
          </template>
        </common-table>
      </el-col>
      <el-col :span="12"> </el-col>
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
    itemrow: {
      type: Object
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
        numPerPage: 20
      },
      columns: [
        {
          label: '公式符号',
          prop: ''
        },
        {
          label: 'ID',
          prop: ''
        },
        {
          label: '表计名称',
          prop: ''
        },
        {
          label: '表计类别',
          prop: ''
        }
      ],
      selectionValue: [],
      type: 'add'
    }
  },
  created() {
    console.log(this.itemrow)
    this.type === 'add' ? this.itemaddmeter() : this.itemsubmeter()
    this.itemunmountedmeter()
  },
  watch: {
    type(newValue, oldValue) {
      if (newValue === 'add') {
        this.itemaddmeter()
      } else {
        this.itemsubmeter()
      }
    }
  },
  methods: {
    itemaddmeter() {
      this.options.loading = true
      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        id: this.itemrow.id
      }
      this.$api.building.itemaddmeter(body).then(res => {
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    itemsubmeter() {
      this.options.loading = true
      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        id: this.itemrow.id
      }
      this.$api.building.itemsubmeter(body).then(res => {
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    itemunmountedmeter() {
      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        buildingid: this.itemrow.buildingid
      }
      this.$api.building.itemunmountedmeter(body).then(res => {
        console.log(res)
      })
    },
    handleSizeChange(numPerPage) {
      this.pagination.numPerPage = numPerPage
      this.itemaddmeter()
    },
    handleIndexChange(pageNum) {
      this.pagination1.pageNum = pageNum
      this.itemaddmeter()
    },
    handleSelectionChange(value) {
      this.selectionValue = value
    }
  }
}
</script>

<style lang="scss" scoped></style>
