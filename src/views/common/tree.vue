<template>
  <div class="tree">
    <div class="tree-top-search" v-if="showTreeSearch">
      <div>
        <el-input
          placeholder="请输入关键字进行过滤"
          v-model="filterText"
          size="small"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div ref="treeButton">
      <div>
        <slot name="tree-button"></slot>
      </div>
      <div v-if="showCollapseExpand">
        <el-button type="text" icon="el-icon-arrow-up" @click="handleCollapse"
          >收缩</el-button
        >
        <el-button type="text" icon="el-icon-arrow-down" @click="handleExpand"
          >展开</el-button
        >
      </div>
    </div>
    <div class="tree-main" ref="treeMain">
      <el-tree
        v-loading="loading"
        v-if="treeMainRefresh"
        ref="tree"
        :accordion="isaccordion"
        :highlight-current="true"
        :props="defaultProps"
        :data="treeData"
        :node-key="nodeKey"
        :default-expand-all="defaultExpand"
        :show-checkbox="showCheckbox"
        :filter-node-method="filterNode"
        :expand-on-click-node="expandOnClickNode"
        @node-click="_handleNodeClick"
        @check="check"
        @check-change="handleCheckChange"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
        :default-expanded-keys="defaultExpandedKeys"
      >
        <!-- <span
          class="custom-tree-node"
          slot-scope="{ node }"
          :class="{ crossMove: treeDraggable }"
        > -->
        <!-- {{node.data}} -->
        <!-- <icon-svg
            name="menu"
            v-if="node.isLeaf && node.level !== 1"
          ></icon-svg> -->
        <!-- <i class="el-icon-s-home" v-if="node.data.type === 'base'"></i>
          <i class="el-icon-s-flag" v-if="node.data.type === 'factory'"></i>
          <i class="el-icon-s-claim" v-if="node.data.type === 'scheme'"></i>
          <i
            class="el-icon-s-unfold"
            v-if="node.data.type === 'productionLine'"
          ></i>
          <i
            class="el-icon-s-promotion"
            v-if="node.data.type === 'station'"
          ></i>
          <i
            class="el-icon-s-custom"
            v-if="node.data.type === 'costCenter'"
          ></i>
          <i class="el-icon-s-tools" v-if="node.data.type === 'operation'"></i> -->
        <!-- <icon class="icon"
                name="folder"
                v-else></icon> -->
        <!-- <span :class="node.data.needUpdate === 1 ? 'red' : 'black'">{{
            node.label
          }}</span> -->
        <!-- </span> -->
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 搜索内容
      filterText: '',
      // 树主体
      treeMainRefresh: true,
      // 是否展开
      defaultExpand: false,
      // 默认展开项
      // defaultExpandedKeys: [],
      noDefaultExpandedKeys: [],
      productionCode: '',
      schemeId: ''
    }
  },
  watch: {
    // 树节点过滤
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.defaultExpand = this.defaultExpandAll
  },
  mounted() {},
  props: {
    // 树加载loading
    loading: {
      type: Boolean,
      default: false
    },
    isaccordion: {
      type: Boolean,
      default: false
    },
    // 搜索区域
    showTreeSearch: {
      type: Boolean,
      default: true
    },
    // 展开收缩区域
    showCollapseExpand: {
      type: Boolean,
      default: true
    },
    // 树内容 展示数据
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 默认节点信息
    defaultProps: {
      type: Object,
      default: function() {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    // 是否在点击节点的时候展开或者收缩节点
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    // 是否可拖拽
    treeDraggable: {
      type: Boolean,
      default: false
    },
    // 是否全部展开
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    // 是否可选择
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 每个树节点用来作为唯一标识的属性
    nodeKey: {
      type: String,
      default: 'id'
    },
    defaultExpandedKeys: {
      type: Array
    }
  },
  methods: {
    // 收起
    handleCollapse() {
      this.defaultExpandedKeys = []
      this.defaultExpand = false
      this.treeMainRefresh = false
      this.$nextTick(function() {
        this.treeMainRefresh = true
      })
    },
    // 展开
    handleExpand() {
      this.defaultExpand = true
      this.treeMainRefresh = false
      this.$nextTick(function() {
        this.treeMainRefresh = true
      })
    },
    // 菜单过滤
    filterNode(value, data) {
      if (!value) return true
      return (
        data[this.defaultProps.label]
          .toUpperCase()
          .indexOf(value.toUpperCase()) !== -1
      )
    },
    // 节点被点击时的回调
    _handleNodeClick(data, draggingNode) {
      this.$emit('node-click', data, draggingNode)
    },
    // 当复选框被点击的时候触发
    check(data) {
      this.$emit('check', data)
    },
    // 节点选中状态发生变化时的回调
    handleCheckChange(data, checked, indeterminate) {
      this.$emit('check-change', data, checked, indeterminate)
    },
    // 节点新增编辑高亮
    setCurrentKey(nodeKey) {
      this.$nextTick(() => {
        // 选中节点
        this.$refs.tree.setCurrentKey(nodeKey)
        this.$refs.tree.setCurrentNode(this.$refs.tree.getCurrentNode())
        // 模拟点击该节点
        this.$emit(
          'node-click',
          this.$refs.tree.getCurrentNode(),
          this.$refs.tree.getNode(this.$refs.tree.getCurrentNode())
        )
      })
    },
    getCurrentKey() {
      console.log(this.$refs.tree.getCurrentKey())
    },
    // 保存默认展开项目-展开
    nodeExpand(data, node, obj) {
      this.$emit('nodeExpand', data, node, obj)
      // this.defaultExpandedKeys.push(node.key)
    },
    // 删除默认展开项目-收起
    nodeCollapse(data, node, obj) {
      this.$emit('nodeCollapse', data, node, obj)
      // console.log(node)
      // if (this.defaultExpandedKeys.indexOf(node.key) > -1) {
      //     for (let i = 0, len = this.defaultExpandedKeys.length; i < len; i++) {
      //         if (this.defaultExpandedKeys[i] === node.key) {
      //             this.defaultExpandedKeys.splice(i, 1)
      //             return
      //         }
      //     }
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
$borderColor: #dddddd;
.tree {
  height: 100%;
  width: 320px;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  .tree-main {
    flex: 1;
    overflow: auto;
  }
}
// .ime-tree {
//   //   width: 400px;
//   width: 100%;
//   overflow: auto;
//   height: 100%;
//   position: relative;
//   .tree-top-search {
//     position: relative;
//     height: 50px; // line-height: 50px;
//     box-sizing: border-box; // padding: 0 10px;
//     border-bottom: 1px solid $borderColor;
//     .search-wrap {
//       height: 26px;
//       margin: auto;
//       position: absolute;
//       top: 0;
//       left: 10px;
//       bottom: 0;
//       right: 10px;
//     }
//   }
//   .tree-button {
//     .el-dropdown {
//       &:hover {
//         color: var(--theme-color);
//       }
//       padding-left: 5px;
//       padding-right: 5px;
//       font-size: 12px;
//       cursor: pointer;
//     }
//     .el-button {
//       &:hover {
//         color: var(--theme-color);
//       }
//       padding: 0 0 0 5px;
//       font-size: 12px;
//       border-radius: 3px;
//       color: #515152;
//       border-width: 0;
//     }
//     .is-disabled {
//       &:hover {
//         color: #cbcbcb;
//       }
//       color: #cbcbcb;
//     }
//     .el-icon-plus {
//       padding-right: 3px;
//     }
//     .tree-button-sub,
//     .tree-button-slot > div {
//       padding: 0 10px;
//       height: 40px;
//       line-height: 40px;
//       box-sizing: border-box;
//       border-bottom: 1px solid $borderColor;
//     }
//   }
//   .tree-main {
//     position: absolute;
//     width: 100%;
//     bottom: 0px;
//     left: 0px;
//     overflow: auto;
//     .crossMove {
//       &:hover {
//         cursor: move;
//       }
//     }
//     .green {
//       color: green !important;
//     }
//     .red {
//       color: red !important;
//     }
//   }
// }
</style>
