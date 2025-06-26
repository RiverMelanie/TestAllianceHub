<template>
	<div class="container">
	<div class="login-type" v-if="!showLoginForm && !showRegisterForm && !showUserRegisterForm">      
	<h2>请选择您要进行的操作</h2>
      <el-button type="primary" @click="selectLoginType('user')">企业用户登录</el-button>
      <el-button type="warning" @click="selectLoginType('admin')">超级管理员登录</el-button>
	  <el-button type="info" @click="showRegister">企业注册</el-button>
	  <el-button @click="showUserRegister ">用户注册</el-button>
    </div>

    <div class="box" v-if="showLoginForm && !showRegisterForm">
		<h2>{{ loginType === 'user' ? '企业用户登录' : '超级管理员登录' }}</h2>
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
		<el-button type="info" @click="backToTypeSelection">返回</el-button>
	</div>

    <div class="form-box" v-if="showRegisterForm">
      <h2>企业注册</h2>
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
        <el-form-item label="企业ID" prop="companyId">
          <el-input v-model="registerForm.companyId" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="registerForm.companyName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="registerForm.contactInfo" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        
        <el-form-item label="账号" prop="account">
          <el-input v-model="registerForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="registerForm.createTime" disabled></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitRegister">注册</el-button>
          <el-button @click="backToTypeSelection">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

	<!-- 用户注册表单部分 -->
	<div class="form-box" v-if="showUserRegisterForm">
		<h2>用户注册</h2>
		<el-form 
		:model="userRegisterForm" 
		:rules="userRegisterRules" 
		ref="userRegisterFormRef"
		label-width="120px"
		>
		<!-- 用户ID (自动生成) -->
		<el-form-item label="用户ID" prop="userId">
			<el-input v-model="userRegisterForm.userId" disabled style="width: 100%"></el-input>
		</el-form-item>
		
		<!-- 所属企业ID (必填) -->
		<el-form-item label="所属企业ID" prop="companyId">
			<el-input 
			v-model="userRegisterForm.companyId" 
			placeholder="请输入企业ID" 
			style="width: 100%"
			></el-input>
		</el-form-item>
		
		<!-- 用户名 (必填) -->
		<el-form-item label="用户名" prop="username">
			<el-input 
			v-model="userRegisterForm.username" 
			placeholder="请输入用户名" 
			style="width: 100%"
			></el-input>
		</el-form-item>

		<el-form-item label="用户昵称" prop="nickname">
			<el-input 
			v-model="userRegisterForm.nickname" 
			placeholder="请输入用户昵称" 
			style="width: 100%"
			></el-input>
		</el-form-item>

		<el-form-item label="手机号码" prop="phone">
			<el-input 
			v-model="userRegisterForm.phone" 
			placeholder="请输入手机号码" 
			style="width: 100%"
			></el-input>
		</el-form-item>

		<el-form-item label="邮箱" prop="email">
			<el-input 
			v-model="userRegisterForm.email" 
			placeholder="请输入邮箱" 
			style="width: 100%"
			></el-input>
		</el-form-item>

		<el-form-item label="性别" prop="gender">
			<el-radio-group v-model="userRegisterForm.gender">
			<el-radio :label="1">男</el-radio>
			<el-radio :label="2">女</el-radio>
			</el-radio-group>
		</el-form-item>
		
		<!-- 密码 (必填) -->
		<el-form-item label="密码" prop="password">
			<el-input 
			v-model="userRegisterForm.password" 
			type="password" 
			placeholder="请输入密码" 
			show-password 
			style="width: 100%"
			></el-input>
		</el-form-item>
		
		<el-form-item label="创建时间" prop="createTime">
			<el-input 
			v-model="userRegisterForm.createTime" 
			disabled 
			style="width: 100%"
			></el-input>
		</el-form-item>
		
		<el-form-item>
			<el-button type="primary" @click="submitUserRegister">注册</el-button>
			<el-button @click="backToTypeSelection">返回</el-button>
		</el-form-item>
		</el-form>
	</div>

	</div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user.ts';

	let router=useRouter()
	let store = useUserStore()
	let uname=ref("")
	let upwd=ref("")

	let loginType = ref("") 
	let showLoginForm = ref(false)
	let showRegisterForm = ref(false)
	let showUserRegisterForm = ref(false)

	function showUserRegister() {
		showUserRegisterForm.value = true;
		getNextUserId(); // 确保进入注册页面时调用
		userRegisterForm.value.createTime = new Date().toLocaleString();
	}
	
	// 仅当用户点击注册按钮时调用
	function showRegister() {
		showRegisterForm.value = true;
		getNextCompanyId(); // 延迟到真正需要时再调用
	}

	function selectLoginType(type: string) {
		loginType.value = type
		showLoginForm.value = true
	}

	// 返回选择界面
	function backToTypeSelection() {
		showLoginForm.value = false;
		showRegisterForm.value = false;
		registerFormRef.value?.resetFields();
		registerForm.value.createTime = new Date().toLocaleString();
		uname.value = ""
		upwd.value = ""
		showUserRegisterForm.value = false;
	}

	function login(){
		let user={
			uname:uname.value,
			upwd:upwd.value,
			loginType: loginType.value // 告诉后端当前选择的登录类型
		}
		axios.post("http://localhost:8080/login",user)
		.then(res=>{
			if(res.data.success){
				ElMessage.success("登录成功")

				if(loginType.value === 'user') {
					router.push("/home") // 用户主页
				} else {
					router.push("/Managerhome") // 管理员主页
				}

			}else{
				ElMessage.error(res.data.message ||"登录失败")
			}
		})
	}

	// 注册表单数据
	const registerForm = ref({
		companyId: '',
		companyName: '',
		contactInfo: '',
		account: '',
		password: '',
		createTime: new Date().toLocaleString()
	});

	// 注册表单验证规则
	const registerRules: FormRules = {
		companyName: [
			{ required: true, message: '请输入企业名称', trigger: 'blur' },
			{ min: 2, max: 255, message: '长度在2到255个字符', trigger: 'blur' }
		],
		contactInfo: [
			{ required: true, message: '请输入联系方式', trigger: 'blur' }
		],
		account: [
			{ required: true, message: '请输入账号', trigger: 'blur' },
			{ min: 4, max: 50, message: '长度在4到50个字符', trigger: 'blur' }
		],
		password: [
			{ required: true, message: '请输入密码', trigger: 'blur' },
			{ min: 6, max: 100, message: '长度在6到100个字符', trigger: 'blur' }
		]
	};

	const registerFormRef = ref<FormInstance>();

	// 获取下一个企业ID
	async function getNextCompanyId() {
		try {
			const response = await axios.get('http://localhost:8080/company/next-id');
			registerForm.value.companyId = response.data.nextId;
		} catch (error) {
			console.error('获取企业ID失败:', error);
			ElMessage.error('获取企业ID失败');
		}
	}

	// 提交注册
	async function submitRegister() {
		try {
			await registerFormRef.value?.validate();
			
			const response = await axios.post('http://localhost:8080/company/register', {
				company_name: registerForm.value.companyName,
				contact_info: registerForm.value.contactInfo,
				account: registerForm.value.account,
				password: registerForm.value.password
			});
			
			if (response.data.success) {
				ElMessage.success('企业注册成功');
				backToTypeSelection();
			} else {
				ElMessage.error(response.data.message || '注册失败');
			}
		} catch (error) {
			console.error('注册失败:', error);
			ElMessage.error('注册失败');
		}
	}

	// 组件挂载时获取下一个企业ID
	onMounted(() => {
		getNextCompanyId();
	});

	// 用户注册表单数据
	const userRegisterForm = ref({
		userId: '',
		companyId: '',
		username: '',
		nickname: '',
		phone: '',
		email: '',
		gender: null,
		password: '',
		createTime: new Date().toLocaleString()
	});

	// 用户注册表单验证规则
	const userRegisterRules = {
		companyId: [
			{ required: true, message: '请输入企业ID', trigger: 'blur' },
			{ pattern: /^\d+$/, message: '企业ID必须为数字', trigger: 'blur' }
		],
		username: [
			{ required: true, message: '请输入用户名', trigger: 'blur' },
			{ min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
		],
		nickname: [
			{ required: true, message: '请输入昵称', trigger: 'blur' },
			{ min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
		],
		phone: [
			{ required: true, message: '请输入手机号码', trigger: 'blur' },
		],
		email: [
			{ required: true, message: '请输入邮箱', trigger: 'blur' },
			{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
		],
		gender: [
			{ required: true, message: '请选择性别', trigger: 'change' }
		],
		password: [
			{ required: true, message: '请输入密码', trigger: 'blur' },
			{ min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
		],
	};

	var userRegisterFormRef = ref<FormInstance>();

		// 获取下一个用户ID
	async function getNextUserId() {
			try {
				const response = await axios.get('http://localhost:8080/next-id');
				if (response.data.success) {
					userRegisterForm.value.userId = response.data.nextId; // 确保绑定到表单
				} else {
					ElMessage.error(response.data.message || '获取用户ID失败');
				}
			} catch (error) {
				console.error('获取用户ID失败:', error);
				//ElMessage.error('获取用户ID失败: ' + (error.response?.data?.message || error.message));
			}
		
	}

	// 提交用户注册
	async function submitUserRegister() {
		// 添加判断确保表单引用存在
		if (!userRegisterFormRef.value) {
			ElMessage.error('表单初始化失败');
			return;
		}
		try {
			// 先验证表单
			await userRegisterFormRef.value.validate();

			const response = await axios.post('http://localhost:8080/register', {
				company_id: Number(userRegisterForm.value.companyId),
				username: userRegisterForm.value.username,
				nickname: userRegisterForm.value.nickname,
				phone: userRegisterForm.value.phone,
				email: userRegisterForm.value.email ,
				gender: userRegisterForm.value.gender ,
				password: userRegisterForm.value.password,
			});
			
			if (response.data.success) {
				ElMessage.success('注册成功');
				backToTypeSelection();
			} else {
				ElMessage.error(response.data.message || '注册失败');
			}
		} catch (error:any) {
			if (error.response) {
				ElMessage.error(error.response.data.message || '注册失败');
			} else {
				ElMessage.error('注册失败: ' + error.message);
			}
			ElMessage.error('注册失败' );
		}
	}
</script>

<style scoped>
	.box {
		border: 1px solid #A9a9a9;
		width: 250px;
		padding: 20px;
		border-radius: 10px;
		background-color: rgb(127, 232, 255);
	}
	.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	}

	.login-type {
	border: 1px solid #fefbfb;
	width: 300px;
	padding: 30px;
	border-radius: 10px;
	background-color: rgb(127, 232, 255);
	text-align: center;
	}

	.form-box {
	border: 1px solid #f8f5f5;
	width: 500px;
	padding: 30px;
	border-radius: 10px;
	background-color: rgb(127, 232, 255);
	}

	.el-button {
	margin: 10px;
	}
</style>