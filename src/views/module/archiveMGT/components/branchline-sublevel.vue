<template>
  <div class="sublevel">
    <span>类别：</span>
    <el-select
      v-model="selectValue"
      style="width:100px;margin-right:10px;"
      size="mini"
      @change="querybytype"
      placeholder="请选择"
    >
      <el-option label="分线" value="1"> </el-option>
      <el-option label="变压器" value="2"> </el-option>
    </el-select>
    <div class="content">
      <div class="left">
        <!-- 解决表格宽度自适应问题 -->
        <div style="position:absolute; width:100%;">
          <common-table
            :dataSource="tableData"
            :options="options"
            :pagination="pagination"
            :columns="columns"
            @handleSizeChange="handleSizeChange"
            @handleIndexChange="handleIndexChange"
            @selection-change="handleSelectionChange"
          >
            <template slot="toolbar">
              <div style="line-height:30px;margin-right:10px;">已挂载子级</div>
              <el-button
                size="mini"
                type="primary"
                :disabled="this.selectionValue.length === 0"
                @click="dismount"
                >批量卸载</el-button
              >
            </template>
          </common-table>
        </div>
      </div>
      <div class="right">
        <div style="position:absolute; width:100%;">
          <common-table
            :dataSource="tableData1"
            :options="options1"
            :pagination="pagination1"
            :columns="columns1"
            @handleSizeChange="handleSizeChange1"
            @handleIndexChange="handleIndexChange1"
            @selection-change="handleSelectionChange1"
          >
            <template slot="toolbar">
              <div style="line-height:30px;margin-right:10px;">待挂载子级</div>
              <!-- <el-input
              size="mini"
              clearable
              v-model="linename"
              prefix-icon="el-icon-search"
              placeholder="输入名称搜索"
              style="width:150px;margin-right:10px;"
              @keyup.enter.native="queryparentchildnode"
            ></el-input> -->
              <el-button
                size="mini"
                type="primary"
                :disabled="this.selectionValue1.length === 0"
                @click="mount"
                >批量挂载</el-button
              >
            </template>
          </common-table>
        </div>
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
  computed: {
    // id() {
    //   return this.$parent.$parent.$parent.id
    // },
    type() {
      return this.$parent.$parent.$parent.type
    },
    id: {
      get() {
        return this.$parent.$parent.$parent.id
      },
      set(val) {
        return val
      }
    }
  },
  watch: {
    id(newValue, oldValue) {
      this.querymounted()
      this.querybytype()
      // this.queryparentchildnode()
    }
  },
  data() {
    return {
      tableData: [],
      options: {
        loading: false,
        index: false,
        maxHeight: 650,
        mutiSelect: true
      },
      pagination: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
      },
      columns: [
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
      tableData1: [],
      options1: {
        loading: false,
        index: false,
        maxHeight: 650,
        mutiSelect: true
      },
      pagination1: {
        total: 0,
        pageNum: 1,
        numPerPage: 10
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
          label: '类别',
          render: (h, parmas) => {
            if (parmas.row.archivetype === 1) {
              return [
                h('span', {
                  style: 'fontSize: 22px'
                }),
                h('span', '分线')
              ]
            } else if (parmas.row.archivetype === 4) {
              return [
                h('span', {
                  style: 'fontSize: 22px'
                }),
                h('span', '变压器')
              ]
            }
          }
        }
      ],
      selectionValue: [],
      selectionValue1: [],
      linename: '',
      selectValue: '1'
    }
  },
  created() {
    // this.queryparentchildnode()
    this.querymounted() //已挂载
    this.querybytype() //待挂载
  },
  methods: {
    //根据类型查询变压器或者分析的待挂载子级
    querybytype() {
      this.querymounted()
      if (this.selectValue === '1') {
        this.columns1[1] = {
          prop: 'linename',
          label: '分线名称'
        }
        this.queryparentchildnode()
      } else {
        this.columns1[1] = {
          prop: 'transname',
          label: '变压器名称'
        }
        this.querytranformerchildnode()
      }
    },
    //查询待挂载的子级
    queryparentchildnode() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage,
        notype: 2,
        linename: this.linename ? this.linename : 'admin'
      }
      this.$api.transformer.queryparentchildnode(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options1.loading = false
          this.tableData1 = res.page.list
          this.pagination1.total = res.page.totalCount
        } else {
          return
        }
      })
    },
    //查询待挂载的变压器
    querytranformerchildnode() {
      this.options1.loading = true
      let body = {
        page: this.pagination1.pageNum,
        limit: this.pagination1.numPerPage
      }
      this.$api.branchline.querytranformerchildnode(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options1.loading = false
          this.tableData1 = res.page.list
          this.pagination1.total = res.page.totalCount
        } else {
          return
        }
      })
    },
    //根据类型查询已挂载的变压器或者分线
    querymounted() {
      if (this.selectValue === '1') {
        this.afterresultlinequery()
      } else {
        this.afterresultquery()
      }
    },
    //查询已挂载的分线
    afterresultlinequery() {
      this.options.loading = true
      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        id: this.id,
        archivetype: 1,
        serachkind: 2
      }
      this.$api.branchline.afterresultlinequery(body).then(res => {
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    //查询已挂载的变压器
    afterresultquery() {
      this.options.loading = true
      let body = {
        page: this.pagination.pageNum,
        limit: this.pagination.numPerPage,
        id: this.id,
        archivetype: 1,
        serachkind: 2
      }
      this.$api.branchline.afterresultquery(body).then(res => {
        if (res.code === 0) {
          this.options.loading = false
          this.tableData = res.page.list
          this.pagination.total = res.page.totalCount
        }
      })
    },
    handleSizeChange() {},
    handleIndexChange() {},
    handleSelectionChange() {},
    handleSizeChange1(numPerPage) {
      this.pagination1.numPerPage = numPerPage
      this.querybytype()
    },
    handleIndexChange1(pageNum) {
      this.pagination1.pageNum = pageNum
      this.querybytype()
    },
    handleSelectionChange1(value) {
      this.selectionValue1 = value
    },
    //挂载按钮事件
    mount() {
      if (this.selectValue === '1') {
        //挂载分线
        this.mountlineperline()
      } else {
        this.mountlinetrans()
      }
    },
    //挂载分线
    mountlineperline() {
      console.log(this.id)
      let body = {
        brachline: {
          archivetype: 1,
          id: this.id
        },
        lines: this.selectionValue1
      }
      this.$api.branchline.mountlineperline(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$emit('refresh')
          this.querymounted()
          this.querybytype()
        }
      })
    },
    //挂载变压器
    mountlinetrans() {
      let body = {
        brachline: {
          archivetype: 4,
          id: this.id
        },
        lines: this.selectionValue1
      }
      this.$api.branchline.mountlinetrans(body).then(res => {
        if (res.code === 0) {
          this.$emit('refresh')
          this.querymounted()
          this.querybytype()
        }
      })
    },
    //卸载按钮事件
    dismount() {
      if (this.selectValue === '1') {
        //挂载分线
        this.dismountlineperline()
      } else {
        this.dismountlinetrans()
      }
    },
    //卸载分线
    dismountlineperline() {
      let body = {
        brachline: {
          archivetype: 1,
          id: this.id
        },
        lines: this.selectionValue
      }
      this.$api.branchline.dismountlineperline(body).then(res => {
        if (res.code === 0) {
          this.$emit('refresh')
          this.querymounted()
          this.querybytype()
        }
      })
    },
    //从分线卸载变压器
    dismountlinetrans() {
      let body = {
        brachline: {
          archivetype: 4,
          id: this.id
        },
        transformers: this.selectionValue
      }
      this.$api.branchline.dismountlinetrans(body).then(res => {
        if (res.code === 0) {
          this.$emit('refresh')
          this.querymounted()
          this.querybytype()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sublevel {
  height: 100%;
  .content {
    height: 100%;
    display: flex;
    .left {
      flex: 1;
      margin-right: 20px;
      position: relative; //解决表格宽度自适应问题
    }
    .right {
      flex: 1;
      position: relative;
    }
  }
}
</style>
