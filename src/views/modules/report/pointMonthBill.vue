<!--
	描述：按表计查看的月度账单
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
      <el-form-item label="数据时间">
        <el-date-picker
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
          @click.prevent="query()"
          icon="el-icon-search"
        >查询</el-button>
        <el-button
          type="warning"
          @click.prevent="reCalcHandle()"
          icon="el-icon-date"
        >重算</el-button>
      </el-form-item>
    </el-form>
    <table style="width: 100%;height: 40px;min-width:955px;line-height: 40px; text-align: center;color:#82848A ; border: 1px solid #15a193;margin-bottom: 10px;font-weight: 600;">
      <tr>
        <td style="color: #606266;">上次结算日期：{{beginDate}}</td>
        <td style="color: #606266;">本次结算日期：{{endDate}}</td>
        <td style="color: #13CE66;">总用电量 ：{{sumEleEnergy}} kWh</td>
        <td style="color: #13CE66;">总电费 ：{{sumEleReadAmount}} 元</td>
        <td style="color: #DD6161;">总用水量 ：{{sumWatEnergy}} m³</td>
        <td style="color: #DD6161;">总水费 ：{{sumWatReadAmount}} 元</td>
      </tr>
    </table>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="changeTabs"
    >
      <el-tab-pane
        label="电表账单"
        name="eleTab"
      >
        <div v-if="eleDataTableVisable">
          <hltable
            v-bind:tburl="url"
            v-bind:tbcols="eleCols"
            ref="eleDataTable"
            v-bind:tbconfig="tbconfig"
          ></hltable>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="水表账单"
        name="watTab"
      >
        <div v-if="watDataTableVisable">
          <hltable
            v-bind:tburl="url"
            v-bind:tbcols="watCols"
            ref="watDataTable"
            v-bind:tbconfig="tbconfig"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
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
      activeName: "eleTab",
      eleDataTableVisable: true,
      watDataTableVisable: true,
      queryForm: {
        type: 0,
        datatime: tool.formatDate(tool.addMonth(new Date(), -1), "yyyy-MM"),
        schemeid: 3,
        regionName: this.$cookie.get("regionName"),
        regionid: this.$cookie.get("regionid")
      },
      url: "/report/pointMonthBill/list",
      eleCols: [
        { prop: "pointName", label: "表名", width: "120" },
        { prop: "commaddress", label: "表号", width: "120" },
        { prop: "regionName", label: "所属区域", width: "120" },
        { prop: "hm", label: "户名", width: "120" },
        { prop: "startBm", label: "上次结算读数", width: "120" },
        { prop: "endBm", label: "本次结算读数", width: "120" },
        { prop: "rate", label: "倍率", width: "120" },
        { prop: "readEnergy", label: "结算用量(kWh)" },
        { prop: "readUnitPrice", label: "单价(元/kWh)" },
        { prop: "readAmount", label: "金额(元)" }
      ],
      watCols: [
        { prop: "pointName", label: "表名", width: "120" },
        { prop: "commaddress", label: "表号", width: "120" },
        { prop: "regionName", label: "所属区域", width: "120" },
        { prop: "hm", label: "户名", width: "120" },
        { prop: "startBm", label: "上次结算读数", width: "120" },
        { prop: "endBm", label: "本次结算读数", width: "120" },
        { prop: "readEnergy", label: "结算用量(m³)" },
        { prop: "readUnitPrice", label: "单价(元/m³)" },
        { prop: "readAmount", label: "金额(元)" }
      ],
      tbstyle: {
        width: "1200px"
      },
      sumEleEnergy: 0,
      sumEleReadAmount: 0,
      sumWatEnergy: 0,
      sumWatReadAmount: 0,
      beginDate: "",
      endDate: ""
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
    }
  },
  mounted() {
    if (!this.queryForm.regionid) {
      this.$message.info("请选择区域");
      return;
    }
    this.getDataList(0);
  },
  methods: {
    query() {
      if (!this.queryForm.regionid) {
        this.$message.info("请选择区域");
        return;
      }
      this.getDataList(0);
      setTimeout(() => {
        this.getDataList(1);
      }, 100);
    },
    getDataList(type) {
      let refTable = this.$refs.eleDataTable;
      let callback;
      if (type == 0) {
        callback = this.querySum;
      }
      if (type == 1) {
        refTable = this.$refs.watDataTable;
      }
      refTable.loadData(
        {
          type: type,
          datatime: this.queryForm.datatime,
          schemeid: this.queryForm.schemeid,
          regionid: this.queryForm.regionid
        },
        callback
      );
    },
    getSelectRegion(data) {
      this.queryForm.regionid = data.id;
      this.queryForm.regionName = data.label;
    },
    querySum() {
      let vm = this;
      vm.$http.ajaxGet(
        "/report/pointMonthBill/sum",
        {
          datatime: vm.queryForm.datatime,
          schemeid: vm.queryForm.schemeid,
          regionid: vm.queryForm.regionid
        },
        function(res) {
          vm.sumEleEnergy = res.data.sumEleEnergy;
          vm.sumEleReadAmount = res.data.sumEleReadAmount;
          vm.sumWatEnergy = res.data.sumWatEnergy;
          vm.sumWatReadAmount = res.data.sumWatReadAmount;
          vm.beginDate = res.data.beginDate;
          vm.endDate = res.data.endDate;
        },
        function(res) {
          debugger;
          vm.$message.error(res.msg || "查询失败");
        }
      );
    },
    changeTabs(tab, event) {
      // 处理elementUi 同一个页面2个table的列宽不能自适应问题.
      let widthTimespan = 120 + new Date().getTime() * 0.0000000000001;
      let vm = this;
      if (tab.label == "电表账单") {
        vm.$set(vm.eleCols, 1, {
          prop: "commaddress",
          label: "表号",
          width: widthTimespan
        });
      } else {
        vm.$set(vm.watCols, 1, {
          prop: "commaddress",
          label: "表号",
          width: widthTimespan
        });
      }
    },
    reCalcHandle() {
      this.$confirm("重算会覆盖原有数据，您确定重算吗?", "重算提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      }).then(() => {
        this.$http.ajaxGet(
          "/report/pointMonthBill/reCalc",
          {
            datatime: this.queryForm.datatime,
            schemeid: this.queryForm.schemeid,
            regionid: this.queryForm.regionid
          },
          () => {
            this.$message.success("操作成功");
            this.getDataList(0);
          },
          data => {
            this.$message.error(data.msg);
          }
        );
      });
    }
  }
};
</script>

<style>
.formWidth {
  width: 150px;
}
</style>