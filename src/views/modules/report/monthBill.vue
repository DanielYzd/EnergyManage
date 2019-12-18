<!--
	描述：分摊报表
-->
<template>
  <div class="content-wrap">
    <el-form
      :inline="true"
      :model="queryForm"
      @keyup.enter.native="getDataList()"
      size="small"
      labelWidth="90px"
    >
      <region-select-item
        label="所属区域"
        v-model="queryForm.regionName"
        @getRegion="getSelectRegion"
      ></region-select-item>
      <el-form-item label="数据时间">
        <el-date-picker
          v-if="queryForm.schemeid === 6"
          v-model="queryForm.datatime"
          type="month"
          placeholder="选择月份"
          class="formWidth"
          value-format="yyyy-MM"
          format="yyyy-MM"
          size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.prevent="getDataList()"
          icon="el-icon-search"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="url"
      v-bind:tbcols="cols"
      ref="dataTable"
      v-bind:tbconfig="tbconfig"
      v-bind:tbstyle="tbstyle"
    ></hltable>
  </div>
</template>

<script>
import hlDatePicker from "@/components/hl-date-picker";
import hltable from "@/components/hltable";
import tool from "@/utils/tool";
import regionSelect from "@/views/modules/pob/region-select";
export default {
  data() {
    return {
      queryForm: {
        type: 0,
        datatime: tool.formatDate(tool.addDay(new Date(), -1), "yyyy-MM"),
        schemeid: 6,
        regionName: this.$cookie.get("regionName"),
        regionid: this.$cookie.get("regionid")
      },
      url: "/report/share/list",
      tbstyle: {
        height: "500"
      }
    };
  },
  components: {
    hlDatePicker,
    "region-select-item": regionSelect,
    hltable
  },
  computed: {
    tbconfig() {
      return {
        isShowSelection: false,
        isShowRowIndex: true,
        isShowPage: true
      };
    },
    cols() {
      this.changeHeight();
      let cols = [
        { prop: "regionName", label: "所属区域", width: "120", fixed: true },
        { prop: "areaName", label: "房间", width: "120", fixed: true },
        { prop: "hm", label: "用户", width: "120", fixed: true },
        { prop: "commaddress", label: "表通信地址", width: "120", fixed: true },
        { prop: "datatime", label: "开始时间", width: "140" },
        { prop: "datatime2", label: "结束时间", width: "140" },
        { prop: "roomArea", label: "建筑面积(㎡)", width: "140" },
        { prop: "floor", label: "楼层", width: "110" }
      ];
      if (this.queryForm.type == 0) {
        cols = cols.concat([
          { prop: "roomAreaExt", label: "有效面积(㎡)", width: "140" },
          { prop: "validDays", label: "有效天数", width: "140" },
          { prop: "roomReadEleVal", label: "抄见电量(kWh)", width: "160" },
          {
            prop: "roomElePubShareFactor",
            label: "公共分摊系数",
            width: "160"
          },
          { prop: "roomElePubVal", label: "公共分摊电量(kWh)", width: "160" },
          {
            prop: "roomEleVatorShareFactor",
            label: "电梯分摊系数",
            width: "160"
          },
          { prop: "roomEleVatorVal", label: "电梯分摊电量(kWh)", width: "160" },
          {
            prop: "roomEleAirShareFactor",
            label: "空调分摊系数",
            width: "160"
          },
          { prop: "roomEleAirVal", label: "空调分摊电量(kWh)", width: "160" },
          {
            prop: "roomEleLossShareFactor",
            label: "变线损分摊系数",
            width: "160"
          },
          {
            prop: "roomEleLossVal",
            label: "变线损分摊电量(kWh)",
            width: "170"
          },
          { prop: "roomUnitPrice", label: "电价(元)", width: "95" },
          { prop: "roomEleTotalVal", label: "总电量(kWh)", width: "145" },
          { prop: "amount", label: "总费用(元)", width: "140" }
        ]);
      } else if (this.queryForm.type == 1) {
      }
      return cols;
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData(
        {
          type: this.queryForm.type,
          datatime: this.queryForm.datatime,
          schemeid: this.queryForm.schemeid,
          regionid: this.queryForm.regionid
        },
        null,
        1,
        500
      );
    },
    getSelectRegion(data) {
      this.queryForm.regionid = data.id;
      this.queryForm.regionName = data.label;
    },
    changeHeight() {
      this.tbstyle.height = window.innerHeight - 242;
    }
  }
};
</script>

<style>
.formWidth {
  width: 150px;
}
/* .content-wrap {
  background-color: khaki;
} */
</style>