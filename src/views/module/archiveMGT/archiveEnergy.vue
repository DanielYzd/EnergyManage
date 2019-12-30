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
            <energy-item v-if="activeName === 'first'"></energy-item>
          </el-tab-pane>
          <el-tab-pane label="能源分项" name="second" :lazy="true">
            <energy-type v-if="activeName === 'second'"></energy-type>
          </el-tab-pane>
        </el-tabs>
      </div>
      <empty v-else></empty>
    </div>
  </div>
</template>

<script>
import Tree from '@/views/common/tree'
import EnergyAddorUpdate from './components/energy-add-update'
import empty from '@/views/common/Empty'
import EnergyItem from './components/energy-item'
import EnergyType from './components/energy-type'
export default {
  components: {
    Tree,
    EnergyAddorUpdate,
    EnergyItem,
    EnergyType,
    empty
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
      queryoneLoading: false
    }
  },
  created() {
    this.queryallbuilding()
  },
  methods: {
    _handleNodeClick(data, node) {
      console.log(data)
      if (data.archivetype === '2') {
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
    add() {
      //type=add 表示新增

      this.type = ''
      this.$nextTick(() => {
        this.type = 'add'
        this.parentData = {}
      })
    },
    cancle() {
      this.type = ''
    },
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
    confirm(value) {
      console.log(value)
      if (this.type === 'add') {
        this.$api.building.addbuilding(value).then(res => {
          console.log(res)

          if (res.code === 0) {
            this.id = res.id
            this.queryallbuilding()
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

    queryallbuilding() {
      this.loading = true
      this.defaultExpandedKeys = []
      this.defaultExpandedKeys.push(this.id)
      console.log(this.defaultExpandedKeys)
      this.$api.building.queryallbuilding().then(res => {
        console.log(res)
        this.loop(res.data, [], '0')
        this.loading = false
        if (this.id) {
          this.$refs.parentTree.setCurrentKey(this.id)
        }
      })
    },
    loop(list, data, pcode) {
      list.forEach(item => {
        if (item.parentid === pcode) {
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
}
</style>
