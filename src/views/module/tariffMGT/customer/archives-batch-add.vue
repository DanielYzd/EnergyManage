<template>
	<el-dialog title="批量导入" :close-on-click-modal="false" :visible.sync="visible">
		<el-steps :active="active" finish-status="success">
			<el-step title="选择应用场景"></el-step>
			<el-step title="下载Excel模板"></el-step>
			<el-step title="上传导入"></el-step>
		</el-steps>
		<el-form :model="dataForm" style="margin-top:10px;" label-width="140px" size="small">
			<div v-if="active === 0">
				<!--	  		<el-form-item label="应用模式">
				<el-radio-group v-model="dataForm.appModeid" v-for="(type, index) in appModeList" key="0" @change="changeAppModeHandler">
			      <el-radio :key="type.appid" :label="type.appid" style="width:240px;">{{type.name}}</el-radio>
			    </el-radio-group>
			</el-form-item>-->
				<template v-if="dataForm.appModeid === 0">
					<el-form-item label="应用场景类型">
						<el-radio-group v-model="dataForm.appType" v-for="(type, index) in appTypeList" key="1" @change="changeHandler">
							<el-radio :key="type.appid" :label="type.appid" style="width:180px;">{{type.name}}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="场景结构示例">
						<el-tree v-if="dataForm.appType === 0" :data="data" default-expand-all :props="defaultProps"></el-tree>
						<el-tree v-if="dataForm.appType === 1" :data="data1" default-expand-all :props="defaultProps"></el-tree>
						<el-tree v-if="dataForm.appType === 2" :data="data2" default-expand-all :props="defaultProps"></el-tree>
						<el-tree v-if="dataForm.appType === 3" :data="data3" default-expand-all :props="defaultProps"></el-tree>
					</el-form-item>
				</template>
				<region-select label="所属区域" v-model="dataForm.regionName" @getRegion="getSelectRegion"></region-select>
			</div>
			<div v-if="active === 1">
				<el-form-item>
					<el-button type="success" icon="el-icon-download" @click="downLoadExcelTemplate">下载对应档案模板</el-button>
				</el-form-item>
			</div>
			<div v-if="active === 2">
				<el-form-item>
					<el-upload class="upload-demo" :action="url" :before-upload="beforeUploadHandle" multiple :limit="3" drag ref="upload" :file-list="fileList" :onError="handlerError" :onSuccess="handlerSuccess" accept=".xls" :auto-upload="true">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传xls文件，且不超过10M</div>
					</el-upload>
					<!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
				</el-form-item>
			</div>
		</el-form>
		<el-button style="margin-top: 12px;" @click="back" v-if="active>0">上一步</el-button>
		<el-button style="margin-top: 12px;" @click="next" v-if="active<2">下一步</el-button>
		<el-button style="margin-top: 12px;" @click="()=>{this.visible=false}" v-if="active==2">关闭</el-button>
	</el-dialog>
</template>

<script>
	import regionSelect from '@/views/modules/pob/region-select'
	export default {
		components: {
			regionSelect
		},
		data() {
			return {
				visible: false,
				active: 0,
				url: '',
				fileList: [],
				//appModeList : [{appid:0,name:"简单模式"},{appid:1,name:"复杂模式"}],
				appTypeList: [{
					appid: 0,
					name: "租户和设备(表、开关)"
				}
				// , {
				// 	appid: 1,
				// 	name: "小区"
				// }, {
				// 	appid: 2,
				// 	name: "其他"
				// }
				, {
					appid: 3,
					name: "租户、房间分摊"
				}],
				dataForm: {
					regionid: null,
					regionName: '',
					appType: 0,
					appModeid: 0
				},
				data: [{
					label: '管理区域',
					children: [{
						label: '能耗客户',
						children: [{
							label: '电表1'
						},{
							label: '水表1'
						}]
					}]
				}],
				data1: [{
					label: '小区名称',
					children: [{
						label: '楼栋号、楼栋名称',
						children: [{
							label: '门牌号、用户名称'
						}]
					}]
				}],
				data2: [{
					label: '建筑名称',
					children: [{
						label: '用户1名称'
					}, {
						label: '用户1名称'
					}]
				}],
				data3: [{
					label: '园区名称',
					children: [{
						label: '楼栋',
						children: [{
							label: '房间名称',
							children: [{
								label: '租户名称'
							}]
						}]
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		computed: {
			myHeaders() { //:headers="myHeaders"
				return {
					token: this.$cookie.get('token')
				}
			}
		},
		methods: {
			init() {
				this.visible = true
				this.active = 0
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
			getSelectRegion(data) {
				this.dataForm.regionid = data.id
				this.dataForm.regionName = data.label;
				this.url = this.$http.adornUrl(`/pob/insertTemplate/batchImport?appType=${this.dataForm.appType}&regionid=${this.dataForm.regionid}&token=${this.$cookie.get('token')}`)
			},
			downLoadExcelTemplate() {
				var xlsName = encodeURIComponent("基础档案模板.xls")
				var url = `/static/excel/app${this.dataForm.appType}/${xlsName}`
				window.open(window.SITE_CONFIG.cdnUrl + url)
				/*var turnForm = document.createElement("form");   
			    document.body.appendChild(turnForm);
			    turnForm.method = 'get';
			    console.log(url)
			 	turnForm.action = url;
			 	turnForm.target = '_blank';
			    turnForm.submit();*/
			},
			handlerError(res) {
				this.url = this.$http.adornUrl(`/pob/insertTemplate/batchImport?appType=${this.dataForm.appType}&regionid=${this.dataForm.regionid}&token=${this.$cookie.get('token')}`)
				this.fileList = []
				this.$message.error(res.msg)
			},
			handlerSuccess(res, file, fileList) {
				this.url = this.$http.adornUrl(`/pob/insertTemplate/batchImport?appType=${this.dataForm.appType}&regionid=${this.dataForm.regionid}&token=${this.$cookie.get('token')}`)
				this.fileList = []
				if(res.code === 0) {
					this.$message({
						message: '恭喜你，导入成功',
						type: 'success'
					});
					this.$emit('refreshDataList')
				} else {
					this.$message.error(res.msg)
				}
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			beforeUploadHandle: function(file) {

			},
			changeHandler(value) {
				this.dataForm.appType = value;
			},
			changeAppModeHandler(value) {
				if(value === 1) {
					this.dataForm.appType = 3;
				} else {
					this.dataForm.appType = 0;
				}
			}
		}
	}
</script>

<style>

</style>