<template>
	<el-form-item :label="label">
	    <el-date-picker
			v-bind:value="currentValue"
	      	align="right"
	      	type="date"
	      	value-format="yyyy-MM-dd" format="yyyy-MM-dd"
	      	placeholder="选择日期" @input="handleInput"  style="width: 140px;" @change="handleChange"
	      	:picker-options="dayPickerOptions">
    	</el-date-picker>
	</el-form-item>
</template>

<script>
	export default{
		computed:{
		    currentValue:function () {
		      return this.value
		    }
		},
		props : ['value','label'],
		data(){
			return {
				dayPickerOptions : {
		          disabledDate(time) {
		            return time.getTime() > Date.now();
		          },
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周前',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }]
		        }
			}
		},
		methods:{
		    handleInput(value) {
		      this.$emit('input', value);
		    },
		    handleChange(value) {
		      this.$emit('change', value);
		    }
		}
	}
</script>

<style>
</style>