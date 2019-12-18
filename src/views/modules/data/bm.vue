<!--表计读数-->
<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
      labelWidth="85px"
    >
      <region-select-item label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
      <el-form-item label="表计类型">
        <el-select
          v-model="dataForm.type"
          clearable
          placeholder="请选择"
          class="formItem"
          @change="getDataList"
        >
          <el-option
            v-for="item in meterTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据时间">
        <el-date-picker
          v-model="dataForm.datatime"
          type="daterange"
          style="width: 220px;"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :default-time="['00:00:00', '00:00:00']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="表通信地址">
        <el-input v-model="dataForm.commaddress" placeholder="表通信地址" class="formItem" clearable></el-input>
      </el-form-item>
      <el-form-item label="终端地址">
        <el-input v-model="dataForm.rtuAddr" class="formItem"></el-input>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button @click="getDataList()" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tbUrl"
      v-bind:tbcols="tbCols"
      ref="dataTable"
      v-bind:tbconfig="tbConfig"
      @dataDetail="dataDetail"
    />
  </div>
</template>

<script>
import regionSelect from "@/views/modules/pob/region-select";
import hlDatePicker from "@/components/hl-date-picker";
import hltable from "@/components/hltable";
import tool from "@/utils/tool";
export default {
  data() {
    return {
      loading: false,
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataForm: {
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -1), "yyyy-MM-dd"),
          tool.formatDate(tool.addDay(new Date(), -1), "yyyy-MM-dd")
        ],
        regionid: this.$cookie.get("regionid"),
        regionName: this.$cookie.get("regionName"),
        rtuAddr: "",
        time: "00:00",
        type: 0
      },
      tbUrl: "/data/readMetering/pointbm",
      tbConfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        isShowPage: true
      }
    };
  },
  components: {
    hlDatePicker,
    hltable,
    "region-select-item": regionSelect
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
    tbCols() {
      if (
        this.dataForm.type == 1 ||
        this.dataForm.type === 2 ||
        this.dataForm.type === 3
      ) {
        return [
			{prop:"regionName", label:"所属区域",width:100},
          { prop: "pointName", label: "表计名称", width: "90" },
          { prop: "commaddress", label: "表计通讯地址", width: "90" },
          { prop: "datatime", label: "时间", width: "120" },
          { prop: "flowV", label: "表计读数", width: "90" }
        ];
      } else {
        return [
			{prop:"regionName", label:"所属区域",width:100},
          { prop: "pointName", label: "表计名称", width: "90" },
          { prop: "commaddress", label: "表计通讯地址", width: "90" },
          { prop: "numberid", label: "表序号", width: "60" },
          { prop: "rtuAddr", label: "终端地址", width: "70" },
          { prop: "datatime", label: "时间", width: "120" },
          { prop: "zyz", label: "费率总读数", width: "70" },
          { prop: "zyj", label: "费率尖读数", width: "70" },
          { prop: "zyf", label: "费率峰读数", width: "70" },
          { prop: "zyp", label: "费率平读数", width: "70" },
          { prop: "zyg", label: "费率谷读数", width: "70" }
          //   ,{ prop: "fyz", label: "反向有功总", width: "70" }
          //   { prop: "fyj", label: "反向有功尖", width: "70" },
          //   { prop: "fyf", label: "反向有功峰", width: "70" },
          //   { prop: "fyp", label: "反向有功平", width: "70" },
          //   { prop: "fyg", label: "反向有功谷", width: "70" },
          //   { prop: "fwz", label: "反向无功总", width: "70" }
        ];
      }
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$refs.dataTable.loadData({
        datatime: this.dataForm.datatime[0],
        datatime2: this.dataForm.datatime[1],
        regionid: this.dataForm.regionid,
        rtuAddr: this.dataForm.rtuAddr,
        type: this.dataForm.type || 0,
        commaddress: this.dataForm.commaddress
      });
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.getDataList();
    },
    dataDetail(row) {
      /*		    	var name = "pointBm"
		        var newTabs = this.mainTabs.filter(item => item.name !== name)
		        if (newTabs.length >= 1) {
		          this.mainTabs = newTabs
		        } 
		        this.$router.push({ name: name,params: { customerid : row.customerid ,pointid : row.pointid ,datatime :row.datatime}})*/
      var datatime2 = tool.addDay(new Date(this.dataForm.datatime), 1);
      this.tbConfig.rowButtonType = 0;
      this.$refs.dataTable.loadData({
        datatime: this.dataForm.datatime,
        datatime2: tool.formatDate(datatime2, "yyyy-MM-dd"),
        regionid: this.dataForm.regionid,
        pointid: row.pointid,
        type: this.dataForm.type || 0
      });
    }
  }
};
</script>

<style>
</style>