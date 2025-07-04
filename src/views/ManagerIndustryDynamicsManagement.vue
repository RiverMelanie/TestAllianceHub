<template>
    <!-- 搜索表单 -->
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
      <el-form-item>
        <el-button type="primary" @click="reviewDynamic">审核行业动态</el-button>
      </el-form-item>
    </el-form>
  </div>
<div class="table-wrapper" >
  <el-table :data="dynamics" style="width: 100%"  align="center" table-layout: fixed>
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
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <div class="operation-buttons">
          <el-button link type="primary" @click="delDynamic(scope.row.dynamicId)" size="small">删除</el-button>
          <el-button link type="primary" @click="updt(scope.row)">修改</el-button>
          <!-- 关键修改：传递 dynamicId 参数 -->
        <el-upload
          class="upload-btn"
          :action="`http://localhost:8080/Managerupload?dynamicId=${scope.row.dynamicId}&publisherId=${scope.row.publisherId}&title=${scope.row.title}&content=${scope.row.content}&summary=${scope.row.summary}&author=${scope.row.author}&auditStatus=${scope.row.auditStatus}`"
          :on-success="(res:any) => handleUploadSuccess1(res, scope.row)"
          :file-list="fileList"
          :auto-upload="true"
          style="margin-left: 20px"
        >
        </el-upload>
        </div>
        </template>
      </el-table-column>
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

<el-dialog v-model="updialogVisible" title="修改行业动态" width="400">
   发布者Id:<el-input
    v-model="uppublisherId"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    标题:<el-input
    v-model="uptitle"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    内容:<el-input
    v-model="upcontent"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    摘要:<el-input
    v-model="upsummary"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    作者:<el-input
    v-model="upauthor"
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
    <el-button type="primary" @click="updtDynamic">确认修改</el-button>
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
import { onMounted } from 'vue';
import type { UploadFile } from 'element-plus';
const fileList = ref<UploadFile[]>([]); // 存储已选文件
let router=useRouter()
let publisherId=ref('')
let title=ref('')
let content=ref('')
let summary=ref('')
let author=ref('')
let imageUrl=ref('')
let uppublisherId=ref('')
let uptitle=ref('')
let upcontent=ref('')
let upsummary=ref('')
let upauthor=ref('')
let upimageUrl=ref('')
let updynamicId=ref('')
let upcreateTime=ref('')
let upauditStatus=ref('')
let reviewpublisherId=ref('')
let reviewtitle=ref('')
let reviewcontent=ref('')
let reviewsummary=ref('')
let reviewauthor=ref('')
let reviewimageUrl=ref('')
let createTime=ref('')
let auditStatus=ref('')
let dialogVisible=ref(false)
let updialogVisible=ref(false)
let reviewdialogVisible=ref(false)
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

// 文件上传成功回调
const handleUploadSuccess1 = (response: any,row:any) => {
  if (response.code === 200) {
    ElMessage.success('上传成功！');
    imageUrl.value = response.url; 
  } else {
    ElMessage.error('上传失败，请重试！');
  }
};

// 搜索按钮触发
const search = () => {
  currentPage.value = 1; // 搜索后重置页码为第 1 页
  fetchData();
};
// 组件挂载后自动执行
    onMounted(search);
// 页码改变
const handleCurrentChange = (newPage:any) => {
  currentPage.value = newPage;
  fetchData();
};

//添加动态
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
        ReviewerID:publisherId.value,
        Title:title.value,
        NewsImage:imageUrl.value ,
        Content:content.value,   
        NewsSummary:summary.value,
        Author:author.value,
        auditStatus:0
    }
    //先往审核表里面添加
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
//更新动态
function updt(row:any){
    updialogVisible.value=true

    updynamicId.value=row.dynamicId
    uppublisherId.value=row.publisherId
    uptitle.value=row.title
    upcontent.value=row.content
    upsummary.value=row.summary
    upauthor.value=row.author
    upimageUrl.value=row.imageUrl
    upcreateTime.value=row.createTime
    upauditStatus.value=row.auditStatus
}
function updtDynamic(){
    let obj={
        dynamicId:updynamicId.value,
        publisherId:uppublisherId.value,
        title:uptitle.value,
        content:upcontent.value,
        summary:upsummary.value,
        author:upauthor.value,
        imageUrl:upimageUrl.value,
        auditStatus:upauditStatus.value
    }
    axios.post("http://localhost:8080/upDynamic",obj)
    .then(res=>{
        if(res.data>0){
            console.log(res.data)
            ElMessage.success("修改成功")
            updialogVisible.value=false
            search();
        }
    })
}
//审核动态
function reviewDynamic(){
  router.push("/ManagerReviewDynamics")
}
//删除动态
function delDynamic(id:number){
  axios.get("http://localhost:8080/delDynamic?id="+id)
    .then(res=>{
        if(res.data>0){
            ElMessage.success("删除成功")
            search();
        }else{
            ElMessage.error("删除失败")
        }
    })
}
</script>

<style scoped>
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
/* 操作列按钮容器基础布局 */
.operation-buttons {
  display: flex;
  gap: 12px; /* 增大间距，避免拥挤 */
  align-items: center;
  flex-wrap: wrap; /* 适配小屏幕 */
}

/* 优化 Link 按钮样式（删除/修改） */
.operation-buttons .el-button--link {
  color: #007bff;          /* 主色调，匹配系统风格 */
  text-decoration: none;   /* 去除默认下划线 */
  padding: 6px 12px;       /* 增大点击区域 */
  border-radius: 4px;      /* 轻微圆角，增强质感 */
  transition: all 0.3s ease;

  /* hover 交互增强 */
  &:hover {
    color: #0056b3;         /* 加深主色，突出反馈 */
    text-decoration: underline; /*  hover 时显示下划线 */
    background-color: #f1f5ff; /* 浅灰背景，区分点击态 */
    transform: translateY(-1px); /* 轻微上移，模拟物理交互 */
  }

  /* 激活态（点击时） */
  &:active {
    transform: translateY(0);
    background-color: #e3f0ff;
  }
}

/* 上传按钮单独优化（可选，保持简洁） */
.upload-btn .el-button {
  padding: 4px 10px; 
  font-size: 13px;
  background: #f5f7fa;
  border: 1px solid #d9d9d9;
  color: #495057;
  
  &:hover {
    background: #e9ecef;
    border-color: #c0c4cc;
  }
}
</style>