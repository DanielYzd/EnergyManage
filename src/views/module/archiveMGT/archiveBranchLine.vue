<template>
  <div class="branchline">
    <Tree
      :defaultProps="defaultProps"
      :treeData="treeData"
      :isaccordion="true"
      :loading="loading"
      :defaultExpandAll="false"
      ref="parentTree"
      @node-click="_handleNodeClick"
      :showCollapseExpand="false"
      :defaultExpandedKeys="defaultExpandedKeys"
      nodeKey="id"
    >
      <template slot="tree-button">
        <el-button type="text" icon="el-icon-plus" @click="addline()">
          新增分线
        </el-button>
      </template>
    </Tree>
    <section class="content">
      <div v-if="type === 1">
        <branchlineAddorUpdate
          @confirm="confirm"
          @cancle="cancle"
          :branchlineData="branchlineData"
        ></branchlineAddorUpdate>
        <el-tabs
          v-if="type === 1 && id"
          v-model="activeName"
          :stretch="true"
          @tab-click="handleClick"
        >
          <el-tab-pane label="子级信息" name="first" :lazy="true">
            <branchlineSublevel
              v-if="activeName === 'first'"
            ></branchlineSublevel>
          </el-tab-pane>
          <el-tab-pane label="表计信息" name="second" :lazy="true">
            <branchlineMeter v-if="activeName === 'second'"></branchlineMeter>
          </el-tab-pane>
        </el-tabs>
      </div>

      <branchlineTransform
        v-else-if="type === 4"
        :transformData="transformData"
      ></branchlineTransform>
    </section>
  </div>
</template>

<script>
import Tree from '@/views/common/tree.vue'
import branchlineAddorUpdate from './components/branchline-add-or-update'
import branchlineTransform from './components/branchline-transform'
import branchlineSublevel from './components/branchline-sublevel'
import branchlineMeter from './components/branchline-meter'
export default {
  components: {
    Tree,
    branchlineAddorUpdate,
    branchlineTransform,
    branchlineSublevel,
    branchlineMeter
  },
  data() {
    // 档案类型0=区域，1=分线，2=建筑，3=用户，4=变压器，5=终端，6=分项，7=部门，8=表计 ,
    return {
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      defaultExpandedKeys: [],
      id: '',
      type: 0,
      branchlineData: [],
      transformData: [],
      activeName: 'first'
    }
  },
  created() {
    this.querytopline()
  },
  methods: {
    _handleNodeClick(data, node) {
      console.log(data)
      this.id = data.id
      console.log(data.id)

      this.queryoneline(data.type, data.id)
    },
    queryoneline(type, id) {
      let body = {
        id
      }
      this.$api.branchline.queryoneline(body).then(res => {
        if (type === 1) {
          this.branchlineData = res.data
          this.$nextTick(() => {
            this.type = type
          })
        } else if (type === 4) {
          this.transformData = res.data
          this.$nextTick(() => {
            this.type = type
          })
        }
      })
    },
    addline() {
      this.type = 0
      this.id = 0
      this.$nextTick(() => {
        this.branchlineData = []
        this.type = 1
      })
    },
    querytopline() {
      this.loading = true
      this.defaultExpandedKeys = []
      this.defaultExpandedKeys.push(this.id)
      this.$api.branchline.querytopline().then(res => {
        this.loop(res.data, [], '0')
        this.loading = false
      })
    },
    loop(list, data, pcode) {
      list.forEach(item => {
        if (item.parentcode === pcode) {
          let child = {
            label: item.sname,
            children: [],
            id: item.id,
            type: item.datatype,
            parentcode: item.parentcode
          }
          this.loop(list, child.children, item.id)
          data.push(child)
          this.treeData = data
          if (this.id) {
            this.$refs.parentTree.setCurrentKey(this.id)
          }
        }
      })
    },
    confirm(form, branchlineData) {
      console.log(branchlineData)

      if (branchlineData.length > 0) {
        //更新
        let temp = {
          archivetype: 1,
          id: this.id,
          mountstatus: 0
        }
        let body = { ...temp, ...form }
        this.$api.branchline.modifyline(body).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.querytopline()
            this.$nextTick(() => {
              this.type = 0
            })
          }
        })
      } else {
        let temp = {
          archivetype: 1,
          id: 0,
          mountstatus: 0
        }
        let body = { ...temp, ...form }
        this.$api.branchline.addline(body).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.querytopline()
            this.$nextTick(() => {
              this.type = 0
            })
          }
        })
      }
    },
    cancle() {
      this.type = 0
    },
    handleClick(tab, event) {
      console.log(tab, event)
      console.log(this.activeName)
    }
  }
}
</script>

<style lang="scss" scoped>
.branchline {
  display: flex;
  height: 100%;
  .content {
    padding: 0 20px;
    flex: 1;
    height: 100%;
    overflow: auto;
    .el-tabs {
      /deep/.el-tabs__content {
        overflow: visible;
      }
    }
  }
}
</style>
