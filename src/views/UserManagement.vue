<template>
  <div class="user-home">
    <el-container>
      <el-aside width="220px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          @select="handleMenuSelect"
          class="user-menu"
          active-text-color="#409EFF"
          background-color="#f5f7fa"
        >
          <el-menu-item index="profile" class="menu-item">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="edit" class="menu-item">
            <i class="el-icon-edit"></i>
            <span>基本资料修改</span>
          </el-menu-item>
          <el-menu-item index="password" class="menu-item">
            <i class="el-icon-lock"></i>
            <span>修改密码</span>
          </el-menu-item>
          <el-menu-item v-if="hasPermission" index="users" class="menu-item">
            <i class="el-icon-user-solid"></i>
            <span>用户列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main-content">
        <!-- 个人信息 -->
        <div v-if="activeMenu === 'profile'" class="profile-container content-card">
          <h2 class="content-title">个人信息</h2>
          <el-card shadow="hover" class="info-card">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="用户ID" label-class-name="desc-label">{{ userInfo.user_id }}</el-descriptions-item>
              <el-descriptions-item label="用户名" label-class-name="desc-label">{{ userInfo.username }}</el-descriptions-item>
              <el-descriptions-item label="昵称" label-class-name="desc-label">{{ userInfo.nickname }}</el-descriptions-item>
              <el-descriptions-item label="手机号码" label-class-name="desc-label">{{ userInfo.phone }}</el-descriptions-item>
              <el-descriptions-item label="邮箱" label-class-name="desc-label">{{ userInfo.email }}</el-descriptions-item>
              <el-descriptions-item label="性别" label-class-name="desc-label">
                {{ userInfo.gender === 1 ? '男' : '女' }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间" label-class-name="desc-label">
                {{ formatDate(userInfo.create_time) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>

        <!-- 基本资料修改 -->
        <div v-if="activeMenu === 'edit'" class="edit-container content-card">
          <h2 class="content-title">基本资料修改</h2>
          <el-card shadow="hover" class="form-card">
            <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px" label-position="left">
              <el-form-item label="昵称" prop="nickname" class="form-item">
                <el-input v-model="editForm.nickname" placeholder="请输入昵称"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone" class="form-item">
                <el-input v-model="editForm.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="form-item">
                <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender" class="form-item">
                <el-radio-group v-model="editForm.gender">
                  <el-radio :label="2">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="action-buttons">
                <el-button type="primary" @click="submitEdit" size="medium">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 修改密码 -->
        <div v-if="activeMenu === 'password'" class="password-container content-card">
          <h2 class="content-title">修改密码</h2>
          <el-card shadow="hover" class="form-card">
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" label-position="left">
              <el-form-item label="旧密码" prop="oldPassword" class="form-item">
                <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword" class="form-item">
                <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword" class="form-item">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请确认新密码"></el-input>
              </el-form-item>
              <el-form-item class="action-buttons">
                <el-button type="primary" @click="submitPassword" size="medium">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 用户列表 -->
        <div v-if="activeMenu === 'users'" class="users-container content-card">
          <h2 class="content-title">用户列表</h2>
          <el-card shadow="hover" class="table-card">
            <el-table :data="userList" border style="width: 100%" stripe>
              <el-table-column prop="user_id" label="用户ID" width="80" align="center"></el-table-column>
              <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="nickname" label="昵称" min-width="120"></el-table-column>
              <el-table-column prop="phone" label="手机号码" min-width="130"></el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
              <el-table-column label="性别" width="80" align="center">
                <template #default="scope">
                  {{ scope.row.gender === 2 ? '女' : '男' }}
                </template>
              </el-table-column>
              <el-table-column prop="create_time" label="创建时间" min-width="160">
                <template #default="scope">
                  {{ formatDate(scope.row.create_time) }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

    const router = useRouter()
    const store = useUserStore()
    const activeMenu = ref('profile')
    const hasPermission = ref(false)

    interface User {
      user_id: number;
      company_id: number ;
      username: string ;
      nickname: string ;
      phone: string ;
      email: string ;
      gender: number ;
      //password?: string;
      create_time: string ;
      status: number ;
    }

    var userInfo = ref<User>({
      user_id: 0,
      company_id: 0,
      username: '',
      nickname: '',
      phone: '',
      email: '',
      gender: 0,
      //password: '',
      create_time: '',
      status:1
    });
    
    const editForm = ref({
        nickname: '',
        phone: '',
        email: '',
        gender: 2
    })
    const passwordForm = ref({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const userList = ref([])

    const editFormRef = ref()
    const passwordFormRef = ref()

    // 表单验证规则
    const editRules = {
        nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
        ],
        phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        gender: [
            { required: true, message: '请选择性别', trigger: 'change' }
        ]
    }

    const passwordRules = {
        oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
        ]
    }

    // 验证密码一致性
    function validatePassword(rule:any, value:any, callback:any) {
        if (value !== passwordForm.value.newPassword) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    }

    // 格式化日期
    function formatDate(date: string | Date) {
      if (!date) return ''
      
      if (date instanceof Date) {
        return date.toLocaleString()
      }
      
      try {
        // 处理可能的时区问题
        if (date.includes('T') && date.endsWith('Z')) {
          return new Date(date).toLocaleString()
        }
        // 处理不带时区的ISO格式
        if (date.includes('T')) {
          return new Date(date + 'Z').toLocaleString()
        }
        // 处理其他格式
        return new Date(date).toLocaleString()
      } catch (e) {
        console.error('日期解析错误:', e)
        return date // 如果无法解析，返回原始字符串
      }
    }

    // 菜单选择
    function handleMenuSelect(index:any) {
        activeMenu.value = index
        if (index === 'users') {
            fetchUserList()
        }
    }

    // 获取用户信息
    async function fetchUserInfo() {
      try {
          const token = localStorage.getItem('token')
          const response = await axios.get(`http://localhost:8080/user/by-username/${store.userName}`, {
          headers: { Authorization: token }
          })
          
          if (response.data.success) {
            // 更新组件和store中的用户信息
            userInfo.value = response.data.userInfo
            store.setUserInfo(response.data.userInfo)
            hasPermission.value = response.data.userInfo.status === 0
            initEditForm()
          } else {
            ElMessage.error(response.data.message|| '获取用户信息失败')
          }
      } catch (error) {
          console.error('获取用户信息失败:', error)
          ElMessage.error('获取用户信息失败')
      }
    }

    // 提交修改
    async function submitEdit() {
      try {
          await editFormRef.value.validate()
          const response = await axios.put(`http://localhost:8080/user/${userInfo.value.user_id}`, editForm.value, {
            headers: { 
              Authorization: localStorage.getItem('token') 
            }
          })
          
          if (response.data.success) {
            ElMessage.success('修改成功')
            await fetchUserInfo() // 刷新用户信息
          } else {
            ElMessage.error(response.data.message)
          }
      } catch (error) {
          console.error('修改请求详情:', {
            url: `http://localhost:8080/user/${userInfo.value.user_id}`,
            token: localStorage.getItem('token'),
            error
          });
          ElMessage.error('修改失败')
          console.error('修改出错:', error)
      }
    }

    // 提交密码修改
    async function submitPassword() {
        try {
            await passwordFormRef.value.validate()
            const token = localStorage.getItem('token')
            const response = await axios.post(
            `http://localhost:8080/user/${userInfo.value.user_id}/change-password`,
            {
                oldPassword: passwordForm.value.oldPassword,
                newPassword: passwordForm.value.newPassword
            },
            { headers: { Authorization: token } }
            )
            
            if (response.data.success) {
            ElMessage.success('密码修改成功')
            passwordForm.value = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
            } else {
            ElMessage.error(response.data.message)
            }
        } catch (error) {
            ElMessage.error('密码修改失败')
        }
    }

    // 修改获取用户列表的方法
    async function fetchUserList() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/users', {
          headers: { Authorization: token }
        })
        
        if (response.data.success) {
          userList.value = response.data.users
        } else {
          // 如果无权访问，隐藏用户列表菜单项
          if (response.data.message === "无权查看用户列表") {
            hasPermission.value = false
          }
          ElMessage.error(response.data.message)
        }
      } catch (error: any) {
        if (error.response && error.response.data.message === "无权查看用户列表") {
          hasPermission.value = false
        }
        ElMessage.error('获取用户列表失败')
      }
    }

    // 初始化
    onMounted(() => {
        if (!store.userName) {
          router.push('/home')
          ElMessage.error('用户名不匹配')
          return
        }
        
        // 如果store中已有用户信息，直接使用
        if (store.userInfo) {
          userInfo.value = store.userInfo as User
          hasPermission.value = store.userInfo.status === 0 // 只有status=0有权限
          initEditForm()
        } else {
          // 否则从后端获取用户信息
          fetchUserInfo()
        }
    })

    function initEditForm() {
      editForm.value = {
        nickname: userInfo.value.nickname || '',
        phone: userInfo.value.phone || '',
        email: userInfo.value.email || '',
        gender: userInfo.value.gender || 2
      }
    }
</script>

<style scoped>
  .user-home {
    height: 80vh;
    display: flex;
    background-color: #f0f2f5;
  }

  .sidebar {
    background-color: #f5f7fa;
    border-right: 1px solid #e6e6e6;
  }

  .user-menu {
    height: 100%;
    border-right: none;
  }

  .menu-item {
    margin: 8px 0;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .menu-item:hover {
    background-color: #ecf5ff !important;
  }

  .menu-item.is-active {
    background-color: #ecf5ff !important;
    color: #409EFF !important;
    font-weight: 500;
  }

  .main-content {
    padding: 20px;
    background-color: #f0f2f5;
  }

  .content-card {
    max-width: 900px;
    margin: 0 auto;
  }

  .content-title {
    color: #303133;
    font-size: 22px;
    margin-bottom: 24px;
    font-weight: 500;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;
  }

  .info-card {
    padding: 20px;
    border-radius: 8px;
  }

  .form-card {
    padding: 30px 20px;
    border-radius: 8px;
  }

  .table-card {
    padding: 20px;
    border-radius: 8px;
  }

  .form-item {
    margin-bottom: 22px;
  }

  .action-buttons {
    margin-top: 30px;
    text-align: center;
  }

  .desc-label {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-descriptions__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-descriptions__content) {
    color: #303133;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  :deep(.el-table) {
    font-size: 14px;
  }

  :deep(.el-table th) {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 500;
  }
</style>