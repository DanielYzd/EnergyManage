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
          <el-input size="mini" v-model="slabel" disabled></el-input>
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
            value-format="yyyy"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[0].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[0].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[1].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[1].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[2].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[2].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[3].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[3].targetvalue"
          ></el-input-number>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[4].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[4].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[5].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[5].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[6].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[6].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[7].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[7].targetvalue"
          ></el-input-number>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[8].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[8].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[9].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[9].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[10].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[10].targetvalue"
          ></el-input-number>
        </el-col>
        <el-col :span="6">
          <span class="name">{{ ItemTargetList[11].targetmonth }}月：</span>
          <el-input-number
            size="mini"
            v-model="ItemTargetList[11].targetvalue"
          ></el-input-number>
        </el-col>
      </el-row>
      <!-- <el-tag size="small">计量公式</el-tag> -->
      <el-row style="display:flex;flex-direction:row-reverse">
        <el-button type="primary" size="mini" @click="confirm">确定</el-button>
        &nbsp;&nbsp;
        <el-button size="mini" @click="cancle">取消</el-button>
      </el-row>
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
      slabel: '',
      itemtype: '',
      itemname: '',
      targetyear: '2020',
      ItemTargetList: [
        {
          targetmonth: '1',
          targetvalue: 0
        },
        {
          targetmonth: '2',
          targetvalue: 0
        },
        {
          targetmonth: '3',
          targetvalue: 0
        },
        {
          targetmonth: '4',
          targetvalue: 0
        },
        {
          targetmonth: '5',
          targetvalue: 0
        },
        {
          targetmonth: '6',
          targetvalue: 0
        },
        {
          targetmonth: '7',
          targetvalue: 0
        },
        {
          targetmonth: '8',
          targetvalue: 0
        },
        {
          targetmonth: '9',
          targetvalue: 0
        },
        {
          targetmonth: '10',
          targetvalue: 0
        },
        {
          targetmonth: '11',
          targetvalue: 0
        },
        {
          targetmonth: '12',
          targetvalue: 0
        }
      ]
    }
  },
  created() {
    console.log(this.itemrow)
    this.queryenergyitem()
    this.queryenergyitemtarget()
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
          this.slabel = res.data.slabel
        }
      })
    },
    //查询能耗指标数据
    queryenergyitemtarget() {
      let body = {
        id: this.itemrow.id,
        archivetype: this.itemrow.archivetype,
        targetyear: this.targetyear
      }
      this.$api.building.queryenergyitemtarget(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.ItemTargetList = res.data
            this.targetyear = res.data[0].targetyear
          }
        }
      })
    },
    confirm() {
      console.log(this.ItemTargetList)
      let itemtagert = {
        archiveid: this.itemrow.id,
        archivetype: this.itemrow.archivetype,
        buildingid: this.itemrow.buildingid,
        energytype: 0,
        targetyear: this.targetyear
      }
      let body = {
        ItemTargetList: this.ItemTargetList,
        itemtagert
      }
      this.$emit('contentConfirm', body)
    },
    cancle() {
      this.$emit('contentCancle')
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
