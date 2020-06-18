<template>
  <el-dialog title="表计更换" custom-class="dialogcommon" :close-on-click-modal="false" :visible.sync="visible">
    
		<el-steps :active="active" finish-status="success">
			<el-step title="设置换表信息"></el-step>
			<el-step title="补录旧表底度"></el-step>
			<el-step title="设置新表初始底度"></el-step>
		</el-steps>
    <el-form
      :model="dataForm"
      :inline="true"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="140px"
      size="small"
      style="padding-top:10px;"
    >
      <div  v-if="active === 0">
          <region-select-item
            label="所属区域"
            v-model="dataForm.regionName"
            @getRegion="getSelectRegion"
            prop="regionName"
          ></region-select-item>
          <el-form-item label="旧表通信地址" prop="searchWord">
            <!-- <el-input
              style="width:250px;"
              placeholder="请输入"
              v-model="dataForm.searchWord"
              class="input-with-select"
              clearable
            >
              <el-select
                v-model="searchSelect"
                slot="prepend"
                placeholder="请选择"
                style="width: 110px;"
              >
                <el-option label="表通信地址" value="1"></el-option>
                <el-option label="表计名称" value="2"></el-option>
              </el-select>
            </el-input>-->
            <el-input v-model="dataForm.searchWord" style="width:220px;" placeholder="请输入表通信地址"></el-input>
            <el-button type="primary" @click.prevent="seachHander()" icon="el-icon-search">搜索表计</el-button>
          </el-form-item>
          <el-form-item label="表计名称" prop="pointid">
            <el-select
              v-model="dataForm.pointid"
              style="width:220px;"
              placeholder="请选择"
              @change="selectMeter"
            >
              <el-option
                v-for="item in meterList"
                :key="item.pointid"
                :label="item.disc"
                :value="item.pointid"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="表计通信地址" prop="commaddress">
            <el-input
              v-model="dataForm.commaddress"
              style="width:220px;"
              placeholder="请输入电表通信地址"
              disabled
            ></el-input>
          </el-form-item>-->
          <el-form-item label="表计类型" prop="typeName">
            <el-input v-model="dataForm.typeName" style="width:220px;" placeholder="表计类型" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="所属用户" prop="hm">
            <el-input v-model="dataForm.hm" placeholder="户名" style="width:220px;" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户地址" prop="address">
            <el-input v-model="dataForm.address" placeholder="地址" style="width:220px;" disabled></el-input>
          </el-form-item>-->
          <el-form-item label="安装位置" prop="instLocation">
            <el-input
              v-model="dataForm.instLocation"
              placeholder="安装位置"
              style="width:220px;"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="新表通信地址" prop="commaddress2">
            <el-input v-model="dataForm.commaddress2" placeholder="请输入新表通信地址" style="width:220px;"></el-input>
            <!-- <el-button type="primary" @click.prevent="showInputNewMeterData()">设置新表初始底度</el-button> -->
          </el-form-item>
          <el-form-item label="更换时间" prop="inputTime">
            <el-date-picker
              v-model="dataForm.changeTime"
              style="width: 220px;"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:00"
              format="yyyy-MM-dd HH:mm:00"
            ></el-date-picker>
          </el-form-item>
          <!-- <hltable v-bind:tburl="tburl" v-bind:tbcols="tbcols"  v-bind:tbconfig="tbconfig" ref="dataTable"></hltable> -->

          
        </div>
      <div  v-if="active === 1">
          <el-form-item label="数据时间" prop="operateTime">
            <el-date-picker
              v-model="dataForm.operateTime"
              style="width: 220px;"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
            <el-button type="primary" @click.prevent="queryBmHander()" icon="el-icon-search">查看最后采集数据</el-button>
          </el-form-item>
          <!--
          <el-form-item label="数据最后采集时间" prop="address">
            <el-input
              v-model="dataForm.newestDatatime"
              placeholder="旧表最后一次抄表时间"
              style="width:220px;"
              disabled
            ></el-input>
          </el-form-item>-->
          <br />
          <div class="bordClass">
            <el-form-item label="读数" prop="flowV" v-if="this.dataForm.type !== 0 ">
              <el-input-number v-model="dataForm.flowV" :min="0" label="请输入读数"></el-input-number>
            </el-form-item>
            <template v-if="this.dataForm.type === 0 ">
              <el-form-item label="正向有功总" prop="zyzbm">
                <el-input-number v-model="dataForm.zyzbm" :min="0" label="请输入正向有功总读数"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="反向有功总" prop="fyzbm">
              <el-input-number v-model="dataForm.fyzbm" :min="0" label="请输入正向有功总读数"></el-input-number>
              </el-form-item>-->
              <el-form-item label="正向有功尖" prop="zyjbm">
                <el-input-number v-model="dataForm.zyjbm" :min="0" label="请输入正向有功尖读数"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="反向有功尖" prop="fyjbm">
              <el-input-number v-model="dataForm.fyjbm" :min="0" label="请输入正向有功总读数"></el-input-number>
              </el-form-item>-->
              <el-form-item label="正向有功峰" prop="zyfbm">
                <el-input-number v-model="dataForm.zyfbm" :min="0" label="请输入正向有功峰读数"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="反向有功峰" prop="fyfbm">
              <el-input-number v-model="dataForm.fyfbm" :min="0" label="请输入正向有功总读数"></el-input-number>
              </el-form-item>-->
              <el-form-item label="正向有功平" prop="zypbm">
                <el-input-number v-model="dataForm.zypbm" :min="0" label="请输入正向有功平读数"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="反向有功平" prop="fypbm">
              <el-input-number v-model="dataForm.fypbm" :min="0" label="请输入正向有功总读数"></el-input-number>
              </el-form-item>-->
              <el-form-item label="正向有功谷" prop="zygbm">
                <el-input-number v-model="dataForm.zygbm" :min="0" label="请输入正向有功谷读数"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="反向有功谷" prop="fygbm">
              <el-input-number v-model="dataForm.fygbm" :min="0" label="请输入正向有功总读数"></el-input-number>
              </el-form-item>-->
            </template>
          </div>
        </div>
      <div  v-if="active === 2">
          <el-form-item label="新表初始采集时间" prop="operateTime2">
            <el-date-picker
              v-model="dataForm.operateTime2"
              style="width: 220px;"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
          </el-form-item>
          <br />
          <el-form-item label="读数" prop="flowV2" v-if="this.dataForm.type !== 0 ">
            <el-input-number v-model="dataForm.flowV2" :min="0" label="请输入读数"></el-input-number>
          </el-form-item>
          <template v-if="this.dataForm.type === 0 ">
            <el-form-item label="正向有功总" prop="zyzbm2">
              <el-input-number v-model="dataForm.zyzbm2" :min="0" label="请输入正向有功总读数"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="反向有功总" prop="fyzbm2">
              <el-input-number v-model="dataForm.fyzbm2" :min="0" label="请输入正向有功总读数"></el-input-number>
            </el-form-item>-->
            <el-form-item label="正向有功尖" prop="zyjbm2">
              <el-input-number v-model="dataForm.zyjbm2" :min="0" label="请输入正向有功尖读数"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="反向有功尖" prop="fyjbm2">
              <el-input-number v-model="dataForm.fyjbm2" :min="0" label="请输入正向有功总读数"></el-input-number>
            </el-form-item>-->
            <el-form-item label="正向有功峰" prop="zyfbm2">
              <el-input-number v-model="dataForm.zyfbm2" :min="0" label="请输入正向有功峰读数"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="反向有功峰" prop="fyfbm2">
              <el-input-number v-model="dataForm.fyfbm2" :min="0" label="请输入正向有功总读数"></el-input-number>
            </el-form-item>-->
            <el-form-item label="正向有功平" prop="zypbm2">
              <el-input-number v-model="dataForm.zypbm2" :min="0" label="请输入正向有功平读数"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="反向有功平" prop="fypbm2">
              <el-input-number v-model="dataForm.fypbm2" :min="0" label="请输入正向有功总读数"></el-input-number>
            </el-form-item>-->
            <el-form-item label="正向有功谷" prop="zygbm2">
              <el-input-number v-model="dataForm.zygbm2" :min="0" label="请输入正向有功谷读数"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="反向有功谷" prop="fygbm2">
              <el-input-number v-model="dataForm.fygbm2" :min="0" label="请输入正向有功总读数"></el-input-number>
            </el-form-item>-->
          </template>
      </div>
      <el-form-item style="margin-left: 180px;">
		<el-button style="margin-top: 12px;" @click="back" v-if="active>0">上一步</el-button>
		<el-button style="margin-top: 12px;" @click="next" v-if="active<2">下一步</el-button>
        <el-button type="primary" v-if="active===2" @click="dataFormSubmit()">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import tool from "@/utils/tool";
import hltable from "@/components/hltable";
import regionSelect from "@/views/modules/pob/region-select";

export default {
  data() {
    return {
      active : 0,
      searchSelect: "1",
      activedTabName: "-1",
      oldMeterDataVisible : false,
      nextDisable : false,
      visible: false,
      meterList: [],
      meterTypeList: this.$sysConfig.getMeterTypes(),
      tburl: "",
      tbcols: [
        { prop: "oldMetercode", label: "最后数据时间" },
        { prop: "oldMetercode", label: "正向有功总" },
        { prop: "oldMetercode", label: "正向有功尖" },
        { prop: "oldMetercode", label: "正向有功峰" },
        { prop: "oldMetercode", label: "正向有功平" },
        { prop: "oldMetercode", label: "正向有功谷" }
      ],
      tbconfig: {
        isShowSelection: false,
        isShowRowIndex: true,
        rowButtonType: 0,
        isShowPage: true
      },
      dataForm: {
        regionName: this.$cookie.get("regionName"),
        regionid: this.$cookie.get("regionid"),
        newestDatatime: "",
        searchWord: "",
        type: 0,
        typeName: "",
        pointid: null,
        ctid: null,
        ptid: null,
        rate: 1,
        commaddress: "",
        hm: "",
        telephone: "",
        address: "",
        instLocation: "",
        changeTime : "",
        operateTime: tool.formatDate(
          tool.addDay(new Date(), -1),
          "yyyy-MM-dd 00:00:00"
        ),
        flowV: null,
        zyzbm: null,
        zyjbm: null,
        zyfbm: null,
        zypbm: null,
        zygbm: null,
        operateTime2: tool.formatDate(new Date(), "yyyy-MM-dd 00:00:00"),
        commaddress2: "",
        flowV2: null,
        zyzbm2: null,
        zyjbm2: null,
        zyfbm2: null,
        zypbm2: null,
        zygbm2: null
      },
      rules: {
        commaddress2: [
          { required: true, message: "请输入新表通信地址", trigger: "change" }
        ]
      }
    };
  },
  components: {
    "region-select-item": regionSelect,
    hltable
  },
  methods: {
    init() {
      this.visible = true;
      this.activedTabName = "-1"
      this.active = 0
      this.initData()
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
    },
    seachHander() {
      if (!this.dataForm.regionid) {
        this.$message.error("请选择所属区域后搜索!");
        return;
      }
      if (!this.dataForm.searchWord) {
        this.$message.error("请输入旧表通讯地址后搜索!");
        return;
      }
      var params = {
        regionid: this.dataForm.regionid,
        commaddress: this.dataForm.searchWord
      };
      this.$http.ajaxGet("/pob/meter/selectMeters", params, res => {
        this.meterList = res.data;
        if (this.meterList.length > 0) {
          this.selectMeter(this.meterList[0].pointid);
        } else {
          this.$message.info("没有搜索到表计。");
        }
      });
    },
    removeTab(targetName){
      this[targetName==='1'?'oldMeterDataVisible':'newMeterDataVisible'] = false
      this.activedTabName = '-1'
    },
			back() {
				this.active -= 1;
			},
			next() {
				if(!this.dataForm.regionid) {
					this.$message.error('请选择要导入的区域')
					return;
				}
        if(this.active++ > 2) this.active = 0;
			},
    showInputOldMeterData(){
      this.oldMeterDataVisible = true
      this.activedTabName = '1'
    },
    showInputNewMeterData(){
      this.newMeterDataVisible = true
      this.activedTabName = '2'
    },
    selectMeter(value) {
      this.meterList.some(item => {
        if (item.pointid === value) {
          this.dataForm.pointid = item.pointid;
          this.dataForm.commaddress = item.commaddress;
          this.dataForm.hm = item.hm;
          this.dataForm.address = item.address;
          this.dataForm.telephone = item.telephone;
          this.dataForm.typeName = item.typeName;
          this.dataForm.type = item.type;
          this.dataForm.instLocation = item.instLocation;
        }
      });
    },
    queryBmHander() {
      if (!this.dataForm.pointid) {
        this.$message.error("请选择计量点后搜索!");
        return;
      }
      var params = {
        pointid: this.dataForm.pointid
      };
      this.$http.ajaxGet(
        "/data/readMetering/selectPointNewestBm",
        params,
        res => {
          var d = res.data;
          this.dataForm.operateTime = d.datatime;
          this.dataForm.flowV = d.flowV;
          this.dataForm.zyzbm = d.zyz;
          this.dataForm.zyjbm = d.zyj;
          this.dataForm.zyfbm = d.zyf;
          this.dataForm.zypbm = d.zyp;
          this.dataForm.zygbm = d.zyg;
          this.dataForm.fyzbm = d.fyz;
          this.dataForm.fyjbm = d.fyj;
          this.dataForm.fyfbm = d.fyf;
          this.dataForm.fypbm = d.fyp;
          this.dataForm.fygbm = d.fyg;
        }
      );
    },
    dataFormSubmit() {
      if (!this.dataForm.commaddress2) {
        this.$message.error("请输入新表的通信地址!");
        return;
      }
      var params = [{
          pointid: this.dataForm.pointid,
          type: this.dataForm.type,
          operateType: 20,
          metercode: this.dataForm.commaddress,
          operateTime: this.dataForm.changeTime,
          inputTime: this.dataForm.changeTime,
          ctid: this.dataForm.ctid,
          ptid: this.dataForm.ptid,
          rate: this.dataForm.rate,
          operateTime: this.dataForm.operateTime,// 替换为旧表拆除时间
          flowV: this.dataForm.flowV,
          zyzbm: this.dataForm.zyzbm,
          zyjbm: this.dataForm.zyjbm,
          zyfbm: this.dataForm.zyfbm,
          zypbm: this.dataForm.zypbm,
          zygbm: this.dataForm.zygbm
          // ,fyzbm: this.dataForm.fyzbm,
          // fyjbm: this.dataForm.fyjbm,
          // fyfbm: this.dataForm.fyfbm,
          // fypbm: this.dataForm.fypbm,
          // fygbm: this.dataForm.fygbm
        }];
      params.push({
          pointid: this.dataForm.pointid,
          type: this.dataForm.type,
          operateType: 10,
          metercode: this.dataForm.commaddress2,
          operateTime: this.dataForm.changeTime,
          inputTime: this.dataForm.changeTime,
          ctid: this.dataForm.ctid,
          ptid: this.dataForm.ptid,
          rate: this.dataForm.rate,
          operateTime: this.dataForm.operateTime2,
          flowV: this.dataForm.flowV2,
          zyzbm: this.dataForm.zyzbm2,
          zyjbm: this.dataForm.zyjbm2,
          zyfbm: this.dataForm.zyfbm2,
          zypbm: this.dataForm.zypbm2,
          zygbm: this.dataForm.zygbm2
          // ,fyzbm: this.dataForm.fyzbm2,
          // fyjbm: this.dataForm.fyjbm2,
          // fyfbm: this.dataForm.fyfbm2,
          // fypbm: this.dataForm.fypbm2,
          // fygbm: this.dataForm.fygbm2
        })
      this.$http.ajaxPost(
        "/app/meterChange/save",
        params,
        res => {
          this.$message.success("保存成功");
          this.visible = false;
          this.$emit("refreshDataList");
        },
        res => {
          this.$message.error("保存失败");
        }
      );
    },
    initData(){
        this.dataForm.regionName = this.$cookie.get("regionName")
        this.dataForm.regionid= this.$cookie.get("regionid")
        this.dataForm.newestDatatime= ""
        this.dataForm.searchWord= ""
        this.dataForm.type= 0
        this.dataForm.typeName= ""
        this.dataForm.pointid= null
        this.dataForm.commaddress= ""
        this.dataForm.address= ""
        this.dataForm.instLocation= ""
        this.dataForm.changeTime = ""
        this.dataForm.operateTime= null
        this.dataForm.flowV= null
        this.dataForm.zyzbm= null
        this.dataForm.zyjbm= null
        this.dataForm.zyfbm= null
        this.dataForm.zypbm= null
        this.dataForm.zygbm= null
        this.dataForm.operateTime2= tool.formatDate(new Date(), "yyyy-MM-dd 00:00:00")
        this.dataForm.commaddress2= ""
        this.dataForm.flowV2= null
        this.dataForm.zyzbm2= null
        this.dataForm.zyjbm2= null
        this.dataForm.zyfbm2= null
        this.dataForm.zypbm2= null
        this.dataForm.zygbm2= null
    }
  }
};
</script>
<style>
</style>