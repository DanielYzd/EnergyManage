<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header">
            <h2>企业信息</h2>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="content">
                <el-row style="width:100%">
                  <el-col :span="12">
                    <icon-svg name="zhubiantaishu" class="zhubian"></icon-svg>
                  </el-col>
                  <el-col :span="12" class="title">
                    <div class="title1">111</div>
                    <div class="title2">主变台数(台)</div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="content">
                <el-row style="width:100%">
                  <el-col :span="12">
                    <icon-svg
                      name="zhuangjirongliang"
                      class="zhubian"
                    ></icon-svg>
                  </el-col>
                  <el-col :span="12" class="title">
                    <div class="title1">111</div>
                    <div class="title2">装机容量(kVA)</div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top:20px;">
            <el-col :span="12">
              <div class="content">
                <el-row style="width:100%">
                  <el-col :span="12">
                    <icon-svg
                      name="wangguanshuliang"
                      class="zhubian"
                    ></icon-svg>
                  </el-col>
                  <el-col :span="12" class="title">
                    <div class="title1">111</div>
                    <div class="title2">网关数量(个)</div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="content">
                <el-row style="width:100%">
                  <el-col :span="12">
                    <icon-svg name="jiliangdianshu" class="zhubian"></icon-svg>
                  </el-col>
                  <el-col :span="12" class="title">
                    <div class="title1">111</div>
                    <div class="title2">计量点数(个)</div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>能耗日历</span>
            <el-dropdown @command="handleCommand" style="float:right">
              <icon-svg
                name="menu"
                style="font-size:16px;cursor:pointer"
              ></icon-svg>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">水</el-dropdown-item>
                <el-dropdown-item command="b">电</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-row :gutter="40" style="height:270px;">
            <el-col :span="12" class="second">
              <div class="secondname">
                <div class="secondname1">水日用量</div>
                <div class="secondname2">11233</div>
              </div>
              <div class="secondname">
                <div class="secondname1">水月用量</div>
                <div class="secondname2">11233</div>
              </div>
            </el-col>
            <el-col :span="12" class="second">
              <div class="secondname">
                <div class="secondname1">水日用量</div>
                <div class="secondname2">11233</div>
              </div>
              <div class="secondname">
                <div class="secondname1">水日用量</div>
                <div class="secondname2">11233</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="bodypad">
          <div slot="header" class="clearfix">
            <span>能耗用途</span>
            <el-dropdown @command="handleCommand" style="float:right">
              <icon-svg
                name="menu"
                style="font-size:16px;cursor:pointer"
              ></icon-svg>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">水</el-dropdown-item>
                <el-dropdown-item command="b">电</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="piecontent">
            <div class="symbol">单位(千瓦时)</div>
            <div class="echart">
              <Echart :isAxisChart="false" :chartData="chartData"></Echart>
            </div>
            <el-tabs type="border-card" class="tabs" stretch>
              <el-tab-pane label="昨日"></el-tab-pane>
              <el-tab-pane label="本月"></el-tab-pane>
              <el-tab-pane label="本年"></el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="bottomcontent">
      <el-row :gutter="20" style="height:100%">
        <el-col :span="12" style="height:100%">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span style="height:40px;line-height:40px;">能耗分类</span>
              <el-tabs style="float:right;height:20px;">
                <el-tab-pane label="逐时" name="first"></el-tab-pane>
                <el-tab-pane label="逐日" name="second"></el-tab-pane>
                <el-tab-pane label="逐月" name="third"></el-tab-pane>
              </el-tabs>
            </div>
            <Echart :isAxisChart="true" :chartData="chartData1"></Echart>
          </el-card>
        </el-col>
        <el-col :span="12" style="height:100%">
          <el-card shadow="hover" style="height:100%">
            <div slot="header" class="clearfix">
              <span style="height:40px;line-height:40px;"
                >纵向能耗同比-电力</span
              >
              <el-dropdown @command="handleCommand" style="float:right">
                <icon-svg
                  name="menu"
                  style="font-size:16px;cursor:pointer;height:40px;line-height:40px;"
                ></icon-svg>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">水</el-dropdown-item>
                  <el-dropdown-item command="b">电</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-tabs style="float:right;height:20px;margin-right:20px;">
                <el-tab-pane label="逐时" name="first"></el-tab-pane>
                <el-tab-pane label="逐日" name="second"></el-tab-pane>
                <el-tab-pane label="逐月" name="third"></el-tab-pane>
              </el-tabs>
            </div>
            <Echart
              class="echart"
              :isAxisChart="true"
              :chartData="chartData2"
            ></Echart>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Echart from '@/components/Echart.vue'
export default {
  components: {
    Echart
  },
  data() {
    return {
      chartData: {
        legend: {
          //图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
          show: true,
          orient: 'vertical',
          left: 'right',
          textStyle: {
            color: '#333'
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            //饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
            label: {
              position: 'inside',
              formatter: '{d}%'
            },
            center: ['45%', '45%']
          }
        ]
      },
      chartData1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['水', '电']
        },
        xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '水',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            data: [120, 132, 101, 134, 300, 330, 410]
          },
          {
            name: '电',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            data: [220, 182, 191, 234, 500, 330, 310]
          }
        ]
      },
      chartData2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['本月', '上月']
        },
        xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '本月',
            type: 'line',

            data: [120, 132, 101, 134, 90, 230, 410]
          },
          {
            name: '上月',
            type: 'line',

            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      }
    }
  },
  methods: {
    handleCommand(command) {}
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  .el-card {
    /deep/.el-card__header {
      padding: 10px 20px !important;
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }
    }
    .content {
      width: 100%;
      height: 125px;
      background-color: #f0f6f9;
      display: flex;
      padding: 0 10px;
      // justify-content: center;
      align-items: center;
      /deep/.zhubian {
        // background-color: #24a5e8;
        font-size: 70px;
      }

      .title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 15px;
        .title1 {
          font-size: 20px;
        }
        .title2 {
          font-size: 12px;
        }
      }
    }
    .second {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .secondname {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .secondname1 {
          font-size: 14px;
        }
        .secondname2 {
          margin-top: 10px;
          color: #f79120;
          font-size: 30px;
        }
      }
    }
  }
  .bodypad {
    /deep/.el-card__body {
      padding: 0 !important;
      .piecontent {
        height: 310px;
        display: flex;
        flex-direction: column;
      }
      .symbol {
        font-size: 12px;
        margin: 10px 0 10px 10px;
        color: rgb(78, 77, 77);
      }
      .echart {
        flex: 1;
      }
      .tabs {
        height: 30px;
        .el-tabs__content {
          padding: 0;
        }
      }
    }
  }
  .bottomcontent {
    flex: 1;
    // padding: 10px;
    margin-top: 10px;
    .el-card {
      height: 100%;
      /deep/.el-card__header {
        padding: 0px 20px !important;
        height: 40px;
        .clearfix:before,
        .clearfix:after {
          display: table;
          content: '';
        }
        .clearfix:after {
          clear: both;
        }
      }
      /deep/.el-card__body {
        padding: 0px;
        min-height: 350px;
        height: calc(100% - 40px);
      }
    }
  }
}
</style>
