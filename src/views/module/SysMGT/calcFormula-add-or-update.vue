<template>
  <!--  <el-dialog
    :title="!dataForm.formulaid ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">-->
  <el-form
    :model="dataForm"
    :rules="dataRule"
    ref="dataForm"
    size="small"
    label-width="140px"
    :inline="true"
  >
    <region-select-item
      label="所属区域"
      v-model="dataForm.regionName"
      @getRegion="getSelectRegion"
      prop="regionName"
    ></region-select-item>
    <el-form-item label="公式名称" prop="formulaName">
      <el-input
        v-model="dataForm.formulaName"
        placeholder="公式名称"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="公式类型" prop="formulaType">
      <el-select v-model="dataForm.formulaType" placeholder="请选择公式类型">
        <el-option
          v-for="item in formulaTypeList"
          :key="item.value"
          :label="item.key"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分摊类型" prop="factorType">
      <el-select v-model="dataForm.factorType" placeholder="请选择公式类型">
        <el-option
          v-for="item in factorTypeList"
          :key="item.value"
          :label="item.key"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="margin-left: 20px;">
      <!--<el-button @click="visible = false">取消</el-button>-->
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      <el-button @click="showNote">分摊说明</el-button>
    </el-form-item>
    <el-tabs style="margin-left: 40px;">
      <el-tab-pane label="累加“+”表计">
        <region-select-item
          label="筛选区域"
          v-model="dataForm.filterRegionName"
          @getRegion="getFilterRegion"
          prop="filterRegionName"
        ></region-select-item>
        <el-form-item label="计量回路标志" prop="loopUsedType">
          <el-select
            v-model="dataForm.loopUsedType"
            clearable
            placeholder="计量标志"
            style="width: 100%;"
            @change="getMeterGrid($event, 'add')"
          >
            <el-option
              v-for="item in loopUsedTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表通信地址" prop="commaddress">
          <el-input
            v-model="dataForm.commaddress"
            placeholder="表通信地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList('addMeter')" type="primary"
            >查询</el-button
          >
          <el-button @click="selectedAll('addMeter')" type="primary"
            >全选</el-button
          >
          <el-button @click="clearAll('addPointids')" type="primary"
            >清空</el-button
          >
        </el-form-item>
        <br />
        <el-row :gutter="20">
          <el-col :span="11">
            <hltable
              :tburl="meterUrl"
              :tbcols="meterCols"
              ref="addMeterGrid"
              :tbconfig="addMeterConfig"
              height="150"
              @selections="
                data => {
                  this.addMeterWaitList = data
                }
              "
            ></hltable>
          </el-col>
          <el-col :span="2">
            <div class="el-transfer__buttons">
              <button
                type="button"
                @click="unChoose('addMeter')"
                class="el-button el-button--primary  el-transfer__button"
              >
                <span><i class="el-icon-arrow-left"></i></span>
              </button>
              <button
                type="button"
                @click="choose('addMeter')"
                class="el-button el-button--primary  el-transfer__button"
              >
                <span><i class="el-icon-arrow-right"></i></span>
              </button>
            </div>
          </el-col>

          <el-col :span="11">
            <el-table
              ref="addMeterSelectedGrid"
              max-height="600"
              @selection-change="addMeterChangeHandle"
              border
              size="small"
              :data="addMetersSelected"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center"
                width="60"
                label="序号"
              ></el-table-column>
              <el-table-column prop="disc" label="已选表计名称">
              </el-table-column>
              <el-table-column prop="loopUsedTypeName" label="计量回路标志">
              </el-table-column>
              <el-table-column prop="mesureLocalIdStr" label="房间名称">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--<el-form-item label="已选表计" prop="addPointids">
				  	<el-select v-model="dataForm.addPointids" multiple placeholder="请选择" style="width: 700px;">
				    	<el-option v-for="item in addMetersSelected" :key="item.pointid" :label="item.commaddress" :value="item.pointid"></el-option>
				  	</el-select>
      			</el-form-item>-->
      </el-tab-pane>
      <el-tab-pane label="累加“+”公式">
        <el-form-item label="公式类型" prop="filterFormulaType">
          <el-select
            v-model="dataForm.filterFormulaType"
            clearable
            placeholder="根据公式类型筛选"
            style="width: 100%;"
            @change="getFormulaGrid($event, 'add')"
          >
            <el-option
              v-for="item in formulaTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="getFormulaGrid(dataForm.filterFormulaType, 'add')"
            type="primary"
            >查询</el-button
          >
          <el-button @click="selectedAll('addFormula')" type="primary"
            >全选</el-button
          >
          <el-button @click="clearAll('addFormulaids')" type="primary"
            >清空</el-button
          >
        </el-form-item>
        <br />
        <el-form-item label="已选公式" prop="addFormulaids">
          <el-select
            v-model="dataForm.addFormulaids"
            multiple
            placeholder="请选择"
            style="width: 700px;"
          >
            <el-option
              v-for="item in addFormulasSelected"
              :key="item.formulaid"
              :label="item.formulaName"
              :value="item.formulaid"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="">
          <hltable
            v-bind:tburl="tburl"
            v-bind:tbcols="tbcols"
            ref="addFormulaGrid"
            v-bind:tbconfig="addFormulaConfig"
          ></hltable>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="累减“-”表计">
        <region-select-item
          label="筛选区域"
          v-model="dataForm.filterRegionName"
          @getRegion="getFilterRegion"
          prop="filterRegionName"
        ></region-select-item>
        <el-form-item label="计量标志" prop="loopUsedType">
          <el-select
            v-model="dataForm.loopUsedType"
            clearable
            placeholder="计量标志"
            style="width: 100%;"
            @change="getMeterGrid($event, 'sub')"
          >
            <el-option
              v-for="item in loopUsedTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表通信地址" prop="commaddress2">
          <el-input
            v-model="dataForm.commaddress2"
            placeholder="表通信地址"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList('subMeter')" type="primary"
            >查询</el-button
          >
          <el-button @click="selectedAll('subMeter')" type="primary"
            >全选</el-button
          >
          <el-button @click="clearAll('subMeter')" type="primary"
            >清空</el-button
          >
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="11">
            <hltable
              :tburl="meterUrl"
              :tbcols="meterCols"
              ref="subMeterGrid"
              :tbconfig="subMeterConfig"
              height="150"
              @selections="
                data => {
                  this.subMeterWaitList = data
                }
              "
            ></hltable>
          </el-col>
          <el-col :span="2">
            <div class="el-transfer__buttons">
              <button
                type="button"
                @click="unChoose('subMeter')"
                class="el-button el-button--primary  el-transfer__button"
              >
                <span><i class="el-icon-arrow-left"></i></span>
              </button>
              <button
                type="button"
                @click="choose('subMeter')"
                class="el-button el-button--primary  el-transfer__button"
              >
                <span><i class="el-icon-arrow-right"></i></span>
              </button>
            </div>
          </el-col>

          <el-col :span="11">
            <el-table
              ref="subMeterSelectedGrid"
              max-height="600"
              @selection-change="subMeterChangeHandle"
              border
              :data="subMetersSelected"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center"
                width="60"
                label="序号"
              ></el-table-column>
              <el-table-column prop="disc" label="已选表计名称">
              </el-table-column>
              <el-table-column prop="loopUsedTypeName" label="计量回路标志">
              </el-table-column>
              <el-table-column prop="mesureLocalIdStr" label="房间名称">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--<el-form-item label="已选表计" prop="subPointids">
				  	<el-select v-model="dataForm.subPointids" multiple placeholder="请选择" style="width: 700px;">
				    	<el-option v-for="item in subMetersSelected" :key="item.pointid" :label="item.commaddress" :value="item.pointid"></el-option>
				  	</el-select>
      			</el-form-item>-->
      </el-tab-pane>
      <el-tab-pane label="累减“-”公式">
        <el-form-item label="公式类型" prop="filterFormulaType2">
          <el-select
            v-model="dataForm.filterFormulaType2"
            clearable
            placeholder="根据公式类型筛选"
            style="width: 100%;"
            @change="getFormulaGrid($event, 'sub')"
          >
            <el-option
              v-for="item in formulaTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="getFormulaGrid(dataForm.filterFormulaType2, 'sub')"
            type="primary"
            >查询</el-button
          >
          <el-button @click="selectedAll('subFormula')" type="primary"
            >全选</el-button
          >
          <el-button @click="clearAll('subFormulaids')" type="primary"
            >清空</el-button
          >
        </el-form-item>
        <br />
        <el-form-item label="已选公式" prop="subFormulaids">
          <el-select
            v-model="dataForm.subFormulaids"
            multiple
            placeholder="请选择"
            style="width: 700px;"
          >
            <el-option
              v-for="item in subFormulasSelected"
              :key="item.formulaid"
              :label="item.formulaName"
              :value="item.formulaid"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="">
          <hltable
            v-bind:tburl="tburl"
            v-bind:tbcols="tbcols"
            ref="subFormulaGrid"
            v-bind:tbconfig="subFormulaConfig"
          ></hltable>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <calc-formula-note
      v-if="calcFormulaNoteVisible"
      ref="calcFormulaNoteRef"
    ></calc-formula-note>
  </el-form>
  <!--  </el-dialog>-->
</template>

<script>
import regionSelect from '@/views/modules/pob/region-select'
import hltable from '@/components/hltable'
import tool from '@/utils/tool'
import calcFormulaNote from './calcFormula-note'
import globals from '@/utils/globals'
export default {
  data() {
    return {
      calcFormulaNoteVisible: false,
      addMeterwaitList: [], //累加表计待选
      addMeterSelectedList: [], //累加表计已选选
      subMeterwaitList: [], //累减表计待选
      subMeterSelectedList: [], //累减表计已选选
      visible: false,
      show: false,
      formulaTypeList: [
        { value: 0, key: '分摊计算公式' },
        { value: 1, key: '变线损公式' },
        { value: 2, key: '分项能耗公式' }
      ],
      //formulaTypeList : [{value:0,key:'房间抄读总电量'},{value:1,key:'母线总电量'},{value:2,key:'公共区域照明总电量'},{value:3,key:'消防总电量'},
      //	{value:4,key:'安防总电量'},{value:5,key:'电梯总电量'},{value:6,key:'空调总电量'},{value:7,key:'公共用电量'},{value:8,key:'变线损电量'},{value:10,key:'其他电量'}],
      factorTypeList: [
        { value: 0, key: '无分摊' },
        { value: 1, key: '按抄见电量分摊' },
        { value: 2, key: '按楼栋面积分摊' },
        { value: 3, key: '按楼层面积分摊' },
        { value: 4, key: '按汇总电量分摊' }
      ],
      addMeters: [],
      subMeters: [],
      addFormulas: [],
      subFormulas: [],
      addMetersSelected: [], //缓存选择过的历史纪录
      subMetersSelected: [],
      addFormulasSelected: [],
      subFormulasSelected: [],
      dataForm: {
        formulaid: null,
        regionid: this.$cookie.get('regionid'),
        regionName: this.$cookie.get('regionName'),
        filterRegionName: '',
        filterRegionid: null,
        formulaName: '',
        formulaType: 0,
        factorType: 0,
        note: '',
        loopUsedType: null,
        loopUsedType2: null,
        commaddress: '',
        commaddress2: '',
        filterFormulaType: null,
        filterFormulaType2: null,
        addPointids: [],
        addFormulaids: [],
        subPointids: [],
        subFormulaids: []
      },
      loopUsedTypeList: globals.loopUsedTypeList,
      meterUrl: '/pob/meter/list',
      meterCols: [
        {
          prop: 'disc',
          label: '待选表计名称',
          width: 100
        } /*,{prop:"commaddress", label:"表通信地址",width:100 }*/,
        { prop: 'loopUsedTypeName', label: '计量回路标志', width: 100 },
        { prop: 'mesureLocalIdStr', label: '房间名称', width: 100 }
      ],
      tburl: '/pob/calcFormula/list',
      tbcols: [
        { prop: 'formulaName', label: '公式名称', width: 240 },
        { prop: 'regionName', label: '应用区域' }
      ],
      dataRule: {
        formulaName: [
          { required: true, message: '公式名称不能为空', trigger: 'blur' }
        ],
        regionName: [
          { required: true, message: '所属区域不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    hltable,
    'region-select-item': regionSelect,
    'calc-formula-note': calcFormulaNote
  },
  computed: {
    addMeterConfig() {
      return this.getConfig('addMeter')
    },
    subMeterConfig() {
      return this.getConfig('subMeter')
    },
    addFormulaConfig() {
      return this.getConfig('addFormula')
    },
    subFormulaConfig() {
      return this.getConfig('subFormula')
    }
  },
  activated() {
    this.init()
  },
  methods: {
    addMeterChangeHandle(val) {
      this.addMeterSelectedList = val // 返回的是选中的列的数组集合
    },
    subMeterChangeHandle(val) {
      this.subMeterSelectedList = val // 返回的是选中的列的数组集合
    },

    choose(type) {
      var vm = this
      var symbols = type.substr(0, 3)
      var grid = vm.$refs[type + 'Grid']
      var waitList = vm[type + 'WaitList'] //待选
      var pointids = vm.dataForm[symbols + 'Pointids']
      waitList.forEach(item => {
        vm[symbols + 'MetersSelected'].push(item)
      })
      for (let i = 0; i < waitList.length; i++) {
        let val = waitList[i]
        for (var j = 0; j < grid.tableData.length; j++) {
          if (grid.tableData[j].pointid === val.pointid) {
            if (pointids.indexOf(val.pointid) == -1) {
              pointids.push(val.pointid) //存入已选的测点
            }
            grid.tableData.splice(j, 1) //删除待选列表
          }
        }
      }
    },
    unChoose(type) {
      var vm = this
      var symbols = type.substr(0, 3)
      var waitGrid = vm.$refs[type + 'Grid']
      var pointids = vm.dataForm[symbols + 'Pointids']
      var selected = vm[type + 'SelectedList']
      var selectedGridData = vm[symbols + 'MetersSelected']
      for (let i = 0; i < selected.length; i++) {
        let val = selected[i]
        for (var j = 0; j < selectedGridData.length; j++) {
          if (selectedGridData[j].pointid === val.pointid) {
            var index = pointids.indexOf(val.pointid)
            if (index > -1) {
              pointids.splice(index, 1)
            }
            selectedGridData.splice(j, 1) //删除待选列表
            waitGrid.tableData.push(val) //存入
          }
        }
      }
      console.log(vm.dataForm[type.substr(0, 3) + 'Pointids'])
    },
    getDataList(type) {
      var vm = this
      var symbols = type.substr(0, 3)
      if (type === 'addMeter' || type === 'subMeter') {
        vm.getMeterGrid(null, symbols)
      } else if (type === 'addFormula' || type === 'subFormula') {
        vm.getFormulaGrid(null, symbols)
      }
    },
    init() {
      this.visible = true
      this.loadDetail()
    },
    loadDetail() {
      var params = this.$route.params
      if (params.formulaid === undefined) {
        return
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }
      if (params.formulaid) {
        this.dataForm.formulaid = params.formulaid
      } else {
        return
      }
      var vm = this
      this.$http.ajaxGet(
        `/pob/calcFormula/info/${this.dataForm.formulaid}`,
        {},
        res => {
          let data = res.meter
          vm.dataForm.formulaName = data.formulaName
          vm.dataForm.regionid = data.parentId
          vm.dataForm.regionName = data.regionName
          vm.dataForm.formulaType = data.formulaType
          vm.dataForm.factorType = data.factorType
          vm.dataForm.addPointids = vm.strToArray(data.addPointids)
          vm.dataForm.addFormulaids = vm.strToArray(data.addFormulaids)
          vm.dataForm.subPointids = vm.strToArray(data.subPointids)
          vm.dataForm.subFormulaids = vm.strToArray(data.subFormulaids)
          console.log(data.addPointids)
          vm.getMeters(data.addPointids, 'add')
          vm.getMeters(data.subPointids, 'sub')
          vm.getFormulas(data.addFormulaids, 'add')
          vm.getFormulas(data.subFormulaids, 'sub')
          this.getDataList()
        }
      )
    },
    getFormulaGrid(formulaType, type) {
      var vm = this
      var grid = this.$refs[type + 'FormulaGrid']
      grid.loadData(
        {
          formulaType: formulaType,
          //regionid : this.dataForm.filterRegionid?this.dataForm.filterRegionid:'',
          page: 1,
          limit: 300,
          notInIds: this.dataForm.formulaid
        },
        function(res) {
          vm[type + 'Formulas'] = res.page.list
        }
      )
    },
    getMeterGrid(loopUsedType, type) {
      var vm = this
      if (loopUsedType) {
        vm.dataForm.loopUsedType = loopUsedType
      }
      var grid = this.$refs[type + 'MeterGrid']
      grid.loadData(
        {
          loopUsedType: vm.dataForm.loopUsedType,
          commaddress: vm.dataForm.commaddress,
          regionid: this.dataForm.filterRegionid
            ? this.dataForm.filterRegionid
            : ''
        },
        function(res) {
          vm[type + 'Meters'] = res.page.list
        }
      )
    },
    getMeters(pointids, type) {
      var vm = this
      vm.$http.ajaxGet(
        '/pob/meter/list/',
        {
          pointids: pointids,
          page: 1,
          limit: 500
        },
        res => {
          vm[type + 'MetersSelected'] = res.page.list
        }
      )
    },
    getFormulas(formulaids, type) {
      var vm = this
      this.$http.ajaxGet(
        '/pob/calcFormula/list/',
        {
          formulaids: formulaids,
          page: 1,
          limit: 500
        },
        res => {
          vm[type + 'FormulasSelected'] = res.page.list
        }
      )
    },

    selectedHandle(type, row) {
      var vm = this
      var symbols = type.substr(0, 3)
      var id = null,
        ids = null,
        selecteds = null
      var finded = false
      if (type === 'addMeter' || type === 'subMeter') {
        id = row.pointid
        ids = vm.dataForm[symbols + 'Pointids']
        selecteds = this[symbols + 'MetersSelected']
        finded = selecteds.some(function(item) {
          return item.pointid === id
        })
      } else if (type === 'addFormula' || type === 'subFormula') {
        id = row.formulaid
        ids = vm.dataForm[symbols + 'Formulaids']
        selecteds = vm[symbols + 'FormulasSelected']
        finded = selecteds.some(function(item) {
          return item.formulaid === id
        })
      }
      if (ids.indexOf(id) == -1) {
        ids.push(id)
        if (!finded) {
          selecteds.push(row)
        }
      } else {
        //this.$message.warning("已经添加过了")
      }
    },
    selectedAll(type) {
      var vm = this
      var grid = vm.$refs[type + 'Grid']
      grid.tableData.forEach(item => {
        vm.selectedHandle.call(vm, type, item)
      })
    },
    clearAll(type) {
      this.dataForm[type] = []
    },
    getSelectRegion(data) {
      this.dataForm.regionid = data.id
      this.dataForm.regionName = data.label
    },
    getFilterRegion(data) {
      this.dataForm.filterRegionid = data.id
      this.dataForm.filterRegionName = data.label
      this.getDataList()
    },
    strToArray(str, split) {
      if (!str || str.length == 0) {
        return []
      }
      let tmp = [],
        tmpStr = str.split(',')
      tmpStr.forEach(function(item) {
        tmp.push(parseInt(item))
      })
      return tmp
    },
    getConfig(type) {
      return {
        isShowSelection: true,
        isShowRowIndex: true,
        hideShowExcel: true,
        //rowButtonType: 4,
        //			    btnWidth : 100 ,
        //			    buttons : [{
        //			      	label : '选择1',
        //		      		handler : (row,refTable,a,b) => {
        //		      			var _this = refTable.multipleTable.$parent
        //		      			for(var i=0;i<10;i++){
        //		      				if(_this.choose){
        //		      					_this.choose(type,row)
        //		      					break;
        //		      				}else{
        //		      					_this = _this.$parent
        //		      				}
        //		      			}
        //		      			//var _this = refTable.multipleTable.$parent.$parent.$parent.$parent.$parent
        //		      			//_this.selectedHandle(type,row)
        //		      		}
        //			    }],
        isShowPage: true
      }
    },
    dataFormSubmit() {
      var vm = this
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return
        }
        var form = {
          parentId: this.dataForm.regionid,
          parentType: 0,
          formulaid: this.dataForm.formulaid,
          formulaName: this.dataForm.formulaName,
          formulaType: this.dataForm.formulaType,
          factorType: this.dataForm.factorType,
          addPointids: this.dataForm.addPointids.join(','),
          addFormulaids: this.dataForm.addFormulaids.join(','),
          subPointids: this.dataForm.subPointids.join(','),
          subFormulaids: this.dataForm.subFormulaids.join(',')
        }
        this.$http.ajaxPost(
          `/pob/calcFormula/${!this.dataForm.formulaid ? 'add' : 'update'}`,
          form,
          res => {
            vm.$message.success('操作成功')
            //this.visible = false
            vm.$emit('refreshDataList')
            vm.$router.push({ name: 'pob-calcFormula' })
          },
          msg => {
            vm.$message.error(msg)
          }
        )
      })
    },
    showNote() {
      this.calcFormulaNoteVisible = true
      this.$nextTick(() => {
        this.$refs.calcFormulaNoteRef.init()
      })
    }
  }
}
</script>
<style></style>
