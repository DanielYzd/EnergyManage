<!--
	描述：分摊报表
-->
<template>
  <div>
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
      <calc-cycle-select
        label="结算周期"
        v-model="queryForm.schemeid"
        tbstyle="width:220px"
        ref="calcCycleSelect"
        @getSelected="getSelectScheme"
      ></calc-cycle-select>
      <el-form-item label="数据时间">
        <el-date-picker
          v-model="queryForm.datatime"
          type="month"
          placeholder="选择月份"
          class="formWidth"
          value-format="yyyy-MM"
          format="yyyy-MM"
          size="small"
          style="width:220px"
        ></el-date-picker>
        <!--<el-date-picker v-model="queryForm.dates" type="daterange" v-if="queryForm.schemeid === 7" 
			    			style="width: 220px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small"
							start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '00:00:00']">
        </el-date-picker>-->
      </el-form-item>
      <el-form-item label="表计类型">
        <el-select
          v-model="queryForm.type"
          placeholder="请选择"
          class="formWidth"
          @change="getDataList()"
          style="width:220px"
        >
          <el-option
            v-for="item in meterTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房间名称">
        <el-input
          v-model="queryForm.areaName"
          placeholder="房间名称"
          class="formWidth"
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input
          v-model="queryForm.hm"
          placeholder="用户名称"
          class="formWidth"
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item label="表通信地址">
        <el-input
          v-model="queryForm.commaddress"
          placeholder="表通信地址"
          class="formWidth"
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.prevent="getDataList()"
          icon="el-icon-search"
        >查询</el-button>
        <el-button
          type="warning"
          @click.prevent="reCalcHandle()"
          icon="el-icon-date"
        >重算</el-button>
        <el-button
          type="danger"
          @click.prevent="reSendHandle()"
          icon="el-icon-message"
        >推送</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="shareSumUrl"
      v-bind:tbcols="shareSumCols"
      ref="shareSumDataTable"
      v-bind:tbconfig="shareSumTbconfig"
      @dataDetail="dataDetail"
    ></hltable>
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
import calcCycleSelect from "@/views/modules/ppf/calc-cycle-select";
export default {
  data() {
    return {
      inputAddVisible: false,
      meterList: [],
      meterTypeList: this.$sysConfig.getMeterTypes(),
      queryForm: {
        commaddress: "",
        hm: "",
        areaName: "",
        type: 0,
        datatime: tool.formatDate(tool.addMonth(new Date(), -1), "yyyy-MM"),
        dates: [
          tool.formatDate(tool.addDay(new Date(), -15), "yyyy-MM-dd"),
          tool.formatDate(tool.addDay(new Date(), 1), "yyyy-MM-dd")
        ],
        schemeid: 0,
        regionName: this.$cookie.get("regionName"),
        regionid: this.$cookie.get("regionid")
      },
      url: "/report/share/list",
      tbstyle: {
        height: "500"
      },
      shareSumUrl: "/report/share/shareSumList",
      shareSumCols: [
        { prop: "regionName", label: "所属区域" },
        { prop: "formulaName", label: "公式名称", width: 220 },
        { prop: "zDlP", label: "公式分摊总量(kWh)", width: 220 }
      ],
      shareSumTbconfig: {
        isShowSelection: false,
        isShowRowIndex: false,
        rowButtonType: 3,
        isShowPage: false
      }
    };
  },
  components: {
    hlDatePicker,
    "region-select-item": regionSelect,
    hltable,
    "calc-cycle-select": calcCycleSelect
  },
  computed: {
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    tbconfig() {
      return {
        isShowSelection: false,
        isShowRowIndex: true,
        isShowPage: true
      };
    },
    cols() {
      let cols = [
        { prop: "regionName", label: "所属区域", width: "120", fixed: true },
        { prop: "areaName", label: "房间", width: "120", fixed: true },
        { prop: "hm", label: "用户", width: "140", fixed: true },
        { prop: "commaddress", label: "表通信地址", width: "140", fixed: true },
        { prop: "datatime", label: "开始时间", width: "140" },
        { prop: "datatime2", label: "结束时间", width: "140" },
        { prop: "roomArea", label: "建筑面积(㎡)", width: "120" },
        { prop: "floor", label: "楼层", width: "80" }
      ];
      if (this.queryForm.type == 0) {
        cols = cols.concat([
          { prop: "roomAreaExt", label: "有效面积(㎡)", width: "120" },
          { prop: "validDays", label: "有效天数", width: "120" },
          { prop: "roomReadEleVal", label: "抄见电量(kWh)", width: "130" },
          {
            prop: "roomElePubShareFactor",
            label: "公共分摊系数",
            width: "130"
          },
          { prop: "roomElePubVal", label: "公共分摊电量(kWh)", width: "160" },
          {
            prop: "roomEleVatorShareFactor",
            label: "电梯分摊系数",
            width: "120"
          },
          { prop: "roomEleVatorVal", label: "电梯分摊电量(kWh)", width: "160" },
          {
            prop: "roomEleAirShareFactor",
            label: "空调分摊系数",
            width: "130"
          },
          { prop: "roomEleAirVal", label: "空调分摊电量(kWh)", width: "160" },
          {
            prop: "roomEleLossShareFactor",
            label: "变线损分摊系数",
            width: "140"
          },
          {
            prop: "roomEleLossVal",
            label: "变线损分摊电量(kWh)",
            width: "180"
          },
          { prop: "roomUnitPrice", label: "电价(元)", width: "95" },
          { prop: "roomEleTotalVal", label: "总电量(kWh)", width: "115" },
          { prop: "amount", label: "总费用(元)", width: "140" }
        ]);
      } else if (this.queryForm.type == 1) {
      }
      return cols;
    }
  },
  mounted() {},
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        commaddress: this.queryForm.commaddress,
        hm: this.queryForm.hm,
        areaName: this.queryForm.areaName,
        type: this.queryForm.type,
        datatime: this.queryForm.datatime,
        schemeid: this.queryForm.schemeid,
        regionid: this.queryForm.regionid
      });
      this.getShareSumDataList();
    },
    getShareSumDataList(data) {
      this.$refs.shareSumDataTable.loadData({
        type: this.queryForm.type,
        datatime: this.queryForm.datatime,
        schemeid: this.queryForm.schemeid,
        regionid: this.queryForm.regionid
      });
    },
    getSelectRegion(data) {
      this.queryForm.regionid = data.id;
      this.queryForm.regionName = data.label;
    },
    getSelectScheme(selectedValue) {
      this.queryForm.schemeid = selectedValue;
      this.getDataList();
    },
    dataDetail(row) {
      var name = "shareDetail";
      var newTabs = this.mainTabs.filter(item => item.name !== name);
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs;
      }
      this.$router.push({
        name: name,
        params: {
          formulaid: row.formulaid,
          startTime: this.queryForm.datatime + "-06",
          endTime: tool.getNextMonth(this.queryForm.datatime + "-06")
        }
      });
    },

    energyDetail(row) {
      var name = "pointEnergy";
      var newTabs = this.mainTabs.filter(item => item.name !== name);
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs;
      }
      this.$router.push({
        name: name,
        params: {
          customerid: row.customerid,
          pointid: row.pointid,
          datatime: this.queryDatatime,
          schemeid: this.queryForm.schemeid
        }
      });
    },
    inputHandler(row) {
      var name = "inputAdd2";
      var newTabs = this.mainTabs.filter(item => item.name !== name);
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs;
      }
      this.$router.push({
        name: name,
        params: {
          customerid: row.customerid,
          pointid: row.pointid,
          datatime: this.queryDatatime,
          schemeid: this.queryForm.schemeid
        }
      });
    },
    reCalcHandle() {
      this.$confirm("重算会覆盖原有数据，您确定重算吗?", "重算提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      }).then(() => {
        this.$http.ajaxGet(
          "/report/share/reCalc",
          {
            datatime: this.queryForm.datatime,
            schemeid: this.queryForm.schemeid,
            regionid: this.queryForm.regionid
          },
          () => {
            this.$message.success("操作成功");
            this.getDataList();
          },
          data => {
            this.$message.error(data.msg);
          }
        );
      });
    },
    reSendHandle() {
      this.$confirm("您确定重新推送账单吗?", "重算提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      }).then(() => {
        if (!window.SITE_CONFIG.zjnUploadUrl) {
          this.$message.error("没有设置账单推送地址");
          return;
        }
        var url =
          window.SITE_CONFIG.zjnUploadUrl +
          "/api/zjn/uploadBill?datatime=" +
          tool.formatDate(new Date(this.queryForm.datatime), "yyyyMM");
        this.$http({
          url: url,
          method: "post",
          data: {}
        })
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success(
                "正在推送中，请稍后到系统日志中查看推送结果。"
              );
            } else {
              this.$message.error("推送失败");
            }
          })
          .catch(error => {
            this.$message.error("推送失败");
          });
      });
    }
  }
};
</script>

<style>
.formWidth {
  width: 220px;
}
</style>