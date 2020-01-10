<template>
  <Tree
    :showCollapseExpand="false"
    :defaultProps="defaultProps"
    :treeData="treeData"
    :isaccordion="true"
    :loading="loading"
    :defaultExpandAll="true"
    ref="RegionTree"
    @node-click="_handleNodeClick"
    :defaultExpandedKeys="defaultExpandedKeys"
    nodeKey="id"
  ></Tree>
</template>

<script>
import Tree from '@/views/common/tree'
export default {
  components: {
    Tree
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      loading: false,
      defaultExpandedKeys: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDataList()
    })
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$api.building.queryallbuilding().then(res => {
        this.loop(res.data, [], 0)
        this.$cookie.get('regionid')
          ? this.$refs.RegionTree.setCurrentKey(this.$cookie.get('regionid'))
          : ''
      })
    },
    loop(list, data, parentid) {
      list.forEach(item => {
        if (item.parentid.toString() === parentid.toString()) {
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
    _handleNodeClick(data, node) {
      //   console.log(data)
      this.$emit('nodeClick', data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
