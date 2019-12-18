<template>
  <div class="custom-tree-container">
    <batch-add v-if="batchAddVisible" ref="batchAdd" @refreshDataList="getDataList"></batch-add>
    <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="区域结构" name="regionStruts">
    		<el-form :inline="true" :model="dataForm" size="small">
      <el-form-item>
        <el-button v-if="isAuth('pob:region:save')" type="primary" @click="appendRoot" icon="el-icon-circle-plus-outline">新增区域</el-button>
      </el-form-item>
      <el-form-item>
      	<el-button v-if="isAuth('pob:region:save')" type="primary" @click="batchAddHandle()" icon="el-icon-document">档案批量导入</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      :data="regionList"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            增加子级
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => modify(node, data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    </el-tab-pane>
    <el-tab-pane label="区域配置" name="second">
    	<region-config></region-config>
    </el-tab-pane>
    </el-tabs>
  <div class="block">
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</div>
</template>
<script>
  import { showSuccessMsgBox,showFailMsgBox } from '@/utils'
	import batchAdd from './archives-batch-add'
	import AddOrUpdate from './region-add-or-update'
	import regionConfig from './region-config'
  export default {
		components:{
			batchAdd,AddOrUpdate,regionConfig
		},
    data () {
    	const id = 1000;
      const data = [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1',
	        children: [{
	            id: 10,
	            label: '四级 1-1-1-1'
	        }]
          }]
        }]
      }]
      return {
      	activeName : 'regionStruts',
      	dataForm: {},
      	dataList: [],
        dataListLoading: false,
        regionList: [],//JSON.parse(JSON.stringify(data)),
        addOrUpdateVisible: false,
		    batchAddVisible :false 
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (callback) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/pob/region/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          let result = []
          this.getTree(data.data,result,true)
          this.regionList = result
          this.dataListLoading = false
          if(callback){
          	callback();
          }
        })
      },
      getTree(data,result,rootFlag){
      	if(rootFlag){
      		let accountRegionId = this.$cookie.get("accountRegionId") || 0 
      		accountRegionId = parseInt(accountRegionId)
	      	for (var i = 0; i < data.length; i++) {
	      		if(data[i].parentid === 0 || data[i].regionId=== accountRegionId ){
	      			result.push({
	      				id : data[i].regionId,
	      				label :data[i].regionName,
	      				layer : data[i].layer
	      			})
	      		}
	      	}
      	}
      	var tmp = data ;
      	for (var m = 0; m < result.length; m++) {
      			var node = result[m];
      	    for (var j = 0; j < tmp.length; j++) {
	      	    	if(node.children === undefined){
	      					node.children = []
	      			}
	      			if(tmp[j].parentid=== node.id){
	      				var childNode = {
		      				id : tmp[j].regionId,
		      				label :tmp[j].regionName,
	      				  layer : tmp[j].layer
	      				}
	      				node.children.push(childNode);
	      			}
	      		}
      	    if(node.children.length>0){
      	    	this.getTree(data,node.children,false)
      	    }
      	    
      	}
      },
      appendRoot(){
      	this.addOrUpdateVisible = true
        this.$nextTick(() => {
      			this.$refs.addOrUpdate.init(null,0,1)
    		})
      	/*this.$prompt('请输入跟节点名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{2}$/,
          inputErrorMessage: '至少输入2个字符'
        }).then(({ value }) => {
          this.appendDo(value,0,1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });*/
      },
      append (data) {
      	this.addOrUpdateVisible = true
        this.$nextTick(() => {
      			this.$refs.addOrUpdate.init(null,data.id,data.layer+1)
    		})
/*        this.$prompt('请输入子区域节点名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{2}$/,
          inputErrorMessage: '至少输入2个字符'
        }).then(({ value }) => {
          if (!data.children) {
          	this.$set(data, 'children', []);
        	}
          this.appendDo(value,data.id,data.layer+1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });*/
      },
      appendDo (regionName,parentid,layer){
      	this.$http({
              url: this.$http.adornUrl('/pob/region/add'),
              method: 'post',
              data: this.$http.adornData({
                'regionName': regionName,
                'parentid': parentid,
                'layer': layer
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
      },
      remove (node, data) {
        if(data.children && data.children.length>0){
        	this.$message({
            type: 'warning',
            message: '请先删除子节点'
          });
          return 
        }
        this.$confirm('此操作将永久删除该节点及其子节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.removeDo(data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
	  removeDo(regionId){
	  	this.$http({
              url: this.$http.adornUrl('/pob/region/delete/'+regionId),
              method: 'post',
              data: this.$http.adornData()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
	  },
      modify (node, data) {
      	this.addOrUpdateVisible = true
        this.$nextTick(() => {
      			this.$refs.addOrUpdate.init(data.id)
    		})
/*      	this.$prompt('请输入区域节点名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.{3}$/,
          inputErrorMessage: '至少输入2个字符',
          inputValue:data.label
        }).then(({ value }) => {
          this.modifyDo(data.id,value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });*/
      },
      modifyDo (regionId, regionName) {
      	this.$http({
              url: this.$http.adornUrl('/pob/region/update'),
              method: 'post',
              data: this.$http.adornData({
              	'regionName': regionName,
                'regionId': regionId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
               	showSuccessMsgBox(this,this.getDataList(),'修改成功');
              } else {
                showFailMsgBox(data.msg)
              }
            })
      },
      // 批量导入
      batchAddHandle () {
        this.batchAddVisible = true
        this.$nextTick(() => {
          this.$refs.batchAdd.init()
        })
      }
    }
  }
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
    .el-tree-node:focus>.el-tree-node__content{
      background-color: #5daaf0;
    }
    .el-button--text:focus{
      color :#bae1dd;
    }
</style>