<template>
  <el-popover
    placement="right"
    width="400"
    trigger="manual"
    v-model="visible"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
      labelWidth="90px"
    >
      <template v-if="comparenType === 'onlyDayBetween'">
        <el-form-item label="时段">
          <el-date-picker
            v-model="dataForm.datatime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width:240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '00:00:00']"
          ></el-date-picker>
        </el-form-item>
      </template>
      <template v-if="comparenType === 'onlyYear'||comparenType === 'onlyQuarter'">
        <el-form-item label="本期年份">
          <el-select
            v-model="dataForm.thisYear"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="comparenType === 'day'">
        <el-form-item label="本期时段">
          <el-date-picker
            v-model="dataForm.datatime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width:240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '00:00:00']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="同比年份">
          <el-select
            v-model="dataForm.dayCompareYear"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="comparenType === 'dayCompareMonth'">
        <el-form-item label="本期月份">
          <el-date-picker
            v-model="monthValue"
            type="month"
            value-format="yyyy-MM"
            format="yyyy-MM"
            style="width:240px"
          ></el-date-picker>
        </el-form-item>
      </template>

      <template v-if="comparenType === 'month' ||comparenType === 'quarter'  ||comparenType === 'quarterPie'">
        <el-form-item label="本期年份">
          <el-select
            v-model="dataForm.thisYear"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同比年份">
          <el-select
            v-model="dataForm.compareYear"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <br>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >确定</el-button>
        <el-button @click="onCannel">取消</el-button>
      </el-form-item>
    </el-form>
    <span
      slot="reference"
      @click="setQueryDate"
    ><i class="el-icon-edit"></i></span>
  </el-popover>
</template>

<script>
import tool from "@/utils/tool";
export default {
  props: {
    comparenType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      yearOptions: ["2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      monthValue: tool.formatDate(new Date(), "yyyy-MM"),
      dataForm: {
        yearValue: ["2019", "2018"],
        dayCompareYear: "2018",
        datatime: [
          tool.formatDate(tool.addDay(new Date(), -15), "yyyy-MM-dd"),
          tool.formatDate(new Date(), "yyyy-MM-dd")
        ],
        datatime2: [
          tool.formatDate(
            tool.addMonth(tool.addDay(new Date(), -15), -12),
            "yyyy-MM-dd"
          ),
          tool.formatDate(tool.addMonth(new Date(), -12), "yyyy-MM-dd")
        ],
        thisYear: tool.formatDate(new Date(), "yyyy"),
        compareYear: tool.formatDate(tool.addMonth(new Date(), -12), "yyyy")
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    setQueryDate() {
      this.visible = !this.visible;
    },
    onSubmit() {
      let comparenType = this.comparenType;
      let param = null;
      if (comparenType === "day") {
        param = this.createDayCompareYearParams();
      } else if (comparenType === "dayCompareMonth") {
        param = this.createDayCompareMonthParams();
      } else if (comparenType === "month") {
        param = this.createMonthCompareParams();
      } else if (comparenType === "quarter") {
        param = this.createQuarterCompareParams();
      } else if (comparenType === "quarterPie") {
        param = this.createQuarterPieCompareParams();
      } else if (comparenType === "onlyDayBetween") {
        param = this.createOnlyDayBetweenCompareParams();
      } else if (comparenType === "onlyYear") {
        param = this.createOnlyYearParams();
      } else if (comparenType === "onlyQuarter") {
        param = this.createOnlyQuarterParams();
      }
      this.$emit("callback", param);
      this.visible = false;
    },
    createDayCompareYearParams() {
      let thisDates = this.dataForm.datatime;
      let compareDates = [
        this.dataForm.dayCompareYear + thisDates[0].substr(4),
        this.dataForm.dayCompareYear + thisDates[1].substr(4)
      ];
      return {
        thisDates: thisDates,
        compareDates: compareDates,
        comparenType: "day"
      };
    },
    createDayCompareMonthParams() {
      let compareVal = this.monthValue;
      let thisStartDateStr = compareVal + "-01";
      let thisStartDate = new Date(
        compareVal.substring(0, 4),
        compareVal.substring(5, 7) - 1,
        1,
        0,
        0,
        0
      );
      let thisEndDateStr = tool.formatDate(
        tool.addDay(tool.addMonth(thisStartDate, 1), -1),
        "yyyy-MM-dd"
      );
      let compareStartDate = tool.addMonth(thisStartDate, -1);
      let compareEndDate = tool.addDay(thisStartDate, -1);
      let thisDates = [thisStartDateStr, thisEndDateStr];
      let compareDates = [
        tool.formatDate(compareStartDate, "yyyy-MM-dd"),
        tool.formatDate(compareEndDate, "yyyy-MM-dd")
      ];
      return {
        thisDates: thisDates,
        compareDates: compareDates,
        comparenType: "dayCompareMonth"
      };
    },
    createMonthCompareParams() {
      return {
        thisYear: this.dataForm.thisYear,
        compareYear: this.dataForm.compareYear,
        comparenType: "month"
      };
    },
    createQuarterCompareParams() {
      return {
        thisYear: this.dataForm.thisYear,
        compareYear: this.dataForm.compareYear,
        comparenType: "quarter"
      };
    },
    createQuarterPieCompareParams() {
      return {
        thisYear: this.dataForm.thisYear,
        compareYear: this.dataForm.compareYear,
        comparenType: "quarterPie"
      };
    },
    createOnlyDayBetweenCompareParams() {
      let thisDates = this.dataForm.datatime;
      return {
        thisDates: thisDates,
        comparenType: "onlyDayBetween"
      };
    },
    createOnlyYearParams() {
      return {
        thisYear: this.dataForm.thisYear,
        comparenType: "onlyYear"
      };
    },
    createOnlyQuarterParams() {
      return {
        thisYear: this.dataForm.thisYear,
        comparenType: "onlyQuarter"
      };
    },
    onCannel() {
      this.visible = false;
    }
  }
};
</script>

<style>
</style>