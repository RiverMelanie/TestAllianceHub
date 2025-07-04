<template>
<div class="auth-container">
    <!-- 初始选择界面 -->
    <div class="selection-panel" v-if="!showLoginForm && !showRegisterForm && !showUserRegisterForm">
      <div class="logo-section">
        <h1>测盟汇</h1>
        <p>测盟汇Web端管理系统</p>
      </div>
      
      <h2 class="action-title">请选择您要进行的操作</h2>
      
      <div class="action-buttons">
        <div class="button-row">
          <el-button type="primary" @click="selectLoginType('user')">
            <el-icon><User /></el-icon>
            企业用户登录
          </el-button>
          <el-button type="warning" @click="selectLoginType('admin')">
            <el-icon><Key /></el-icon>
            超级管理员登录
          </el-button>
        </div>
        
        <div class="button-row">
          <el-button type="success" @click="showRegister">
            <el-icon><OfficeBuilding /></el-icon>
            企业注册
          </el-button>
          <el-button type="info" @click="showUserRegister">
            <el-icon><UserFilled /></el-icon>
            用户注册
          </el-button>
        </div>
      </div>
    </div>

    <!-- 登录表单 (固定在视口中央) -->
    <div class="form-panel login-form" v-if="showLoginForm" v-click-outside="backToTypeSelection">
      <h2>{{ loginType === 'user' ? '企业用户登录' : '超级管理员登录' }}</h2>
      <p>请输入您的账号和密码</p>
      
      <el-form>
        <el-form-item label="请输入账号">
          <el-input v-model="uname" placeholder="请输入账号" />
        </el-form-item>
        
        <el-form-item label="请输入密码">
          <el-input v-model="upwd" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <div class="form-actions">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="backToTypeSelection">返回</el-button>
        </div>
      </el-form>
    </div>

    <!-- 企业注册表单 (固定在视口中央) -->
    <div class="form-panel register-form" v-if="showRegisterForm" v-click-outside="backToTypeSelection">
      <h2>企业注册</h2>
      <p>创建新的企业账户</p>
      
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
        <el-form-item label="企业ID">
          <el-input v-model="registerForm.companyId" disabled />
        </el-form-item>
        
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="registerForm.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="registerForm.contactInfo" placeholder="请输入联系方式" />
        </el-form-item>
        
        <el-form-item label="账号" prop="account">
          <el-input v-model="registerForm.account" placeholder="请输入账号" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <el-form-item label="创建时间">
          <el-input v-model="registerForm.createTime" disabled />
        </el-form-item>
        
        <div class="form-actions">
          <el-button type="primary" @click="submitRegister">注册</el-button>
          <el-button @click="backToTypeSelection">返回</el-button>
        </div>
      </el-form>
    </div>

    <!-- 用户注册表单 (固定在视口中央) -->
    <div class="form-panel user-register-form" v-if="showUserRegisterForm" v-click-outside="backToTypeSelection">
      <h2>用户注册</h2>
      <p>注册个人用户账户</p>
      
      <el-form :model="userRegisterForm" :rules="userRegisterRules" ref="userRegisterFormRef">
        <el-form-item label="用户ID">
          <el-input v-model="userRegisterForm.userId" disabled />
        </el-form-item>
        
        <el-form-item label="所属企业ID" prop="companyId">
          <el-input v-model="userRegisterForm.company_id" placeholder="请输入企业ID" />
        </el-form-item>
        
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userRegisterForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userRegisterForm.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userRegisterForm.phone" placeholder="请输入手机号码" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userRegisterForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userRegisterForm.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="userRegisterForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <el-form-item label="创建时间">
          <el-input v-model="userRegisterForm.createTime" disabled />
        </el-form-item>
        
        <div class="form-actions">
          <el-button type="primary" @click="submitUserRegister">注册</el-button>
          <el-button @click="backToTypeSelection">返回</el-button>
        </div>
      </el-form>
    </div>

    <!-- 底部信息 (始终显示) -->
    <div class="footer">
      <p>© 2023 测盟汇 | 隐私政策 | 服务条款</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user.ts';
import {
  User,
  Key,
  OfficeBuilding,
  UserFilled
} from '@element-plus/icons-vue';

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
				
				// 存储用户信息到localStorage
				localStorage.setItem('userInfo', JSON.stringify({
				userId: res.data.userInfo.user_id,
				nickname: res.data.userInfo.nickname
				}))

				const store = useUserStore()
        		store.setUserInfo(res.data.userInfo) // 保存完整用户信息

				console.log("登录返回Token:", res.data.token); 
				localStorage.setItem('token', res.data.token); 
				localStorage.setItem('userId', res.data.userInfo.user_id); 

				if(loginType.value === 'user') {
					router.push("/home") // 用户主页
				} else {
					router.push("/Managerhome") // 管理员主页
				}

			}else{
				ElMessage.error(res.data.message ||"登录失败")
			}
		})

		store.userName = uname.value
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
		company_id: '',
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
		company_id: [
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

			// 确保所有参数正确转换
			const registerData = {
				company_id: Number(userRegisterForm.value.company_id),
				username: userRegisterForm.value.username,
				nickname: userRegisterForm.value.nickname,
				phone: userRegisterForm.value.phone,
				email: userRegisterForm.value.email,
				gender: userRegisterForm.value.gender, 
				password: userRegisterForm.value.password
			};

			const response = await axios.post('http://localhost:8080/register', registerData);
			
			if (response.data.success) {
				userRegisterForm.value.userId = response.data.userId; // 同步后端生成的 ID
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
			//ElMessage.error('注册失败' );
		}
	}
</script>

<style scoped>
	.auth-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: #f5f7fa;
	position: relative;
	}

	.selection-panel {
	max-width: 800px;
	margin: 40px auto;
	padding: 40px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	text-align: center;
	}

	.logo-section {
	margin-bottom: 30px;
	}

	.logo-section h1 {
	color: #409EFF;
	font-size: 32px;
	margin-bottom: 8px;
	}

	.logo-section p {
	color: #606266;
	font-size: 16px;
	}

	.action-title {
	color: #303133;
	font-size: 20px;
	margin-bottom: 30px;
	}

	.action-buttons {
	display: flex;
	flex-direction: column;
	gap: 20px;
	}

	.button-row {
	display: flex;
	justify-content: center;
	gap: 20px;
	}

	.el-button {
	width: 200px;
	height: 50px;
	font-size: 16px;
	}

	.form-panel {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90%;
	max-width: 500px;
	padding: 30px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	z-index: 100;
	}

	.form-panel h2 {
	color: #409EFF;
	text-align: center;
	margin-bottom: 8px;
	}

	.form-panel p {
	color: #606266;
	text-align: center;
	margin-bottom: 24px;
	}

	.form-actions {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 24px;
	}

	.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 16px;
	text-align: center;
	background: white;
	border-top: 1px solid #ebeef5;
	color: #909399;
	font-size: 14px;
	}

	@media (max-width: 768px) {
	.selection-panel {
		margin: 20px;
		padding: 20px;
	}
	
	.button-row {
		flex-direction: column;
		align-items: center;
	}
	
	.el-button {
		width: 100%;
	}
	
	.form-panel {
		width: 95%;
		padding: 20px;
	}
	}
</style>