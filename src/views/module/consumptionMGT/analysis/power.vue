<template>
  <div style="padding:0 10px; height:100%">
    <el-row :gutter="20" class="statistics">
      <el-col :span="5" class="leftcontent">
        <el-card style="height:100%;" class="lefttitle">
          <div slot="header">
            <el-row>
              <el-col :span="12">
                <div>能源类别:</div>
              </el-col>
              <el-col :span="12">
                <el-select v-model="type" size="mini" placeholder="请选择">
                  <el-option value="1" label="电力"></el-option>
                  <el-option value="2" label="水"></el-option>
                  <el-option value="3" label="热能"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19" class="rightcontent">
        <el-card style="height:100%" :body-style="{ padding: 0,height:'100%' }">
          <el-form :inline="true" :model="form" >
            <el-form-item>
              <el-input size="mini" v-model="form.num1"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select size="mini" style="width:100px;" v-model="form.num2">
                <el-option
                  v-for="item in selectType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                align="center"
                v-show="form.num2 === '1'"
                size="mini"
                v-model="form.date"
                type="date"
                style="width:150px"
                placeholder="选择日期"
              >
              </el-date-picker>
              <el-date-picker
                align="center"
                size="mini"
                v-show="form.num2 === '2'"
                v-model="form.date"
                type="month"
                style="width:150px"
                placeholder="选择月"
              >
              </el-date-picker>
              <el-date-picker
                align="center"
                style="200px"
                size="mini"
                v-show="form.num2 ==='3'"
                v-model="form.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.value2" size="mini" style="width:100px">
                <el-option label="总" value="1"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item>
              <el-select v-model="form.value3" size="mini" style="width:100px">
                <el-option label="正向有功" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.value4" size="mini" style="width:100px">
                <el-option label="预付电费" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search">搜索</el-button>
              <el-button type="primary" size="mini" icon="el-icon-export">导出</el-button>
            </el-form-item>
          </el-form>
          <common-table
            :options="options"
            :dataSource="tableData"
            :columns="columns"
            :pagination="pagination"
          ></common-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CommonTable from '@/views/common/Table'
export default {
  components: {
    CommonTable
  },
  data () {
    return {
      type: '1',
      options: {
        // initTable: false,
        maxHeight: 550,
        loading: false,
        stripe: false,
        border: false,
        index: true,
        mutiSelect: false
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      pagination: {
        total: 10,
        pageNum: 1,
        numPerPage: 10
      },
      form: {
        num2: '1',
        date: '',
        value2: '',
        value3: '',
        value4: ''
      },
      columns: [
        {
          prop: 'date',
          label: '日期',
          align: 'center',
          width: '',
          fixed: false
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: '',
          fixed: false
        },
        {
          prop: 'address',
          label: '地址',
          align: 'center',
          width: '',
          fixed: false
        }
      ],
      selectType: [
        {
          label: '日',
          value: '1'
        },
        {
          label: '月',
          value: '2'
        },
        {
          label: '自定义',
          value: '3'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/analyse/statistics.scss";
</style>
