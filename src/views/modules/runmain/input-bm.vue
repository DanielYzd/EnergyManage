<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>表计详细信息</span>
      </div>
      <div class="text item">
        <el-form
          :model="queryForm"
          :inline="true"
          ref="queryForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="140px"
          size="small"
        >
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            v-for="(item,index) in queryForm.meterInfo"
            :key="index"
          >
            <el-input
              v-model="item[item.prop]"
              style="width:220px;"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card
      class="box-card"
      style="margin-top:10px;"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>录入表计读数</span>
      </div>
      <div class="text item">
        <el-form
          :model="dataForm"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="140px"
          size="small"
        >
          <el-form-item label="数据时间">
            <el-date-picker
              v-model="dataForm.datatime"
              type="datetime"
              placeholder="选择日期"
              style="width: 220px;"
              value-format="yyyy-MM-dd HH:mm:00"
              size="small"
              @change="loadData()"
            ></el-date-picker>
          </el-form-item>
          <template v-if="this.dataForm.type !== 0 ">
            <br />
            <el-form-item
              label="读数"
              prop="flowV"
            >
              <el-input
                v-model="dataForm.flowV"
                label="请输入读数"
                class="formItem"
              ></el-input>
            </el-form-item>
          </template>
          <template v-if="this.dataForm.type === 0 ">
            <el-form-item
              label="费率总读数"
              prop="startBm"
            >
              <el-input
                v-model="dataForm.zyzbm"
                label="请输入起始正向有功总读数"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="费率尖读数"
              prop="zyjbmStart"
            >
              <el-input
                v-model="dataForm.zyjbm"
                label="请输入起始正向有功总读数"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="费率峰读数"
              prop="zyfbmStart"
            >
              <el-input
                v-model="dataForm.zyfbm"
                label="请输入起始正向有功总读数"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="费率平读数"
              prop="zypbmStart"
            >
              <el-input
                v-model="dataForm.zypbm"
                label="请输入起始正向有功总读数"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="费率谷读数"
              prop="zygbmStart"
            >
              <el-input
                v-model="dataForm.zygbm"
                label="请输入起始正向有功总读数"
              ></el-input>
            </el-form-item>
          </template>
          <br />
          <el-form-item style="margin-left: 180px;">
            <el-button
              type="primary"
              @click="save()"
              :loading="saveLoading"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import hlDatePicker from "@/components/hl-date-picker";
import tool from "@/utils/tool";
export default {
  data() {
    return {
      loading: false,
      saveLoading: false,
      visible: false,
      queryForm: {
        meterInfo: [
          { label: "所属区域", prop: "regionName", regionName: "" },
          { label: "表计名称", prop: "disc", disc: "" },
          { label: "表计通信地址", prop: "commaddress", commaddress: "" },
          { label: "表计类型", prop: "typeName", typeName: "" },
          { label: "CT", prop: "ctName", ctName: "" },
          { label: "PT", prop: "ptName", ptName: "" },
          { label: "倍率", prop: "rate", rate: "" },
          { label: "安装位置", prop: "instLocation", instLocation: "" },
          { label: "计量标志", prop: "loopUsedTypeName", loopUsedTypeName: "" },
          { label: "计量区域", prop: "mesureLocalIdStr", mesureLocalIdStr: "" }
        ]
      },
      dataForm: {
        schemeid: 2,
        pointid: 0,
        type: 0,
        datatime: "2018-12-28",
        monthDate: "2018-12",
        flowV: null,
        zyzbm: null,
        zyjbm: null,
        zyfbm: null,
        zypbm: null,
        zygbm: null
      }
    };
  },
  components: {
    hlDatePicker
  },
  activated() {
    this.init();
  },
  computed: {
    queryStartDate() {
      return this.dataForm.datatime + " 00:00:00";
    }
  },
  methods: {
    init() {
      var params = this.$route.params;
      if (params.pointid === undefined) {
        return;
      }
      this.dataForm.pointid = params.pointid ? parseInt(params.pointid) : null;
      this.dataForm.datatime = params.datatime
        ? params.datatime
        : tool.formatDate(tool.addDay(new Date(), 1), "yyyy-MM-dd 00:00:00");
      this.dataForm.schemeid = params.schemeid;
      this.loadMeterInfo();
    },
    loadMeterInfo() {
      let vm = this;
      vm.$http.ajaxGet(`/pob/meter/info/${this.dataForm.pointid}`, {}, res => {
        var meter = res.meter;
        var infos = [
          {
            label: "所属区域",
            prop: "regionName",
            regionName: meter.regionName
          },
          { label: "表计名称", prop: "disc", disc: meter.disc },
          {
            label: "表通信地址",
            prop: "commaddress",
            commaddress: meter.commaddress
          },
          { label: "表计类型", prop: "typeName", typeName: meter.typeName },
          {
            label: "安装位置",
            prop: "instLocation",
            instLocation: meter.instLocation
          },
          {
            label: "计量回路标志",
            prop: "loopUsedTypeName",
            loopUsedTypeName: meter.loopUsedTypeName
          },
          {
            label: "计量区域",
            prop: "mesureLocalIdStr",
            mesureLocalIdStr: meter.mesureLocalIdStr
          }
        ];
        if (meter.type === 0) {
          infos = infos.concat([
            { label: "CT", prop: "ctName", ctName: meter.ctName },
            { label: "PT", prop: "ptName", ptName: meter.ptName },
            { label: "倍率", prop: "rate", rate: meter.rate }
          ]);
        }
        vm.dataForm.type = meter.type;
        vm.queryForm.meterInfo = infos;
        vm.loadData();
      });
    },
    loadData() {
      let vm = this;
      let params = {
        pointid: vm.dataForm.pointid,
        datatime: vm.dataForm.datatime,
        type: vm.dataForm.type,
        page: 1,
        limit: 15
      };

      this.$http.ajaxGet("/data/readMetering/pointbm", params, res => {
        let d = res.page.list[0];
        if (!d) return;

        this.dataForm.flowV = d.flowV;
        this.dataForm.zyzbm = d.zyz;
        this.dataForm.zyjbm = d.zyj;
        this.dataForm.zyfbm = d.zyf;
        this.dataForm.zypbm = d.zyp;
        this.dataForm.zygbm = d.zyg;
      });
    },
    save() {
      let data = this.dataForm;
      let params = {
        pointid: data.pointid,
        datatime: this.dataForm.datatime,
        type: data.type,
        zBm: data.zyzbm,
        jBm: data.zyjbm,
        fBm: data.zyfbm,
        pBm: data.zypbm,
        gBm: data.zygbm,
        direction: 1,
        prop: 2,
        flowV: data.flowV
      };
      if (!data.pointid) {
        this.$message.warning("请关闭后重新选择表计!");
        return;
      }
      this.saveLoading = true;
      var url = `/data/readMetering/input/${
        data.type === 0 ? "ele" : "flow"
      }?type=${data.type}`;
      this.$http.ajaxPost(
        url,
        [params],
        res => {
          this.$message.success("保存成功!");
          this.saveLoading = false;
          this.loadData();
        },
        () => {
          this.saveLoading = false;
          this.$message.error("保存失败!");
        }
      );
    }
  }
};
</script>

<style>
</style>