<template>
	<el-dialog custom-class="dialogcommon" :title="isAdd ? '新增' : '修改'" :close-on-click-modal="false"
		:visible.sync="visible">
		<el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px"
			size="small">
			<el-form-item label="终端地址" prop="commaddress">
				<el-input v-model="dataForm.commaddress" placeholder="终端地址" style="width:80%"></el-input>
			</el-form-item>
			<el-form-item label="任务号" prop="taskid">
				<el-input-number v-model="dataForm.taskid" :min="1" :max="64"></el-input-number>
			</el-form-item>
			<el-form-item label="启用标志" prop="iseffectFlag">
				<el-switch v-model="dataForm.iseffectFlag" on-text="有效" off-text="无效" on-value="1" off-value="0">
				</el-switch>
			</el-form-item>
			<el-form-item label="任务模板" prop="schemeid">
				<el-select v-model="dataForm.schemeid" placeholder="请选择任务模板" style="width:80%"
					@change="schemeChangeHandler">
					<el-option v-for="item in schemeList" :key="item.schemeid" :label="item.disc"
						:value="item.schemeid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="任务模板数据项" prop="di">
				<el-input type="textarea" v-model="dataForm.di" disabled style="width:80%"></el-input>
			</el-form-item>
			<el-form-item style="display: block;padding-left: 80px;">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="dataFormSubmit()">保存</el-button>
				<el-button type="primary" @click="dataFormSubmit(true)">保存并下发</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      isAdd: true,
      dataForm: {
        tid: null,
        rtuid: null,
        commaddress: '',
        schemeid: 1,
        taskid: 0,
        iseffect: 1,
        iseffectFlag: true,
        di: ''
      },
      schemeList: []
    }
  },
  methods: {
    init(row, rtuAddr) {
      this.visible = true
      this.$nextTick(() => {
        this.dataForm.tid = null
        this.$refs['dataForm'].resetFields()
        if (row) {
          this.isAdd = false
        } else {
          this.isAdd = true
        }
        this.$http.ajaxGet('/remote/task/schemelist', {}, res => {
          this.schemeList = res.data
          if (row) {
            this.dataForm.rtuid = row.rtuid
            this.dataForm.commaddress = row.commaddress
            this.dataForm.schemeid = row.schemeid
            this.dataForm.taskid = row.taskid
            this.dataForm.iseffect = row.iseffect
            this.dataForm.iseffectFlag = row.iseffect === 1
            this.dataForm.tid = row.tid
          } else {
            this.dataForm.schemeid = this.schemeList[0].schemeid
            this.dataForm.commaddress = rtuAddr
            this.dataForm.iseffectFlag = true
            this.dataForm.iseffect = 1
          }
          this.schemeChangeHandler(this.dataForm.schemeid)
        })
      })
    },
    schemeChangeHandler(schemeid) {
      this.schemeList.some(item => {
        if (item.schemeid == schemeid) {
          this.dataForm.di = item.di
          return true
        }
      })
    },
    dataFormSubmit(isSend) {
      this.$http.ajaxGet(
        `/pob/rtu/select/${this.dataForm.commaddress}`,
        {},
        data => {
          if (!data.rtu || !data.rtu.rtuid) {
            this.$message.error(
              this.dataForm.commaddress + '的终端不存在，请输入正确的终端地址！'
            )
            return
          }
          var params = [
            {
              rtuid: data.rtu.rtuid,
              tid: this.dataForm.tid,
              schemeid: this.dataForm.schemeid,
              taskid: this.dataForm.taskid,
              iseffect: this.dataForm.iseffectFlag ? 1 : 0
            }
          ]
          this.doSave(isSend, params)
        },
        msg => {
          this.$message.error(msg)
        }
      )
    },
    doSave(isSend, params) {
      this.$http.ajaxPost(
        `/remote/task/${this.isAdd ? 'insert' : 'update'}`,
        params,
        data => {
          this.$message.success('操作成功')
          this.visible = false
          if (this.isAdd) {
            params = data.data
          }
          this.$emit('saveCallBack', isSend ? params : null)
        },
        msg => {
          this.$message.error(msg)
        }
      )
    }
  }
}
</script>

<style>
</style>