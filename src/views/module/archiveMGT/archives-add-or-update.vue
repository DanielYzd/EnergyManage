<template>
  <el-dialog
    :title="!dataForm.customerid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="resetForm"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
      size="small"
    >
      <el-tabs v-model="activedTabName" tab-position="left">
        <el-tab-pane label="用户信息" name="-1">
          <region-select-item
            label="所属区域"
            v-model="dataForm.regionName"
            @getRegion="getSelectRegion"
            prop="regionName"
          ></region-select-item>
          <el-form-item
            label="用户信息"
            prop="disc"
            style="display: inline-block;"
          >
            <el-input v-model="dataForm.disc" placeholder="户名"></el-input>
          </el-form-item>
          <el-form-item
            label="门牌号"
            prop="doorplate"
            style="display: inline-block;"
          >
            <el-input
              v-model="dataForm.doorplate"
              placeholder="门牌号"
              style="width:100%"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户地址" prop="address">
            <el-input v-model="dataForm.address" placeholder="地址"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码"
            prop="telephone"
            style="display: inline-block;"
          >
            <el-input
              v-model="dataForm.telephone"
              placeholder="联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码2"
            prop="telephone2"
            style="display: inline-block;"
          >
            <el-input
              v-model="dataForm.telephone2"
              placeholder="联系电话2"
            ></el-input>
          </el-form-item>
          <el-form-item label="表计类型" prop="type">
            <el-checkbox-group v-model="type" @change="meterTypeChange">
              <el-checkbox
                v-for="item in meterTypeList"
                :key="item.value"
                :label="item.value"
                >{{ item.key }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="主站费控" prop="ppfstatus">
            <el-switch
              v-model="dataForm.ppfstatus"
              @change="ppfSwitchChange"
              active-color="#13ce66"
              active-text="开启"
            ></el-switch>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="计费参数" v-if="dataForm.isppf" name="4">
          <el-form-item
            label="计费开始日期"
            style="display: inline-block;"
            prop="starttime"
          >
            <el-date-picker
              v-model="dataForm.starttime"
              style="width: 160px;"
              type="date"
              value="yyyy-MM-dd"
              placeholder="开户日期"
              value-format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="计费结束日期"
            prop="checkOutTime"
            style="display: inline-block;"
          >
            <el-date-picker
              v-model="dataForm.checkOutTime"
              value-format="yyyy-MM-dd"
              align="right"
              type="date"
              placeholder="选择日期"
              style="width: 160px;"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="结算周期"
            prop="jszq"
            style="display: inline-block;"
          >
            <el-select
              v-model="dataForm.jszq"
              placeholder="请选择电价"
              @change="calcSchemeChange"
              style="width: 160px;"
            >
              <el-option
                v-for="item in schemeidList"
                :key="item.schemeid"
                :label="item.disc"
                :value="item.schemeid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="结算时间"
            prop="jssj"
            v-if="dataForm.jszq === 3"
            style="display: inline-block;"
          >
            <el-input-number
              v-model="dataForm.jssj"
              :min="1"
              :max="28"
              style="width: 160px;"
            ></el-input-number>
            <label>号</label>
          </el-form-item>
          <br />
          <el-form-item
            label="预充金额"
            style="display: inline-block;"
            prop="khje"
          >
            <el-input-number
              v-model="dataForm.khje"
              :disabled="!isCanModify"
              :min="0"
              :max="50000"
              label="请输入预充金额"
              style="width: 140px;"
            ></el-input-number>
            <label>元</label>
          </el-form-item>
          <el-form-item
            label="催费金额"
            style="display: inline-block;"
            prop="bjje"
          >
            <el-input-number
              v-model="dataForm.bjje"
              :min="0"
              :max="5000"
              label="请输入催费金额"
              style="width: 160px;"
            ></el-input-number>
            <label>元</label>
          </el-form-item>
          <br />
          <el-form-item
            label="自动拉闸"
            style="display: inline-block;"
            prop="autoControl"
          >
            <el-switch
              v-model="dataForm.autoControl"
              active-color="#13ce66"
              active-text="开启"
              style="width: 160px;"
            ></el-switch>
          </el-form-item>
          <el-form-item
            label="自动拉闸金额"
            style="display: inline-block;"
            prop="tzje"
          >
            <el-input-number
              v-model="dataForm.tzje"
              label="请输入拉闸金额"
              style="width: 160px;"
            ></el-input-number>
            <label>元</label>
          </el-form-item>
          <el-form-item
            label="电价"
            prop="unitPriceEle"
            style="display: inline-block;"
          >
            <el-select
              v-model="dataForm.unitPriceEle"
              placeholder="请选择电价"
              style="width: 160px;"
            >
              <el-option
                v-for="item in eleUnitPriceList"
                :key="item.priceid"
                :label="item.disc"
                :value="item.priceid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="水价"
            prop="unitPriceWat"
            style="display: inline-block;"
          >
            <el-select
              v-model="dataForm.unitPriceWat"
              placeholder="请选择水价"
              style="width: 160px;"
            >
              <el-option
                v-for="item in watUnitPriceList"
                :key="item.priceid"
                :label="item.disc"
                :value="item.priceid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="电表信息" v-if="type.indexOf(0) > -1" name="0">
          <div style="display:flex;">
            <el-tabs
              v-model="activedTabName_0"
              type="border-card"
              style="flex:1;max-width: 750px;"
              closable
              @tab-remove="removeMeter($event, 0)"
            >
              <el-tab-pane
                v-for="(meter, index) in dataForm.eleMeters"
                :label="index + 1 + '号电表'"
                :key="meter.key"
                :name="index.toString()"
              >
                <el-form-item
                  label="表计名称"
                  prop="disc"
                  style="margin-bottom: 15px;"
                >
                  <el-input
                    v-model="meter.disc"
                    placeholder="请输入电表名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="表计通信地址" prop="commaddress">
                  <el-input
                    v-model="meter.commaddress"
                    placeholder="请输入电表通信地址"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="CT(电流互感器)"
                  prop="ctid"
                  style="margin-bottom: 15px;"
                >
                  <el-select
                    v-model="meter.ctid"
                    placeholder="CT"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in ctList"
                      :key="item.id"
                      :label="item.disc"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="PT(电压互感器)" prop="ptid">
                  <el-select
                    v-model="meter.ptid"
                    placeholder="PT"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in ptList"
                      :key="item.id"
                      :label="item.disc"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="能耗用途" prop="energyType">
                  <el-select
                    v-model="meter.energyType"
                    clearable
                    placeholder="能耗用途"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in energyEleTypeList"
                      :key="item.value"
                      :label="item.key"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div style="width:100px;">
              <el-tooltip effect="dark" placement="top-start">
                <div slot="content">增加</div>
                <el-button
                  v-if="isAuth('pob:meter:save')"
                  @click.prevent="addMeter(0)"
                  icon="el-icon-circle-plus"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="水表信息" v-if="type.indexOf(1) > -1" name="1">
          <div style="display:flex;">
            <el-tabs
              v-model="activedTabName_1"
              type="border-card"
              style="flex:1"
              closable
              @tab-remove="removeMeter($event, 1)"
            >
              <el-tab-pane
                v-for="(meter, index) in dataForm.watMeters"
                :label="index + 1 + '号水表'"
                :name="index.toString()"
                :key="meter.key"
              >
                <el-form-item
                  label="表计名称"
                  prop="disc"
                  style="margin-bottom: 15px;"
                >
                  <el-input
                    v-model="meter.disc"
                    placeholder="请输入电表名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="表计通信地址" prop="commaddress">
                  <el-input
                    v-model="meter.commaddress"
                    placeholder="请输入电表通信地址"
                  ></el-input>
                </el-form-item>
                <el-form-item label="能耗用途" prop="energyType">
                  <el-select
                    v-model="meter.energyType"
                    placeholder="能耗用途"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in energyWatTypeList"
                      :key="item.value"
                      :label="item.key"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div style="width:100px;">
              <el-tooltip effect="dark" placement="top-start">
                <div slot="content">增加</div>
                <el-button
                  v-if="isAuth('pob:meter:save')"
                  @click.prevent="addMeter(1)"
                  icon="el-icon-circle-plus"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="气表信息" v-if="type.indexOf(2) > -1" name="2">
          <div style="display:flex;">
            <el-tabs
              v-model="activedTabName_2"
              type="border-card"
              style="flex:1"
              closable
              @tab-remove="removeMeter($event, 2)"
            >
              <el-tab-pane
                v-for="(meter, index) in dataForm.gasMeters"
                :label="index + 1 + '号气表'"
                :name="index.toString()"
                :key="meter.key"
              >
                <el-form-item
                  label="表计名称"
                  prop="disc"
                  style="margin-bottom: 15px;"
                >
                  <el-input
                    v-model="meter.disc"
                    placeholder="请输入电表名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="表计通信地址" prop="commaddress">
                  <el-input
                    v-model="meter.commaddress"
                    placeholder="请输入电表通信地址"
                  ></el-input>
                </el-form-item>
                <el-form-item label="能耗用途" prop="energyType">
                  <el-select
                    v-model="meter.energyType"
                    placeholder="能耗用途"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in energyGasTypeList"
                      :key="item.value"
                      :label="item.key"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div style="width:100px;">
              <el-tooltip effect="dark" placement="top-start">
                <div slot="content">增加</div>
                <el-button
                  v-if="isAuth('pob:meter:save')"
                  @click.prevent="addMeter(2)"
                  icon="el-icon-circle-plus"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="热表信息" v-if="type.indexOf(3) > -1" name="3">
          <div style="display:flex;">
            <el-tabs
              v-model="activedTabName_3"
              type="border-card"
              style="flex:1"
              closable
              @tab-remove="removeMeter($event, 3)"
            >
              <el-tab-pane
                v-for="(meter, index) in dataForm.hotMeters"
                :label="index + 1 + '号热表'"
                :name="index.toString()"
                :key="meter.key"
              >
                <el-form-item
                  label="表计名称"
                  prop="disc"
                  style="margin-bottom: 15px;"
                >
                  <el-input
                    v-model="meter.disc"
                    placeholder="请输入电表名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="表计通信地址" prop="commaddress">
                  <el-input
                    v-model="meter.commaddress"
                    placeholder="请输入电表通信地址"
                  ></el-input>
                </el-form-item>
                <el-form-item label="能耗用途" prop="energyType">
                  <el-select
                    v-model="meter.energyType"
                    placeholder="能耗用途"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in energyHotTypeList"
                      :key="item.value"
                      :label="item.key"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div style="width:100px;">
              <el-tooltip effect="dark" placement="top-start">
                <div slot="content">增加</div>
                <el-button
                  v-if="isAuth('pob:meter:save')"
                  @click.prevent="addMeter(3)"
                  icon="el-icon-circle-plus"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile } from "@/utils/validate";
import tool from "@/utils/tool";
import { treeDataTranslate, randomName } from "@/utils";
import regionSelect from "@/views/modules/pob/region-select";

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
      activeNames: ["1", "2"],
      activedTabName: "-1",
      activedTabName_0: null,
      activedTabName_1: null,
      activedTabName_2: null,
      activedTabName_3: null,
      visible: false,
      type: [0],
      oldType: [0],
      isCanModify: true,
      schemeidList: [
        { schemeid: 2, disc: "每天" },
        { schemeid: 3, disc: "每月" }
      ],
      dataForm: {
        customerid: 0,
        disc: "",
        regionName: this.$cookie.get("regionName"),
        regionid: this.$cookie.get("regionid"),
        doorplate: "",
        telephone: "",
        address: "",
        rtuCommAddress: null,
        rtuid: null,
        eleMeters: [],
        watMeters: [],
        gasMeters: [],
        hotMeters: [],
        isppf: false,
        ppfstatus: false,
        starttime: tool.formatDate(new Date(), "yyyy-MM-dd 00:00:00"),
        autoControl: true,
        khje: 0,
        tzje: 0,
        bjje: 0,
        checkOutTime: null,
        unitPriceEle: null,
        unitPriceWat: null,
        unitPriceGas: null,
        jszq: 2,
        jssj: 0
      },
      regionList: [],
      unitPriceList: [],
      meterTypeList: this.$sysConfig.getMeterTypes(), // ,//,{key : '热',value : 3}
      energyEleTypeList: [
        { value: 1, key: "照明与插座用电" },
        { value: 2, key: "空调用电" },
        { value: 3, key: "动力用电" },
        { value: 4, key: "特殊用电" }
      ],
      energyWatTypeList: [
        { value: 5, key: "厨卫生活用水" },
        { value: 6, key: "道路景观用水" }
      ],
      energyGasTypeList: [{ value: 7, key: "居民用气" }],
      energyHotTypeList: [{ value: 8, key: "居民用热" }],
      ctList: [],
      ptList: [],
      dataRule: {
        disc: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        regionName: [
          { required: true, message: "所属区域不能为空", trigger: "blur" }
        ]
        //        ,telephone: [
        //          { required: true, message: '手机号不能为空', trigger: 'blur' },
        //          { validator: validateMobile, trigger: 'blur' }
        //        ]
      }
    };
  },
  watch: {
    type: function(newVal, oldVal) {
      this.oldType = oldVal;
    },
    visible(newVal, oldVal) {
      this.resetForm();
    }
  },
  components: {
    "region-select-item": regionSelect
  },
  computed: {
    eleUnitPriceList() {
      return this.unitPriceList.filter(item => {
        return item.type === 0;
      });
    },
    watUnitPriceList() {
      return this.unitPriceList.filter(item => {
        return item.type === 1;
      });
    },
    gasUnitPriceList() {
      return this.unitPriceList.filter(item => {
        return item.type === 2;
      });
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
      this.dataForm.customerid = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.dataForm.eleMeters = [];
        this["activedTabName_0"] = "0";
        this["activedTabName"] = "-1";
        this.type = [];
        this.dataForm.watMeters = [];
        this.dataForm.gasMeters = [];
        this.dataForm.hotMeters = [];
        this.dataForm.isppf = false;
        this.dataForm.ppfstatus = false;
        this.isCanModify = true;
        this.$refs["dataForm"].resetFields();
      });
      this.$http.ajaxGet("/common/ct/list/", {}, res => {
        this.ctList = res.data;
      });
      this.$http.ajaxGet("/common/pt/list/", {}, res => {
        this.ptList = res.data;
      });
      if (this.dataForm.customerid) {
        this.$http({
          url: this.$http.adornUrl(
            `/pob/customerUnion/info/${this.dataForm.customerid}`
          ),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.loadUnitPrice(data.customer.regionid);
            this.dataForm.disc = data.customer.disc;
            this.dataForm.regionid = data.customer.regionid;
            this.dataForm.regionName = data.customer.regionName;
            this.dataForm.hh = data.customer.hh;
            this.dataForm.rtuCommAddress = data.customer.rtuCommAddress;
            this.dataForm.doorplate = data.customer.doorplate;
            this.dataForm.telephone = data.customer.telephone;
            this.dataForm.telephone2 = data.customer.telephone2;
            this.dataForm.address = data.customer.address;
            this.dataForm.eleMeters = data.customer.eleMeters;
            this.dataForm.watMeters = data.customer.watMeters;
            this.dataForm.gasMeters = data.customer.gasMeters;
            this.dataForm.hotMeters = data.customer.hotMeters;

            var ppfInfo = data.customer;
            if (ppfInfo && ppfInfo.ppfstatus === PPF_STATUS_ON) {
              this.isCanModify = false;
              this.dataForm.isppf = true;
              this.dataForm.ppfstatus = true;
              this.dataForm.starttime = ppfInfo.starttime;
              this.dataForm.checkOutTime = ppfInfo.checkOutTime;
              this.dataForm.autoControl =
                ppfInfo.autoControl === PPF_AUTOCONTROL_ON;
              this.dataForm.khje = ppfInfo.khje;
              this.dataForm.tzje = ppfInfo.tzje;
              this.dataForm.bjje = ppfInfo.bjje;
              this.dataForm.unitPriceEle = ppfInfo.unitPriceEle;
              this.dataForm.unitPriceWat = ppfInfo.unitPriceWat;
              this.dataForm.unitPriceGas = ppfInfo.unitPriceGas;
              this.dataForm.jssj = ppfInfo.jssj;
              this.dataForm.jszq = ppfInfo.jszq;
            }
            var type = [];
            if (data.customer.eleMeters && data.customer.eleMeters.length > 0) {
              type = type.concat([0]);
            }
            if (data.customer.watMeters && data.customer.watMeters.length > 0) {
              type = type.concat([1]);
            }
            if (data.customer.gasMeters && data.customer.gasMeters.length > 0) {
              type = type.concat([2]);
            }
            if (data.customer.hotMeters && data.customer.hotMeters.length > 0) {
              type = type.concat([3]);
            }
            this.type = type;
          } else {
            this.$message.error(data.msg || "加载数据失败，请联系管理员");
          }
        });
      }
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
      this.loadUnitPrice(data.id);
    },
    dataFormSubmit2() {
      this.dataForm.isppf = false;
    },
    ppfSwitchChange(value) {
      var vm = this;
      if (value) {
        this.$refs["dataForm"].validate(valid => {
          if (!valid) {
            setTimeout(function() {
              vm.dataForm.ppfstatus = false;
              vm.dataForm.isppf = false;
            }, 20);
            return;
          }
          vm.dataForm.isppf = value;
          vm.meterTypeList.forEach(item => {
            var meterType = item.value;
            var tMeters = vm.getMeters(meterType);
            if (tMeters && tMeters.length > 0) {
              tMeters.forEach((meter, index) => {
                meter.calcFlag = value;
                vm.$set(tMeters, meter, index);
              });
            }
          });
        });
      }
    },
    calcSchemeChange(value) {
      if (value === 2) {
        //计算方案为每天，默认结算时间为0点
        this.dataForm.jssj = 0;
      }
    },
    meterTypeChange(value) {
      this.type = value;
      this.meterTypeList.some(item => {
        var meterType = item.value;
        var tMeters = this.getMeters(meterType);
        if (tMeters && value.indexOf(meterType) == -1 && tMeters.length > 0) {
          this.type = this.oldType;
          this.$message.error("请先删除表计档案");
          return true;
        }
        if (tMeters && value.indexOf(meterType) > -1 && tMeters.length == 0) {
          tMeters.push(this.getDefaultMeterObj(meterType));
          this["activedTabName"] = meterType.toString();
          this["activedTabName_" + meterType] = "0";
        }
      });
    },
    removeMeter(index, meterType) {
      var tMeters = this.getMeters(meterType);
      if (!tMeters[index].pointid) {
        tMeters.splice(index, 1);
        var m = this.type.indexOf(meterType);
        if (tMeters.length == 0 && m > -1) {
          this.type.splice(m, 1);
          this["activedTabName"] = "-1";
        }
        if (tMeters.length > 1) {
          this["activedTabName_" + meterType] = (tMeters.length - 1).toString();
        }
      } else {
        this.$confirm(
          `确定对[表名为${tMeters[index].disc}]进行<b style="color:red">删除</b>操作?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true,
            type: "warning"
          }
        ).then(() => {
          this.$http({
            url: this.$http.adornUrl("/pob/meter/delete"),
            method: "post",
            data: this.$http.adornData([tMeters[index].pointid], false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  tMeters.splice(index, 1);
                  var m = this.type.indexOf(meterType);
                  if (tMeters.length == 0 && m > -1) {
                    this.type.splice(m, 1);
                    this["activedTabName"] = "-1";
                  }
                  this["activedTabName_" + meterType] = (
                    tMeters.length - 1
                  ).toString();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      }
    },
    addMeter(meterType) {
      var tMeters = this.getMeters(meterType);
      var tab = tMeters.length;
      tMeters.push(this.getDefaultMeterObj(meterType, tMeters.length + 1));
      this["activedTabName_" + meterType] = tab.toString();
    },
    getDefaultMeterObj(meterType, numbers) {
      let energyType = 1;
      if (meterType === 1) {
        energyType = 5;
      } else if (meterType === 2) {
        energyType = 7;
      } else if (meterType === 3) {
        energyType = 8;
      }
      return {
        type: meterType,
        typeName: this.getMeterTypeName(meterType),
        disc:
          this.dataForm.disc +
          this.getMeterTypeName(meterType) +
          (numbers ? numbers : "1"),
        energyType: energyType,
        ctid: 1,
        ptid: 1,
        calcFlag: false,
        key: Date.now()
      };
    },
    getMeterTypeName(meterType) {
      switch (meterType) {
        case 0:
          return "电表";
        case 1:
          return "水表";
        case 2:
          return "气表";
        case 3:
          return "热表";
      }
    },
    getMeters(meterType) {
      switch (meterType) {
        case 0:
          return this.dataForm.eleMeters;
        case 1:
          return this.dataForm.watMeters;
        case 2:
          return this.dataForm.gasMeters;
        case 3:
          return this.dataForm.hotMeters;
      }
    },
    // 表单提交
    dataFormSubmit() {
      if (
        this.dataForm.ppfstatus &&
        this.dataForm.eleMeters.length === 0 &&
        this.dataForm.watMeters.length === 0 &&
        this.dataForm.gasMeters.length === 0 &&
        this.dataForm.hotMeters.length === 0
      ) {
        this.$message.error("用户下没有关联任何表计，不能开启主站费控");
        return;
      }
      if (
        this.dataForm.ppfstatus &&
        this.dataForm.unitPriceEle === null &&
        this.dataForm.unitPriceWat === null
      ) {
        this.$message.error("没有设置电价或水价，不能开启主站费控");
        return;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/pob/customerUnion/${
                !this.dataForm.customerid ? "saveUnion" : "updateUnion"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              customerid: this.dataForm.customerid || undefined,
              regionid: this.dataForm.regionid,
              hh: this.dataForm.hh,
              disc: this.dataForm.disc,
              telephone: this.dataForm.telephone,
              telephone2: this.dataForm.telephone2,
              doorplate: this.dataForm.doorplate,
              address: this.dataForm.address,
              eleMeters: this.dataForm.eleMeters,
              watMeters: this.dataForm.watMeters,
              gasMeters: this.dataForm.gasMeters,
              hotMeters: this.dataForm.hotMeters,
              ppfstatus: this.dataForm.ppfstatus === true ? 0 : 1,
              autoControl: this.dataForm.autoControl === true ? 0 : 1,
              starttime: this.dataForm.starttime,
              checkOutTime: this.dataForm.checkOutTime,
              khje: this.dataForm.khje,
              tzje: this.dataForm.tzje,
              bjje: this.dataForm.bjje,
              unitPriceEle: this.dataForm.unitPriceEle,
              unitPriceWat: this.dataForm.unitPriceWat,
              unitPriceGas: this.dataForm.unitPriceGas,
              jssj: this.dataForm.jssj,
              jszq: this.dataForm.jszq
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          this.$message({
            message: "用户必填信息不完整，请正确填写",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style></style>
