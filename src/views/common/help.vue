<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="计量标志(分项能耗)"
        name="1"
      >
        <p>参考<el-link
            type="primary"
            href="https://wenku.baidu.com/view/cf1c73fb0129bd64783e0912a216147916117e76.html"
            target="_blank"
          >《浙江省公共建筑用电分项计量系统设计标准》</el-link>用电分成4个能耗子项。能耗子项下分别是总表和分表。能耗子项等于下面总表电量之和。<br>
          照明插座用电 = ∑母线照明总表 + ∑公共区域照明总表 ;
          母线照明总表 = ∑房间计量表<br>
          在计算公式中分别定义照明插座用电、空调用电、动力设备用电、特殊用电的计算公式。
        </p>
        <el-cascader-panel
          :show-all-levels="true"
          :props="{ expandTrigger: 'hover' }"
          :options="loopUsedTypeList2"
          clearable
        ></el-cascader-panel>
      </el-collapse-item>
      <el-collapse-item
        title="分摊系数"
        name="2"
      >
        <div>
          <ul style='padding:0  '>
            <li><strong>按抄见电量分摊
              </strong>：单户抄见电量 / 所有户抄见电量</li>
            <li><strong>按楼栋面积分摊
              </strong>：单户有效面积 / 所有有效面积;<br>有效面积 = (入住天数 / 当月总天数)*房间面积</li>
            <li><strong>按楼层面积分摊
              </strong>：(单户面积 / 楼层面积)*(楼层/总楼层)<br></li>
            <li><strong>按汇总电量分摊
              </strong>：单户（抄见电量 + 公共分摊 + 电梯分摊) / 所有户(抄见电量 + 公共分摊 + 电梯分摊)</li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import globals from "@/utils/globals";
export default {
  data() {
    return {
      activeNames: ["1", "2"],
      loopUsedTypeList2: globals.loopUsedTypeLevelList
    };
  },
  methods: {}
};
</script>
<style>
</style>