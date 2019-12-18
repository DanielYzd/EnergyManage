<template>
	<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" size="small" label-width="140px">
			<region-select-item label="应用区域" v-model="dataForm.regionName" @getRegion="getSelectRegion" prop="regionName"></region-select-item>
			<el-form-item label="结算周期">
				<el-select v-model="dataForm.circleId" placeholder="结算周期" style="width:220px">
					<el-option v-for="item in circleList" :key="item.clearingCircleid" :label="item.circleName" :value="item.clearingCircleid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
	import { treeDataTranslate } from '@/utils'
	import regionSelect from '@/views/modules/pob/region-select'
	export default {
		data() {
			return {
				visible: false,
				dataForm: {
					id: 0,
					circleId: '',
					regionId: 0,
					regionName: ''
				},
				circleList: [],
				dataRule: {
					regionName: [{
						required: true,
						message: '所属区域不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted(){
			this.$http.ajaxGet('/ppfClearingCircle/list', {}, (res) => {
				this.circleList = res.data;
			})
		},
		components: {
			'region-select-item': regionSelect
		},
		methods: {
			init(id) {
				this.dataForm.id = id || 0
				this.visible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
				})
				if(this.dataForm.id) {
					var vm = this;
					this.$http.ajaxGet(`/pob/region/config/${this.dataForm.id}`, {}, (res) => {
						let data = res.data;
						vm.dataForm.circleId = data.circleId
						vm.dataForm.regionId = data.regionId
						vm.dataForm.regionName = data.regionName
					})
				}
			},
			getSelectRegion(data) {
				this.dataForm.regionId = data.id
				this.dataForm.regionName = data.label;
			},
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if(!valid) {
						return;
					}
					var form = {
						id: this.dataForm.id,
						circleId: this.dataForm.circleId,
						type: this.dataForm.type,
						unitType: this.dataForm.unitType,
						regionId: this.dataForm.regionId
					}
					this.$http.ajaxPost(`/pob/region/config/${!this.dataForm.id ? 'save' : 'update'}`, form, () => {
						this.$message.success('保存成功')
						this.visible = false
						this.$emit('refreshDataList')
					}, () => {
						this.$message.error('保存失败')
					})
				})
			}
		}
	}
</script>
<style>

</style>