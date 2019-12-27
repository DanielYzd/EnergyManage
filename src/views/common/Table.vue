<template>
  <div>
    <div style="display:flex; padding:10px 0px;">
      <slot name="toolbar"> </slot>
    </div>
    <el-table
      style="width:100%;"
      v-loading="tableoptions.loading"
      element-loading-text="加载中..."
      :data="dataSource"
      :max-height="tableoptions.maxHeight"
      :stripe="tableoptions.stripe"
      :border="tableoptions.border"
      :row-style="rowStyle"
      @sort-change="tableSortChange"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      header-row-class-name="table-header-row"
    >
      <!-- selection选择框 -->
      <el-table-column
        v-if="tableoptions.mutiSelect"
        type="selection"
        style="width:50px"
        align="center"
      >
      </el-table-column>
      <!-- 序号 -->
      <el-table-column
        v-if="tableoptions.index"
        type="index"
        label="序号"
        width="50"
        :index="indexMethod"
        align="center"
      >
      </el-table-column>
      <!-- 数据列
            prop:列的值
            label:列的表头
            fixed:列是否固定在左侧或者右侧，true表示固定在左侧 -->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          :sortable="column.sortable"
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              {{ scope.row[column.prop] }}
            </template>
            <!-- render -->
            <template v-else>
              <RenderDom
                :row="scope.row"
                :index="index"
                :render="column.render"
              />
            </template>

            <!-- render button -->
            <!-- plain:是否朴素元素 -->
            <!-- @click.stop 阻止点击事件继续传播 -->
            <template v-if="column.button">
              <template>
                <el-button
                  v-for="(btn, id) in column.group"
                  :key="id"
                  :type="btn.type"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :disabled="
                    typeof btn.disabled === 'function'
                      ? btn.disabled(scope.row)
                      : btn.disabled
                  "
                  :plain="btn.plain"
                  @click.stop="btn.onClick(scope.row, scope.$index)"
                  >{{ btn.value ? btn.value : undefined }}
                </el-button>
              </template>
            </template>
            <!-- slot 其他常用项 -->
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      :total="pagination.total"
      background
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="pagination.numPerPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
      style="margin-top: 20px;text-align: right"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  components: {
    RenderDom: {
      functional: true, // 函数式组件 - 无 data 和 this 上下文 => better render
      props: {
        row: Object,
        index: Number,
        render: Function
      },

      // @param {Function} createElement - 原生创建dom元素的方法， 弃用，推荐使用 jsx
      // @param {Object} ctx - 渲染的节点的this对象
      // @argument 传递参数 row index

      render: (h, opt) => {
        const params = {
          row: opt.props.row,
          index: opt.props.index
        }
        if (opt.props.column) params.column = opt.props.column
        return opt.props.render(h, params)
      }
      // const { row, index } = ctx.props
      // return ctx.props.render(row, index)
      // return createElement('span', index)
    }
  },
  props: {
    dataSource: Array,
    options: Object, // 表格参数控制 maxHeight、stript等等...
    columns: Array,
    // fetch: Function, // 获取数据的函数
    pagination: Object, // 分页不传则不显示
    rowStyle: Function // 根据当前行数据是否高亮
  },
  computed: {
    tableoptions() {
      return Object.assign(
        {
          stripe: true,
          border: true
        },
        this.options
      )
    }
  },
  created() {},
  methods: {
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.$emit('handleSizeChange', size)
    },
    handleIndexChange(current) {
      // 切换页码
      this.$emit('handleIndexChange', current)
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    handleRowClick(row, event, column) {
      this.$emit('row-click', row, event, column)
    },
    tableSortChange(column) {
      this.$emit('sort-Change', column)
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    // 序号计算
    indexMethod(index) {
      if (this.pagination) {
        return (
          index + 1 + (this.pagination.pageNum - 1) * this.pagination.numPerPage
        )
      } else {
        return index
      }
    }
  }
}
</script>
<style>
.el-table th,
.el-table tr.table-header-row {
  /* background: #cecfcf; 示例， 对表格样式上的修饰 */
  font-size: 12px;
  background: #f1f1f1;
  color: #666666;
}

.el-table .el-button [class*='el-icon-'] + span {
  margin-left: 0 !important;
}

.el-pagination {
  margin: 20px 0px 0px 0px !important;

  /*font-weight: 400;*/
}
</style>
