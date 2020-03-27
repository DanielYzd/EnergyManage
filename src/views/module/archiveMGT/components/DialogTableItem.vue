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
            <el-button type="primary" size="mini" @click="dismountitemmeter()"
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
          ref="childtable"
          @handleSizeChange="handleSizeChange1"
          @handleIndexChange="handleIndexChange1"
          @selection-change="handleSelectionChange1"
        >
          <template slot="toolbar">
            <div style="line-height:30px;margin-right:10px;">待挂载表计</div>
            <el-button type="primary" size="mini" @click="mountitemmeter()"
              >挂载</el-button
            >
          </template>
        </common-table>
      </el-col>
    </el-row>
    <el-row style="display:flex;flex-direction:row-reverse;margin-top:10px;">
      <el-button type="primary" size="mini" @click="closeItemTable">
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
    itemrow: {
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
          label: '公式符号',
          prop: 'symbol',
          render: (h, params) => {
            return h(
              'el-select',
              {
                props: {
                  value: params.row.symbol,
                  size: 'mini'
                },
                on: {
                  change: value => {
                    params.row.symbol = value
                    //切换类型，清空全选项
                    this.$refs.childtable.clearSelection()
                  }
                },
                style: {
                  fontSize: '12px'
                }
              },
              [
                h('el-option', {
                  props: {
                    value: 1,
                    label: '加公式'
                  }
                }),
                h('el-option', {
                  props: {
                    value: 2,
                    label: '减公式'
                  }
                })
              ]
            )
          }
        },
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
          prop: 'customerid',
          render: (h, parmas) => {
            switch (parmas.row.customerid) {
              case 0:
                return [
                  h('span', {
                    style: 'fontSize: 22px'
                  }),
                  h('span', '电')
                ]
              case 1:
                return [
                  h('span', {
                    style: 'fontSize: 22px'
                  }),
                  h('span', '水')
                ]
              case 2:
                return [
                  h('span', {
                    style: 'fontSize: 22px'
                  }),
                  h('span', '气')
                ]
              case 3:
                return [
                  h('span', {
                    style: 'fontSize: 22px'
                  }),
                  h('span', '热')
                ]
            }
            // if (parmas.row.archivetype === 0) {
            //   return [
            //     h('span', {
            //       style: 'fontSize: 22px'
            //     }),
            //     h('span', '电')
            //   ]
            // } else if (parmas.row.archivetype === 1) {
            //   return [
            //     h('span', {
            //       style: 'fontSize: 22px'
            //     }),
            //     h('span', '水')
            //   ]
            // }
          }
        }
      ],
      selectionValue: [],
      selectionValue1: [],
      type: 'add',
      differmeters: [], //挂载已选择为减的
      summermeters: [], //挂载已选择为加的
      undiffermeters: [], //卸载已选择为减的
      unsummermeters: [] //卸载已选择为加的
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
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        buildingid: this.itemrow.buildingid
      }
      this.options1.loading = true
      this.$api.building.itemunmountedmeter(body).then(res => {
        if (res.code === 0) {
          this.options1.loading = false
          // this.tableData1 = res.page.list
          this.tableData1 = res.page.list.map(item => {
            return { ...item, symbol: 1 }
          })
          this.pagination1.total = res.page.totalCount
        }
      })
    },
    handleSizeChange(numPerPage) {
      this.pagination.numPerPage = numPerPage
      this.type === 'add' ? this.itemaddmeter() : this.itemsubmeter()
    },
    handleIndexChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.type === 'add' ? this.itemaddmeter() : this.itemsubmeter()
    },
    handleSelectionChange(value) {
      this.selectionValue = value
      let unsummermeters = this.type === 'add' ? this.selectionValue : []
      let undiffermeters = this.type === 'sub' ? this.selectionValue : []
      unsummermeters = unsummermeters.map(item => {
        return { id: item.pointid }
      })
      undiffermeters = undiffermeters.map(item => {
        return { id: item.pointid }
      })
      this.undiffermeters = undiffermeters
      this.unsummermeters = unsummermeters
    },
    handleSizeChange1(numPerPage) {
      this.pagination1.numPerPage = numPerPage
      this.itemunmountedmeter()
    },
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      this.itemunmountedmeter()
    },
    handleSelectionChange1(value) {
      this.selectionValue1 = value
      console.log(this.selectionValue1)
      // let summermeters = this.selectionValue1.map(item => {
      //   if (item.symbol === 1) {
      //     return { id: item.pointid }
      //   }
      // })
      // let differmeters = this.selectionValue1.map(item => {
      //   if (item.symbol === 2) {
      //     return { id: item.pointid }
      //   }
      // })
      let summermeters = this.selectionValue1.filter(item => {
        return item.symbol === 1
      })
      let differmeters = this.selectionValue1.filter(item => {
        return item.symbol === 2
      })
      summermeters = summermeters.map(item => {
        return { id: item.pointid }
      })
      differmeters = differmeters.map(item => {
        return { id: item.pointid }
      })
      console.log(summermeters)
      console.log(differmeters)
      this.differmeters = differmeters
      this.summermeters = summermeters
    },
    //挂载表计
    mountitemmeter() {
      let body = {
        differmeters: this.differmeters,
        itemid: {
          id: this.itemrow.id
        },
        summermeters: this.summermeters
      }
      console.log(body)
      this.$api.building.mountitemmeter(body).then(res => {
        if (res.code === 0) {
          this.type === 'add' ? this.itemaddmeter() : this.itemsubmeter()
          this.itemunmountedmeter()
        }
      })
    },
    //卸载表计
    dismountitemmeter() {
      let body = {
        differmeters: this.undiffermeters,
        itemid: {
          id: this.itemrow.id
        },
        summermeters: this.unsummermeters
      }
      console.log(body)
      this.$api.building.dismountitemmeter(body).then(res => {
        if (res.code === 0) {
          this.type === 'add' ? this.itemaddmeter() : this.itemsubmeter()
          this.itemunmountedmeter()
        }
      })
    },
    closeItemTable() {
      this.$emit('closeItemTable')
    }
  }
}
</script>

<style lang="scss" scoped></style>
