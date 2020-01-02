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
          prop: 'itemtype',
          label: '分项类别'
        },
        {
          prop: 'itemname',
          label: '分项名称'
        },
        {
          prop: 'differmeter',
          label: '＋公式'
        },
        {
          prop: 'summeter',
          label: '-公式'
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
              value: '指标',
              //   plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this._edit('content', row, index)
              }
            },
            {
              name: '编辑',
              type: 'primary',
              size: 'mini',
              icon: 'el-icon-edit',
              value: '公式',
              //   plain: true,
              onClick: (row, index) => {
                // 箭头函数写法的 this 代表 Vue 实例
                this._edit('table', row, index)
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
    this.queryallenergyitem(this.id)
  },
  watch: {
    id(newValue, oldValue) {
      this.queryallenergyitem(newValue)
    }
  },
  methods: {
    //查询列表树
    queryallenergyitem(id) {
      this.options.loading = true
      let body = {
        id
      }
      this.$api.building.queryallenergyitem(body).then(res => {
        if (res.code === 0) {
          this.loop(res.data, [], 78)
          this.options.loading = false
        }
      })
    },
    loop(list, data, pcode) {
      list.forEach(item => {
        if (item.dicparentid === pcode) {
          let child = {
            children: [],
            archivetype: item.archivetype,
            buildingid: item.buildingid,
            createtime: item.createtime,
            dicid: item.dicid,
            dicparentid: item.dicparentid,
            differmeter: item.differmeter,
            id: item.id,
            itemcode: item.itemcode,
            itemname: item.itemname,
            itemtype: item.itemtype,
            mountstatus: 0,
            summeter: item.summeter
          }
          this.loop(list, child.children, item.dicid)
          data.push(child)
          this.tableData = data
        }
      })
    },
    _edit(type, row, index) {
      this.$emit('itemedit', type, row, index)
    }
  }
}
</script>

<style lang="scss" scoped></style>
