<template>
  <el-dialog
  custom-class="dialogcommon"
    :title="!dataForm.customerid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" size="small" label-width="140px">
      <el-tabs v-model="activedTabName" tab-position="left">
        <el-tab-pane label="租户信息" name="-1">
          <region-select-item
            label="所属区域"
            v-model="dataForm.regionName"
            @getRegion="getSelectRegion"
            prop="regionName"
          ></region-select-item>
          <el-form-item label="户名" prop="disc">
            <el-input v-model="dataForm.disc" placeholder="户名" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="telephone" style="display: inline-block;">
            <el-input v-model="dataForm.telephone" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="手机号码2" prop="telephone2" style="display: inline-block;">
            <el-input v-model="dataForm.telephone2" placeholder="联系电话2"></el-input>
          </el-form-item>
          <el-form-item label="入住房间" prop="areaIdList">
            <el-select
              v-model="dataForm.areaIdList"
              placeholder="请选择房间门牌号"
              filterable
              multiple
              style="width:80%"
              @change="changeAreaHandler"
            >
              <el-option
                v-for="item in mesureLocalList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="使用面积(m²)" prop="area">
		        <el-input v-model="dataForm.area" placeholder="0" style="width:80%" disabled></el-input>
          </el-form-item>-->
          <el-form-item label="主站费控" prop="ppfstatus">
            <el-switch
              v-model="dataForm.ppfstatus"
              active-color="#13ce66"
              active-text="开启"
              @change="changePpf"
            ></el-switch>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="计费参数" v-if="dataForm.ppfstatus" name="0">
          <!--<el-form-item label="费控模式" prop="calcMode">
						<el-radio-group v-model="dataForm.calcMode"  @change="changeCalcMode">
					      <el-radio  :label="0" style="width:130px;">简单抄表模式</el-radio>
					      <el-radio  :label="1" style="width:130px;">分摊模式</el-radio>
					    </el-radio-group>
					</el-form-item>-
  				<el-form-item label="计费模式" prop="calcMode">
		        <el-select v-model="dataForm.calcMode" placeholder="请选择计费模式" class="form-item">
				      <el-option v-for="item in calcModeList" :key="item.calcMode" :label="item.disc" :value="item.calcMode"></el-option>
				    </el-select>
          </el-form-item>-->
          <el-form-item label="入住时间" prop="starttime" style="display: inline-block;">
            <el-date-picker
              v-model="dataForm.starttime"
              :disabled="!isCanModify"
              value-format="yyyy-MM-dd"
              align="right"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="退租时间" prop="checkOutTime" style="display: inline-block;">
            <el-date-picker
              v-model="dataForm.checkOutTime"
              value-format="yyyy-MM-dd"
              align="right"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>

          <div v-if="dataForm.calcMode === 0">
            <el-form-item
              label="自动拉闸"
              prop="autoControl"
              style="display: inline-block;width: 340px;"
            >
              <el-switch v-model="dataForm.autoControl" active-color="#13ce66" active-text="开启"></el-switch>
            </el-form-item>
            <el-form-item label="自动拉闸金额" prop="tzje" style="display: inline-block;">
              <el-input-number v-model="dataForm.tzje" label="请输入拉闸金额"></el-input-number>
              <label>元</label>
            </el-form-item>
            <el-form-item label="预充金额" style="display: inline-block;width: 340px;" prop="khje">
              <el-input-number
                v-model="dataForm.khje"
                :disabled="!isCanModify"
                :min="0"
                :max="50000"
                label="请输入开户金额"
              ></el-input-number>
              <label>元</label>
            </el-form-item>
            <el-form-item label="催费金额" style="display: inline-block;" prop="bjje">
              <el-input-number v-model="dataForm.bjje" :min="0" :max="1000" label="请输入催费金额"></el-input-number>
              <label>元</label>
            </el-form-item>
          </div>
          <!--	<el-form-item label="结算周期" prop="jszq" style="display: inline-block;">
			        <el-select v-model="dataForm.jszq" placeholder="请选择结算周期"  style="display: inline-block;">
					      <el-option v-for="item in schemeidList" :key="item.schemeid" :label="item.disc" :value="item.schemeid"></el-option>
					    </el-select>
	    		</el-form-item>
						<el-form-item label="结算时间" prop="jssj" v-if="dataForm.jszq === 3"   style="display: inline-block;">
					      <el-input-number v-model="dataForm.jssj" :min="1" :max="28"></el-input-number>
					      <label>号</label>
					</el-form-item>
          <br>-->
          <el-form-item label="电价" prop="unitPriceEle" style="display: inline-block;">
            <el-select v-model="dataForm.unitPriceEle" placeholder="请选择电价">
              <el-option
                v-for="item in eleUnitPriceList"
                :key="item.priceid"
                :label="item.disc"
                :value="item.priceid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="水价" prop="unitPriceWat" style="display: inline-block;">
            <el-select v-model="dataForm.unitPriceWat" placeholder="请选择水价">
              <el-option
                v-for="item in watUnitPriceList"
                :key="item.priceid"
                :label="item.disc"
                :value="item.priceid"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--  <el-form-item label="电梯计费" prop="flagElevator" style="display: inline-block;width: 340px;" v-if="dataForm.calcMode === 1">
				      	<el-switch v-model="dataForm.flagElevator" active-text="是" ></el-switch>
	    			</el-form-item>
		    		<el-form-item label="空调计费" prop="flagEleair"  style="display: inline-block;" v-if="dataForm.calcMode === 1">
				      	<el-switch v-model="dataForm.flagEleair" active-text="是" ></el-switch>
		    				</el-date-picker>
		    		</el-form-item>
		      	<el-form-item label="用水分摊系数" prop="watFactor" style="display: inline-block;" v-if="dataForm.calcMode === 1">
		        	<el-input-number v-model="dataForm.watFactor" :precision="2" :step="0.1" :max="10"></el-input-number>
          </el-form-item>-->
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { isMobile } from "@/utils/validate";
import { treeDataTranslate, randomName } from "@/utils";
import regionSelect from "@/views/modules/pob/region-select";
import hlDatePicker from "@/components/hl-date-picker";
import tool from "@/utils/tool";
const PPF_STATUS_ON = 0;
const PPF_AUTOCONTROL_ON = 0;
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      activeNames: ["1"],
      visible: false,
      activedTabName: "-1",
      calcModeList: [
        { calcMode: 0, disc: "预付费" },
        { calcMode: 1, disc: "后付费" }
      ],
      schemeidList: [
        { schemeid: 2, disc: "每天" },
        { schemeid: 3, disc: "每月" }
      ], //{schemeid : 1,disc:'每小时'},
      isCanModify: true,
      dataForm: {
        customerid: 0,
        disc: "",
        regionName: "",
        regionid: "",
        doorplate: "",
        telephone: "",
        telephone2: "",
        areaIdList: [],
        calcMode: 0,
        unitPriceEle: null,
        unitPriceWat: null,
        unitPriceGas: null,
        starttime: tool.formatDate(new Date(), "yyyy-MM-dd 00:00:00"),
        checkOutTime: null,
        flagElevator: false,
        flagEleair: false,
        watFactor: 0.0,
        autoControl: false,
        ppfstatus: false,
        khje: 0,
        tzje: -10,
        bjje: 0,
        jszq: 2,
        jssj: 0
      },
      inputVisible: false,
      inputValue: "",
      isShow: false,
      unitPriceList: [],
      mesureLocalList: [],
      dataRule: {
        disc: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        regionName: [
          { required: true, message: "所属区域不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    hlDatePicker,
    "region-select-item": regionSelect
  },
  computed: {
    eleUnitPriceList() {
      let priceList = this.unitPriceList.filter(item => {
        return item.type === 0;
      });
      this.dataForm.unitPriceEle =
        priceList.length > 0 ? priceList[0].priceid : null;
      return priceList;
    },
    watUnitPriceList() {
      let priceList = this.unitPriceList.filter(item => {
        return item.type === 1;
      });
      this.dataForm.unitPriceWat =
        priceList.length > 0 ? priceList[0].priceid : null;
      return priceList;
    }
  },
  methods: {
    resetForm() {
      let vm = this;
      let refDataForm = vm.$refs["dataForm"];
      if (refDataForm) {
        setTimeout(function() {
          refDataForm.resetFields();
          vm.setInitData();
        }, 20);
      }
    },
    setInitData() {
      this.dataForm.disc = "";
      this.dataForm.regionid = 0;
      this.dataForm.regionName = "";
      this.dataForm.hh = "";
      this.dataForm.rtuCommAddress = "";
      this.dataForm.doorplate = "";
      this.dataForm.telephone = "";
      this.dataForm.telephone2 = "";
      this.dataForm.address = "";
      this.dataForm.eleMeters = [];
      this.dataForm.watMeters = [];
      this.dataForm.gasMeters = [];
      this.dataForm.hotMeters = [];

      this.isCanModify = true;
      this.dataForm.isppf = false;
      this.dataForm.ppfstatus = false;
      this.dataForm.starttime = tool.formatDate(
        new Date(),
        "yyyy-MM-dd 00:00:00"
      );
      this.dataForm.checkOutTime = "";
      this.dataForm.autoControl = false;
      this.dataForm.khje = 0;
      this.dataForm.tzje = 0;
      this.dataForm.bjje = 0;
      this.dataForm.unitPriceEle = null;
      this.dataForm.unitPriceWat = null;
      this.dataForm.unitPriceGas = null;
      this.dataForm.jssj = 1;
      this.dataForm.jszq = 2;
    },
    init(id) {
      this.dataForm.customerid = id || null;
      this.visible = true;
      this.activedTabName = "-1";
      this.$nextTick(() => {
        this.isCanModify = true;
        this.$refs["dataForm"].resetFields();
        this.resetForm();
      });
      this.$http.ajaxGet(
        "/ppf/unitprice/list/",
        {
          regionid: this.dataForm.regionid ? this.dataForm.regionid : ""
        },
        res => {
          this.unitPriceList = res.list;
        }
      );
      if (!this.dataForm.customerid) {
        this.$nextTick(() => {
          this.changePpf();
        });
        return;
      }
      this.$http.ajaxGet(
        `/pob/customer/info/${this.dataForm.customerid}`,
        {},
        data => {
          this.dataForm.disc = data.customer.disc;
          this.dataForm.regionid = data.customer.regionid;
          this.queryRooms();
          this.loadUnitPrice(data.customer.regionid);
          this.dataForm.regionName = data.customer.regionName;
          this.dataForm.hh = data.customer.hh;
          this.dataForm.doorplate = data.customer.doorplate;
          this.dataForm.telephone = data.customer.telephone;
          this.dataForm.telephone2 = data.customer.telephone2;
          this.dataForm.area = data.customer.area;
          if (data.customer.areaIds) {
            this.dataForm.areaIdList = data.customer.areaIds
              .split(",")
              .map(item => {
                return parseInt(item);
              });
          }
          let ppf = data.customer;
          if (ppf) {
            this.dataForm.calcMode = ppf.calcMode;
            this.dataForm.ppfstatus = ppf.ppfstatus === PPF_STATUS_ON;
            this.isCanModify = !this.dataForm.ppfstatus;
            this.dataForm.unitPriceEle = ppf.unitPriceEle;
            this.dataForm.unitPriceWat = ppf.unitPriceWat;
            this.dataForm.flagEleair = ppf.flagEleair === 1 ? true : false;
            this.dataForm.flagElevator = ppf.flagElevator === 1 ? true : false;
            this.dataForm.watFactor = ppf.watFactor;
            this.dataForm.starttime = ppf.starttime;
            this.dataForm.checkOutTime = ppf.checkOutTime;
            this.dataForm.autoControl = ppf.autoControl === PPF_AUTOCONTROL_ON;
            this.dataForm.khje = ppf.khje;
            this.dataForm.tzje = ppf.tzje;
            this.dataForm.bjje = ppf.bjje;
            this.dataForm.jssj = ppf.jssj;
            this.dataForm.jszq = ppf.jszq;
          }
        }
      );
    },
    loadUnitPrice() {
      this.dataForm.unitPriceEle = null;
      this.dataForm.unitPriceWat = null;
      this.dataForm.unitPriceGas = null;
      this.$http.ajaxGet(
        "/ppf/unitprice/list/",
        {
          regionid: this.dataForm.regionid || 0
        },
        res => {
          this.unitPriceList = res.list;
        }
      );
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id;
      this.dataForm.regionName = data.label;
      this.queryRooms();
      this.loadUnitPrice(data.id);
    },
    queryRooms() {
      let ROOM_OBJ_TYPE = 16;
      var param = {
        regionid: this.dataForm.regionid,
        mesureLocal: ROOM_OBJ_TYPE,
        page: 1,
        limit: 200
      };
      this.$http.ajaxGet(
        "/pob/pobCommunityBuilding/mesureLocal/list",
        param,
        data => {
          this.mesureLocalList = data.page;
        }
      );
    },
    changePpf() {
      this.dataForm.calcMode = 0;
      this.changeCalcMode();
    },
    changeCalcMode() {
      this.dataForm.flagEleair = false;
      this.dataForm.flagElevator = false;
      this.dataForm.watFactor = 0;
    },
    changeAreaHandler(values) {
      let area = 0;
      let roomNames = [];
      values.forEach(v => {
        var m = this.mesureLocalList.find(i => {
          return v === i.value;
        });
        area += m.attach;
        roomNames.push(m.key);
      });
      this.dataForm.area = area.toFixed(3);
      this.dataForm.doorplate = roomNames.join(",");
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) {
          return;
        }
        var form = {
          customerid: this.dataForm.customerid || undefined,
          regionid: this.dataForm.regionid,
          hh: this.dataForm.hh,
          disc: this.dataForm.disc,
          doorplate: this.dataForm.doorplate,
          telephone: this.dataForm.telephone,
          telephone2: this.dataForm.telephone2,
          area: this.dataForm.area,
          areaIds: this.dataForm.areaIdList.join(","),
          ppfstatus: this.dataForm.ppfstatus === true ? 0 : 1,
          autoControl: this.dataForm.autoControl === true ? 0 : 1,
          unitPriceEle: this.dataForm.unitPriceEle,
          unitPriceWat: this.dataForm.unitPriceWat,
          flagEleair: this.dataForm.flagEleair ? 1 : 0,
          flagElevator: this.dataForm.flagElevator ? 1 : 0,
          watFactor: this.dataForm.watFactor,
          starttime: this.dataForm.starttime,
          checkOutTime: this.dataForm.checkOutTime,
          calcMode: this.dataForm.calcMode,
          khje: this.dataForm.khje,
          tzje: this.dataForm.tzje,
          bjje: this.dataForm.bjje,
          jssj: this.dataForm.jssj,
          jszq: this.dataForm.jszq
        };
        this.$http.ajaxPost(
          `/pob/customer/${
            !this.dataForm.customerid ? "saveCustomer" : "update"
          }`,
          form,
          data => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.$emit("refreshDataList");
              }
            });
          },
          msg => {
            this.$message.error(msg);
          }
        );
      });
    }
  }
};
</script>
<style>
.demo-block-control {
  border-top: 1px solid #eaeefb;
  height: 44px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: center;
  margin-top: -1px;
  color: #d3dce6;
  cursor: pointer;
  position: relative;
}
.form-label {
  width: 100px;
  padding-right: 10px;
  text-align: right;
  display: inline-block;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 140px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>