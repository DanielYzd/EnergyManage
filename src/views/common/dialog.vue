<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="width"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      :show-close="showClose"
      center
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer" v-show="showFoot">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-show="!showFoot">
        <el-button type="primary" @click="close()">关闭</el-button>
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
    showClose: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '55%'
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
