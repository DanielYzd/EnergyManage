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
          v-if="isAuth('pob:calcFormula:add')"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button @click="showNote">分摊系数说明</el-button>
      </el-form-item>
    </el-form>
    <calc-formula-note
      v-if="calcFormulaNoteVisible"
      ref="calcFormulaNoteRef"
    ></calc-formula-note>
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
  </div>
</template>

<script>
import AddOrUpdate from "./calcFormula-add-or-update";
import calcFormulaNote from "./calcFormula-note";
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
      tburl: "/pob/calcFormula/list",
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        hasUpdateAuth: this.isAuth("pob:calcFormula:update"),
        hasDeleteAuth: this.isAuth("pob:calcFormula:delete"),
        rowButtonType: 1,
        isShowPage: true
      },
      tbcols: [
        { prop: "formulaName", label: "公式名称", width: 240 },
        { prop: "formulaTypeName", label: "公式类型", width: 120 },
        { prop: "regionName", label: "应用区域" },
        { prop: "factorTypeName", label: "分摊系数" },
        { prop: "updateDate", label: "最后修改时间" },
        { prop: "createDate", label: "创建时间" }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      batchAddVisible: false,
      calcFormulaNoteVisible: false
    };
  },
  components: {
    AddOrUpdate,
    hltable,
    "region-select-item": regionSelect,
    "calc-formula-note": calcFormulaNote
  },
  computed: {
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    }
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
      /*this.addOrUpdateVisible = true
        	this.$nextTick(() => {
          		this.$refs.addOrUpdate.init(row?row.fomulaid:null)
        	})*/
      var name = "calcFormulaAdd";
      var newTabs = this.mainTabs.filter(item => item.name !== name);
      if (newTabs.length >= 1) {
        this.mainTabs = newTabs;
      }
      this.$router.push({
        name: name,
        params: { formulaid: row ? row.formulaid : null }
      });
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.getDataList();
    },
    deleteHandle(row) {
      var ids = row
        ? [row.formulaid]
        : this.dataListSelections.map(item => {
            return item.formulaid;
          });
      var len = ids.length;
      var vm = this;
      this.$confirm(
        `确定${len == 1 ? "删除" : "批量删除"} ${len}条记录?`,
        "删除提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      ).then(() => {
        vm.$http.ajaxPost("/pob/calcFormula/delete", ids, function(res) {
          vm.$message.success("删除成功");
          vm.getDataList();
        });
      });
    },
    showNote() {
      this.calcFormulaNoteVisible = true;
      this.$nextTick(() => {
        this.$refs.calcFormulaNoteRef.init();
      });
    }
  }
};
</script>

<style>
</style>