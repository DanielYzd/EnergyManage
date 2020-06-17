<template>
  <div class="communication">
    <el-form :inline="true" :model="ruleForm">
      <el-form-item label="所属单元">
        <el-input size="mini"></el-input>
      </el-form-item>
      <el-form-item label="能源类型">
        <el-select size="mini"></el-select>
      </el-form-item>
      <el-form-item label="表通信地址">
        <el-input size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" icon="el-icon-search"
          >查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="warning" icon="el-icon-arrow-up"
          >批量召读
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="warning" icon="el-icon-arrow-down"
          >批量下发
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="success" icon="el-icon-download"
          >导出模板
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="success" icon="el-icon-upload2"
          >批量导入
        </el-button>
      </el-form-item>
    </el-form>
    <div class="doubletable">
      <div class="left-table">
        <Common-table
          :dataSource="dataSource1"
          :options="options1"
          :columns="columns1"
        ></Common-table>
      </div>
      <div class="right-table"></div>
    </div>
  </div>
</template>

<script>
import CommonTable from '@/views/common/Table'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      ruleForm: {},
      dataSource1: [],
      options1: {
        loading: false,
        mutiSelect: true
      },
      columns1: [
        { prop: 'commaddress', label: '终端地址' },
        { prop: 'curstatusDesc', label: '终端状态' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.communication {
  height: 100%;
  .el-form {
    .el-form-item {
      margin: 0 10px;
    }
  }
  .doubletable {
    display: flex;
    .left-table {
      width: 250px;
    }
    .right-table {
      flex: 1;
    }
  }
}
</style>
