<template>
	<el-dialog custom-class="dialogcommon" :title="!dataForm.regionid ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
			label-width="120px" size="small">
			<el-form-item label="区域名称" prop="regionName">
				<el-input v-model="dataForm.regionName" placeholder="区域名称"></el-input>
			</el-form-item>
			<el-form-item label="短信签名" prop="regionCode">
				<el-input v-model="dataForm.regionCode" placeholder="短信签名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        regionid: null,
        regionName: '',
        regionCode: '',
        parentid: null,
        layer: 0
      },
      dataRule: {
        regionName: [
          { required: true, message: '所属区域不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, parentid, layer) {
      this.dataForm.regionid = id || null
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.regionid) {
        this.$http.ajaxGet(
          `/pob/region/info/${this.dataForm.regionid}`,
          {},
          data => {
            this.dataForm.regionName = data.region.regionName
            this.dataForm.regionCode = data.region.regionCode
            this.dataForm.parentid = data.region.parentid
            this.dataForm.layer = data.region.layer
          }
        )
      } else {
        this.dataForm.parentid = parentid
        this.dataForm.layer = layer
      }
    },
    dataFormSubmit() {
      this.$http({
        url: this.$http.adornUrl(
          `/pob/region/${!this.dataForm.regionid ? 'add' : 'update'}`
        ),
        method: 'post',
        data: this.$http.adornData({
          regionId: this.dataForm.regionid || undefined,
          regionName: this.dataForm.regionName,
          regionCode: this.dataForm.regionCode,
          parentid: this.dataForm.parentid,
          layer: this.dataForm.layer
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
  }
}
</script>

<style></style>
