<template>
  <div>
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
  </div>
</template>

<script>
// import RegionSelect from '@/views/common/RegionSelect'
import RegionSelect from '@/views/modules/pob/region-select'
export default {
  components: {
    RegionSelect
  },
  data() {
    return {
      regionid: this.$cookie.get('regionid'),
      regionName: this.$cookie.get('regionName'),
      dimension: '3',
      time: this.$moment().format('YYYYMM'),
      type: '0'
    }
  },
  created() {},
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
      console.log(this.time)
      //   console.log(this.dimension)
      //   console.log(this.regionid)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}
</style>
