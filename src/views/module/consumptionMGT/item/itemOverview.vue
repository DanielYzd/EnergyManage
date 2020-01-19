<template>
  <div
    class="overview"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" ref="ruleForm" style="height:50px;">
      <el-form-item>
        <RegionSelect
          :size="'mini'"
          v-model="regionName"
          @getRegion="getSelectRegion"
        ></RegionSelect>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dimension" size="mini" style="width:80px;">
          <el-option value="2" label="日"></el-option>
          <el-option value="3" label="月"></el-option>
          <el-option value="4" label="年"></el-option>
        </el-select>
        <el-date-picker
          size="mini"
          v-model="time"
          v-if="dimension === '2'"
          value-format="yyyyMMdd"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-date-picker
          size="mini"
          v-else-if="dimension === '3'"
          v-model="time"
          type="month"
          value-format="yyyyMM"
          placeholder="选择月"
        >
        </el-date-picker>
        <el-date-picker
          size="mini"
          value-format="yyyy"
          v-else-if="dimension === '4'"
          v-model="time"
          type="year"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="mini"
          @click="handle"
          >刷新</el-button
        >
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="content">
      <div class="left">
        <l-home ref="lhome"></l-home>
      </div>
      <div class="right">
        <r-home ref="rhome"></r-home>
      </div>
    </div>
  </div>
</template>

<script>
import LHome from './components/LHome'
import RHome from './components/RHome'
// import RegionTree from '@/views/common/RegionTree'
import RegionSelect from '@/views/modules/pob/region-select'
export default {
  components: {
    RegionSelect,
    LHome,
    RHome
  },
  data() {
    return {
      loading: false,
      regionid: this.$cookie.get('regionid'),
      regionName: this.$cookie.get('regionName'),
      dimension: '3',
      time: this.$moment().format('YYYYMM')
    }
  },
  watch: {
    dimension(newValue, oldValue) {
      switch (newValue) {
        case '2':
          this.time = this.$moment().format('YYYYMMDD')

          break
        case '3':
          this.time = this.$moment().format('YYYYMM')

          break
        case '4':
          this.time = this.$moment().format('YYYY')

          break
      }
    },
    time(newValue, oldValue) {
      this.handle()
    }
  },
  created() {
    this.$nextTick(() => {
      this.handle()
    })
  },
  methods: {
    getSelectRegion(data) {
      this.regionid = data.id
      this.regionName = data.label
      this.handle()
      //   this.getDataList()
    },
    handle() {
      this.loading = true
      let body = {
        deptId: this.regionid,
        time: this.time,
        dimension: this.dimension
      }
      console.log(body)
      this.$refs.lhome.itemyoy(body)
      this.$refs.rhome.itemtime(body)
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.overview {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-divider--horizontal {
    margin: 0;
  }
  .content {
    height: calc(100% - 51px);
    display: flex;
    .left {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      .top {
        margin-top: 10px;
        flex: 1;
      }
      .bottom {
        flex: 1;
        margin-top: 10px;
      }
    }
    .right {
      flex: 2;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
