<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="width"
      :top="top"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      :show-close="showClose"
      :center="center"
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer" v-show="showFoot">
        <el-button size="mini" @click="cancle()">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirm()"
          >确 定</el-button
        >
      </span>
      <span
        slot="footer"
        class="dialog-footer"
        v-show="!showFoot && showFootClose"
      >
        <el-button type="primary" size="mini" @click="close()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    showFoot: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '15vh'
    },
    width: {
      type: String,
      default: '55%'
    },
    showFootClose: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancle() {
      this.$emit('cancle')
    },
    confirm() {
      this.$emit('confirm')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
