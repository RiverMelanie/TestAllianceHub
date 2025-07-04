<template>
<el-table :data="dynamicsreview" style="width: 100%" table-layout: fixed>
    <el-table-column prop="ReviewerID" label="审核员Id" width="180" />
    <el-table-column prop="Title" label="标题" width="180" />
    <el-table-column prop="NewsImage" label="图片链接" width="180">
      <template #default="scope">
      <a :href="scope.row.NewsImage" target="_blank">
      {{ scope.row.NewsImage }}
      </a>
     </template>
    </el-table-column>
    <el-table-column prop="Content" label="内容" width="180" />
    <el-table-column prop="NewsSummary" label="摘要" width="180" />
    <el-table-column prop="Author" label="作者" width="180" />
    <el-table-column prop="ReviewResult" label="审核状态" width="180" />
    <el-table-column label="操作" min-width="200">
      <template #default="scope">
        <div class="operation-buttons">
        <el-button link type="primary" @click="reviewDynamic(scope.row)">审核动态</el-button>
        
        </div>
      </template>
    </el-table-column>
</el-table>

<el-dialog v-model="updialogVisible" title="审核行业动态" width="400">
   审核者Id:<el-input
    v-model="upReviewrID"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    标题:<el-input
    v-model="upTitle"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    图片链接:<el-input
    v-model="upNewsImage"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    内容:<el-input
    v-model="upContent"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    摘要:<el-input
    v-model="upNewsSummary"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    作者:<el-input
    v-model="upAuthor"
    style="width: 240px"
    placeholder="Please input"
    clearable
    /><br>
    审核结果:<el-select 
              v-model="upReviewResult" 
              style="width: 240px" 
              clearable 
            >
              <el-option label="0" value="0"></el-option>
              <el-option label="1" value="1"></el-option>
            </el-select><br>
    <el-button type="primary" @click="updtreviewDynamic">确认审核</el-button>
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

       <el-button type="primary" @click="clean">一键清除已审核通过的动态</el-button>
</template>

<script setup lang="ts">
import axios from 'axios'
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import { useUserStore } from '@/stores/user'; 
import { onMounted } from 'vue';

let router=useRouter()
const upReviewrID=ref()
const upTitle=ref('')
const upNewsImage=ref('')
const upContent=ref('')
const upNewsSummary=ref('')
const upAuthor=ref('')
const upReviewResult=ref()
let createTime=ref('')
let auditStatus=ref('')
let updialogVisible=ref(false)
const loading = ref(false);     // 加载状态
const currentPage = ref(1);     // 当前页
const pageSize = ref(8);        // 每页显示 8 条
const totalCount = ref(0);      // 总记录数
const dynamicsreview = ref([]);
const fileList = ref([]);

//审核动态
function reviewDynamic(row:any){
    updialogVisible.value=true
    upReviewrID.value=row.ReviewerID
    upTitle.value=row.Title
    upNewsImage.value=row.NewsImage
    upContent.value=row.Content
    upNewsSummary.value=row.NewsSummary
    upAuthor.value=row.Author
    upReviewResult.value=row.ReviewResult
}

function updtreviewDynamic(){
    let obj={
      ReviewerID:upReviewrID.value,
      Title:upTitle.value,
      NewsImage:upNewsImage.value,
      Content:upContent.value,
      NewsSummary:upNewsSummary.value,
      Author:upAuthor.value,
      ReviewResult:upReviewResult.value
    }
    axios.post("http://localhost:8080/upReviewDynamic",obj)
    .then(res=>{
        if(res.data>0){
            console.log("审核记录："+res.data)
            ElMessage.success("修改成功")
            updialogVisible.value=false
            search();
        }
    })
}

const fetchData = async (params = {}) => {
  loading.value = true;
  try {
    // 合并查询条件和分页参数
    const queryParams = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...params
    };

    const res = await axios.get('http://localhost:8080/reviewsearch', {
      params: queryParams
    });
    dynamicsreview.value = res.data.data
    totalCount.value = res.data.totalCount;
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

//一键清除
function clean(){
    axios.get("http://localhost:8080/clean")
}
</script>