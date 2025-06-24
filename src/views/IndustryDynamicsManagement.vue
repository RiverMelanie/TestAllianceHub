<template>
    <!-- 搜索表单 -->
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

<el-table :data="dynamics" style="width: 100%" table-layout: fixed>
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
    图片链接:<el-input
    v-model="imageUrl"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    <el-button type="primary" @click="addDynamic">添加书籍</el-button>
     </el-dialog>

     <!-- 分页组件 -->
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
const store = useUserStore(); 

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

// 页码改变
const handleCurrentChange = (newPage:any) => {
  currentPage.value = newPage;
  fetchData();
};

function addDynamic(){
    let user={
        username:store.username,
        password:store.userpwd
    }
    axios.post("http://localhost:8080/searchid",user)
    .then(res=>{
      console.log(res.data)
      publisherId.value=res.data
      console.log(publisherId.value)
    })

    let obj={
        publisherId:publisherId.value,
        title:title.value,
        content:content.value,   
        summary:summary.value,
        author:author.value,
        imageUrl:imageUrl.value,   
        auditStatus:0
    }
    axios.post("http://localhost:8080/addDynamic",obj)
    .then(res=>{
        if(res.data>0){
            ElMessage.success("添加成功，待审核通过后即刻发布")
            dialogVisible.value=false
            search();
        }
        
    })
    axios.post("http://localhost:8080/addreviewrecord",obj)
    
}


</script>

<style scoped>
/* 让按钮横向排列 */
.operation-buttons {
  display: flex;
  gap: 8px; /* 按钮之间的间距，可调整 */
  align-items: center; /* 垂直居中 */
}

</style>