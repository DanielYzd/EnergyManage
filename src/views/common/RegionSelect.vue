<template>
  <div>
    <el-cascader
      :options="regionList"
      :show-all-levels="false"
      v-model="regionid"
      size="mini"
      placeholder="请选择所属区域"
      :props="{ checkStrictly: true }"
      @change="handlechange"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regionList: [],
      regionid: this.$cookie.get('regionid')
    }
  },
  mounted() {
    console.log(this.$cookie.get('regionid'))
    this.getDataList()
  },
  methods: {
    handlechange() {
      console.log(this.regionid)
    },
    getDataList(callback) {
      this.$api.region.getDataList().then(res => {
        console.log(res)
        // this.loop(res.data, [], 0)
        console.log(this.toTreeData(res.data, 0))
        this.regionList = this.toTreeData(res.data, 0)
      })
    },
    loop(list, data, parentid) {
      list.forEach(item => {
        if (item.parentid === parentid) {
          // console.log(item)
          let child = {
            layer: item.layer,
            value: item.regionId,
            label: item.regionName,
            children: []
          }
          this.loop(list, child.children, item.regionId)
          data.push(child)
          this.regionList = data
          // console.log(this.regionList)
        }
      })
      console.log(this.regionList)
    },
    toTreeData(data, pid) {
      console.log(data, pid)
      function tree(id) {
        let arr = []
        data
          .filter(item => {
            return item.parentid === id
          })
          .forEach(item => {
            console.log(item)
            arr.push({
              value: item.regionId,
              label: item.regionName,
              children:
                tree(item.regionId).length > 0 ? tree(item.regionId) : ''
            })
          })
        console.log(arr)
        return arr
      }
      return tree(pid) // 第一级节点的父id，是null或者0，视情况传入
    }
  }
}
</script>

<style lang="scss" scoped></style>
