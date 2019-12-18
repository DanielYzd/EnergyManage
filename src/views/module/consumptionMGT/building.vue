<template>
  <div class="building">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card>
          <TREE
            :treeData="treeData"
            :showTreeSearch="true"
            :showCollapseExpand="false"
            ref="parentTree"
            highlight-current
            :defaultProps="defaultProps"
            :defaultExpand="false"
            :expandOnClickNode="true"
            :loading="loading"
            node-key="nodeId"
            :defaultExpandedKeys="defaultExpandedKeys"
            :treeDraggable="treeDraggable"
            :allow-drop="allowDrop"
            :allow-drag="allowDarg"
            @nodeCollapse="nodeCollapse"
            @nodeExpand="nodeExpand"
            @node-click="_handleNodeClick"
          ></TREE>
        </el-card>
      </el-col>
      <el-col :span="19"></el-col>
    </el-row>
  </div>
</template>

<script>
import TREE from '@/components/Tree'
export default {
  components: {
    TREE
  },
  data() {
    return {
      treeData: [
        {
          label: 'XXX有限公司',
          children: [
            {
              label: '二期一号楼'
            },
            {
              label: '二期2号楼'
            },
            {
              label: '二期3号楼'
            },
            {
              label: '二期4号楼'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>
.building {
  height: 100%;
  padding: 0 10px;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}
</style>
