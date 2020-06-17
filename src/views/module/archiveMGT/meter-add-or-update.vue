<template>
  <el-dialog
    :title="!dataForm.pointid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :inline="true"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      label-width="140px"
    >
      <el-form-item label="能源类型">
        <!-- <el-radio-group
          v-model="dataForm.type"
          @change="meterTypeChange"
          style="width:220px"
        >
          <el-radio
            v-for="item in meterTypeList"
            :key="item.value"
            :label="item.value"
            >{{ item.key }}</el-radio
          >
        </el-radio-group> -->
        <el-select
          v-model="dataForm.type"
          placeholder="表计类型"
          style="width:220px"
        >
          <el-option
            v-for="item in meterTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表计名称" prop="disc">
        <el-input
          v-model="dataForm.disc"
          placeholder="表计名称"
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item label="通信地址" prop="commaddress">
        <el-input
          v-model="dataForm.commaddress"
          placeholder="表通信地址"
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <region-select-item
        label="所属单元"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        prop="regionName"
      ></region-select-item>
      <el-form-item
        label="CT(电流互感器)"
        prop="ctid"
        v-if="dataForm.type === 0"
      >
        <el-select v-model="dataForm.ctid" placeholder="CT" style="width:220px">
          <el-option
            v-for="item in ctList"
            :key="item.id"
            :label="item.disc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="PT(电压互感器)"
        prop="ctid"
        v-if="dataForm.type === 0"
      >
        <el-select v-model="dataForm.ptid" placeholder="PT" style="width:220px">
          <el-option
            v-for="item in ptList"
            :key="item.id"
            :label="item.disc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安装位置" prop="instLocation">
        <el-input
          v-model="dataForm.instLocation"
          placeholder="安装位置"
          clearable
          style="width:220px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="计量标志"
        prop="loopUsedType"
        v-if="dataForm.type < 4"
      >
        <el-select
          v-model="dataForm.loopUsedType"
          placeholder="计量标志"
          style="width:220px"
          @change="handlerMesureChange"
        >
          <el-option
            v-for="item in loopUsedTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button @click="showHelp">说明</el-button>
      </el-form-item>

      <!-- <el-form-item
        label="计量标志"
        prop="loopUsedType"
        v-if="dataForm.type < 4"
      >
        <el-cascader
          v-model="dataForm.loopUsedType"
          :show-all-levels="false"
          :props="{checkStrictly: true, expandTrigger: 'hover' }"
          :options="loopUsedTypeList2"
          clearable
        ></el-cascader>
      </el-form-item> -->

      <!-- <loop-used-item
        label="所属区域"
        v-model="dataForm.regionName"
        @getRegion="getSelectRegion"
        prop="regionName"
      ></loop-used-item> -->
      <el-form-item
        label="计量区域（入住房间）"
        v-if="
          dataForm.type < 4 &&
            (dataForm.loopUsedType == 1110 || dataForm.loopUsedType == 1111)
        "
      >
        <el-select
          v-model="dataForm.mesureLocalId"
          style="width:220px"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入"
          :remote-method="remoteMethod"
          :loading="opLoading"
        >
          <el-option
            v-for="item in mesureLocalList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开关数量" prop="loops" v-if="dataForm.type > 3">
        <el-input-number
          v-model="dataForm.loops"
          :min="1"
          :max="3"
          label="请输入开关数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="电表类型" prop="eleType" v-if="dataForm.type == 0">
        <el-select
          v-model="dataForm.eleType"
          placeholder="电表类型"
          style="width:220px"
          @change="eleMeterChange"
        >
          <el-option
            v-for="item in eleTypeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="上级总表"
        v-if="dataForm.eleType > 0"
        prop="parentId"
      >
        <el-select
          v-model="dataForm.parentId"
          style="width:220px"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入表计名称远程模糊搜索"
          :remote-method="queryParentMeter"
          :loading="opLoading"
        >
          <el-option
            v-for="item in parentIdList"
            :key="item.pointid"
            :label="item.disc"
            :value="item.pointid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子表" v-if="dataForm.eleType == 2" prop="brotherId">
        <el-select
          v-model="dataForm.brotherId"
          style="width:220px"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入表计名称远程模糊搜索"
          :remote-method="queryBrotherMeter"
          :loading="opLoading"
        >
          <el-option
            v-for="item in brotherIdList"
            :key="item.pointid"
            :label="item.disc"
            :value="item.pointid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="占比(%)" v-if="dataForm.eleType == 1">
        <el-input-number
          v-model="dataForm.proportion"
          :min="1"
          :max="100"
          label="占比"
        ></el-input-number>
      </el-form-item>
      <br />
      <el-form-item style="margin-left: 40px;">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import globals from '@/utils/globals'
import regionSelect from '@/views/modules/pob/region-select'
import loopUsedSelect from '@/views/modules/pob/loop-used-select'
export default {
  data() {
    return {
      loading: false,
      opLoading: false,
      visible: false,
      hasMainPoint: false,
      dataForm: {
        pointid: 0,
        disc: '',
        type: 0,
        commaddress: '',
        regionName: '',
        regionid: '',
        instLocation: '',
        loopUsedType: 1110,
        mesureLocalId: null,
        energyType: 1,
        ctid: 1,
        ptid: 1,
        loops: 1,
        hm: '',
        eleType: 0,
        parentId: '',
        brotherId: '',
        proportion: ''
      },
      meterTypeList: this.$sysConfig.getMeterTypes(),
      mesureLocal: 16,
      mesureLocalUrl: '/pob/pobCommunityBuilding/mesureLocal/list',
      mesureLocalList: [],
      hmList: [],
      macList: [],
      loopUsedTypeList: globals.loopUsedTypeList,
      loopUsedTypeList2: globals.loopUsedTypeLevelList,
      eleTypeList: [
        { value: 0, key: '实表' },
        { value: 1, key: '比例虚拟表' },
        { value: 2, key: '子母虚拟表' }
      ],
      ctList: [],
      ptList: [],
      parentIdList: [],
      brotherIdList: [],
      dataRule: {
        commaddress: [
          { required: true, message: '表通信地址不能为空', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        regionName: [
          { required: true, message: '所属区域不能为空', trigger: 'change' }
        ]
        // ,parentId: [
        //   { required: true, message: "所属总表不能为空", trigger: "blur" }
        // ]
        // ,brotherId: [
        //   { required: true, message: "所属子表不能为空", trigger: "blur" }
        // ]
      }
    }
  },
  components: {
    'region-select-item': regionSelect
  },
  methods: {
    init(id) {
      this.dataForm.pointid = id || 0
      this.visible = true
      this.dataForm.loopUsedType = 1110
      this.dataForm.mesureLocalId = null
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.$http.ajaxGet('/common/ct/list/', {}, res => {
        this.ctList = res.data
      })
      this.$http.ajaxGet('/common/pt/list/', {}, res => {
        this.ptList = res.data
      })
      this.$http.ajaxGet('/pob/deviceMac/list/', {}, res => {
        this.macList = res.data
      })

      if (this.dataForm.pointid) {
        this.$http({
          url: this.$http.adornUrl(`/pob/meter/info/${this.dataForm.pointid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.regionName = data.meter.regionName
            this.dataForm.regionid = data.meter.regionid
            this.dataForm.disc = data.meter.disc
            this.dataForm.hm = data.meter.hm
            this.dataForm.commaddress = data.meter.commaddress
            this.dataForm.type = data.meter.type
            this.dataForm.ctid = data.meter.ctid
            this.dataForm.ptid = data.meter.ptid
            this.dataForm.energyType = data.meter.energyType
            this.dataForm.instLocation = data.meter.instLocation
            this.dataForm.loopUsedType = data.meter.loopUsedType
            this.mesureLocal = data.meter.mesureLocal
            this.dataForm.mesureLocalId = data.meter.mesureLocalId
            this.dataForm.eleType = data.meter.inventedType
            this.dataForm.proportion = data.meter.proportion
            this.dataForm.parentId = data.meter.parentId
            this.dataForm.brotherId = data.meter.brotherId
            this.$http.ajaxPost(
              '/pob/meter/selectMetersByDisc',
              { pointId: data.meter.parentId || '-1' },
              res => {
                this.parentIdList = res.list
              }
            )
            this.$http.ajaxPost(
              '/pob/meter/selectMetersByDisc',
              { pointId: data.meter.brotherId || '-1' },
              res => {
                this.brotherIdList = res.list
              }
            )
            this.dataForm.brotherId = data.meter.brotherId
            this.dataForm.loops = data.meter.loops
            this.remoteMethod()
          }
        })
      }
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
      this.dataForm.mesureLocalId = null
      this.remoteMethod()
    },
    meterTypeChange(value) {
      if (value === 0) {
        this.dataForm.energyType = 1
      } else if (value === 1) {
        this.dataForm.energyType = 5
      } else if (value === 2) {
        this.dataForm.energyType = 7
      } else if (value === 3) {
        this.dataForm.energyType = 8
      }
    },
    remoteMethod(query) {
      if (!this.dataForm.regionid) {
        this.$message({
          message: '请先选择所属区域进行',
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.opLoading = true
      setTimeout(() => {
        this.opLoading = false
        this.$http({
          url: this.$http.adornUrl(this.mesureLocalUrl),
          method: 'get',
          params: this.$http.adornParams({
            regionid: this.dataForm.regionid,
            mesureLocal: this.mesureLocal || 16,
            page: 1,
            limit: 20,
            areaName: query
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.mesureLocalList = data.page
          }
        })
      }, 200)
    },
    queryParentMeter(query) {
      if (!query) return
      this.opLoading = true
      setTimeout(() => {
        this.opLoading = false
        this.$http({
          url: this.$http.adornUrl('/pob/meter/selectMetersByDisc'),
          method: 'post',
          data: this.$http.adornData({
            disc: query,
            pointid: query
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.parentIdList = data.list
          }
        })
      }, 200)
    },
    queryBrotherMeter(query) {
      if (!query) return
      this.opLoading = true
      setTimeout(() => {
        this.opLoading = false
        this.$http({
          url: this.$http.adornUrl('/pob/meter/selectMetersByDisc'),
          method: 'post',
          data: this.$http.adornData({
            disc: query,
            pointid: query
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.brotherIdList = data.list
          }
        })
      }, 200)
    },
    handlerMesureChange(value) {
      this.mesureLocalList = []
      this.dataForm.mesureLocalId = null
      this.hasMainPoint = globals.hasMainPoint(this.dataForm.loopUsedType)
      this.remoteMethod()
    },
    eleMeterChange(value) {
      if (value > 0) {
        this.dataForm.commaddress = '000000000000'
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/pob/meter/${!this.dataForm.pointid ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              pointid: this.dataForm.pointid || undefined,
              regionid: this.dataForm.regionid,
              disc: this.dataForm.disc,
              type: this.dataForm.type,
              commaddress: this.dataForm.commaddress,
              ctid: this.dataForm.ctid,
              ptid: this.dataForm.ptid,
              energyType: this.dataForm.energyType,
              instLocation: this.dataForm.instLocation,
              loopUsedType: this.dataForm.loopUsedType,
              mesureLocal: globals.mesureLocalType(this.dataForm.loopUsedType),
              mesureLocalId: this.dataForm.mesureLocalId,
              loops: this.dataForm.loops,
              parentId:
                this.dataForm.eleType > 0 || this.dataForm.loopUsedType != 0
                  ? this.dataForm.parentId
                  : '',
              brotherId:
                this.dataForm.eleType > 1 ? this.dataForm.brotherId : '',
              proportion:
                this.dataForm.eleType == 1 ? this.dataForm.proportion : '',
              inventedType: this.dataForm.eleType
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    showHelp() {
      this.visible = false
      this.$router.push({ name: 'help' })
    }
  }
}
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
</style>
