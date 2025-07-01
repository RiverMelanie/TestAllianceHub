<template>
  <div class="admin-user-management">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>用户管理系统</span>
        </div>
      </template>

      <!-- 查询条件 -->
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList">查询</el-button>
          <el-button type="primary" @click="resetSearch">刷新</el-button>
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-form-item>
      </el-form>

      <!-- 修改表格列定义 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="company_id" label="公司ID" width="100"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template #default="scope">
            {{ formatGender(scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'danger' : 'success'">
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isSuper" label="角色" width="120" align="center">
          <template #default="scope">
            {{ scope.row.isSuper === 1 ? '超级管理员' : '普通用户' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"style="margin-left: 5px">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
              style="margin-left: 5px">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改添加用户弹窗的表单 -->
    <el-dialog v-model="addDialogVisible" title="添加用户" width="500px">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addFormRef">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="公司ID">
          <el-input-number v-model="addForm.company_id" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="addForm.gender">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
            <el-option label="未知" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addForm.status">
            <el-option label="启用" :value="0"></el-option> 
            <el-option label="禁用" :value="1"></el-option>   
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.isSuper">
            <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="普通用户" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddUser">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改编辑用户弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" label-width="100px" ref="editFormRef">
        <el-form-item label="用户ID">
          <el-input v-model="editForm.user_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司ID">
          <el-input-number v-model="editForm.company_id" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
            <el-option label="未知" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.is_super">
            <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="普通用户" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import axios from 'axios'

  // 表格数据
  const userList = ref([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(5)

  // 查询表单
  const searchForm = ref({
    username: '',
    phone: '',
    status: undefined
  })

  // 表单数据
  interface User {
    userId: number;  
    username: string;
    phone: string;
    email: string;
    password?: string;
    status: number;
    isSuper: number;
  }

  const form = ref<User>({
    userId: 0,
    username: '',
    phone: '',
    email: '',
    password: '',
    status: 1, // 默认启用
    isSuper: 0 // 默认普通用户
  });

  // 弹窗显示
  const dialogVisible = ref(false)

  // 修改编辑用户方法
  const handleEdit = (row: any) => {
    editForm.value = {
      user_id: row.userId,
      company_id: row.company_id,
      username: row.username,
      nickname: row.nickname,
      phone: row.phone,
      email: row.email,
      gender: row.gender,
      status: row.status,
      is_super: row.isSuper
    };
    editDialogVisible.value = true;
  };
  
  const formatGender = (gender: number) => {
    switch(gender) {
      case 1: return '男';
      case 2: return '女';
      default: return '未知';
    }
  };

  // 添加日期格式化方法
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  const getUserList = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/user/list', { 
        params: {
          username: searchForm.value.username || undefined,
          phone: searchForm.value.phone || undefined,
          status: searchForm.value.status || undefined,
          page: currentPage.value,
          size: pageSize.value
        }
      });

      if (res.data && res.data.data) {
        userList.value = res.data.data.map((user: any) => ({
          userId: user.user_id,
          company_id: user.company_id,
          username: user.username,
          nickname: user.nickname,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          create_time: user.create_time, // 添加创建时间
          status: user.status,
          isSuper: user.is_super
        }));
        total.value = res.data.total;
      }
    } catch (error: any) {
      ElMessage.error(`获取用户列表失败: ${error.message}`);
    }
  };

  // 重置查询
  const resetSearch = () => {
    searchForm.value = {
      username: '',
      phone: '',
      status: undefined
    }
    getUserList()
  }

  // 切换用户状态
  const toggleStatus = async (row:any) => {
    try {
      const newStatus = row.status === 1 ? 0 : 1
      await axios.put('http://localhost:8080/admin/user/updateStatus', {
        userId: row.userId,
        status: newStatus
      })
      ElMessage.success('状态更新成功')
      getUserList()
    } catch (error) {
      ElMessage.error('状态更新失败')
      console.error(error)
    }
  }

  // 保存用户
  const saveUser = async () => {
    try {
      // 构造请求数据（确保类型正确）
      const userData = {
        username: form.value.username,
        phone: String(form.value.phone), // 确保手机号是字符串
        email: String(form.value.email), // 确保邮箱是字符串
        password: form.value.password, // 不加密直接传输
        status: form.value.status, // 直接使用数字值
        isSuper: form.value.isSuper // 直接使用数字值
      };

      const url = form.value.userId 
        ? `http://localhost:8080/admin/user/update/${form.value.userId}`
        : 'http://localhost:8080/admin/user/create';

      const res = await axios({
        method: form.value.userId ? 'put' : 'post',
        url,
        data: userData
      });

      if (res.data && (res.data.includes('成功') || res.data === 1)) {
        ElMessage.success('操作成功');
        dialogVisible.value = false;
        getUserList();
      } else {
        throw new Error(res.data || '操作失败');
      }
    } catch (error:any) {
      ElMessage.error(`操作失败: ${error.message}`);
      console.error('详细错误:', error);
    }
  };

  // 分页
  const handleSizeChange = (val:any) => {
    pageSize.value = val
    getUserList()
  }

  const handleCurrentChange = (val:any) => {
    currentPage.value = val
    getUserList()
  }

  // 初始化
  onMounted(() => {
    getUserList()
  })

  // 表单验证规则
  const rules = {
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  };

  // 添加表单
  const addForm = ref({
    username: '',
    nickname: '',
    phone: '',
    email: '',
    company_id: 0, // 默认公司ID
    gender: 0,     // 默认未知
    password: '',
    status: 1,     // 默认启用(1)
    isSuper: 0     // 默认普通用户
  });

  const addDialogVisible = ref(false);
  const addFormRef = ref();

  // 编辑表单
  const editForm = ref({
    user_id: 0,
    company_id:0,
    username: '',
    nickname:'',
    phone: '',
    email: '',
    gender:0,
    status: 1,
    is_super: 0
  });
  const editDialogVisible = ref(false);
  const editFormRef = ref();

  // 编辑用户
  const handleEditUser = async () => {
    try {
      const payload = {
        user_id: editForm.value.user_id,
        username: editForm.value.username, // 确保包含username
        company_id: editForm.value.company_id,
        nickname: editForm.value.nickname,
        gender: editForm.value.gender,
        phone: editForm.value.phone,
        email: editForm.value.email,
        status: editForm.value.status,
        is_super: editForm.value.is_super
      };
      
      console.log("发送的更新数据:", payload);  // 调试日志
      
      const res = await axios.put('http://localhost:8080/admin/user/update', payload);

      if (res.data.includes('成功')) {
        ElMessage.success('更新用户成功');
        editDialogVisible.value = false;
        getUserList(); // 刷新列表
      }
    } catch (error: any) {
      console.error('更新用户失败:', error);
      ElMessage.error('更新用户失败: ' + (error.response?.data || error.message));
    }
  };

  // 修改handleAddUser方法
  const handleAddUser = async () => {
    try {
      await addFormRef.value.validate();
      
      const res = await axios.post('http://localhost:8080/admin/user/create', {
        username: addForm.value.username,
        nickname: addForm.value.nickname,
        phone: addForm.value.phone,
        email: addForm.value.email,
        company_id: addForm.value.company_id,
        gender: addForm.value.gender,
        password: addForm.value.password,
        status: addForm.value.status, // 确保这里传递的是数值1或0
        is_super: addForm.value.isSuper
      });

      if (res.data.includes('成功')) {
        ElMessage.success('添加用户成功');
        addDialogVisible.value = false;
        getUserList();
        addFormRef.value.resetFields();
        // 重置表单后恢复默认值
        addForm.value = {
          username: '',
          nickname: '',
          phone: '',
          email: '',
          company_id: 0,
          gender: 0,
          password: '',
          status: 1,
          isSuper: 0
        };
      }
    } catch (error: any) {
      console.error('添加用户失败:', error);
      ElMessage.error('添加用户失败: ' + (error.response?.data || error.message));
    }
  };

  // 添加删除用户方法
  const handleDelete = (row: any) => {
    ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗? 此操作无法撤销!`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      try {
        const res = await axios.delete(`http://localhost:8080/admin/user/delete/${row.userId}`);
        if (res.data.includes('成功')) {
          ElMessage.success('用户删除成功');
          getUserList(); // 刷新用户列表
        }
      } catch (error: any) {
        console.error('删除用户失败:', error);
        ElMessage.error('删除用户失败: ' + (error.response?.data || error.message));
      }
    }).catch(() => {
      ElMessage.info('已取消删除');
    });
  };
</script>

<style scoped>
  .admin-user-management {
    padding: 1px;
  }
</style>