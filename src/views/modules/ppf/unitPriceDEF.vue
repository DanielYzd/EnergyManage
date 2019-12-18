<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
    >
      <region-select-item
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
      ></region-select-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('ppf:unitprice:add')"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addOrUpdateHandle()"
        >新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('ppf:unitprice:update')"
          type="warning"
          @click="updateRegionPrice"
        >批量设置</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tburl"
      v-bind:tbcols="tbcols"
      ref="dataTable"
      v-bind:tbconfig="tbconfig"
      @addOrUpdateHandle="addOrUpdateHandle"
      @deleteHandle="deleteHandle"
      @selections="(data)=>{this.dataListSelections = data}"
    ></hltable>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <region-update
      v-if="regionUpdateVisible"
      ref="regionUpdate"
      @refreshDataList="getDataList"
    ></region-update>
  </div>
</template>

<script>
import AddOrUpdate from "./unitprice-add-or-update";
import regionUpdate from "./unitprice-region-update";
import regionSelect from "@/views/modules/pob/region-select";
import hltable from "@/components/hltable";
export default {
  data() {
    return {
      dataForm: {
        searchWord: "",
        loopUsedType: null,
        regionid: this.$cookie.get("regionid"),
        regionName: this.$cookie.get("regionName")
      },
      tburl: "/ppf/unitprice/list",
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 1,
        hasUpdateAuth: this.isAuth("ppf:unitprice:update"),
        hasDeleteAuth: this.isAuth("ppf:unitprice:delete"),
        isShowPage: false
      },
      tbcols: [
        { prop: "disc", label: "单价名称", width: 140 },
        { prop: "regionName", label: "应用区域", width: 140 },
        { prop: "unitTypeName", label: "单价类型", width: 120 },
        { prop: "jDj", label: "尖单价" },
        { prop: "fDj", label: "峰单价" },
        { prop: "pDj", label: "平单价" },
        { prop: "gDj", label: "谷单价" }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      regionUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate,
    hltable,
    "region-select-item": regionSelect,
    "region-update": regionUpdate
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid
      });
    },
    addOrUpdateHandle(row) {
      var vm = this;
      //   if (row && row.regionId === 0) {
      //     vm.$message.error("系统默认单价，不能修改！");
      //     return;
      //   }
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row ? row.priceid : null);
      });
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.getDataList();
    },
    deleteHandle(row) {
      var vm = this;
      //   if (row.regionId === 0) {
      //     vm.$message.error("系统默认单价，不能删除！");
      //     return;
      //   }
      var id = row.priceid;
      this.$confirm(`确定1条单价记录?`, "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      }).then(() => {
        vm.$http.ajaxPost(
          "/ppf/unitprice/delete",
          id,
          res => {
            vm.$message.success("删除成功");
            vm.getDataList();
          },
          res => {
            vm.$message.error(res);
          }
        );
      });
    },
    updateRegionPrice() {
      this.regionUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.regionUpdate.init();
      });
    }
  }
};
</script>

<style>
</style>