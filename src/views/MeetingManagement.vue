<template>
    <el-row :gutter="20">
        <el-col :span="5">
            <el-input v-model="creatorNameText" style="width: 150px" placeholder="创建人" clearable />
        </el-col>
        <el-col :span="5">
            <el-input v-model="meetingNameText" style="width: 150px" placeholder="会议名称" clearable />
        </el-col>
        <el-col :span="6">
            <el-date-picker
                v-model="meetingDateText"
                type="date"
                placeholder="选择会议日期"
                :disabled-date="disabledDate"
                :shortcuts="shortcuts"
                clearable
            />
        </el-col>
        <el-col :span="3">
            <el-button type="primary" :icon="Search" @click="searchCombin">查询</el-button>
        </el-col>
        <el-col :span="2">
            <el-button type="primary" plain>创建</el-button>
        </el-col>
    </el-row>

    <el-dialog v-model="updateDialogVisible" title="修改会议信息" width="400">
    会议封面：<el-input
                v-model="ncover_url"
                style="width: 240px"
                placeholder="Please input"
                clearable
                /><br/>
    会议名称：<el-input
                v-model="nmeeting_name"
                style="width: 240px"
                placeholder="Please input"
                clearable
                /><br/>
    会议日期：<el-input
                v-model="nmeeting_date"
                style="width: 240px"
                placeholder="Please input"
                clearable
                /><br/>
    开始时间：<el-input
                v-model="nstart_time"
                style="width: 240px"
                placeholder="Please input"
                clearable
                /><br/>
    结束时间：<el-input
                v-model="nend_time"
                style="width: 240px"
                placeholder="Please input"
                clearable
                /><br/> 
    介    绍：<el-input
                v-model="ncontent"
                style="width: 240px"
                placeholder="Please input"
                clearable
                /><br/> 
    创建时间：<el-input
                v-model="ncreate_time"
                style="width: 240px"
                placeholder="Please input"
                disabled
                /><br/> 
    创 建 人：<el-input
                v-model="ncreator_name"
                style="width: 240px"
                placeholder="Please input"
                disabled
                /><br/> 
    状    态：<el-input
                v-model="naudit_status"
                style="width: 240px"
                placeholder="Please input"
                disabled
                /><br/>
            <el-button type="primary" @click="updateData">修改</el-button>     
  </el-dialog>


    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="cover_url" label="封面" width="150">
            <template #default="scope">
                <el-image style="width: 150px; height: 150px" :src="scope.row.cover_url" :fit="'cover'" />
            </template>
        </el-table-column>
        <el-table-column prop="meeting_id" label="会议号" width="120" />
        <el-table-column prop="meeting_name" label="会议名称" width="120" show-overflow-tooltip/>
        <el-table-column prop="meeting_date" label="会议日期" />
        <el-table-column prop="start_time" label="开始时间" />
        <el-table-column prop="end_time" label="结束时间" />
        <el-table-column prop="content" label="介绍" width="240" show-overflow-tooltip />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column prop="creator_name" label="创建人" />
        <el-table-column prop="audit_status" label="状态" />
        <el-table-column label="操作" width="240" >
            <template #default="scope">
                <el-button type="primary" plain @click="check(scope.row.meeting_id,scope.row.creator_name)">审核</el-button><br>
                <el-button type="primary" plain @click="updateMeeting(scope.row)">修改</el-button><br>
                <el-button type="primary" plain @click="deleteMeeting(scope.row.meeting_id)">删除</el-button>
            </template>
        </el-table-column> 
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 12, 24]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {  Search,Plus } from '@element-plus/icons-vue'; 
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import type { ImageProps } from 'element-plus'
import { error } from 'echarts/types/src/util/log.js';

    let userStore = useUserStore()

    let creatorNameText = ref('')
    let meetingNameText = ref('')
    let meetingDateText = ref('')

    let tableData = ref([])
    let cover_url = ref('')
    let meeting_name = ref('')
    let meeting_date = ref('')
    let start_time = ref('')
    let end_time = ref('')
    let content = ref('')
    let create_time = ref('')
    let creator_name = ref('')
    let audit_status = ref('')

    let updateDialogVisible = ref(false)
    let nmeeting_id = ref('')
    let ncover_url = ref('')
    let nmeeting_name = ref('')
    let nmeeting_date = ref('')
    let nstart_time = ref('')
    let nend_time = ref('')
    let ncontent = ref('')
    let ncreate_time = ref('')
    let ncreator_name = ref('')
    let naudit_status = ref('')

    const currentPage = ref(1)
    const pageSize = ref(3)
    const total = ref(0)
    const loading = ref(false)
    //日期选择
    const shortcuts = [
        {
            text: '今天',
            value: new Date(),
        },
        {
            text: '昨天',
            value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
            },
        },
        {
            text: '一周前',
            value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
            },
        },
    ]

    const disabledDate = (time: Date) => {
        return time.getTime() > Date.now()
    }


    //分页函数
    function handleSizeChange(val: number) {
        pageSize.value = val
        currentPage.value = 1
        if (!(creatorNameText.value.trim() && meetingNameText.value.trim() && meetingDateText.value.trim())) {
            getAllMeeting()
        }
        else{
            searchCombin()
        }
    }
    function handleCurrentChange(val: number) {
        currentPage.value = val
       if (!(creatorNameText.value.trim() && meetingNameText.value.trim() && meetingDateText.value.trim())) {
            getAllMeeting()
        }
        else{
            searchCombin()
        }
    }
    

    //显示所有数据
    onMounted(() => {
        getAllMeeting()
    })
    function getAllMeeting() {
        loading.value = true
        axios.get('http://localhost:8080/getAllMeetings',{
            params:{
                currentPage:currentPage.value,
                pageSize:pageSize.value
            }
        })
        .then(res => {
            console.log(res.data)
            tableData.value = (res.data.list || []).map((item: any) => ({
                meeting_id:item.meeting_id,
                meeting_name:item.meeting_name,
                meeting_date:item.meeting_date,
                start_time:item.start_time,
                end_time:item.end_time,
                content:item.content || '',
                cover_url:item.cover_url,
                create_time:item.create_time,
                creator_name:item.creator_name,
                audit_status:item.audit_status
            }))
            total.value = res.data.total || 0
        })
        .catch(error => {
            console.error("获取数据失败：",error)
            ElMessage.error("数据加载失败")
            tableData.value = []
        })
        .finally(() => {
            loading.value = false
        })
    }
    //查询
    function searchCombin() {
        if (!(creatorNameText.value.trim() && meetingNameText.value.trim() && meetingDateText.value.trim())) {
            getAllMeeting()
            return
        }
        loading.value = true
        axios.get('http://localhost:8080/getMeetingsBy',{
            params:{
                creator_name:creatorNameText.value.trim(),
                meeting_name:meetingNameText.value.trim(),
                meeting_date:meetingDateText.value.trim(),
                currentPage:currentPage.value,
                pageSize:pageSize.value
            }
        })
        .then(res => {
            tableData.value = res.data.list || []
            total.value = res.data.total || 0
        })
        .catch(error => {
            console.log("搜索失败：", error)
            ElMessage.error("搜索失败")
            tableData.value = []
        })
        .finally(() => {
            loading.value = false
        })
    }

    function check(id:number,name:any) {
        if (userStore.userName != name) {
            ElMessage.warning("您无审核权限")
            return
        }
    }
    //更新数据
    function updateMeeting(row:any){
        updateDialogVisible.value = true
        nmeeting_id.value = row.meeting_id
        ncover_url.value = row.cover_url
        nmeeting_name.value = row.meeting_name
        nmeeting_date.value = row.meeting_date
        nstart_time.value = row.start_time
        nend_time.value = row.end_time
        ncontent.value = row.content
        ncreate_time.value = row.create_time
        ncreator_name.value = row.creator_name
        naudit_status.value = row.audit_status
    }
    function updateData() {
        if (userStore.userName != ncreator_name.value ) {
            ElMessage.warning("您无修改权限")
            return
        }
        if (!ncover_url.value || !nmeeting_name.value || !nmeeting_date.value || !nstart_time.value || !nend_time.value || !ncontent.value ) {
            ElMessage.warning("请完善信息")
            return
        }
        let meeting = {
           meeting_id:nmeeting_id.value,
           cover_url:ncover_url.value,
           meeting_name:nmeeting_name.value,
           meeting_date:nmeeting_date.value,
           start_time:nstart_time.value,
           end_time:nend_time.value,
           content:ncontent.value,
           create_time:ncreate_time,
           creator_name:ncreator_name,
           audit_status:0 
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.post("http://localhost:8080/updateMeeting",meeting,config)
        .then(res => {
            console.log(res.data)
            if (res.data > 0) {
                ElMessage.success("修改成功")
                updateDialogVisible.value = false
                getAllMeeting()
            } else {
                ElMessage.error("修改失败")
            }
        })
        .catch(error => {
            ElMessage.error("修改失败")
            console.error("修改出错：",error)
        })
    }

    function deleteMeeting(no:number){
        if (userStore.userName != "admin" ) {
            ElMessage.warning("您无删除权限")
            return
        }
        axios.get(`http://localhost:8080/deleteMeeting/${no}`)
        .then(res => {
            if (res.data > 0) {
                ElMessage.success("删除成功")
            } else {
                ElMessage.error("删除失败")
            }
        })
        .catch(error => {
            console.error("删除操作失败：", error)
            ElMessage.error("删除商品时发生错误")
        })
    }
</script>

<style scoped>

</style>