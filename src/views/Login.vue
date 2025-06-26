<template>
	<div class="box">
		<h2>登录</h2>
		账号: <el-input
				v-model="uname"
				style="width: 240px"
				placeholder="Please input"
				clearable
				/> <br /><br />
		密码: <el-input
				v-model="upwd"
				style="width: 240px"
				type="password"
				placeholder="Please input password"
				show-password
			  />
			  <br /><br />
		<el-button type="success" @click="login">登录</el-button>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
	let router=useRouter()
	let store = useUserStore()
	let uname=ref("")
	let upwd=ref("")
	function login(){
		let user={
			uname:uname.value,
			upwd:upwd.value
		}
		axios.post("http://localhost:8080/login",user)
		.then(res=>{
			if(res.data){
				ElMessage.success("登录成功")
				router.push("/home")
			}else{
				ElMessage.error("登录失败")
			}
		})
	}
</script>

<style scoped>
	.box{
		border: 1px solid #A9a9a9;
		width: 300px;
		height: 240px;
		border-radius: 10px;
		margin: 150px auto;
		text-align: center;
		background-color: rgb(127, 232, 255);
	}
</style>