<!--
	作者：378357088@qq.com
	时间：2018-12-28
	描述：查询所有计量点电量，并提供电量录入、excel导入
-->
<template>
  <div>
    <el-form
      :inline="true"
      :model="queryForm"
      @keyup.enter.native="getDataList()"
      size="small"
      label-width="85px"
    >
      <region-select-item
        label="所属区域"
        v-model="queryForm.regionName"
        @getRegion="getSelectRegion"
      ></region-select-item>
      <el-form-item label="数据时间">
        <el-date-picker
          v-model="queryForm.datatime"
          type="daterange"
          placeholder="选择日期"
          style="width: 220px;"
          value-format="yyyy-MM-dd"
          size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="表计类型">
        <el-select
          v-model="queryForm.type"
          placeholder="请选择"
          style="width: 220px;"
          @change="getDataList()"
        >
          <el-option
            v-for="item in meterTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计量标志">
        <el-select
          v-model="queryForm.loopUsedType"
          clearable
          placeholder="计量标志"
          style="width: 220px;"
          @change="getDataList"
        >
          <el-option
            v-for="item in loopUsedTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<el-col :span="6">
			    	<el-form-item label="用户名称">
			    		<el-input v-model="queryForm.hm" placeholder="用户名称" style="width: 200px;" clearable></el-input>
			    	</el-form-item>
      </el-col>-->
      <el-form-item label="表通信地址">
        <el-input
          v-model="queryForm.commaddress"
          placeholder="表通信地址"
          style="width: 220px;"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="数据属性">
        <el-select
          v-model="queryForm.dataattribute"
          placeholder="数据属性"
          style="width: 220px;"
          clearable
        >
          <el-option
            v-for="item in dataTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            type="primary"
            @click.prevent="getDataList()"
            icon="el-icon-search"
          >搜索表计</el-button>
          <el-button
            type="primary"
            @click="downTemplate()"
            icon="el-icon-download"
          >下载模板</el-button>
        </el-button-group>
        <!--<el-button type="primary" @click="inputExcel()">excel导入</el-button>-->
      </el-form-item>
      <el-upload
        style="display: inline-block;"
        :action="upLoadUrl"
        :file-list="upLoadFileList"
        :onSuccess="handlerSuccess"
        accept=".xls"
        :auto-upload="true"
        :show-file-list="false"
      >
        <el-button
          size="small"
          type="warning"
          icon="el-icon-upload"
        >批量导入</el-button>
      </el-upload>
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
import hlDatePicker from "@/components/hl-date-picker";
import hltable from "@/components/hltable";
import tool from "@/utils/tool";
import regionSelect from "@/views/modules/pob/region-select";
import calcCycleSelect from "@/views/modules/ppf/calc-cycle-select";
import globals from "@/utils/globals";
export default {
  data() {
    return {
      inputAddVisible: false,
      meterList: [],
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataTypeList: [
        { key: "自动采集", value: 0 },
        { key: "手动录入", value: 2 }
      ],
      queryForm: {
        dataattribute: "",
        commaddress: "",
        hm: "",
        loopUsedType: "",
        type: 0,
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -3), "yyyy-MM-dd"),
          tool.formatDate(tool.addDay(new Date(), 1), "yyyy-MM-dd")
        ],
        regionName: this.$cookie.get("regionName"),
        regionid: this.$cookie.get("regionid")
      },
      loopUsedTypeList: globals.loopUsedTypeList,
      //url: "/data/pointsEnergy/bmKwh",
      url: "/data/readMetering/pointbmNoNumber",
      upLoadUrl: "",
      upLoadFileList: []
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
      let buttons = [
        {
          label: "读数录入",
          handler: (row, refTable) => {
            var _this = refTable.multipleTable.$parent.$parent;
            _this.inputHandler(row);
          }
        }
      ];
      return {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 4,
        btnWidth: 100,
        buttons: buttons,
        isShowPage: true
      };
    },
    cols() {
      let cols = [
        { prop: "regionName", label: "所属区域" },
        { prop: "pointName", label: "表计名称", width: 120 },
        { prop: "commaddress", label: "表通信地址", width: 120 },
        { prop: "datatime", label: "数据时间", width: 110 }
      ];
      if (this.queryForm.type == 0) {
        cols = cols.concat([
          { prop: "zyz", label: "费率总读数", width: "70" },
          { prop: "zyj", label: "费率尖读数", width: "70" },
          { prop: "zyf", label: "费率峰读数", width: "70" },
          { prop: "zyp", label: "费率平读数", width: "70" },
          { prop: "zyg", label: "费率谷读数", width: "70" }
        ]);
      } else {
        cols.push({ prop: "flowV", label: "流量(m³)", width: "120" });
      }
      return cols;
    },
    queryDatatime() {
      let queryDate = null;
      return queryDate;
    }
  },
  mounted() {
    this.upLoadUrl = this.$http.adornUrl(
      `/pob/insertTemplate/batchImportEnergy?token=${this.$cookie.get("token")}`
    );
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        commaddress: this.queryForm.commaddress,
        loopUsedType: this.queryForm.loopUsedType,
        type: this.queryForm.type,
        datatime: this.queryForm.datatime[0] + " 00:00:00",
        datatime2: this.queryForm.datatime[1] + " 00:00:00",
        regionid: this.queryForm.regionid,
        dataattribute: this.queryForm.dataattribute
      });
    },
    getSelectRegion(data) {
      this.queryForm.regionid = data.id;
      this.queryForm.regionName = data.label;
    },
    downTemplate() {
      var xlsName = encodeURIComponent("导入读数模板.xls");
      var url = `/static/excel/input/${xlsName}`;
      window.open(window.SITE_CONFIG.cdnUrl + url);
    },
    handlerError(res) {
      this.fileList = [];
      this.$message.error(res.msg);
    },
    handlerSuccess(res, file, fileList) {
      this.upLoadFileList = [];
      if (res.code === 0) {
        this.$message({
          message: "恭喜你，导入成功",
          type: "success"
        });
      } else {
        this.$message.error(res.msg || "导入失败!");
      }
    },
    inputHandler(row) {
      var name = "inputBm";
      var newTabs = this.mainTabs.filter(item => item.name !== name);
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs;
      }
      this.$router.push({
        name: name,
        params: {
          pointid: row.pointid,
          datatime: row.datatime
        }
      });
    }
  }
};
</script>

<style>
</style>