<template>
  <el-dialog
  custom-class="dialogcommon"
    :title="!dataForm.areaId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :inline="true"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      label-width="140px"
      label-position="right"
    >
      <region-select-item
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        prop="regionName"
      ></region-select-item>
      <el-form-item
        label="房间名称"
        prop="areaName"
        required
      >
        <el-input
          v-model="dataForm.areaName"
          placeholder="门牌号或商铺号"
          clearable
          class="form-item"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="楼层"
        prop="floor"
      >
        <el-input-number
          v-model="dataForm.floor"
          :max="100"
          class="form-item"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="面积"
        prop="area"
      >
        <el-input-number
          v-model="dataForm.area"
          :precision="2"
          :step="0.01"
          :max="10000"
          class="form-item"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="电价"
        prop="unitPriceEle"
      >
        <el-select
          v-model="dataForm.unitPriceEle"
          placeholder="请选择电价"
          class="form-item"
        >
          <el-option
            v-for="item in eleUnitPriceList"
            :key="item.priceid"
            :label="item.disc"
            :value="item.priceid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="水价"
        prop="unitPriceWat"
      >
        <el-select
          v-model="dataForm.unitPriceWat"
          placeholder="请选择水价"
          class="form-item"
        >
          <el-option
            v-for="item in watUnitPriceList"
            :key="item.priceid"
            :label="item.disc"
            :value="item.priceid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="入住客户"
        prop="customerid"
      >
        <el-select
          v-model="dataForm.customerid"
          placeholder="请选择客户"
          class="form-item"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in customeridList"
            :key="item.customerid"
            :label="item.disc"
            :value="item.customerid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="入住日期"
        prop="starttime"
      >
        <el-date-picker
          v-model="dataForm.starttime"
          type="date"
          value="yyyy-MM-dd"
          placeholder="开户日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="退租日期"
        prop="checkOutTime"
      >
        <el-date-picker
          v-model="dataForm.checkOutTime"
          value-format="yyyy-MM-dd"
          align="right"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="装机容量"
        prop="installCapacity"
      >
        <el-input-number
          v-model="dataForm.installCapacity"
          :precision="2"
          :step="1"
          :max="10000"
          class="form-item"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="装机容量价"
        prop="capacityPriceid"
      >
        <el-select
          v-model="dataForm.capacityPriceid"
          placeholder="请选择装机容量价"
          class="form-item"
        >
          <el-option
            v-for="item in capacityPriceList"
            :key="item.id"
            :label="item.disc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item style="margin-left: 140px;">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dataFormSubmit()"
        >确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import regionSelect from "@/views/modules/pob/region-select";
import tool from "@/utils/tool";
export default {
  data() {
    return {
      visible: false,
      schemeidList: [
        { schemeid: 2, disc: "每天" },
        { schemeid: 3, disc: "每月1号" },
        { schemeid: 6, disc: "每月6号" }
      ],
      calcModeList: [
        { calcMode: 0, disc: "抄读用量计费" },
        { schemeid: 1, disc: "抄读加分摊计费" }
      ],
      ppfStatusList: [
        { ppfstatus: 0, disc: "预付费" },
        { ppfstatus: 1, disc: "后付费" }
      ],
      unitPriceList: [],
      customeridList: [],
      dataForm: {
        areaId: 0,
        area: "",
        floor: 1,
        areaName: "",
        regionid: 0,
        regionName: "",
        customerid: "",
        calcMode: 0,
        unitPriceEle: null,
        unitPriceWat: null,
        unitPriceGas: null,
        starttime: tool.formatDate(new Date(), "yyyy-MM-dd"),
        checkOutTime: null,
        autoControl: false,
        ppfstatus: 0,
        khje: 0,
        tzje: -10,
        bjje: 0,
        jszq: 2,
        installCapacity: 0,
        capacityPriceid: null
      },
      capacityPriceList: [],
      dataRule: {
        regionName: [
          { required: true, message: "所属区域不能为空", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "房间名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    "region-select-item": regionSelect
  },
  computed: {
    eleUnitPriceList() {
      let priceList = this.unitPriceList.filter(item => {
        return item.type === 0;
      });
      this.dataForm.unitPriceEle =
        priceList.length > 0 ? priceList[0].priceid : null;
      return priceList;
    },
    watUnitPriceList() {
      let priceList = this.unitPriceList.filter(item => {
        return item.type === 1;
      });
      this.dataForm.unitPriceWat =
        priceList.length > 0 ? priceList[0].priceid : null;
      return priceList;
    }
  },
  methods: {
    init(id) {
      this.dataForm.areaId = id || 0;
      this.setInitData();
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
      this.$http.ajaxGet(
        "/ppf/unitprice/list/",
        {
          regionid: this.dataForm.regionid ? this.dataForm.regionid : ""
        },
        res => {
          this.unitPriceList = res.list;
        }
      );
      this.$http.ajaxGet(
        "/dcs/capacity/list/",
        { regionid: this.dataForm.regionid ? this.dataForm.regionid : "" },
        res => {
          this.capacityPriceList = res.list;
        }
      );
      if (this.dataForm.areaId) {
        this.$http({
          url: this.$http.adornUrl(
            `/pob/pobCommunityBuilding/info/${this.dataForm.areaId}`
          ),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.regionName = data.communityBuilding.regionName;
            this.dataForm.regionid = data.communityBuilding.parentId;
            this.dataForm.areaId = data.communityBuilding.areaId;
            this.dataForm.areaName = data.communityBuilding.areaName;
            this.dataForm.floor = data.communityBuilding.floor;
            this.dataForm.area = data.communityBuilding.area;
            this.dataForm.customerid = data.communityBuilding.customerid;
            this.queryCustomer();
            this.dataForm.starttime = data.communityBuilding.starttime;
            this.dataForm.checkOutTime = data.communityBuilding.checkOutTime;
            this.dataForm.unitPriceEle = data.communityBuilding.unitPriceEle;
            this.dataForm.unitPriceWat = data.communityBuilding.unitPriceWat;
            this.dataForm.unitPriceHot = data.communityBuilding.unitPriceHot;
            this.dataForm.installCapacity =
              data.communityBuilding.installCapacity;
            this.dataForm.capacityPriceid =
              data.communityBuilding.capacityPriceid;
          }
        });
      } else {
        this.$nextTick(() => {
          this.getSelectRegion({
            id: this.$cookie.get("regionid"),
            label: this.$cookie.get("regionName")
          });
          this.queryCustomer();
        });
      }
    },
    setInitData() {
      this.dataForm.areaName = "";
      this.dataForm.regionid = 0;
      this.dataForm.regionName = "";
      this.dataForm.area = "";
      this.dataForm.customerid = "";
      this.dataForm.calcMode = 0;
      this.dataForm.ppfstatus = 0;
      this.dataForm.starttime = tool.formatDate(
        new Date(),
        "yyyy-MM-dd 00:00:00"
      );
      this.dataForm.checkOutTime = "";
      this.dataForm.autoControl = false;
      this.dataForm.khje = 0;
      this.dataForm.tzje = 0;
      this.dataForm.bjje = 0;
      this.dataForm.unitPriceEle = null;
      this.dataForm.unitPriceWat = null;
      this.dataForm.unitPriceGas = null;
      this.dataForm.jszq = 2;
      this.dataForm.installCapacity = "";
    },
    remoteMethod(query) {
      setTimeout(() => {
        this.queryCustomer(query);
      }, 100);
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.queryCustomer();
    },
    saveCheckCustomer() {
      if (!this.dataForm.customerid) {
        this.saveCheckCustomerSelect(false);
        return;
      }
      this.$http.ajaxGet(
        "/pob/customer/simpleList",
        { customerid: this.dataForm.customerid },
        data => {
          let customerList = data.page.list;
          this.saveCheckCustomerSelect(customerList.length == 1);
        }
      );
    },
    saveCheckCustomerSelect(inValidCustomer) {
      if (!inValidCustomer) {
        this.$confirm(
          "入住客户信息没正确设置，将不会保存入住时间和入住客户，是否继续保存？",
          "继续保存",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true,
            type: "warning"
          }
        ).then(() => {
          this.saveAction();
        });
      } else {
        this.saveAction();
      }
    },
    queryCustomer(query) {
      var param = {
        page: 1,
        limit: 200,
        customerid: this.dataForm.customerid ? this.dataForm.customerid : null,
        hm: query ? query : null,
        regionid: this.dataForm.areaId ? this.dataForm.regionid : null
      };
      this.$http.ajaxGet("/pob/customer/simpleList", param, data => {
        this.customeridList = data.page.list;
      });
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.saveCheckCustomer();
        }
      });
    },
    saveAction() {
      this.$http({
        url: this.$http.adornUrl(
          `/pob/pobCommunityBuilding/${
            !this.dataForm.areaId ? "save" : "update"
          }`
        ),
        method: "post",
        data: this.$http.adornData({
          areaId: this.dataForm.areaId || undefined,
          parentId: this.dataForm.regionid,
          areaName: this.dataForm.areaName,
          floor: this.dataForm.floor,
          area: this.dataForm.area,
          customerid: this.dataForm.customerid,
          calcMode: this.dataForm.calcMode,
          unitPriceEle: this.dataForm.unitPriceEle,
          unitPriceWat: this.dataForm.unitPriceWat,
          unitPriceGas: this.dataForm.unitPriceGas,
          starttime: this.dataForm.starttime,
          checkOutTime: this.dataForm.checkOutTime,
          autoControl: this.dataForm.autoControl ? 0 : 1,
          ppfstatus: this.dataForm.ppfstatus,
          khje: this.dataForm.khje,
          tzje: this.dataForm.tzje,
          bjje: this.dataForm.bjje,
          jszq: this.dataForm.jszq,
          installCapacity: this.dataForm.installCapacity,
          capacityPriceid: this.dataForm.capacityPriceid
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>
<style>
.form-item {
  width: 220px;
}
</style>