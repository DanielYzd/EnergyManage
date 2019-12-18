<template>
  <el-form ref="form" :model="form" :label-width="labelWidth" :inline="inline">
    <el-form-item :label="item.label" v-for="(item, index) in formLabel" :key="index">
      <el-input v-model="form[item.key]" v-if="item.type === 'input'"></el-input>
      <el-select v-model="form[item.key]" placeholder="请选择活动区域" v-if="item.type === 'select'">
        <el-option v-for="(subitem, index) in item.options" :key="index" :label="subitem.label" :value="subitem.value"></el-option>
      </el-select>
      <el-date-picker v-if="item.type === 'date-picker'" type="date" placeholder="选择日期" v-model="form[item.key]" style="width: 100%;"></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: Object,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: {}
    },
    formLabel: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="scss" scoped></style>
