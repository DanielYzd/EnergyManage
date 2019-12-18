<template>
  <div class="ime-tree sw-flex sw-flex-column">
    <div class="tree-top-search" v-if="showTreeSearch">
      <div class="search-wrap">
        <el-input
          placeholder="请输入关键字进行过滤"
          v-model="filterText"
          size="small"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="tree-button" ref="treeButton">
      <div class="tree-button-slot">
        <slot name="tree-button"></slot>
      </div>
      <!-- <div class="tree-button-sub"
           v-if="showCollapseExpand">
        <el-button type="text"
                   icon="el-icon-arrow-up"
                   @click="handleCollapse">{{$t('collapse\.\B')}}</el-button>
        <el-button type="text"
                   icon="el-icon-arrow-down"
                   @click="handleExpand">{{$t('expand\.\B')}}</el-button>
      </div> -->
    </div>
    <div class="tree-main sw-flex-1" ref="treeMain">
      <el-tree
        v-loading="loading"
        v-if="treeMainRefresh"
        ref="tree"
        :highlight-current="true"
        :props="defaultProps"
        :data="treeData"
        :node-key="nodeKey"
        :default-expand-all="defaultExpand"
        :show-checkbox="showCheckbox"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :draggable="treeDraggable"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :filter-node-method="filterNode"
        :expand-on-click-node="expandOnClickNode"
        @node-click="_handleNodeClick"
        @check="check"
        @check-change="handleCheckChange"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
        :default-expanded-keys="defaultExpandedKeys"
      >
        <span class="custom-tree-node" :class="{ crossMove: treeDraggable }">
          <!-- {{node.data}} -->
          <!-- <icon class="icon"
                name="file"
                v-if="node.isLeaf&&node.level!==1"></icon> -->
          <i class="el-icon-s-home"></i>

          <!-- <span :class="node.data.needUpdate === 1 ? 'red' : 'black'">{{
            node.label
          }}</span> -->
        </span>
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
    // this.defaultExpand = this.defaultExpandAll
  },
  mounted() {
    // console.log(this.$refs.tree)
    // this.$refs.treeMain.style.top =
    //   this.$refs.treeButton.offsetHeight + 50 + 'px'
  },
  props: {
    // 树加载loading
    loading: {
      type: Boolean,
      default: false
    },
    // ref: {
    //     type: String,
    // },
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
    // 树内容
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
      default: false
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
    // 节点开始拖拽时触发的事件
    handleDragStart(node, ev) {
      this.$emit('node-drag-start', node, ev)
      // console.log('drag start', node);
    },
    // 拖拽进入其他节点时触发的事件
    handleDragEnter(draggingNode, dropNode, ev) {
      this.$emit('node-drag-enter', draggingNode, dropNode, ev)
    },
    // 拖拽离开某个节点时触发的事件
    handleDragLeave(draggingNode, dropNode, ev) {
      this.$emit('node-drag-leave', draggingNode, dropNode, ev)
    },
    // 在拖拽节点时触发的事件
    handleDragOver(draggingNode, dropNode, ev) {
      this.$emit('node-drag-over', draggingNode, dropNode, ev)
    },
    // 拖拽结束时（可能未成功）触发的事件
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      if (!draggingNode || !dropNode) {
        return
      }
      this.$emit('node-drag-end', draggingNode, dropNode, dropType, ev)
    },
    // 拖拽成功完成时触发的事
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.$emit('node-drop', draggingNode, dropNode, dropType, ev)
    },
    // 拖拽时判定位置能否被放置
    allowDrop(draggingNode, dropNode, type) {
      console.log(dropNode.data.type)
      console.log(type)
      console.log(
        ((type === 'inner' && dropNode.data.type === 'costCenter') ||
          (type !== 'inner' && dropNode.data.type === 'operation')) &&
          dropNode.data.schemeId === draggingNode.data.schemeId
      )
      return (
        ((type === 'inner' && dropNode.data.type === 'costCenter') ||
          (type !== 'inner' && dropNode.data.type === 'operation')) &&
        dropNode.data.schemeId === draggingNode.data.schemeId
      )
    },
    // 判断节点能否被拖拽
    allowDrag(draggingNode) {
      // 判断被拖拽的类型为OP且被拖拽OP的产线==选中的产线且被拖拽OP的方案为选中产线所在的方案
      return (
        draggingNode.data.type === 'operation' &&
        draggingNode.data.productionLineCode === this.productionCode &&
        draggingNode.data.schemeId === this.schemeId
      )
    },
    // 收起
    // handleCollapse() {
    //     this.defaultExpandedKeys = []
    //     this.defaultExpand = false
    //     this.treeMainRefresh = false
    //     this.$nextTick(function() {
    //         this.treeMainRefresh = true
    //     })
    // },
    // 展开
    // handleExpand() {
    //     this.defaultExpand = true
    //     this.treeMainRefresh = false
    //     this.$nextTick(function() {
    //         this.treeMainRefresh = true
    //     })
    // },
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
      if (data.type === 'productionLine') {
        this.productionCode = data.code
        this.schemeId = draggingNode.parent.data.id
      } else {
        this.productionCode = ''
        this.schemeId = ''
      }
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
.ime-tree {
  // //   width: 400px;
  //   width: 100%;
  overflow: auto;
  height: 100%;
  position: relative;
  .tree-top-search {
    position: relative;
    height: 50px; // line-height: 50px;
    box-sizing: border-box; // padding: 0 10px;
    border-bottom: 1px solid $borderColor;
    .search-wrap {
      height: 26px;
      margin: auto;
      position: absolute;
      top: 0;
      left: 10px;
      bottom: 0;
      right: 10px;
    }
  }
  .tree-button {
    .el-dropdown {
      &:hover {
        color: var(--theme-color);
      }
      padding-left: 5px;
      padding-right: 5px;
      font-size: 12px;
      cursor: pointer;
    }
    .el-button {
      &:hover {
        color: var(--theme-color);
      }
      padding: 0 0 0 5px;
      font-size: 12px;
      border-radius: 3px;
      color: #515152;
      border-width: 0;
    }
    .is-disabled {
      &:hover {
        color: #cbcbcb;
      }
      color: #cbcbcb;
    }
    .el-icon-plus {
      padding-right: 3px;
    }
    .tree-button-sub,
    .tree-button-slot > div {
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      border-bottom: 1px solid $borderColor;
    }
  }
  .tree-main {
    // position: absolute;
    // width:100%;
    // bottom: 0px;
    // left: 0px;
    overflow: auto;
    .crossMove {
      &:hover {
        cursor: move;
      }
    }
  }
}
</style>
