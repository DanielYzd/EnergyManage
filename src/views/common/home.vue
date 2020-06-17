<template>
  <div class="home">
    <el-row :gutter="20" class="top">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card shadow="always">
          <div slot="header">
            <span>档案信息</span>
          </div>
          <div class="num" v-loading="loading">
            <el-card shadow="always" :body-style="{ display: 'flex', padding: 0 }" v-for="item in countData"
              :key="item.name">
              <icon-svg class="icon" :name="item.icon" :style="{ background: item.color }"></icon-svg>
              <div class="detail">
                <p class="num">{{ item.value }}</p>
                <p class="txt">{{ item.name }}</p>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card shadow="always">
          <div slot="header">
            <span>能耗日历-电力 (kWh)</span>
          </div>
          <el-row class="calendar" :gutter="20">
            <el-col :span="15">
              <el-calendar v-model="value"></el-calendar>
            </el-col>
            <el-col :span="9">
              <el-card shadow="hover" style="background:#5ec680">
                <div class="rightnum">
                  <p class="num">???万</p>
                  <p class="txt">日用量</p>
                  <p class="num">???万</p>
                  <p class="txt">月用量</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="calendardata">
            <el-col :span="8">
              <h3 class="num">{{ energy.energy_ele }}万 kWh</h3>
              <h5 class="txt">累计用电量</h5>
            </el-col>
            <el-col :span="8">
              <h3 class="num">{{ energy.energy_wat }}万 m3</h3>
              <h5 class="txt">累计用水量</h5>
            </el-col>
            <el-col :span="8">
              <h3 class="num">{{ energy.energy_gas }}万 m3</h3>
              <h5 class="txt">累计用气量</h5>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card shadow="hover" class="control">
          <div slot="header">
            <span>费控信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover" :body-style="{ display: 'flex', padding: 0 }" class="itemstyle"
                v-for="item in controlData" :key="item.index" style="min-width:170px">
                <icon-svg class="icon" :name="item.icon" :style="{ background: item.color }"></icon-svg>
                <div class="detail">
                  <p class="num">
                    {{ item.value }}
                  </p>
                  <p class="txt">
                    {{ item.name }}
                  </p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-progress type="circle" :stroke-width="16" :percentage="payPerc" color="#ea686e" style="color: #fff;">
              </el-progress>
              <el-card shadow="hover" :body-style="{ padding: 0, background: '#ea686e' }" class="itemstyle">
                <div>
                  <p style="font-size:26px;text-align:center;line-height:30px;color:#ffffff">
                    {{ payPerc }}
                  </p>
                  <p style="font-size:20px;text-align:center;line-height:30px;color:#ffffff">
                    欠费户占比
                  </p>
                </div>
              </el-card>
              <el-card shadow="hover" :body-style="{ padding: 0, background: '#ea686e' }" class="itemstyle">
                <div>
                  <p style="font-size:26px;text-align:center;line-height:30px;color:#ffffff">
                    {{ noPayCustomerNum }}
                  </p>
                  <p style="font-size:20px;text-align:center;line-height:30px;color:#ffffff">
                    欠费户数
                  </p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bottom">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card shadow="hover">
          <Echart style="height:400px;" :chartData="echartData.order"></Echart>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card shadow="hover">
          <Echart style="height:400px;" :chartData="echartData.user"></Echart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Echart from '@/components/Echart'
export default {
  components: {
    Echart
  },
  data() {
    return {
      isAxisChart: false,
      echartData: {
        order: {
          xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line'
            }
          ]
        },
        user: {
          xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        }
      },
      loading: false,
      countData: [
        {
          name: '主变数量(台)',
          value: 0,
          icon: 'zhubian',
          color: '#b5621e'
        },
        {
          name: '终端数量(台)',
          value: 0,
          icon: 'zhongduan',
          color: '#b5621e'
        },
        {
          name: '装机容量(KVA)',
          value: 0,
          icon: 'ronliang',
          color: '#2ec7c9'
        },
        {
          name: '终端在线率',
          value: '0%',
          icon: 'rate',
          color: '#2ec7c9'
        },
        {
          name: '用户数量',
          value: 0,
          icon: 'admin',
          color: '#5ec680'
        },
        {
          name: '计量设备数量(台)',
          value: 0,
          icon: 'shebeicount',
          color: '#5ec680'
        }
      ],
      value: new Date(),
      energy: {
        energy_ele: 0,
        energy_gas: 0,
        energy_wat: 0
      },
      controlData: [
        {
          name: '费控总用户数(户)',
          icon: 'yonghuzongshu',
          value: 0,
          color: '#5ec680'
        },
        {
          name: '累计充值金额(元)',
          icon: 'chongzhi',
          value: 0,
          color: '#f5a465'
        },
        {
          name: '欠费总金额(元)',
          icon: 'qianfei',
          value: 0,
          color: '#ea686e'
        }
      ],
      payPerc: 0,
      noPayCustomerNum: 0
    }
  },
  created() {
    this.initData()
  },
  methods: {
    ajaxGet(url, params, successFun, errorFun) {
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'get',
        params: this.$http.adornParams(params)
      })
        .then(({ data }) => {
          successFun(data)
        })
        .catch(error => {
          console.log(error)
          if (errorFun) {
            errorFun(error)
          } else {
            this.$message.error('请求失败，稍后请重试!')
          }
        })
    },
    initData() {
      this.ajaxGet('/data/stat/countArchives', {}, res => {
        console.log(res.data)
        this.countData[4].value = res.data.customerNum
        // this.archives = res.data
        this.countData[1].value = res.data.rtuNum
      })
      this.ajaxGet('/data/stat/countEnergy', {}, res => {
        this.energy = res.data
      })
      this.ajaxGet('/data/stat/countPay', {}, res => {
        this.controlData[0].value = res.data.customerNum
        this.controlData[1].value = res.data.totalMoney
        this.controlData[2].value = res.data.noPayTotalMoney
        this.payPerc = parseFloat(res.data.payPerc)
        this.noPayCustomerNum = parseInt(res.data.noPayCustomerNum)
      })
      this.ajaxGet('/data/stat/countRtuRate', {}, res => {
        this.countData[3].value = res.data.rate
        // this.loadOnlineRateChart(res.data.rate)
      })
      this.ajaxGet('/energy/compare/dayEnergyType', {}, res => {
        console.log(111)
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/home.scss';
</style>
