<template>
  <div class="dialogcontenttype">
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
    <el-tag size="small">分类信息</el-tag>
    <el-row>
      <el-col :span="24">
        <el-select size="mini" v-model="typecode">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.slabel"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-tag size="small">能耗指标&nbsp;(单位:{{ unit }})</el-tag>
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

    <el-row style="display:flex;flex-direction:row-reverse">
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
      &nbsp;&nbsp;
      <el-button type="primary" size="mini" @click="typecontentClose"
        >关闭
      </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    typerow: {
      type: Object
    }
  },
  data() {
    return {
      buildingcode: '',
      buildingname: '',
      slabel: '',
      typecode: '',
      typeList: '',
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
      //   unit: ''
    }
  },
  computed: {
    unit() {
      return this.typecode === 88 ? 'kWh' : 'm3'
      //   if (this.typetype === 88) {
      //     return 'kWh'
      //   } else {
      //     if (this.typetype === 89) {
      //       return 'm3'
      //     }
      //   }
    }
  },
  created() {
    console.log(this.typerow)
    this.dicListclass()
    this.queryenergytypeone()
  },
  methods: {
    typecontentClose() {
      this.$emit('typecontentClose')
    },
    confirm() {
      this.$emit('confirm')
    },
    queryenergytypeone() {
      let body = {
        id: this.typerow.id
      }
      this.$api.building.queryenergytypeone(body).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.buildingcode = res.data.buildingcode
          this.buildingname = res.data.buildingname
          this.slabel = res.data.slabel
          this.typecode = parseInt(res.data.typecode)
        }
      })
    },
    dicListclass() {
      this.$api.building.dicListclass().then(res => {
        console.log(res)
        this.typeList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogcontenttype {
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
