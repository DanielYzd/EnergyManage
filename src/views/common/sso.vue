<template>
	<div>
	</div>
</template>

<script>
	import tool from '@/utils/tool'
	import axios from 'axios'
	export default{
		data(){
			return{
				params : {}
			}
		},
		mounted(){
			this.init()
		},
		methods : {
			init(){
				this.params = tool.getUrlArgs(window.location.href);
				console.log(this.params)
				var token = this.params.token
				var accountRegionId = this.params.regionid
	            this.$router.push({ name: 'login',params: { token : token ,accountRegionId : accountRegionId} })
	            
			},
			testSchedulerTask(){
				this.$router.replace({ name: 'login' })
				return ;
				var t = {
					"sign": "2AF2E4EAE102C13B649D50662411511C",
					"timestamp": "1545304018909",
					"sysId": "HLSYSID655c15942baabf9a68426d001",
					"sysName": "西湖国际",
					"data": {
						"username": "系统管理员2",
						"userId": "init_000000000000000000000000002",
						"token": "1C41N156V007038710AC00000180A1A2",
						"extInfo": null
					}
				}
				var url = 'http://localhost:18861/multi-meter-fast-api/api/zjn/SSO_Request'
				var http = axios.create({
					  timeout: 1000 * 30,
					  headers: {
						'Content-Type': 'application/json; charset=utf-8'
					  }
				})
				http.post(url,t)
				.then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
				});
			}
		}
	}
</script>

<style>
</style>