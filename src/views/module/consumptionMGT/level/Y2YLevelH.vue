<template>
  <div
    class="view"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="ruleForm" :inline="true">
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
        <el-form-item>
          <el-select v-model="dimension" size="mini" style="width:80px;">
            <el-option value="2" label="日"></el-option>
            <el-option value="3" label="月"></el-option>
            <el-option value="4" label="年"></el-option>
          </el-select>
          <el-date-picker
            size="mini"
            v-model="time"
            style="width:150px"
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
            style="width:150px"
            type="month"
            value-format="yyyyMM"
            placeholder="选择月"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            value-format="yyyy"
            style="width:150px"
            v-else-if="dimension === '4'"
            v-model="time"
            type="year"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <el-select
            v-if="dimension !== '2'"
            v-model="compare"
            size="mini"
            style="width:110px;"
          >
            <el-option label="同比" value="1"></el-option>
            <el-option label="环比" value="2"></el-option>
          </el-select> -->
          <el-select v-model="compare" size="mini" style="width:110px;">
            <el-option
              label="同比"
              v-if="dimension !== '2'"
              value="1"
            ></el-option>
            <el-option
              label="上月本日"
              v-if="dimension === '2'"
              value="1"
            ></el-option>
            <el-option
              label="上年本日"
              v-if="dimension === '2'"
              value="3"
            ></el-option>
            <el-option label="环比" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            size="mini"
            style="width:150px;"
            disabled
            v-model="comparetime"
            v-if="dimension === '2'"
            value-format="yyyyMMdd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            style="width:150px;"
            disabled
            v-model="comparetime"
            v-if="dimension === '3'"
            value-format="yyyyMM"
            type="month"
            placeholder="选择月份"
          >
          </el-date-picker>
          <el-date-picker
            size="mini"
            value-format="yyyy"
            disabled
            style="width:150px"
            v-else-if="dimension === '4'"
            v-model="comparetime"
            type="year"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>

        <el-button
          icon="el-icon-search"
          size="mini"
          @click="handle"
          type="primary"
        >
          查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="content">
      <RegionTree class="tree" @nodeClick="nodeClick"></RegionTree>
      <div class="contenttable"></div>
    </div>
  </div>
</template>

<script>
import RegionTree from '@/views/common/RegionTree'
export default {
  components: {
    RegionTree
  },
  data() {
    return {
      loading: false,
      regionid: this.$cookie.get('regionid'),
      regionName: this.$cookie.get('regionName'),
      dimension: '3',
      time: this.$moment().format('YYYYMM'),
      type: '0',
      comparetime: '',
      compare: '1'
    }
  },
  computed: {},
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
      console.log(body)
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    nodeClick(data) {
      console.log(data)
      this.regionid = data.id
      this.handle()
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-divider--horizontal {
    margin: 0;
  }
  .content {
    margin-top: 10px;
    height: calc(100% - 64px);
    display: flex;
    .tree {
      width: 350px;
    }
    .contenttable {
      overflow: auto;
      flex: 1;
      margin-top: -20px;
    }
  }
}
</style>
