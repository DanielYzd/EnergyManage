<template>
  <div class="dict">
    <Tree
      :defaultProps="defaultProps"
      :treeData="treeData"
      :isaccordion="true"
      :defaultExpandAll="false"
      :loading="loading"
      ref="parentTree"
      @node-click="_handleNodeClick"
      :showCollapseExpand="false"
      :defaultExpandedKeys="defaultExpandedKeys"
      nodeKey="id"
    >
      <template slot="tree-button">
        <el-button type="text" icon="el-icon-plus" @click="add()">
          新增顶级
        </el-button>
      </template>
    </Tree>

    <section class="content">
      <dict-add
        v-if="this.showType === 'add'"
        :nodeData="nodeData"
        :parentForm="parentForm"
        @dictOperation="dictOperation"
      ></dict-add>
      <dict-update
        v-else-if="this.showType === 'update'"
        :nodeData="nodeData"
        :parentForm="parentForm"
        @dictDetailModify="dictDetailModify"
        @delNode="delNode"
      >
        <common-table
          :dataSource="tableData"
          :options="options"
          :columns="columns"
        >
          <template slot="toolbar">
            <el-button size="mini" icon="el-icon-plus" @click="_onAddDialog"
              >新增</el-button
            >
          </template></common-table
        >
      </dict-update>
      <empty v-else></empty>
    </section>
    <Dialog
      :dialogVisible="dialogVisible"
      :title="title"
      @cancle="cancle"
      @confirm="confirm"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="父级名称"
              prop="plabel"
              v-show="this.type === 'add'"
            >
              <el-input v-model="ruleForm.plabel" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典标签" prop="slabel">
              <el-input v-model="ruleForm.slabel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典值" prop="svalue">
              <el-input v-model="ruleForm.svalue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.notes"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import CommonTable from '@/views/common/Table.vue'
import Tree from '@/views/common/tree.vue'
import Dialog from '@/views/common/dialog.vue'
import dictAdd from './components/dictAdd.vue'
import dictUpdate from './components/dictUpdate.vue'
import empty from '@/views/common/Empty.vue'
export default {
  components: {
    CommonTable,
    Dialog,
    Tree,
    dictAdd,
    dictUpdate,
    empty
  },
  data() {
    return {
      loading: false,
      defaultExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'slabel'
      },
      resData: [],
      treeData: [],
      nodeData: {},
      parentForm: {},
      showType: '',
      id: '',
      tableData: [],
      options: {
        maxHeight: 550,
        loading: false,
        stripe: false,
        border: false,
        index: true,
        mutiSelect: false
      },
      columns: [
        {
          prop: 'slabel',
          label: '字典标签'
        },
        {
          prop: 'svalue',
          label: '字典值'
        },
        {
          prop: 'notes',
          label: '备注'
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
              // onClick(row) { // 这种写法的 this 代表 group 里的对象
              //     this.disabled = true
              //     console.log(this)
              // }
              onClick: row => {
                this.$confirm('确定是否删除该字典？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  closeOnClickModal: false
                })
                  .then(() => {
                    let id = row.id
                    this.dictDetailDelete(id).then(res => {
                      this.getDictList()
                    })
                    // this.SWXHR.DELETE(
                    //   `/basic-data/man-hour/del-second-action?id=${id}`
                    // ).then(res => {
                    //   this.fetchTableData()
                    // })
                  })
                  .catch(error => {
                    console.log(error)
                  })
              }
            }
          ]
        }
      ],
      dialogVisible: false,
      title: '',
      ruleForm: {
        layer: 0,
        id: '',
        pcode: '',
        plabel: '',
        slabel: '',
        svalue: '',
        notes: ''
      },
      rules: {
        slabel: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        svalue: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
      },
      type: ''
    }
  },
  created() {
    this.getDictList()
  },
  methods: {
    getDictList() {
      this.loading = true
      this.defaultExpandedKeys = []
      this.defaultExpandedKeys.push(this.id)
      this.$api.sys.getDictlist().then(res => {
        this.resData = res.data
        this.loop(res.data, [], 0)
        this.loading = false
      })
    },
    loop(list, data, pcode) {
      list.forEach(item => {
        if (item.pcode === pcode) {
          let child = {
            slabel: item.slabel,
            layer: item.layer,
            notes: item.notes,
            pcode: item.pcode,
            id: item.id,
            svalue: item.svalue,
            children: []
          }
          this.loop(list, child.children, item.id)

          data.push(child)
          this.treeData = data
          if (this.id) {
            this.$refs.parentTree.setCurrentKey(this.id)
          }
        }
      })
    },
    _handleNodeClick(data, node) {
      //   console.log(node)
      this.id = data.id
      this.showType = 'update'
      this.nodeData = node
      this.parentForm = {
        id: node.data.id,
        plabel: this.nodeData.parent.data.slabel
          ? this.nodeData.parent.data.slabel
          : '无',
        pcode: this.nodeData.data.pcode,
        slabel: node.data.slabel,
        layer: 0,
        svalue: node.data.svalue,
        notes: node.data.notes
      }
      // console.log(this.resData)
      // let tableData = this.resData.map(item => {
      //   return item.pcode === node.data.id ? item : null
      // })
      this.tableData = this.resData.filter(item => item.pcode === node.data.id)
      // console.log(this.tableData)
    },
    add() {
      this.showType = 'add'
      this.parentForm = {
        plabel: '无',
        pcode: 0,
        slabel: '',
        layer: 0,
        svalue: '',
        notes: ''
      }
    },
    dictOperation(form) {
      this.$api.sys.dictOperation(form).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.getDictList()
          this.showType = ''
        }
      })
    },
    dictDetailModify(form) {
      this.$api.sys.dictDetailModify(form).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.getDictList()
          this.showType = ''
        }
      })
    },
    dictDetailDelete(id, flag) {
      this.$api.sys.dictDetailDelete(id).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDictList()
          if (flag === '1') {
            //如果删除父字典 则不刷新nodekey，并且置空
            this.id = ''
            this.showType = ''
          }
        }
      })
    },
    _onAddDialog() {
      this.dialogVisible = true
      this.type = 'add'
      this.title = '新增字典'
      console.log(this.nodeData)
      this.ruleForm.plabel = this.nodeData.data.slabel
      this.ruleForm.pcode = this.nodeData.data.id
      this.ruleForm.slabel = ''
      this.ruleForm.svalue = ''
      this.ruleForm.layer = 0
      this.ruleForm.notes = ''
    },
    _onEditDialog(row, index) {
      this.dialogVisible = true
      this.type = 'update'
      this.title = '编辑字典'
      console.log(row)
      this.ruleForm.id = row.id
      this.ruleForm.pcode = row.pcode
      this.ruleForm.slabel = row.slabel
      this.ruleForm.svalue = row.svalue
      this.ruleForm.layer = row.layer
      this.ruleForm.notes = row.notes
      // this.ruleForm.plabel = this.nodeData.data.slabel
      // this.ruleForm.pcode = this.nodeData.data.id
      // this.ruleForm.slabel=
    },
    delNode() {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dictDetailDelete(this.nodeData.data.id, '1')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    cancle() {
      this.dialogVisible = false
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.ruleForm)
          if (this.type === 'add') {
            this.dictOperation(this.ruleForm)
            this.dialogVisible = false
          } else {
            this.dictDetailModify(this.ruleForm)
            this.dialogVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dict {
  display: flex;
  height: 100%;

  .content {
    padding: 0 20px;
    flex: 1;
    overflow: auto;
  }
}
</style>
