<template>
  <el-form-item
    :label="label"
    :prop="prop"
  >
    <el-popover
      ref="regionIdsPopover"
      placement="bottom-start"
      trigger="click"
    >
      <el-tree
        :data="regionList"
        :props="regionListTreeProps"
        node-key="id"
        ref="regionListTree"
        style="width:230px;max-height:500px;overflow-y:scroll;"
        @current-change="regionTreeCurrentChangeHandle"
        :default-expand-all="true"
        :highlight-current="true"
        :expand-on-click-node="false"
      >
      </el-tree>
    </el-popover>
    <el-input
      v-bind:value="value"
      class="formItem"
      clearable
      v-popover:regionIdsPopover
      :readonly="true"
      placeholder="点击选择能耗计量类型"
      @change="changeHandler"
    ></el-input>
  </el-form-item>
</template>

<script>
import globals from "@/utils/globals";
export default {
  name: "region-select",
  props: ["label", "value", "prop"],
  data() {
    return {
      regionList: [],
      regionListTreeProps: {
        value: "value",
        label: "label",
        children: "children"
      }
    };
  },
  activated() {
    //this.getDataList()
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 数据列表
    getDataList(callback) {
      this.regionList = globals.loopUsedTypeLevelList;
    },
    // 选中
    regionTreeCurrentChangeHandle(data, node) {
      this.$refs.regionIdsPopover.doClose();
      this.$cookie.set("regionid", data.id);
      this.$cookie.set("regionName", data.label);
      this.$emit("getRegion", data);
    },
    changeHandler(value) {
      if (!value) {
        this.$cookie.set("regionid", "");
        this.$cookie.set("regionName", "");
        this.$emit("getRegion", { id: 0, label: "" });
      }
    }
  }
};
</script>

<style>
</style>