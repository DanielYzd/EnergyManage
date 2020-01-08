<template>
  <el-card>
    <div slot="header">
      <span>分级能耗占比</span>
      <span style="font-size:12px;color:#999">(单位：{{ unit }})</span>
      <!-- <div style="height:600px">11111111</div> -->
    </div>
    <common-table
      style="margin-top:-20px;"
      :options="options"
      :dataSource="tabledata"
      :columns="columns"
    ></common-table>
  </el-card>
</template>

<script>
import CommonTable from '@/views/common/Table'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      unit: '',
      tabledata: [],
      options: {
        loading: false,
        maxHeight: 500,
        index: true
      },
      columns: [
        // { prop: '', label: '排名', fixed: true },
        { prop: 'name', label: '次级单位' },
        { prop: 'consumption', label: '能耗' },
        { prop: 'proportion', label: '占比' }
      ]
    }
  },
  created() {},
  methods: {
    proportion(body) {
      console.log(body)
      switch (body.type) {
        case '0':
          this.unit = '千克标准煤'
          break
        case '88':
          this.unit = '千瓦时'
          break
        case '89':
          this.unit = '立方米'
          break
      }
      this.$api.classificationenergy.proportion(body).then(res => {
        console.log(res)
        this.tabledata = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  height: 100%;
  /deep/.el-card__header {
    padding: 12.5px;
  }
  /deep/.el-card__body {
    padding: 0;
    height: calc(100% - 43px);
    overflow: auto;
  }
}
</style>
