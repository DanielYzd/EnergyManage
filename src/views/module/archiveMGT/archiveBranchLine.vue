<template>
  <div class="branchline">
    <Tree
      :defaultProps="defaultProps"
      :treeData="treeData"
      :isaccordion="true"
      :loading="loading"
      :defaultExpandAll="false"
      ref="parentTree"
      @node-click="_handleNodeClick"
      :showCollapseExpand="false"
      :defaultExpandedKeys="defaultExpandedKeys"
      nodeKey="id"
    >
      <template slot="tree-button">
        <!-- 1代表进项 4代表变压器 10代表支路 -->
        <el-button type="text" @click="queryallregionline()">刷新</el-button>
        <el-button type="text" @click="add(1)">新增进线</el-button>
        <el-button type="text" @click="add(10)">新增支路</el-button>
        <el-button type="text" @click="add(4)">新增变压器</el-button>
      </template>
    </Tree>
    <section class="content">
      <add-line
        v-if="type === 1 || type === 10"
        :node="node"
        @refresh="refresh"
        @empty="empty"
      ></add-line>
      <add-transform
        :node="node"
        @refresh="refresh"
        @empty="empty"
        v-else-if="type === 4"
      ></add-transform>
      <empty v-else></empty>
    </section>
  </div>
</template>

<script>
import Tree from '@/views/common/tree.vue'
// import UpdateLine from './components/branchline/updateline'
import AddLine from './components/branchline/addline'
import AddTransform from './components/branchline/addtransform'
import empty from '@/views/common/Empty.vue'
export default {
  components: {
    Tree,
    AddLine,
    empty,
    AddTransform
  },
  data() {
    return {
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      defaultExpandedKeys: [],
      id: '',
      type: 0,
      node: {}
    }
  },
  created() {
    this.queryallregionline()
  },
  methods: {
    queryallregionline() {
      this.loading = true
      this.defaultExpandedKeys = []
      this.defaultExpandedKeys.push(this.id)
      this.$api.newbranchline.queryallregionline().then(res => {
        console.log(res)
        this.loop(res.data, [], '0')
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
            regionid: item.regionid,
            parentid: item.parentid
          }
          this.loop(list, child.children, item.id)
          data.push(child)
          this.treeData = data
          this.loading = false
        }
      })
    },
    _handleNodeClick(node, nodeEvent) {
      this.id = node.id
      this.type = node.archivetype
      this.node = node
    },
    add(type) {
      console.log(type)
      this.node = {
        archivetype: type
      }
      this.type = type
    },
    refresh(val) {
      console.log(val)
      if (val) {
        this.id = val
      }
      this.queryallregionline()
    },
    empty() {
      this.type = 0
      this.id = ''
      this.queryallregionline()
    }
  }
}
</script>

<style lang="scss" scoped>
.branchline {
  display: flex;
  height: 100%;
  .content {
    padding: 0 20px;
    flex: 1;
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
