<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-card class="box-card">
      <el-form
        :model="dataForm"
        label-width="120px"
        label-position="right"
        size="small"
      >
        <el-form-item label="门牌号">
          <el-input v-model="dataForm.doorplate" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="户名">
          <el-input v-model="dataForm.hm" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="dataForm.address" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            v-model="dataForm.telephone"
            style="width: 60%;"
            :disabled="disabledFlag"
          ></el-input>
          <!--<el-tooltip effect="dark" placement="top-start">
					<div slot="content">修改手机号码</div>
		    		<el-button  v-if="isAuth('pob:customer:save') && disabledFlag"  type="warning"
		    			@click.prevent="disabledFlag = false"  icon="el-icon-edit"></el-button>
		    	</el-tooltip>
	    		<el-tooltip effect="dark" placement="top-start">
					<div slot="content">确定</div>
		    		<el-button  v-if="isAuth('pob:customer:save') && !disabledFlag"  type="success"
		    			@click.prevent="modifyTelephone()"  icon="el-icon-check"></el-button>
		    	</el-tooltip>-->
        </el-form-item>
        <el-form-item :label="optType === 2 ? '调整前账户余额' : '账户余额'">
          <el-input v-model="dataForm.balance" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="调整后账户金额" v-if="optType === 2">
          <el-input-number
            style="width: 200px;"
            v-model="dataForm.adjustCash"
            :step="50"
            :max="50000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="调剂原因" v-if="optType === 2">
          <el-select
            v-model="dataForm.adjustType"
            placeholder="调剂原因"
            clearable
          >
            <el-option
              v-for="item in adjustTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调剂说明" v-if="optType === 2">
          <el-input v-model="dataForm.adjustReason" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="缴费金额" v-if="optType === 0">
          <el-input-number
            style="width: 200px;"
            v-model="dataForm.czje"
            :step="50"
            :min="0"
            :max="50000"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button @click="visible = false">取消</el-button>
          <el-button
            :loading="loading"
            type="primary"
            @click="dataFormSubmit()"
            >{{ optType === 1 ? '发送短信' : '确定' }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </el-dialog>
</template>

<script>
import tool from '@/utils/tool'
const OPT_PAY = 0
const OPT_REMIND = 1
export default {
  data() {
    return {
      visible: false,
      disabledFlag: true,
      loading: false,
      optType: 0,
      adjustTypeList: [
        { value: 0, key: '新表预置' },
        { value: 1, key: '换表追补' },
        { value: 2, key: '销户退补' },
        { value: 3, key: '其他原因' }
      ],
      dataForm: {
        customerid: 0,
        doorplate: '',
        hm: '',
        telephone: '',
        address: '',
        balance: '',
        smsContent: '',
        adjustType: null,
        adjustCash: 0,
        czje: 1000
      }
    }
  },
  computed: {
    title() {
      if (this.optType === 0) {
        return '缴费'
      } else if (this.optType === 1) {
        return '短信催费'
      } else if (this.optType === 2) {
        return '退补调剂'
      }
    }
  },
  methods: {
    init(optType, customerInfo) {
      this.visible = true
      this.loading = false
      this.optType = optType
      if (customerInfo) {
        this.dataForm.customerid = customerInfo.customerid
        this.dataForm.doorplate = customerInfo.doorplate
        this.dataForm.hm = customerInfo.hm
        this.dataForm.telephone = customerInfo.telephone
        this.dataForm.address = customerInfo.address
        this.dataForm.balance = customerInfo.syje
      }
    },
    dataFormSubmit() {
      this.loading = true
      if (this.optType === 0) {
        this.toPay()
      } else if (this.optType === 1) {
        this.toSendSms()
      } else if (this.optType === 2) {
        this.toAdjust()
      }
    },
    toPay() {
      this.$http.ajaxGet(
        '/ppf/customer/recharge',
        {
          customerid: this.dataForm.customerid,
          czje: this.dataForm.czje
        },
        resOk => {
          this.visible = false
          this.$message.success('操作成功')
          this.loading = false
        },
        resError => {
          this.$message.error(resError.msg)
          this.loading = false
        }
      )
    },
    toSendSms() {
      this.$http.ajaxPost(
        '/ppf/customer/lessMoneySms',
        [this.dataForm.customerid],
        resOk => {
          this.$message({
            message: '发送成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
            }
          })
          this.loading = false
        },
        resError => {
          this.$message.error(resError.msg)
          this.loading = false
        }
      )
    },
    toAdjust() {
      if (!this.dataForm.adjustType && this.dataForm.adjustType !== 0) {
        this.$message.error('至少选择一个调剂原因')
        this.loading = false
        return
      }
      var adjustCash = this.dataForm.adjustCash - this.dataForm.balance
      let params = {
        customerid: this.dataForm.customerid,
        adjustCash: adjustCash,
        adjustType: this.dataForm.adjustType,
        adjustReason: this.dataForm.adjustReason || ''
      }
      this.$http.ajaxGet(
        '/ppf/customer/adjust',
        params,
        resOk => {
          this.$message.success('退补调剂成功')
          this.loading = false
          this.visible = false
          this.$emit('refreshDataList')
        },
        resError => {
          this.$message.error(resError.msg)
          this.loading = false
        }
      )
    },
    modifyTelephone() {
      this.disabledFlag = true
    }
  }
}
</script>

<style scoped>
.el-dialog__body {
  padding: 10px 20px;
}
.el-input.is-disabled .el-input__inner {
  color: #45c2b5;
}
</style>
