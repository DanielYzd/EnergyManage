<template>
  <div>
    <common-table
      :dataSource="tableData"
      :options="options"
      :columns="columns"
      :treeProps="treeProps"
      :rowKey="'id'"
    ></common-table>
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
      treeProps: { children: 'children' },
      tableData: [],
      options: {
        loading: false
      },
      columns: [
        {
          prop: 'typetype',
          label: '分类类别'
        },
        {
          prop: 'summeter',
          label: '+公式'
        },
        {
          prop: 'differmeter',
          label: '-公式'
        },
        {
          prop: 'energyunit',
          label: '单位'
        },
        {
          prop: 'coalcoefficient',
          label: '折标准系煤数'
        },
        {
          prop: 'typetype',
          label: '采集类型'
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
              type: 'primary',
              size: 'mini',
              icon: 'el-icon-edit',
              //   plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this._onEditDialog(row, index)
              }
            }
          ]
        }
      ]
    }
  },
  computed: {
    id: {
      get() {
        return this.$parent.$parent.$parent.id
      },
      set(val) {
        return val
      }
    }
  },
  created() {
    this.queryallenergytype(this.id)
  },
  watch: {
    id(newValue, oldValue) {
      this.queryallenergytype(newValue)
    }
  },
  methods: {
    //查询列表树
    queryallenergytype(id) {
      let body = {
        id
      }
      this.options.loading = true
      this.$api.building.queryallenergytype(body).then(res => {
        console.log(res.data)
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.data
        }
        // this.loop(res.data, [], 78)
        // console.log(this.tableData)
      })
    },
    // loop(list, data, pcode) {
    //   list.forEach(item => {
    //     if (item.dicparentid === pcode) {
    //       let child = {
    //         children: [],
    //         archivetype: item.archivetype,
    //         buildingid: item.buildingid,
    //         createtime: item.createtime,
    //         dicid: item.dicid,
    //         dicparentid: item.dicparentid,
    //         differmeter: item.differmeter,
    //         id: item.id,
    //         itemcode: item.itemcode,
    //         itemname: item.itemname,
    //         itemtype: item.itemtype,
    //         mountstatus: 0,
    //         summeter: item.summeter
    //       }
    //       this.loop(list, child.children, item.dicid)
    //       data.push(child)
    //       this.tableData = data
    //     }
    //   })
    // },
    _onEditDialog(row, index) {}
  }
}
</script>

<style lang="scss" scoped></style>
