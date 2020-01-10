<template>
  <el-form-item :label="label" :prop="prop">
    <el-popover ref="regionIdsPopover" placement="bottom-start" trigger="click">
      <el-tree
        :data="regionList"
        :props="regionListTreeProps"
        node-key="id"
        ref="regionListTree"
        style="width:230px;max-height:500px;overflow-y:scroll;"
        @current-change="regionTreeCurrentChangeHandle"
        :default-expand-all="false"
        :default-expanded-keys="[0, 9]"
        :highlight-current="true"
        :expand-on-click-node="false"
      >
      </el-tree>
    </el-popover>
    <el-input
      v-bind:value="value"
      class="formItem"
      clearable
      :size="size"
      v-popover:regionIdsPopover
      :readonly="true"
      placeholder="点击选择所属区域"
      @change="changeHandler"
    ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'region-select',
  props: ['label', 'value', 'prop', 'size'],
  data() {
    return {
      regionList: [],
      regionListTreeProps: {
        id: 'id',
        label: 'label',
        children: 'children'
      }
    }
  },
  activated() {
    // this.getDataList()
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$api.building.queryallbuilding().then(res => {
        console.log(res)
        this.loop(res.data, [], 0)
      })
      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('/pob/region/list'),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({ data }) => {
      //   console.log(data)
      //   let result = []
      //   this.getTree(data.data, result, true)
      //   this.regionList = result
      //   console.log(this.regionList)
      //   this.dataListLoading = false
      //   if (callback) {
      //     callback()
      //   }
      // })
    },
    loop(list, data, parentid) {
      list.forEach(item => {
        if (item.parentid.toString() === parentid.toString()) {
          // console.log(item)
          let child = {
            // layer: item.layer,
            // id: item.regionId,
            // label: item.regionName,
            // children: []
            label: item.buildingname,
            children: [],
            id: item.id,
            archivetype: item.archivetype,
            parentid: item.parentid,
            regionid: item.regionid
          }
          this.loop(list, child.children, item.id)
          data.push(child)
          this.regionList = data
          // console.log(this.regionList)
        }
      })
    },
    getTree(data, result, rootFlag) {
      // if (rootFlag) {
      //   for (var i = 0; i < data.length; i++) {
      //     let accountRegionId = this.$cookie.get('accountRegionId') || 0
      //     console.log(accountRegionId)
      //     accountRegionId = parseInt(accountRegionId)
      //     for (let i = 0; i < data.length; i++) {
      //       if (
      //         data[i].parentid === 0 ||
      //         data[i].regionId === accountRegionId
      //       ) {
      //         result.push({
      //           id: data[i].regionId,
      //           label: data[i].regionName,
      //           layer: data[i].layer
      //         })
      //       }
      //     }
      //   }
      // }
      // console.log(result)
      // var tmp = data
      // for (var m = 0; m < result.length; m++) {
      //   var node = result[m]
      //   for (var j = 0; j < tmp.length; j++) {
      //     if (node.children === undefined) {
      //       node.children = []
      //     }
      //     if (tmp[j].parentid === node.id) {
      //       var childNode = {
      //         id: tmp[j].regionId,
      //         label: tmp[j].regionName,
      //         layer: tmp[j].layer
      //       }
      //       node.children.push(childNode)
      //     }
      //   }
      //   if (node.children.length > 0) {
      //     this.getTree(data, node.children, false)
      //   }
      // }
    },
    // 区域树选中
    regionTreeCurrentChangeHandle(data, node) {
      // console.log(data)
      // this.value = data.
      this.$refs.regionIdsPopover.doClose()
      this.$cookie.set('regionid', data.id)
      this.$cookie.set('regionName', data.label)
      this.$emit('getRegion', data)
    },
    changeHandler(value) {
      if (!value) {
        this.$cookie.set('regionid', '')
        this.$cookie.set('regionName', '')
        this.$emit('getRegion', { id: 0, label: '' })
      }
    }
  }
}
</script>

<style></style>
