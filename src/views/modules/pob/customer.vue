<template>
  <div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small" labelWidth="85px">
      <region-select-item label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select-item>
      <!-- <el-form-item>
        <el-input style="width:400px;" placeholder="请输入" v-model="dataForm.searchWord" clearable>
          <el-select v-model="searchSelect" slot="prepend" placeholder="请选择" style="width: 130px;">
            <el-option label="户名" value="1"></el-option>
            <el-option label="手机号" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getDataList()">查询</el-button>
        </el-input>
      </el-form-item> -->
	    	<el-form-item label="用户名称">
	    		<el-input v-model="dataForm.hm" placeholder="用户名称" class="formItem" clearable></el-input>
	    	</el-form-item>
	    	<el-form-item label="手机号码">
	    		<el-input v-model="dataForm.telephone" placeholder="手机号码" class="formItem" clearable></el-input>
	    	</el-form-item>
	    	<el-form-item label="房间名称">
	    		<el-input v-model="dataForm.areaName" placeholder="房间名称" class="formItem" clearable></el-input>
	    	</el-form-item>
	    	<el-form-item label="表计名称">
	    		<el-input v-model="dataForm.meterName" placeholder="表计名称" class="formItem" clearable></el-input>
	    	</el-form-item>
	    	<el-form-item label="表通信地址">
	    		<el-input v-model="dataForm.commaddress" placeholder="表通信地址" class="formItem" clearable></el-input>
	    	</el-form-item>
      <el-form-item>
        <el-button
           icon="el-icon-search" @click="getDataList()"
          type="primary"
        >查询</el-button>
        <el-button
          v-if="isAuth('pob:customer:save')"
          @click="addOrUpdateHandle()"
          icon="el-icon-circle-plus-outline"
          type="primary"
        >新增</el-button>
        <el-button
          v-if="isAuth('pob:customer:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
        <el-button
          v-if="isAuth('pob:customer:save')"
          type="primary"
          @click="batchAddHandle()"
          icon="el-icon-document"
        >批量导入</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tburl"
      v-bind:tbcols="tbcols"
      ref="dataTable"
      v-bind:tbstyle="tbstyle"
      v-bind:tbconfig="tbconfig"
      @addOrUpdateHandle="addOrUpdateHandle"
      @deleteHandle="deleteHandle"
      @selections="(data)=>{this.dataListSelections = data}"
    ></hltable>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <batch-add v-if="batchAddVisible" ref="batchAdd" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import regionSelect from "@/views/modules/pob/region-select";
import AddOrUpdate from "./customer-add-or-update";
import hltable from "@/components/hltable";
import batchAdd from "./archives-batch-add";
export default {
  data() {
    return {
      searchSelect: "1",
      dataForm: {
        hm: "",
        telephone: "",
        areaName: "",
        commaddress: "",
        meterName : "",
        regionid: this.$cookie.get("regionid"),
        regionName: this.$cookie.get("regionName")
      },
      tburl: "/pob/customer/list",
      tbstyle: {
        width: "100%"
      },
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 1,
        isShowPage: true
      },
      tbcols: [
        { prop: "regionName", label: "所属区域" },
        { prop: "disc", label: "户名", width: 220 },
        //,{prop:"area", label:"使用面积(m²)",width:100}
        { prop: "areaNames", label: "入住房间", width: 180 },
        { prop: "meterNames", label: "表计名称", width: 180  },
        { prop: "commaddresses", label: "表通信地址" , width: 180 },
        { prop: "telephone", label: "手机号", width: 110 },
        {
          prop: "ppfstatusName",
          label: "主站计费",
          width: 110,
          tag: true,
          getColor: function(row) {
            if (row.ppfstatus === 0) {
              return "warning";
            } else {
              return "info";
            }
          }
        },
        { prop: "unitPriceNameEle", label: "电价" , width: 110},
        { prop: "unitPriceNameWat", label: "水价" , width: 110},
        //,{prop:"flagEleairName", label:"空调计费"}
        //,{prop:"flagElevatorName", label:"电梯计费"}
        //,{prop:"watFactor", label:"用水分摊系数",width:100}
        { prop: "starttime", label: "入住时间", width: 110 },
        { prop: "checkOutTime", label: "退租时间", width: 110 }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false,
      batchAddVisible: false
    };
  },
  components: {
    hltable,
    AddOrUpdate,
    "region-select-item": regionSelect,
    batchAdd
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid,
        hm: this.dataForm.hm,
        telephone: this.dataForm.telephone,
        areaName: this.dataForm.areaName,
        commaddress: this.dataForm.commaddress ,
        meterName : this.dataForm.meterName
      });
    },
    //选择后回调刷新
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.getDataList();
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row ? row.customerid : null);
      });
    },
    // 删除
    deleteHandle(row) {
      var ids = row
        ? [row.customerid]
        : this.dataListSelections.map(item => {
            return item.customerid;
          });
      var len = ids.length;
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
        this.$http.ajaxPost(
          "/pob/customer/delete",
          ids,
          () => {
            this.$message.success("操作成功");
            this.getDataList();
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
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>