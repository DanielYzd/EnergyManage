<template>
  <el-dialog
    title="批量设置区域下计费单价"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      :inline="true"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      label-width="140px"
    >
      <el-form-item>
        <el-alert
          title="提示：该操作会把区域下的所有房间设置成该单价。若只选择电价，不选择水价，则只更新区域下电价；只选择水价，则只更新区域下水价。"
          type="warning"
        >
        </el-alert>
      </el-form-item>
      <region-select-item
        label="应用区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        prop="regionName"
      ></region-select-item>

      <el-form-item
        label="电价"
        prop="unitPriceEle"
      >
        <el-select
          v-model="dataForm.unitPriceEle"
          placeholder="请选择电价"
          class="formItem"
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
          class="formItem"
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
        label="燃气价"
        prop="unitPriceGas"
      >
        <el-select
          v-model="dataForm.unitPriceGas"
          placeholder="请选择燃气价"
          class="formItem"
        >
          <el-option
            v-for="item in gasUnitPriceList"
            :key="item.priceid"
            :label="item.disc"
            :value="item.priceid"
          ></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item style="margin-left:40px;">
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
export default {
  data() {
    return {
      visible: false,
      unitPriceList: [],
      dataForm: {
        unitPriceEle: 0,
        unitPriceWat: 0,
        unitPriceGas: 0,
        regionid: 0,
        regionName: ""
      },
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataRule: {
        regionName: [
          { required: true, message: "所属区域不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    "region-select-item": regionSelect
  },
  computed: {
    eleUnitPriceList() {
      return this.unitPriceList.filter(item => {
        return item.type === 0;
      });
    },
    watUnitPriceList() {
      return this.unitPriceList.filter(item => {
        return item.type === 1;
      });
    },
    gasUnitPriceList() {
      return this.unitPriceList.filter(item => {
        return item.type === 2;
      });
    }
  },
  methods: {
    init(id) {
      this.dataForm.priceid = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
      this.loadUnitPrice();
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
    },
    loadUnitPrice() {
      this.dataForm.unitPriceEle = null;
      this.dataForm.unitPriceWat = null;
      this.dataForm.unitPriceGas = null;
      this.$http.ajaxGet(
        "/ppf/unitprice/list/",
        {
          regionid: 0
        },
        res => {
          this.unitPriceList = res.list;
        }
      );
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) {
          return;
        }
        if (!this.dataForm.unitPriceEle && !this.dataForm.unitPriceWat) {
          this.$message.warning("电价、水价、燃气价，至少选择一个。");
          return;
        }
        var form = {
          unitPriceEle: this.dataForm.unitPriceEle,
          unitPriceWat: this.dataForm.unitPriceWat,
          unitPriceGas: this.dataForm.unitPriceGas,
          regionId: this.dataForm.regionid
        };
        this.$http.ajaxPost(
          "/ppf/unitprice/updateUseRegion",
          form,
          res => {
            this.$message.success("保存成功");
            this.visible = false;
            this.$emit("refreshDataList");
          },
          () => {
            this.$message.error("保存失败");
          }
        );
      });
    }
  }
};
</script>
<style>
</style>