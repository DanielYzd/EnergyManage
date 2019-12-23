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
          @selection-change="handleSelectionChange1"
        >
          <template slot="toolbar">
            <div style="line-height:30px;margin-right:30px;">已挂载子集</div>
            <el-button
              size="mini"
              type="primary"
              :disabled="this.selectionValue1.length === 0"
              @click="dismountchild"
              >批量卸载</el-button
            >
          </template>
        </common-table>
        <common-table
          v-else
          :dataSource="data3"
          :options="options3"
          :columns="columns3"
          :pagination="pagination3"
          @handleSizeChange="handleSizeChange3"
          @handleIndexChange="handleIndexChange3"
          @selection-change="handleSelectionChange3"
        >
          <template slot="toolbar">
            <div style="line-height:30px;margin-right:30px;">已挂载表计</div>
            <el-button
              size="mini"
              type="primary"
              :disabled="this.selectionValue3.length === 0"
              @click="dismountmeter"
              >批量卸载</el-button
            >
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
          @selection-change="handleSelectionChange2"
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
              :disabled="this.selectionValue2.length === 0"
              @click="mountchild"
              >批量挂载</el-button
            >
          </template>
        </common-table>
        <common-table
          :dataSource="data4"
          v-else
          :options="options4"
          :columns="columns4"
          :pagination="pagination4"
          @handleSizeChange="handleSizeChange4"
          @handleIndexChange="handleIndexChange4"
          @selection-change="handleSelectionChange4"
        >
          <template slot="toolbar">
            <div style="line-height:30px;margin-right:30px;">待挂载表计</div>
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
              :disabled="this.selectionValue4.length === 0"
              @click="mountmeter"
              >批量挂载</el-button
            >
          </template>
        </common-table>
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
      data1: [], //已挂载子级列表
      data2: [], //待挂载子集列表
      data3: [], //已挂载表计列表
      data4: [], //待挂载表计列表
      options1: {
        loading: false,
        index: false,
        maxHeight: 560,
        mutiSelect: true
      },
      options2: {
        loading: false,
        index: false,
        maxHeight: 560,
        mutiSelect: true
      },
      options3: {
        loading: false,
        index: false,
        maxHeight: 560,
        mutiSelect: true
      },
      options4: {
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
      columns3: [
        {
          prop: 'pointid',
          label: 'ID'
        },
        {
          prop: 'disc',
          label: '表计名称'
        },
        {
          prop: 'typeName',
          label: '子级类别'
        }
      ],
      columns4: [
        {
          prop: 'pointid',
          label: 'ID'
        },
        {
          prop: 'disc',
          label: '表计名称'
        },
        {
          prop: 'typeName',
          label: '子级类别'
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
      pagination3: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      pagination4: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      selectionValue2: [],
      selectionValue3: [],
      selectionValue1: [],
      selectionValue4: []
    }
  },
  watch: {
    radio(newValue, oldValue) {
      console.log(newValue)
      if (newValue === 1) {
        (this.pagination1 = {
          total: 0,
          pageNum: 1,
          numPerPage: 10
        }),
          (this.pagination2 = {
            total: 0,
            pageNum: 1,
            numPerPage: 10
          }),
          this.queryparentchildnode()
        this.afterresultquery()
      } else {
        this.afterresultmeter()
        this.querymeterchildnode()
      }
    }
  },
  created() {
    this.queryparentchildnode()
    this.afterresultquery()
  },
  methods: {
    //查询待挂载子集
    queryparentchildnode() {
      this.options2.loading = true
      let body = {
        page: this.pagination2.pageNum,
        limit: this.pagination2.numPerPage,
        notype: 2
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
    //查询待挂载子集
    querymeterchildnode() {
      this.options4.loading = true
      let body = {
        page: this.pagination4.pageNum,
        limit: this.pagination4.numPerPage,
        notype: 1
      }
      this.$api.transformer.querymeterchildnode(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options4.loading = false
          this.data4 = res.page.list
          this.pagination4.total = res.page.totalCount
        }
      })
    },
    //查询已挂载子集
    afterresultquery() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        serachkind: 2, //serachkind查询类型4变压器,1电表，2子集,3终端
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
    //查询已挂载表计
    afterresultmeter() {
      this.options3.loading = true
      let body = {
        page: this.pagination3.pageNum,
        limit: this.pagination3.numPerPage,
        serachkind: 1, //serachkind查询类型4变压器,1电表，2子集,3终端
        archivetype: this.row.archivetype,
        id: this.row.id
      }
      this.$api.transformer.afterresultmeter(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options3.loading = false
          this.data3 = res.page.list
          this.pagination3.total = res.page.totalCount
        }
      })
    },
    //已挂载子集每页显示数量
    handleSizeChange1(numPerPage) {
      this.pagination1.numPerPage = numPerPage
      // this.queryparentchildnode()
      this.afterresultquery()
    },
    // 已挂载跳转下一页或指定页
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      // this.queryparentchildnode()
      this.afterresultquery()
    },
    //待挂载每页显示数
    handleSizeChange2(numPerPage) {
      this.pagination2.numPerPage = numPerPage
      this.queryparentchildnode()
      // this.afterresultquery()
    },
    // 待挂载跳转下一页或指定页
    handleIndexChange2(pageNum) {
      this.pagination2.pageNum = pageNum
      this.queryparentchildnode()
      // this.afterresultquery()
    },
    // 挂载子集多选
    handleSelectionChange2(value) {
      console.log(value)
      this.selectionValue2 = value
    },
    //卸载子集多选
    handleSelectionChange1(value) {
      console.log(value)
      this.selectionValue1 = value
    },
    //卸载表计多选
    handleSelectionChange3(value) {
      console.log(value)
      this.selectionValue3 = value
    },
    //已挂载表计每页显示数量
    handleSizeChange3(numPerPage) {
      this.pagination3.numPerPage = numPerPage
      this.afterresultmeter()
    },
    // 已挂载跳转下一页或指定页
    handleIndexChange3(pageNum) {
      this.pagination3.pageNum = pageNum
      this.afterresultmeter()
    },
    //待挂载每页显示数
    handleSizeChange4(numPerPage) {
      this.pagination4.numPerPage = numPerPage
      this.querymeterchildnode()
      // this.afterresultquery()
    },
    // 待挂载跳转下一页或指定页
    handleIndexChange4(pageNum) {
      this.pagination4.pageNum = pageNum
      this.querymeterchildnode()
      // this.afterresultquery()
    },
    // 挂载子集多选
    handleSelectionChange4(value) {
      console.log(value)
      this.selectionValue4 = value
    },
    //挂载子集
    mountchild() {
      let body = {
        transformer: this.row,
        barchline: this.selectionValue2
      }
      this.$api.transformer.mountchild(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.queryparentchildnode()
          this.afterresultquery()
        }
      })
    },
    //挂载表计
    mountmeter() {
      let body = {
        transformer: this.row,
        PobMeters: this.selectionValue4
      }
      this.$api.transformer.mountmeter(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.afterresultmeter()
          this.querymeterchildnode()
        }
      })
    },

    //卸载子集
    dismountchild() {
      let body = {
        transformer: this.row,
        barchline: this.selectionValue1
      }
      this.$api.transformer.dismountchild(body).then(res => {
        if (res.code === 0) {
          this.queryparentchildnode()
          this.afterresultquery()
        }
      })
    },
    //卸载电表
    dismountmeter() {
      let body = {
        transformer: this.row,
        PobMeters: this.selectionValue1
      }
      this.$api.transformer.dismountmeter(body).then(res => {
        if (res.code === 0) {
          this.afterresultmeter()
          this.querymeterchildnode()
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
