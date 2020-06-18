<template>
	<el-dialog custom-class="dialogcommon" title="批量增加" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px"
			size="small">
			<el-form-item label="终端地址" prop="commaddress">
				<el-input v-model="dataForm.commaddress" placeholder="终端地址" style="width:80%"></el-input>
			</el-form-item>
			<el-form-item label="任务模板">
				<el-checkbox-group v-model="dataForm.schemeids">
					<el-checkbox v-for="item in schemeList" :key="item" :label="item">{{
            item
          }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item style="display: block;padding-left: 80px;">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="dataFormSubmit()">保存</el-button>
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
        rtuid: null,
        commaddress: '',
        schemeids: []
      },
      schemeList: [
        '正有、反有、正无、反无总电能示值曲线',
        '负荷曲线',
        '一类数据当前总尖峰平谷电能示值曲线'
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(rtuAddr) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.commaddress = rtuAddr
      })
    },
    dataFormSubmit() {
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
          var params = {
            rtuid: data.rtu.rtuid,
            schemes: this.dataForm.schemeids.join(',')
          }
          this.doSave(params)
        },
        msg => {
          this.$message.error(msg)
        }
      )
    },
    doSave(params) {
      this.$http.ajaxGet(
        `/remote/task/batchAdd`,
        params,
        data => {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('saveCallBack', null)
        },
        msg => {
          this.$message.error(msg)
        }
      )
    }
  }
}
</script>

<style></style>
