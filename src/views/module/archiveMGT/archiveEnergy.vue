<template>
  <div class="energy">
    <Tree
      :showCollapseExpand="false"
      :defaultProps="defaultProps"
      :treeData="treeData"
      :isaccordion="true"
      :loading="loading"
      :defaultExpandAll="false"
      ref="parentTree"
      @node-click="_handleNodeClick"
      :defaultExpandedKeys="defaultExpandedKeys"
      nodeKey="id"
    >
      <template slot="tree-button">
        <el-button type="text" icon="el-icon-plus" @click="add()">
          新增建筑
        </el-button>
      </template></Tree
    >
    <div class="content">
      <div v-if="type !== ''">
        <EnergyAddorUpdate
          @cancle="cancle"
          :type="type"
          @confirm="confirm"
          @deletebuilding="deletebuilding"
          :parentData="parentData"
          v-loading="queryoneLoading"
        ></EnergyAddorUpdate>
      </div>
      <div v-if="type === 'edit'">
        <!-- <EnergyAddorUpdate @cancle="cancle" :type="type"></EnergyAddorUpdate> -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="电能分项" name="first" :lazy="true">
            <!-- v-if 每次切换标签会重新加载组件 -->
            <energy-item
              v-if="activeName === 'first'"
              @itemedit="item_edit"
              ref="tableItem"
            ></energy-item>
          </el-tab-pane>
          <el-tab-pane label="能源分类" name="second" :lazy="true">
            <energy-type
              v-if="activeName === 'second'"
              ref="tableType"
              @editType="type_edit"
            ></energy-type>
          </el-tab-pane>
        </el-tabs>
      </div>
      <empty v-else></empty>
    </div>
    <!-- 电能分项编辑弹框 -->
    <Dialog
      :title="'电能分项设置'"
      :dialogVisible="itemDialogVisible"
      :showClose="false"
      :showFoot="false"
      :width="'60%'"
      :top="'15vh'"
      :center="false"
    >
      <dialog-content-item
        v-if="itemtype === 'content'"
        :itemrow="itemrow"
        @contentCancle="contentCancle"
        @contentConfirm="contentConfirm"
      ></dialog-content-item>
      <dialog-table-item
        :itemrow="itemrow"
        v-if="itemtype === 'table'"
        @closeItemTable="closeItemTable"
      >
      </dialog-table-item>
    </Dialog>
    <Dialog
      :title="'能源分类设置'"
      :dialogVisible="typeDialogVisible"
      :showClose="false"
      :showFoot="false"
      :width="'60%'"
      :top="'15vh'"
      :center="false"
    >
      <DialogContentType
        :typerow="typerow"
        @typecontentClose="typecontentClose"
        v-if="typetype === 'content'"
      ></DialogContentType>
      <DialogTableType
        :typerow="typerow"
        v-if="typetype === 'table'"
        @closeTypeTable="closeTypeTable"
      >
      </DialogTableType>
    </Dialog>
  </div>
</template>

<script>
import Tree from '@/views/common/tree'
import EnergyAddorUpdate from './components/energy-add-update'
import empty from '@/views/common/Empty'
import EnergyItem from './components/energy-item'
import EnergyType from './components/energy-type'
import Dialog from '@/views/common/dialog'
import DialogContentItem from './components/DialogContentItem'
import DialogTableItem from './components/DialogTableItem'
import DialogContentType from './components/DialogContentType'
import DialogTableType from './components/DialogTableType'
export default {
  components: {
    Tree,
    EnergyAddorUpdate,
    EnergyItem,
    EnergyType,
    empty,
    Dialog,
    DialogContentItem,
    DialogTableItem,
    DialogContentType,
    DialogTableType
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      loading: false,
      id: '',
      defaultExpandedKeys: [],
      activeName: 'first',
      type: '',
      parentData: {},
      queryoneLoading: false,
      itemDialogVisible: false,
      itemrow: '',
      itemtype: '',
      typerow: '',
      typetype: '',
      typeDialogVisible: false //分类的弹框
    }
  },
  created() {
    this.queryallbuilding()
  },
  methods: {
    _handleNodeClick(data, node) {
      console.log(data)
      if (data.archivetype === 2) {
        this.id = data.id
        this.type = 'edit'

        let body = {
          id: data.id
        }
        this.queryoneLoading = true
        this.$api.building.queryonebuilding(body).then(res => {
          console.log(res)
          this.queryoneLoading = false
          this.parentData = res.data
        })
      } else {
        this.type = ''
        this.$message({
          type: 'warning',
          message: '请选中建筑进行操作！'
        })
      }
    },
    //新增建筑档案按钮
    add() {
      //type=add 表示新增

      this.type = ''
      this.$nextTick(() => {
        this.type = 'add'
        this.parentData = {}
      })
    },
    //建筑档案表单取消按钮
    cancle() {
      this.$nextTick(() => {
        this.type = ''
      })
    },
    //建筑档案表单删除按钮
    deletebuilding() {
      this.$confirm('此操作将永久删除该建筑档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.building.deletebuilding(this.id).then(res => {
            console.log(res)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //建筑档案新增编辑确定按钮
    confirm(value) {
      console.log(value)
      if (this.type === 'add') {
        this.$api.building.addbuilding(value).then(res => {
          console.log(res)

          if (res.code === 0) {
            this.$nextTick(() => {
              this.type = ''
              this.id = res.id
              this.queryallbuilding()
            })
          }
        })
      } else if (this.type === 'edit') {
        console.log(value)
        this.$api.building.modifybuilding(value).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$nextTick(() => {
              this.type = ''
              // this.id = ''
              this.queryallbuilding()
            })
          }
        })
      }
    },
    handleClick() {},
    //查询建筑档案树
    queryallbuilding() {
      this.loading = true
      this.defaultExpandedKeys = []
      this.defaultExpandedKeys.push(this.id)
      this.$api.building.queryallbuilding().then(res => {
        this.loop(res.data, [], 0)
        this.loading = false
        if (this.id) {
          this.$refs.parentTree.setCurrentKey(this.id)
        }
      })
    },
    loop(list, data, pcode) {
      list.forEach(item => {
        if (item.parentid.toString() === pcode.toString()) {
          let child = {
            label: item.buildingname,
            children: [],
            id: item.id,
            archivetype: item.archivetype,
            parentid: item.parentid,
            regionid: item.regionid
          }
          this.loop(list, child.children, item.id)
          data.push(child)
          this.treeData = data
        }
      })
    },
    //电能分项列表编辑按钮
    item_edit(type, row, index) {
      console.log(row)
      console.log(index)
      this.itemrow = row
      this.itemtype = type
      this.itemDialogVisible = true
    },
    type_edit(row, index, type) {
      this.typerow = row
      this.typetype = type
      this.typeDialogVisible = true
    },
    contentCancle() {
      this.itemDialogVisible = false
    },
    closeItemTable() {
      this.itemDialogVisible = false
      console.log(this.$refs.tableItem.queryallenergyitem(this.id))
    },
    closeTypeTable() {
      this.typeDialogVisible = false
      console.log(this.$refs.tableType.queryallenergytype(this.id))
    },
    contentConfirm(body) {
      console.log(body)
      this.$api.building.saveitemtagert(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.itemDialogVisible = false
          // this.$message({
          //   type: 'success',
          //   message: '更新成功'
          // })
          this.$notify({
            title: '更新成功',
            type: 'success',
            offset: 50
          })
        }
      })
    },
    //分类能耗弹框关闭
    typecontentClose() {
      this.typeDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.energy {
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    padding: 0 20px;
    height: 100%;
    overflow: auto;
    .el-tabs {
      /deep/.el-tabs__content {
        overflow: visible;
      }
    }
  }
  /deep/.el-dialog {
    .el-dialog__body {
      padding: 0 20px !important;
      .el-pagination {
        overflow: auto;
      }
    }
  }
}
</style>
