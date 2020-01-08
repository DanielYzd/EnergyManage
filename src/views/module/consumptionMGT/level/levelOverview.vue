<template>
  <div
    class="overview"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="ruleForm" :inline="true">
      <el-form-item>
        <region-select
          :size="'mini'"
          v-model="regionName"
          @getRegion="getSelectRegion"
        ></region-select>
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
        <el-select
          v-model="type"
          size="mini"
          @change="handle"
          style="width:80px;"
        >
          <el-option label="综合" value="0"></el-option>
          <el-option label="电" value="88"></el-option>
          <el-option label="水" value="89"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="handle" type="primary"> 刷新</el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="content">
      <div class="left">
        <div class="top">
          <Proportion ref="proportion"></Proportion>
        </div>
        <div class="bottom">
          <Summaryuse ref="summaryuse"></Summaryuse>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <Summarytime ref="summarytime"></Summarytime>
        </div>
        <div class="bottom">
          <Summaryusetime ref="summaryusetime"></Summaryusetime>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import RegionSelect from '@/views/common/RegionSelect'
import RegionSelect from '@/views/modules/pob/region-select'
import Proportion from './components/proportion'
import Summarytime from './components/summarytime'
import Summaryuse from './components/summaryuse'
import Summaryusetime from './components/summaryusetime'
export default {
  components: {
    RegionSelect,
    Proportion,
    Summarytime,
    Summaryuse,
    Summaryusetime
  },
  data() {
    return {
      loading: false,
      regionid: this.$cookie.get('regionid'),
      regionName: this.$cookie.get('regionName'),
      dimension: '3',
      time: this.$moment().format('YYYYMM'),
      type: '0'
    }
  },
  created() {
    this.$nextTick(() => {
      this.handle()
    })
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
        dimension: this.dimension,
        type: this.type
      }
      this.$refs.proportion.proportion(body)
      this.$refs.summarytime.summarytime(body)
      this.$refs.summaryuse.summaryuse(body)
      this.$refs.summaryusetime.summaryusetime(body)
      setTimeout(() => {
        this.loading = false
      }, 500)
      //   console.log(this.time)
      //   console.log(this.dimension)
      //   console.log(this.regionid)
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
    height: calc(100% - 64px);
    display: flex;
    .left {
      flex: 1;
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
      .top {
        margin-top: 10px;
        flex: 1;
      }
      .bottom {
        flex: 1;
        margin-top: 10px;
      }
    }
  }
}
</style>
