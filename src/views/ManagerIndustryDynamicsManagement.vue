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
      <el-form-item>
        <el-button type="primary" @click="reviewDynamic">审核行业动态</el-button>
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
    <el-table-column label="操作" min-width="200">
      <template #default="scope">
        <div class="operation-buttons">
        <el-button link type="primary" @click="delDynamic(scope.row.dynamicId)" size="small">删除</el-button>
        <el-button link type="primary" @click="updt(scope.row)">修改</el-button>
        <el-upload
        class="upload-btn"
        :action="`http://localhost:8080/upload?id=${scope.row.id}&title=${scope.row.title}&author=${scope.row.author}&publisher=${scope.row.publisher}&category=${scope.row.category}&status=${scope.row.status}`"
        :on-success="(res:any) => handleUploadSuccess(res, scope.row)"
        :file-list="fileList"
        :auto-upload="true"
        style="margin-left: 20px"
        >
      </el-upload>
        </div>
      </template>
    </el-table-column>
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
    图片链接:<el-input
    v-model="upimageUrl"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
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
const fileList = ref([]);

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
const handleUploadSuccess = (response: any,row:any) => {
  if (response.code === 200) {
    ElMessage.success('封面上传成功！');
    // 可在此调用接口，将 response.data.url 关联到图书信息
    console.log('图片地址：', response.data);
    row.pic=response.data;
    
  } else {
    ElMessage.error('封面上传失败，请重试！');
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
        ReviewResult:0
    }
    //先往审核表里面添加
    axios.post("http://localhost:8080/addreviewrecord",reviewobj)
    axios.post("http://localhost:8080/addDynamic",obj)
    .then(res=>{
        if(res.data>0){
            ElMessage.success("添加成功，待审核通过后即刻发布")
            dialogVisible.value=false
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
/* 让按钮横向排列 */
.operation-buttons {
  display: flex;
  gap: 8px; /* 按钮之间的间距，可调整 */
  align-items: center; /* 垂直居中 */
}
</style>