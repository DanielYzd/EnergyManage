<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8">
        <Info></Info>
      </el-col>
      <el-col :span="8">
        <Calendar></Calendar>
      </el-col>
      <el-col :span="8">
        <SubItem></SubItem>
      </el-col>
    </el-row>
    <div class="bottomcontent">
      <el-row :gutter="20" style="height:100%">
        <el-col :span="12" style="height:100%">
          <ClassIfication></ClassIfication>
        </el-col>
        <el-col :span="12" style="height:100%">
          <Vertical></Vertical>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Info from './homeComponents/EnterpriseInformation'
import Calendar from './homeComponents/Calendar'
import SubItem from './homeComponents/SubItem'
import ClassIfication from './homeComponents/Cassification'
import Vertical from './homeComponents/Vertical'
export default {
  components: {
    Info,
    Calendar,
    SubItem,
    ClassIfication,
    Vertical
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  .bottomcontent {
    flex: 1;
    // padding: 10px;
    margin-top: 10px;
  }
}
</style>
