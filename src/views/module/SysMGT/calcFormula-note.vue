<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    //this.init();
  },
  methods: {
    init() {
      this.$notify.info({
        title: "计算系数说明",
        dangerouslyUseHTMLString: true,
        position: "bottom-right",
        duration: 0,
        message:
          "<ul style='padding:0  '><strong><li>按抄见电量分摊</strong>：单户抄见电量 / 所有户抄见电量</li>" +
          "<strong><li>按楼栋面积分摊</strong>：单户有效面积 / 所有有效面积;<br>有效面积 = (入住天数 / 当月总天数)*房间面积</li>" +
          "<strong><li>按楼层面积分摊</strong>：(单户面积 / 楼层面积)*(楼层/总楼层)<br></li>" +
          "<strong><li>按汇总电量分摊</strong>：单户（抄见电量 + 公共分摊 + 电梯分摊) / 所有户(抄见电量 + 公共分摊 + 电梯分摊)</li></ul>"
      });
    }
  }
};
</script>

<style>
</style>