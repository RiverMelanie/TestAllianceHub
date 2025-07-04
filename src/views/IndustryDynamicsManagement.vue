<template>
   
  <div class="search-container">
    <el-form :model="searchDynamics" inline label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="searchDynamics.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="searchDynamics.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">Search</el-button>
      </el-form-item> 
      <el-form-item>
        <el-button type="primary" @click="dialogVisible=true">添加行业动态</el-button>
      </el-form-item>     
    </el-form>
  </div>
<div class="table-wrapper" >
  <el-table :data="dynamics" style="width: 100%" align="center" table-layout: fixed>
      <el-table-column prop="dynamicId" label="动态Id" width="180" />
      <el-table-column prop="publisherId" label="发布者Id" width="180" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="content" label="内容" width="180" />
      <el-table-column prop="summary" label="摘要" width="180" />
      <el-table-column prop="author" label="作者" width="180" />
      <el-table-column prop="imageUrl" label="图片链接" width="180">
        <template #default="scope">
        <a :href="scope.row.imageUrl" target="_blank">
        {{ scope.row.imageUrl }}
        </a>
      </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="auditStatus" label="审核状态" width="180" />
  </el-table>
</div>
 <el-dialog v-model="dialogVisible" title="添加行业动态" width="400">
   发布者Id:<el-input
    v-model="publisherId"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    标题:<el-input
    v-model="title"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    内容:<el-input
    v-model="content"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    摘要:<el-input
    v-model="summary"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    作者:<el-input
    v-model="author"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
 
    <el-upload
      class="upload-section"
      action="http://localhost:8080/upload" 
      :on-success="handleUploadSuccess"     
      :file-list="fileList"                  
      :auto-upload="true"                    
      :limit="1"                            
    >
      <el-button type="primary">选择并上传图片</el-button>
    </el-upload>
    
    <div v-if="imageUrl" class="uploaded-preview">
      <img :src="imageUrl" alt="预览" style="max-width: 200px; margin-top: 10px;">
    </div>

    <el-button type="primary" @click="addDynamic">添加行业动态</el-button>
     </el-dialog>

   
    <el-pagination 
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8]"  
      :page-size="pageSize"
      layout=" prev, pager, next"
      :total="totalCount"
      style="margin-top: 20px;"/>
</template>

<script setup lang="ts">
import axios from 'axios'
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import { useUserStore } from '@/stores/user'; 
import { onMounted } from 'vue';
import type { UploadFile } from 'element-plus';
const fileList = ref<UploadFile[]>([]); // 存储已选文件

let router=useRouter()
let dynamicId=ref('')
let publisherId=ref('')
let title=ref('')
let content=ref('')
let summary=ref('')
let author=ref('')
let imageUrl=ref('')
let createTime=ref('')
let auditStatus=ref('')
let dialogVisible=ref(false)
const loading = ref(false);     // 加载状态
const currentPage = ref(1);     // 当前页
const pageSize = ref(8);        // 每页显示 8 条
const totalCount = ref(0);      // 总记录数
const dynamics = ref([]);
const searchDynamics = ref({        // 查询条件
  title: '',
  author: ''
});

// 上传成功回调：将后端返回的 URL 绑定到 imageUrl

const handleUploadSuccess = (response: any) => {
  console.log("pic:")
  console.log(response)
  imageUrl.value = response.url; // 后端需返回 { url: "图片访问地址" }
};

const fetchData = async (params = {}) => {
  loading.value = true;
  try {
    // 合并查询条件和分页参数
    const queryParams = {
      ...searchDynamics.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...params
    };

    const res = await axios.get('http://localhost:8080/search', {
      params: queryParams
    });
    dynamics.value = res.data.data
    totalCount.value = res.data.totalCount;
    console.log(res.data)
  } catch (error) {
    console.error('数据加载失败:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索按钮触发
const search = () => {
  currentPage.value = 1; // 搜索后重置页码为第 1 页
  fetchData();
};
onMounted(search);
// 页码改变
const handleCurrentChange = (newPage:any) => {
  currentPage.value = newPage;
  fetchData();
};

function addDynamic(){
    let obj={
        publisherId:publisherId.value,
        title:title.value,
        content:content.value,   
        summary:summary.value,
        author:author.value,
        imageUrl:imageUrl.value,   
        auditStatus:0
    }

    
    let reviewobj={
        ReviewerID:1,
        Title:title.value,
        NewsImage:imageUrl.value ,
        Content:content.value,   
        NewsSummary:summary.value,
        Author:author.value,
        auditStatus:0
    }
    axios.post("http://localhost:8080/addreviewrecord",reviewobj)
    .then(res=>{
        if(res.data>0){
            ElMessage.success("已成功添加到审核表")
            axios.post("http://localhost:8080/addDynamic",obj)
            .then(res=>{
                if(res.data>0){
                    ElMessage.success("添加成功，待审核通过后即刻发布")
                    dialogVisible.value=false
                    search();
                } 
            })
            search();
        } 
    })
    
    
    
    
}


</script>

<style scoped>
/* 提取页面主风格：浅灰底色 + 蓝橙按钮 + 简洁线条 */
:root {
  --primary: #007bff;    /* 页面蓝色按钮 */
  --secondary: #fd7e14;  /* 页面橙色按钮 */
  --bg: #f1f3f5;         /* 主页面浅灰背景 */
  --border: #d9d9d9;     /* 表格/边框浅灰 */
  --text: #495057;       /* 深灰文字 */
  --hover: #e9ecef;      /* 悬停浅灰 */
}

/* 容器：继承页面浅灰背景 */
.container {
  padding: 20px;
  background-color: var(--bg);
  min-height: calc(100vh - 60px);
}

.search-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.table-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-form .el-input {
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 4px;
  transition: border-color 0.3s;
}

.search-form .el-input:focus {
  border-color: var(--primary);
}



/* 操作按钮：仿页面蓝/橙按钮风格 */
.operation-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.operation-buttons .el-button {
  padding: 4px 12px;
  font-size: 14px;
  border: 1px solid var(--primary);
  color: var(--primary);
  background: transparent;
  border-radius: 4px;
  transition: all 0.3s;
}

.operation-buttons .el-button:hover {
  background: var(--primary);
  color: #fff;
}

/* 对话框：仿页面弹窗（简洁边框+浅灰标题栏） */
.el-dialog {
  border: 1px solid var(--border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.el-dialog__header {
  background: #f8f9fa;
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
}

.el-dialog__title {
  font-size: 16px;
  color: var(--text);
}

.el-dialog__body {
  padding: 16px;
  background: #fff;
}

/* 分页：仿页面分页（蓝灰配色） */
.el-pagination {
  margin-top: 16px;
  text-align: right;
}

.el-pagination .el-pager li {
  border: 1px solid var(--border);
  color: var(--text);
  margin: 0 2px;
  border-radius: 4px;
}

.el-pagination .el-pager li.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }
  .el-table {
    font-size: 13px;
  }
}
</style>