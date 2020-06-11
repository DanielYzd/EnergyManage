<template>
  <div>
    <common-table :dataSource="tableData" :options="options" :pagination="pagination" :columns="columns"
      @handleSizeChange="handleSizeChange" @handleIndexChange="handleIndexChange">
      <template slot="toolbar">
        <el-input size="mini" clearable v-model="transname" prefix-icon="el-icon-search" placeholder="输入名称搜索"
          style="width:150px;margin-right:10px;" @keyup.enter.native="query"></el-input>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click>删除</el-button>
      </template>
    </common-table>
    <Dialog :dialogVisible="dialogVisible" :showFoot="showFoot" :title="title">
      <transformerAddorUpdate :parentForm="parentForm" @back="back" @confirm="confirm"></transformerAddorUpdate>
    </Dialog>
    <Dialog :width="width" :dialogVisible="operateVisible" :title="operateTitle" @close="operateclose"
      :showClose="false" :showFoot="false" :showFootClose="true">
      <transformerOperate :row="row"></transformerOperate>
    </Dialog>
  </div>
</template>

<script>
import Dialog from '@/views/common/dialog'
import CommonTable from '@/views/common/Table'
import transformerAddorUpdate from './components/transformer-add-or-update'
import transformerOperate from './components/transformer-operation'
export default {
  components: {
    CommonTable,
    Dialog,
    transformerAddorUpdate,
    transformerOperate
  },
  data() {
    return {
      transname: '',
      tableData: [],
      parentForm: {},
      options: {
        loading: false,
        index: false,
        maxHeight: 650
      },
      row: {},
      columns: [
        {
          prop: 'transcode',
          label: '变压器编号'
        },
        {
          prop: 'transname',
          label: '变压器名称'
        },
        {
          prop: 'supplymode',
          label: '供电形式',
          render: (h, parmas) => {
            return [
              h('span', {
                style: 'fontSize: 22px'
              }),
              h('span', parmas.row.supplymode === 0 ? '专变' : '公变')
            ]
          }
        },
        {
          prop: 'installlocation',
          label: '操作地址'
        },
        {
          button: true,
          label: '操作',
          width: '200px',
          fixed: 'right',
          group: [
            {
              // you can props => type size icon disabled plain
              name: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this._onEditDialog(row, index)
              }
            },
            {
              name: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              disabled: false,
              onClick: row => {
                this.$confirm('确定是否删除？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  closeOnClickModal: false
                })
                  .then(() => {
                    let id = row.id
                    this.$api.transformer.deletetrans(id).then(res => {
                      this.query()
                    })
                  })
                  .catch(error => {
                    console.log(error)
                  })
              }
            },
            {
              name: '操作',
              type: 'primary',
              icon: 'el-icon-setting',
              onClick: row => {
                this._openOperate(row)
              }
            }
          ]
        }
      ],
      pagination: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      dialogVisible: false,
      showFoot: false,
      title: '',
      operateVisible: false,
      operateTitle: '',
      width: '70%'
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.options.loading = true
      let body = this.transname
        ? {
            page: this.pagination.pageNum,
            limit: this.pagination.numPerPage,
            transname: this.transname
          }
        : {
            page: this.pagination.pageNum,
            limit: this.pagination.numPerPage,
            transname: 'admin'
          }
      this.$api.transformer.queryPage(body).then(res => {
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    handleSizeChange(numPerPage) {
           this.pagination.numPerPage = numPerPage
      this.query()
    },
    // 跳转下一页或指定页
    handleIndexChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.query()
    },
    add() {
      this.dialogVisible = true
      this.title = '新增变压器'
      this.parentForm = {}
    },
    _onEditDialog(row, index) {
      this.dialogVisible = true
      this.title = '修改变压器'
      this.parentForm = row
    },
    back() {
      this.dialogVisible = false
    },
    confirm(value, type) {
      console.log(value)
      console.log(type)
      if (type === 'add') {
        this.$api.transformer.addtrans(value).then(res => {
          console.log(res)
          this.query()
        })
      } else {
        this.$api.transformer.modifytrans(value).then(res => {
          console.log(res)
          this.query()
        })
      }

      this.dialogVisible = false
    },
    _openOperate(row) {
      console.log(row)
      this.row = row
      this.operateVisible = true
      this.operateTitle = row.transname
    },
    operateclose() {
      this.operateVisible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
