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
      <el-form-item label="房间名称">
        <el-input
          v-model="dataForm.areaName"
          placeholder="房间名称"
          class="formItem"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="表通信地址">
        <el-input
          v-model="dataForm.commaddress"
          placeholder="表通信地址"
          class="formItem"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input
          v-model="dataForm.hm"
          placeholder="用户名称"
          class="formItem"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('pob:room:add')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('pob:room:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <hltable
      v-bind:tburl="tburl"
      v-bind:tbcols="tbcols"
      ref="dataTable"
      v-bind:tbconfig="tbconfig"
      v-bind:tbstyle="tbstyle"
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
import AddOrUpdate from "./room-add-or-update";
import regionSelect from "@/views/modules/pob/region-select";
import hltable from "@/components/hltable";
export default {
  data() {
    return {
      dataForm: {
        hm: "",
        areaName: "",
        meterName: "",
        commaddress: "",
        regionid: this.$cookie.get("regionid"),
        regionName: this.$cookie.get("regionName")
      },
      tburl: "/pob/pobCommunityBuilding/list",
      tbconfig: {
        isShowSelection: true,
        isShowRowIndex: true,
        rowButtonType: 1,
        hasUpdateAuth: this.isAuth("pob:room:update"),
        hasDeleteAuth: this.isAuth("pob:room:delete"),
        isShowPage: true
      },
      tbstyle: {
        //height: "500"
      },
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate,
    hltable,
    "region-select-item": regionSelect
  },
  mounted() {
    this.getDataList();
  },
  computed: {
    tbcols() {
      //this.changeHeight();
      return [
        { prop: "areaId", label: "房间编码", width: 100, fixed: true },
        { prop: "regionName", label: "所属区域", fixed: true },
        { prop: "areaName", label: "房间名称", width: 200, fixed: true },
        { prop: "floor", label: "楼层", width: 70 },
        { prop: "area", label: "建筑面积(m²)", width: 120 },
        { prop: "countPoints", label: "表计数量", width: 100 },
        { prop: "meterName", label: "表计名称", width: 180 },
        { prop: "commaddress", label: "表通信地址", width: 180 },
        { prop: "hm", label: "入住用户", width: 220 },
        { prop: "starttime", label: "入住时间", width: 100 },
        { prop: "checkOutTime", label: "退租时间", width: 110 },
        { prop: "unitPriceNameEle", label: "电价", width: 90 },
        { prop: "unitPriceNameWat", label: "水价", width: 90 },
        { prop: "unitPriceNameGas", label: "燃气价", width: 90 },
        { prop: "installCapacity", label: "装机容量", width: 90 },
        { prop: "capacityPrice", label: "容量单价", width: 90 }
      ];
    }
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$refs.dataTable.loadData({
        regionid: this.dataForm.regionid,
        hm: this.dataForm.hm,
        areaName: this.dataForm.areaName,
        commaddress: this.dataForm.commaddress
      });
      this.$refs.dataTable.doLayout();
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row ? row.areaId : null);
      });
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.getDataList();
    },
    deleteHandle(row) {
      var ids = row
        ? [row.areaId]
        : this.dataListSelections.map(item => {
            return item.areaId;
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
        this.$http({
          url: this.$http.adornUrl("/pob/pobCommunityBuilding/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    changeHeight() {
      this.tbstyle.height = window.innerHeight - 242;
    }
  }
};
</script>

<style>
</style>