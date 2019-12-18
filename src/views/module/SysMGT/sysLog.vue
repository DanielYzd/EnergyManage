<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
      labelWidth="85px"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.key"
          placeholder="用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.datatime"
          type="date"
          placeholder="开始时间"
          style="width: 140px;"
          size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.datatime2"
          type="date"
          placeholder="结束时间"
          style="width: 140px;"
          size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="url"
      v-bind:tbcols="cols"
      ref="dataTable"
      v-bind:tbconfig="tbconfig"
    ></hltable>
  </div>
</template>

<script>
import tool from "@/utils/tool";
import hltable from "@/components/hltable";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        datatime: tool.formatDate(tool.addDay(new Date(), -1), "yyyy-MM-dd"),
        datatime2: tool.formatDate(tool.addDay(new Date(), 1), "yyyy-MM-dd")
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: [],
      url: "/sys/log/list",
      cols: [
        { prop: "id", label: "ID", width: 20 },
        { prop: "username", label: "用户名", width: 30 },
        { prop: "operation", label: "用户操作", width: 40 },
        //{ prop: "method", label: "请求方法", width: 220 },
        { prop: "params", label: "请求参数" },
        { prop: "time", label: "耗时(毫秒)", width: 30 },
        { prop: "ip", label: "IP地址", width: 30 },
        { prop: "createDate", label: "创建时间", width: 30 }
      ],
      tbconfig: {
        isShowSelection: false,
        isShowRowIndex: false,
        isShowPage: true
      }
    };
  },
  components: {
    hltable
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$refs.dataTable.loadData({
        page: this.pageIndex,
        limit: this.pageSize,
        key: this.dataForm.key,
        datatime: this.dataForm.datatime,
        datatime2: this.dataForm.datatime2
      });
    }
  }
};
</script>
