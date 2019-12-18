<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="55%"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      :show-close="false"
      center
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer" v-show="showFoot">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
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
    }
  },
  methods: {
    cancle() {
      this.$emit('cancle')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped></style>
