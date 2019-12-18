<template>
  <el-form-item
    :label="label"
    :prop="prop"
  >
    <el-select
      v-bind:value="value"
      :placeholder="label"
      :style="tbstyle"
      @change="selectHandler"
    >
      <el-option
        v-for="item in circleList"
        :key="item.circleId"
        :label="item.circleName"
        :value="item.circleId"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    prop: {
      type: String,
      required: false
    },
    tbstyle: {
      type: String,
      default: function() {
        return "width :100%";
      }
    }
  },
  data() {
    return {
      circleList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$http.ajaxGet("/pob/region/regionConfig/use/list", {}, res => {
        this.circleList = res.list;
        if (this.circleList.length > 0) {
          this.selectHandler(this.circleList[0].circleId);
        }
      });
    },
    selectHandler(value) {
      this.$emit("getSelected", value);
    }
  }
};
</script>

<style>
</style>