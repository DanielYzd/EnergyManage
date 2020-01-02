<template>
  <div class="dialogcontentitem">
    <div>
      <el-tag size="small">建筑信息</el-tag>
      <el-row :gutter="20">
        <el-col :span="8">
          <span class="name">建筑编号：</span>
          <el-input size="mini" v-model="buildingcode" disabled></el-input>
        </el-col>
        <el-col :span="8">
          <span class="name">建筑名称：</span>
          <el-input size="mini" v-model="buildingname" disabled></el-input>
        </el-col>
        <el-col :span="8">
          <span class="name">建筑类型：</span>
          <el-input size="mini" v-model="archivetype" disabled></el-input>
        </el-col>
      </el-row>
      <el-tag size="small">分项信息</el-tag>
      <el-row :gutter="20">
        <el-col :span="8">
          <span class="name">分项类别：</span>
          <el-input size="mini" v-model="itemtype" disabled></el-input>
        </el-col>
        <el-col :span="8">
          <span class="name">分项名称：</span>
          <el-input size="mini" v-model="itemname" disabled></el-input>
        </el-col>
      </el-row>
      <el-tag size="small">能耗指标&nbsp;(单位:kWh)</el-tag>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-date-picker
            type="year"
            v-model="targetyear"
            placeholder="选择年"
            size="mini"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="name">1月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">2月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">3月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">4月：</span>
          <el-input size="mini"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="name">5月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">6月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">7月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">8月：</span>
          <el-input size="mini"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="name">9月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">10月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">11月：</span>
          <el-input size="mini"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="name">12月：</span>
          <el-input size="mini"></el-input>
        </el-col>
      </el-row>
      <!-- <el-tag size="small">计量公式</el-tag> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemrow: {
      type: Object
    }
  },
  data() {
    return {
      buildingcode: '',
      buildingname: '',
      archivetype: '',
      itemtype: '',
      itemname: '',
      targetyear: ''
    }
  },
  created() {
    console.log(this.itemrow)
    this.queryenergyitem()
  },
  methods: {
    queryenergyitem() {
      let body = {
        id: this.itemrow.id
      }
      this.$api.building.queryenergyitem(body).then(res => {
        if (res.code === 0) {
          this.buildingcode = res.data.buildingcode
          this.buildingname = res.data.buildingname
          this.itemtype = res.data.itemtype
          this.itemname = res.data.itemname
          this.archivetype = res.data.archivetype
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogcontentitem {
  .el-col {
    display: flex;
    align-content: center;
    padding: 10px 0;
    .name {
      width: 100px;
      line-height: 28px;
    }
  }
}
</style>
