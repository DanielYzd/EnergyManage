<template>
  <div class="operate">
    <el-radio-group v-model="radio">
      <el-radio :label="1">子级信息</el-radio>
      <el-radio :label="2">表计信息</el-radio>
    </el-radio-group>
    <div class="content">
      <div class="left">
        <common-table
          v-if="radio === 1"
          :dataSource="data1"
          :options="options1"
          :columns="columns1"
          :pagination="pagination1"
          @handleSizeChange="handleSizeChange1"
          @handleIndexChange="handleIndexChange1"
        >
          <template slot="toolbar">
            <div style="line-height:30px;margin-right:30px;">已挂载子集</div>
            <!-- <el-input
              size="mini"
              clearable
              prefix-icon="el-icon-search"
              placeholder="输入名称搜索"
              style="width:150px;margin-right:10px;"
              @keyup.enter.native="queryparentchildnode"
            ></el-input> -->
          </template>
        </common-table>
      </div>
      <div class="right">
        <common-table
          :dataSource="data2"
          v-if="radio === 1"
          :options="options2"
          :columns="columns2"
          :pagination="pagination2"
          @handleSizeChange="handleSizeChange2"
          @handleIndexChange="handleIndexChange2"
          @selection-change="handleSelectionChange"
        >
          <template slot="toolbar">
            <div style="line-height:30px;margin-right:30px;">待挂载子集</div>
            <el-input
              size="mini"
              clearable
              prefix-icon="el-icon-search"
              placeholder="输入名称搜索"
              style="width:150px;margin-right:10px;"
              @keyup.enter.native="queryparentchildnode"
            ></el-input>
            <el-button
              size="mini"
              type="primary"
              :disabled="this.selectionValue.length === 0"
              @click="mountchild"
              >挂载</el-button
            >
          </template>
        </common-table>
        <div v-else>2222</div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/views/common/Table'
export default {
  components: {
    CommonTable
  },
  props: {
    row: {
      type: Object
    }
  },
  data() {
    return {
      radio: 1,
      data1: [], //待挂载子级列表
      data2: [],
      options1: {
        loading: false,
        index: false,
        maxHeight: 560,
        mutiSelect: false
      },
      options2: {
        loading: false,
        index: false,
        maxHeight: 560,
        mutiSelect: true
      },
      columns1: [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'linename',
          label: '分线名称'
        },
        {
          prop: 'archivetype',
          label: '子级类别',
          render: (h, parmas) => {
            return [
              h('span', {
                style: 'fontSize: 22px'
              }),
              h('span', '分线')
            ]
          }
        }
      ],
      columns2: [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'linename',
          label: '分线名称'
        },
        {
          prop: 'archivetype',
          label: '子级类别',
          render: (h, parmas) => {
            return [
              h('span', {
                style: 'fontSize: 22px'
              }),
              h('span', '分线')
            ]
          }
        }
      ],
      pagination1: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      pagination2: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      selectionValue: []
    }
  },
  watch: {
    radio(newValue, oldValue) {
      console.log(newValue)
      if (newValue === 1) {
        this.queryparentchildnode()
        this.afterresultquery()
      }
    }
  },
  created() {
    this.queryparentchildnode()
    this.afterresultquery()
  },
  methods: {
    queryparentchildnode() {
      this.options2.loading = true
      let body = {
        page: this.pagination2.pageNum,
        limit: this.pagination2.numPerPage,
        notype: 4
      }
      this.$api.transformer.queryparentchildnode(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options2.loading = false
          this.data2 = res.page.list
          this.pagination2.total = res.page.totalCount
        }
      })
    },
    afterresultquery() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        serachkind: 4, //serachkind查询类型4变压器,1电表，2子集,3终端
        archivetype: this.row.archivetype,
        id: this.row.id
      }
      this.$api.transformer.afterresultquery(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options1.loading = false
          this.data1 = res.page.list
          this.pagination1.total = res.page.totalCount
        }
      })
    },
    handleSizeChange1(numPerPage) {
      this.pagination1.numPerPage = numPerPage
      // this.queryparentchildnode()
      this.afterresultquery()
    },
    // 跳转下一页或指定页
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      // this.queryparentchildnode()
      this.afterresultquery()
    },
    handleSizeChange2(numPerPage) {
      this.pagination2.numPerPage = numPerPage
      this.queryparentchildnode()
      // this.afterresultquery()
    },
    // 跳转下一页或指定页
    handleIndexChange2(pageNum) {
      this.pagination2.pageNum = pageNum
      this.queryparentchildnode()
      // this.afterresultquery()
    },
    // 多选
    handleSelectionChange(value) {
      console.log(value)
      this.selectionValue = value
    },
    mountchild() {
      let body = {
        transformer: this.row,
        barchline: this.selectionValue
      }
      this.$api.transformer.mountchild(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.queryparentchildnode()
          this.afterresultquery()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  width: 100%;
  .content {
    margin-top: 5px;
    display: flex;
    width: 100%;
    // height: 550px;
    overflow: auto;
    .left {
      flex: 1;
      height: 100%;
      margin-right: 10px;
    }
    .right {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
