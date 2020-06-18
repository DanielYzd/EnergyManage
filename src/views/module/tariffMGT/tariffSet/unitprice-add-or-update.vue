<template>
  <el-dialog
  custom-class="dialogcommon"
    :title="!dataForm.priceid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      label-width="140px"
    >
      <region-select-item
        label="应用区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        prop="regionName"
      ></region-select-item>
      <el-form-item
        label="单价名称"
        prop="disc"
      >
        <el-input
          v-model="dataForm.disc"
          placeholder="单价名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="表计类型">
        <el-select
          v-model="dataForm.type"
          placeholder="CT"
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
      <el-form-item
        label="计价类型"
        prop="unitType"
      >
        <el-select
          v-model="dataForm.unitType"
          placeholder="请选择计价类型"
        >
          <el-option
            v-for="item in unitTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="单价"
        prop="dj"
        v-if="dataForm.unitType === 0 "
      >
        <el-input-number
          v-model="dataForm.dj"
          :precision="4"
          :step="0.01"
          :min="0.0001"
          :max="100"
          clearable
        ></el-input-number><label>{{priceUnit}}</label>
      </el-form-item>
      <template v-if="dataForm.unitType === 1 ">
        <el-form-item
          label="费率尖单价"
          prop="jDj"
        >
          <el-input-number
            v-model="dataForm.jDj"
            :precision="4"
            :step="0.01"
            :max="100"
            clearable
          ></el-input-number><label>{{priceUnit}}</label>
        </el-form-item>
        <el-form-item
          label="费率峰单价"
          prop="fDj"
        >
          <el-input-number
            v-model="dataForm.fDj"
            :precision="4"
            :step="0.01"
            :max="100"
            clearable
          ></el-input-number><label>{{priceUnit}}</label>
        </el-form-item>
        <el-form-item
          label="费率平单价"
          prop="pDj"
        >
          <el-input-number
            v-model="dataForm.pDj"
            :precision="4"
            :step="0.01"
            :max="100"
            clearable
          ></el-input-number><label>{{priceUnit}}</label>
        </el-form-item>
        <el-form-item
          label="费率谷单价"
          prop="gDj"
        >
          <el-input-number
            v-model="dataForm.gDj"
            :precision="4"
            :step="0.01"
            :max="100"
            clearable
          ></el-input-number><label>{{priceUnit}}</label>
        </el-form-item>
      </template>
      <el-form-item>
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
      unitTypeList: [{ value: 0, key: "单一价" }, { value: 1, key: "费率价" }],
      dataForm: {
        priceid: 0,
        disc: "",
        type: 0,
        unitType: 0,
        dj: 0.1,
        jDj: 0.1,
        fDj: 0.1,
        pDj: 0.1,
        gDj: 0.1,
        regionid: 0,
        regionName: ""
      },
      meterTypeList: this.$sysConfig.getMeterTypes(),
      dataRule: {
        disc: [
          { required: true, message: "必须填入单价名称", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 1 到 16 个字符", trigger: "blur" }
        ],
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
    priceUnit() {
      if (this.dataForm.type === 0 || this.dataForm.type === 3) {
        return " 元/千瓦时";
      } else if (this.dataForm.type === 1 || this.dataForm.type === 2) {
        return " 元/立方米";
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.priceid = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
      if (this.dataForm.priceid) {
        var vm = this;
        this.$http.ajaxGet(
          `/ppf/unitprice/info/${this.dataForm.priceid}`,
          {},
          res => {
            let data = res.data;
            vm.dataForm.disc = data.disc;
            vm.dataForm.type = data.type;
            vm.dataForm.unitType = data.unitType;
            vm.dataForm.regionid = data.regionId;
            vm.dataForm.regionName = data.regionName;
            vm.dataForm.dj = data.dj;
            vm.dataForm.jDj = data.jDj;
            vm.dataForm.fDj = data.fDj;
            vm.dataForm.pDj = data.pDj;
            vm.dataForm.gDj = data.gDj;
          }
        );
      }
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) {
          return;
        }
        var form = {
          priceid: this.dataForm.priceid,
          disc: this.dataForm.disc,
          type: this.dataForm.type,
          unitType: this.dataForm.unitType,
          regionId: this.dataForm.regionid,
          dj: this.dataForm.dj,
          jDj: this.dataForm.jDj,
          fDj: this.dataForm.fDj,
          pDj: this.dataForm.pDj,
          gDj: this.dataForm.gDj
        };
        this.$http.ajaxPost(
          `/ppf/unitprice/${!this.dataForm.priceid ? "save" : "update"}`,
          form,
          () => {
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