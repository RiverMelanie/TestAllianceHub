<template>
    <div class="meeting-container">
        <div class="search-area">
            <el-row :gutter="20" style="margin-bottom: 20px;" justify="center">
                <el-col :span="5">
                    <el-input v-model="creatorNameText" style="width: 150px" placeholder="创建人" clearable />
                </el-col>
                <el-col :span="5">
                    <el-input v-model="meetingNameText" style="width: 150px" placeholder="会议名称" clearable />
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="meetingDateText"
                        type="datetime"
                        placeholder="选择会议日期"
                        clearable
                    />
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" :icon="Search" @click="searchCombin" class="action-btn">查询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" plain @click="meetingCreation = true" class="action-btn">创建</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="table-wrapper" >
            <el-table :data="tableData" style="width: 100%" align="center" v-loading="loading" empty-text="暂无数据" class="meeting-table">
                <el-table-column prop="meeting_id" label="会议号" width="70" align="center"/>
                <el-table-column prop="cover_url" label="封面" width="150" align="center">
                    <template #default="scope">
                        <div class="cover-image" @click="openCustomPreview(scope.row.cover_url)">
                            <el-image
                                :src="scope.row.cover_url"
                                :preview-src-list="[scope.row.cover_url]"
                                fit="cover"
                                class="cover-img"
                                hide-on-click-modal
                            >
                                <template #error>
                                    <div class="cover-error">
                                        <el-icon><Picture /></el-icon>
                                        <span>加载失败</span>
                                    </div>
                                </template>
                                <template #placeholder>
                                    <div class="cover-loading">
                                        <el-icon><Loading /></el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="meeting_name" label="会议名称" width="150" show-overflow-tooltip align="center"/>
                <el-table-column prop="start_time" label="会议时间" width="180" align="center"/>
                <el-table-column prop="create_time" label="创建时间" width="180" align="center"/>
                <el-table-column prop="creator_name" label="创建人" width="120" align="center"/>
                <el-table-column prop="audit_status" label="状态" width="120" align="center">
                    <template #default="scope">
                        <el-tag
                            :type="getStatusTagType(scope.row.audit_status)"
                            effect="plain"
                            size="small"
                            class="status-tag"
                        >
                        {{  statusMap[scope.row.audit_status as keyof StatusMap] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" plain @click="updateMeeting(scope.row)" class="action-btn">修改</el-button>
                        <el-button link type="danger" plain @click="deleteMeeting(scope.row)" class="action-btn">删除</el-button>
                        <el-button link type="info" plain @click="detail(scope.row)" class="action-btn">详情</el-button>
                    </template>
                </el-table-column> 
            </el-table>

            <div class="pagination-wrapper" v-if="total > 0">
                    <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    />
            </div>
        </div>

        <el-drawer v-model="meetingCreation" title="创建会议" size="40%" class="create-drawer">
            <div class="form-container">
                <el-form :model="form" :rules="rules" ref="meetingForm" label-width="100px" label-position="left">
                    <el-form-item label="会议封面" prop="cover_url"class="cover-form-item">
                        <div class="cover-upload-container">
                            <el-upload
                                class="avatar-uploader"
                                action="#"
                                :show-file-list="false"
                                :auto-upload="false"
                                :on-change="handleCoverChange"
                                accept="image/*"
                                ref="uploader"
                            >
                            <el-image
                                v-if="cover_url"
                                :src="cover_url"
                                fit="cover"
                                class="avatar"
                                hide-on-click-modal
                            >
                                <template #error>
                                <div class="avatar-error">
                                    <el-icon><Picture /></el-icon>
                                </div>
                                </template>
                            </el-image>
                            <div v-else class="avatar-uploader-default">
                                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                                <div class="default-text">
                                <div class="meeting-title">企业会议</div>
                                <div class="meeting-subtitle">共商发展大计</div>
                                </div>
                            </div>
                            </el-upload>
                            <el-button 
                            v-if="cover_url"
                            type="text" 
                            @click="handleRemoveCover"
                            class="change-img-btn"
                            >
                            更换图片
                            </el-button>
                            
                        </div>
                    </el-form-item>
                    <el-form-item label="会议名称" required>
                        <el-input
                            v-model="meeting_name"
                            placeholder="请输入会议名称"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item label="开始时间" required>
                        <el-date-picker
                            v-model="start_time"
                            type="datetime"
                            placeholder="请选择开始时间"
                        />
                    </el-form-item>
                    <el-form-item label="结束时间" required>
                        <el-date-picker
                            v-model="end_time"
                            type="datetime"
                            placeholder="请选择预计结束时间"
                        />
                    </el-form-item>
                    <el-form-item label="会议介绍" required>
                        <el-input
                            v-model="content"
                            type="textarea"
                            :rows="4"
                            :maxlength="1000" 
                            show-word-limit  
                            placeholder="请输入会议介绍"
                        />
                    </el-form-item>
                    <el-form-item label="创建时间" required>
                        <el-date-picker
                            v-model="create_time"
                            type="datetime"
                            placeholder="请选择创建时间"
                            :disabled-date="disabledDate"
                            :shortcuts="shortcuts"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item label="创建人">
                        <el-input
                            v-model="creator_name"
                            :value="userStore.userName"
                            placeholder="请输入创建人名字"
                            disabled
                        />
                    </el-form-item>
                    <el-form-item label="会议状态">
                        <el-select 
                            v-model="audit_status" 
                            placeholder="未审核"
                            disabled
                        >
                        <el-option label="未审核" value="未审核"></el-option>
                        <el-option label="已通过" value="已通过"></el-option>
                        <el-option label="未通过" value="未通过"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="updateContent = true">会议介绍详情</el-button>
                        <el-drawer v-model="updateContent" title="介绍详情" :append-to-body="true" :before-close="handleClose" >
                            <p>{{content}}</p>
                        </el-drawer>
                        <el-button type="primary" @click="createMeeting" class="submit-btn">确认创建</el-button>
                        <el-button @click="meetingCreation = false" class="cancel-btn">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
        
        <el-drawer v-model="updateDialogVisible" title="修改会议信息" size="40%" class="update-drawer">
            <div class="form-container">
                <el-form label-width="100px" label-position="left">
                    <el-form-item label="会议封面" class="cover-form-item">
                        <div class="cover-upload-container">
                            <el-upload
                                class="avatar-uploader"
                                action="#"
                                :show-file-list="false"
                                :auto-upload="false"
                                :on-change="handleUpdateCoverChange"
                                accept="image/*"
                            >
                                <el-image v-if="ncover_url" :src="ncover_url" fit="cover" class="avatar" hide-on-click-modal>
                                    <template #error>
                                        <div class="avatar-error"><el-icon><Picture /></el-icon></div>
                                    </template>
                                </el-image>
                                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                            </el-upload>
                            <el-button  v-if="ncover_url"  type="text"  @click="ncover_url = ''" class="change-img-btn">更换图片</el-button>
                        </div>
                    </el-form-item>
                     <el-form-item label="会议名称" required>
                        <el-input
                            v-model="nmeeting_name"
                            placeholder="请输入会议名称"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item label="开始时间" required>
                        <el-date-picker
                            v-model="nstart_time"
                            type="datetime"
                            placeholder="请选择开始时间"
                        />        
                    </el-form-item>
                    <el-form-item label="结束时间" required>
                        <el-date-picker
                            v-model="nend_time"
                            type="datetime"
                            placeholder="请选择预计结束时间"
                        />
                    </el-form-item>
                     <el-form-item label="会议介绍" required>
                        <el-input
                            v-model="ncontent"
                            type="textarea"
                            :rows="4"
                            :maxlength="1000" 
                            show-word-limit  
                            placeholder="请输入会议介绍"
                        />
                    </el-form-item>
                     <el-form-item label="创建时间" required>
                        <el-date-picker
                            v-model="ncreate_time"
                            type="datetime"
                            placeholder="请选择创建时间"
                            :disabled-date="disabledDate"
                            :shortcuts="shortcuts"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item label="创建人">
                        <el-input
                            v-model="ncreator_name"
                            placeholder="请输入创建人名字"
                        />
                    </el-form-item>
                    <el-form-item label="会议状态">
                        <el-select 
                            v-model="naudit_status" 
                            placeholder="请选择会议状态"
                            disabled
                        >
                            <el-option label="未审核" value="未审核"></el-option>
                            <el-option label="已通过" value="已通过"></el-option>
                            <el-option label="未通过" value="未通过"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateData" class="submit-btn">确认修改</el-button>
                        <el-button @click="updateDialogVisible = false" class="cancel-btn">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>

        <el-drawer v-model="showDetail" title="会议详情" size="40%">
            <div class="drawer-content">
                <div class="item">
                    <span class="label">会议封面：</span>
                    <el-image 
                        :src="currentMeeting.cover_url" 
                        :preview-src-list="[currentMeeting.cover_url]"
                        style="width: 180px; height: 180px"
                        fit="cover"
                    >
                        <template #error>
                            <div class="image-error">加载失败</div>
                        </template>
                    </el-image>
                </div>
                <div class="item">
                    <span class="label">会议ID：</span>
                    <span>{{ currentMeeting.meeting_id }}</span>
                </div>
                <div class="item">
                    <span class="label">会议名称：</span>
                    <span>{{ currentMeeting.meeting_name }}</span>
                </div>
                <div class="item">
                    <span class="label">开始时间：</span>
                    <span>{{ currentMeeting.start_time }}</span>
                </div>
                <div class="item">
                    <span class="label">结束时间：</span>
                    <span>{{ currentMeeting.end_time }}</span>
                </div>
                <div class="item">
                    <span class="label">会议介绍：</span>
                    <span>{{ currentMeeting.content }}</span>
                </div>
                <div class="item">
                    <span class="label">创建时间：</span>
                    <span>{{ currentMeeting.create_time }}</span>
                </div>
                <div class="item">
                    <span class="label">创建人：</span>
                    <span>{{ currentMeeting.creator_name }}</span>
                </div>
                <div class="item">
                    <span class="label">状态：</span>
                    <el-tag
                        :type="currentMeeting.audit_status === 0 ? 'info' : 
                            currentMeeting.audit_status === 1 ? 'success' : 
                            currentMeeting.audit_status === 2 ? 'danger' : 'default'"
                        effect="plain"
                        size="small"
                        style="padding: 4px 10px; font-size: 14px;"
                    >
                        {{ statusMap[currentMeeting.audit_status] }}
                    </el-tag>
                </div>
            </div>
            <template #footer>
                <el-button @click="showDetail = false">关闭</el-button>
            </template>
        </el-drawer>

         <Teleport to="body">
            <div 
                v-if="customPreviewVisible" 
                class="custom-image-viewer" 
                @click="closeCustomPreview"
            >
                <div class="viewer-content" @click.stop>
                <img :src="customPreviewUrl" alt="预览图" />
                </div>
            </div>
        </Teleport>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {  Search,Plus,Picture,Loading } from '@element-plus/icons-vue'; 
import { ElMessage,ElMessageBox } from 'element-plus';
import type {UploadInstance} from 'element-plus';
import { useUserStore } from '@/stores/user';
import type { UploadProps,UploadFile } from 'element-plus';

    let userStore = useUserStore()

    let creatorNameText = ref('')
    let meetingNameText = ref('')
    let meetingDateText = ref('')

    let tableData = ref([])
    let cover_url = ref('')
    let meeting_name = ref('')
    let start_time = ref('')
    let end_time = ref('')
    let content = ref('')
    let create_time = ref('')
    let creator_name = ref('')
    let audit_status = ref<number>()

    let updateDialogVisible = ref(false)
    let nmeeting_id = ref('')
    let ncover_url = ref('')
    let nmeeting_name = ref('')
    let nstart_time = ref('')
    let nend_time = ref('')
    let ncontent = ref('')
    let ncreate_time = ref('')
    let ncreator_name = ref('')
    let naudit_status = ref<string>('未审核')

    //图片
    let customPreviewVisible = ref(false)
    let customPreviewUrl = ref('')

    //分页相关
    const currentPage = ref(1)
    const pageSize = ref(5)
    const total = ref(0)
    const loading = ref(false)

    //创建会议抽屉
    let meetingCreation = ref(false)
    let updateContent = ref(false)
    let form = ref(null)
    //信息详情
    let showDetail = ref(false)
    let currentMeeting:any = ref({})

    //会议状态转换
    // 修改状态映射的类型定义
    interface StatusMap {
        [key: number]: string;
        0: '未审核';
        1: '已通过';
        2: '未通过';
    }

    interface StatusReverseMap {
        [key: string]: number;
        '未审核': 0;
        '已通过': 1;
        '未通过': 2;
    }

    // 状态映射：数字 → 字符串
    const statusMap: StatusMap = {
        0: '未审核',
        1: '已通过',
        2: '未通过'
    };

    // 字符串 → 数字（创建会议时用）
    const statusReverseMap: StatusReverseMap = {
        '未审核': 0,
        '已通过': 1,
        '未通过': 2
    };

    const getStatusTagType = (status: number) => {
        switch(status) {
            case 0: return 'info';
            case 1: return 'success';
            case 2: return 'danger';
            default: return 'default';
        }
    }
    //表单信息
    const rules = {
        cover_url:[{required:true,message:'请输入会议封面',trigger:['change','blur']}],
        meeting_name: [{ required: true, message: '请输入会议名称', trigger: ['change','blur'] }],
        start_time: [{ required: true, message: '请选择开始时间', trigger: ['change','blur'] }],
        end_time:[{ required: true, message: '请选择预计结束时间', trigger: ['change','blur'] }],
        content:[{ required: true, message: '请填写会议内容', trigger: ['change','blur'] }],
        create_time:[{ required: true, message: '请选择创建时间', trigger: ['change','blur'] }],
        creator_name:[{ required: true, message: '请填写创建人姓名', trigger: ['change','blur'] }],
        audit_status:[{ required: true, message: '请选择会议状态', trigger: ['change','blur'] }],

    }
    //图片预览
    // 打开预览
    function openCustomPreview(url: string) {
        if (!url) {
            ElMessage.warning("没有图片可预览")
            return
        }
        customPreviewUrl.value = url
        customPreviewVisible.value = true
    }

    // 关闭预览
    function closeCustomPreview() {
        customPreviewVisible.value = false
    }


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
        //禁用未来日期
    const disabledDate = (time: Date) => {
        return time.getTime() > Date.now()
    }

    //分页函数
    function handleSizeChange(val: number) {
        pageSize.value = val
        currentPage.value = 1

        if (!creatorNameText.value && !meetingNameText.value && !meetingDateText.value) {
            getAllMeeting()
        }
        else{
            searchCombin()
        }
    }
    function handleCurrentChange(val: number) {
        currentPage.value = val
        loadData()
    }
    function loadData() {
        if (!creatorNameText.value && !meetingNameText.value && !meetingDateText.value) {
            getAllMeeting()
        }
        else{
            searchCombin()
        }
    }
    //创建会议抽屉
    const handleClose = (done: () => void) => {
        ElMessageBox.confirm('确定退出？')
            .then(() => {
            done()
            })
            .catch(() => {
                ElMessage.error("失败")
            })
    }

    const uploader = ref<UploadInstance>() // 添加这行获取uploader引用

    const handleRemoveCover = () => {
    cover_url.value = ''
    // 重置上传组件状态
    if (uploader.value) {
        uploader.value.clearFiles()
    }
    }
    // 图片上传处理 - 创建会议
    const handleCoverChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
    const file = uploadFile.raw
    if (file) {
        // 添加文件类型验证
        if (!file.type.startsWith('image/')) {
        ElMessage.error('请上传图片文件')
        return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
        cover_url.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
    }
    }
    // 图片上传处理 - 修改会议
    const handleUpdateCoverChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
        const file = uploadFile.raw
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                ncover_url.value = e.target?.result as string
            }
            reader.readAsDataURL(file)
        }
    }   
    //日期格式修改
    const formatDateTime = (date: Date | string | null): string => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    //显示所有数据
    onMounted(() => {
        getAllMeeting()
    })
    async function getAllMeeting() {
        loading.value = true
        try {
            const res = await axios.get('http://localhost:8080/getAllMeetings', {
                params: {
                    currentPage: currentPage.value,
                    pageSize: pageSize.value
                }
            })
            
            console.log("API响应数据:", res.data) // 添加调试日志
            
            if (res.data && res.data.list) {
                tableData.value = res.data.list.map((item: any) => ({
                    meeting_id: item.meeting_id,
                    meeting_name: item.meeting_name,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    content: item.content || '',
                    cover_url: item.cover_url,
                    create_time: item.create_time,
                    creator_name: item.creator_name,
                    audit_status: item.audit_status
                }))
                total.value = res.data.total || 0
            } else {
                tableData.value = []
                total.value = 0
                ElMessage.warning("获取到的数据格式不正确")
            }
        } catch (error) {
            console.error("获取数据失败：", error)
            ElMessage.error("数据加载失败")
            tableData.value = []
            total.value = 0
        } finally {
            loading.value = false
        }
    }
    //查询
    async function searchCombin() {
        loading.value = true;
        try {
            const params: any = {
                currentPage: currentPage.value,
                pageSize: pageSize.value
            };
            
            // 如果所有查询条件都为空，则获取全部数据
            if (!creatorNameText.value && !meetingNameText.value && !meetingDateText.value) {
                const res = await axios.get('http://localhost:8080/getAllMeetings', {
                    params: {
                        currentPage: currentPage.value,
                        pageSize: pageSize.value
                    }
                });
                
                if (res.data?.list) {
                    tableData.value = res.data.list.map((item: any) => ({
                        meeting_id: item.meeting_id,
                        meeting_name: item.meeting_name,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        content: item.content || '',
                        cover_url: item.cover_url,
                        create_time: item.create_time,
                        creator_name: item.creator_name,
                        audit_status: item.audit_status
                    }));
                    total.value = res.data.total || 0;
                }
                return;
            }

            // 否则根据条件查询
            if (creatorNameText.value.trim()) params.creator_name = creatorNameText.value.trim();
            if (meetingNameText.value.trim()) params.meeting_name = meetingNameText.value.trim();
            if (meetingDateText.value) params.start_time = new Date(meetingDateText.value).toISOString();

            const res = await axios.get('http://localhost:8080/getMeetingsBy', { params });
            
            if (res.data?.list) {
                tableData.value = res.data.list.map((item: any) => ({
                    meeting_id: item.meeting_id,
                    meeting_name: item.meeting_name,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    content: item.content || '',
                    cover_url: item.cover_url,
                    create_time: item.create_time,
                    creator_name: item.creator_name,
                    audit_status: item.audit_status
                }));
                total.value = res.data.total || 0;
            } else {
                tableData.value = [];
                total.value = 0;
            }
        } catch (error) {
            console.error('查询失败:', error);
            ElMessage.error('查询失败');
            tableData.value = [];
            total.value = 0;
        } finally {
            loading.value = false;
        }
    }
    //更新数据
    function updateMeeting(row:any){
        if (row.creator_name != userStore.userName ) {
            ElMessage.warning("抱歉，您无修改权限")
            return
        }
        updateDialogVisible.value = true
        nmeeting_id.value = row.meeting_id
        ncover_url.value = row.cover_url
        nmeeting_name.value = row.meeting_name
        nstart_time.value = row.start_time
        nend_time.value = row.end_time
        ncontent.value = row.content
        ncreate_time.value = row.create_time
        ncreator_name.value = row.creator_name
        naudit_status.value = "未审核"
    }
    async function updateData() {
        if (!nmeeting_name.value || !nstart_time.value || !nend_time.value || !ncontent.value ) {
            ElMessage.warning("请完善信息")
            return
        }
          // 检查时间有效性
        if (new Date(nstart_time.value) >= new Date(nend_time.value)) {
            ElMessage.error("结束时间必须晚于开始时间")
            return
        }

        const statusNumber = statusReverseMap[naudit_status.value as keyof StatusReverseMap];
        if (statusNumber === undefined) {
            ElMessage.error("会议状态值无效，请选择 未审核/已通过/未通过");
            return;
        }
        let meeting = {
            meeting_id:nmeeting_id.value,
            cover_url:ncover_url.value,
            meeting_name:nmeeting_name.value,
            start_time:formatDateTime(nstart_time.value),
            end_time:formatDateTime(nend_time.value),
            content:ncontent.value,
            create_time:formatDateTime(ncreate_time.value),
            creator_name:ncreator_name.value,
            audit_status:0
        }

        axios.post("http://localhost:8080/updateMeeting",meeting,{
            headers: {
                'Content-Type': 'application/json'
            }
        })
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

    function detail(row:any) {
        showDetail.value = true
        currentMeeting.value = { ...row }
    }

    function deleteMeeting(row:any){
        if (row.creator_name != userStore.userName ) {
            ElMessage.warning("您无删除权限")
            return
        }
        const no = row.meeting_id
        ElMessageBox.confirm(
            '确定要删除这个会议吗？',
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            axios.get(`http://localhost:8080/deleteMeeting/${no}`)
            .then(res => {
                if (res.data > 0) {
                    ElMessage.success("删除成功")
                    getAllMeeting()
                } else {
                    ElMessage.error("删除失败")
                }
            })
            .catch(error => {
                console.error("删除操作失败：", error)
                ElMessage.error("删除发生错误")
            })
        }).catch(() => {
            ElMessage.info("已取消删除")
        }) 
    }

    async function createMeeting() {
        try {
            // 验证表单
            await validateForm();
            
            // 检查时间有效性
            if (new Date(start_time.value) >= new Date(end_time.value)) {
                ElMessage.error("结束时间必须晚于开始时间");
                return;
            }
             let temp_status = "未审核"
            // 状态字符串转数字（核心修改）
            const statusNumber = statusReverseMap[temp_status as keyof StatusReverseMap];
            if (statusNumber === undefined) {
                ElMessage.error("会议状态值无效，请选择 未审核/已通过/未通过");
                return;
            }
            let meeting = {
                cover_url: cover_url.value,
                meeting_name: meeting_name.value,
                start_time: formatDateTime(start_time.value),
                end_time: formatDateTime(end_time.value),
                content: content.value,
                create_time: formatDateTime(create_time.value),
                creator_name: userStore.userName,
                audit_status: statusNumber // 默认未审核状态
            };

            const res = await axios.post("http://localhost:8080/addMeeting", meeting, {
            headers: { 'Content-Type': 'application/json' }
            });

            if (res.data > 0) {
            ElMessage.success("创建成功");
            resetForm();
            getAllMeeting();
            }
        } catch (error) {
            console.error("创建失败:", error);
            ElMessage.error("创建失败");
        }
    }
    
    function validateForm() {
        return new Promise((resolve, reject) => {
            if (!meeting_name.value) {
            reject(new Error("请输入会议名称"))
            }
            if (!start_time.value) {
            reject(new Error("请选择开始时间"))
            }
            resolve(true);
        })
    }
    function resetForm() {
        meetingCreation.value = false;
        cover_url.value = '';
        meeting_name.value = '';
        start_time.value = '';
        end_time.value = '';
        content.value = '';
        create_time.value = '';
    }

</script>

<style scoped>
/* 基础容器样式 */
.meeting-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 搜索区域 */
.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 表格区域 */
.table-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 封面图片 */
.cover-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.cover-img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}

.cover-error, .cover-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #909399;
}

/* 状态标签 */
.status-tag {
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
}

/* 操作按钮 */
.action-btn {
  margin: 0 5px;
}

/* 表单容器 - 用于创建和修改抽屉 */
.form-container {
  padding: 20px;
}

/* 封面上传 */
.cover-form-item :deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
}

.cover-upload-container {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 100%;
}

.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}

.avatar-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

/* 封面信息 */
.cover-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.meeting-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.meeting-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.change-img-btn {
  padding: 0;
}

/* 提交按钮 */
.submit-btn {
  margin-right: 20px;
}

/* 图片预览 */
.custom-image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
}

.viewer-content {
  max-width: 90%;
  max-height: 90%;
}

.viewer-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 详情抽屉 */
.drawer-content {
  padding: 20px;
}

.item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.label {
  width: 100px;
  color: #8c8c8c;
  font-weight: 500;
}
.avatar-uploader-default {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  color: #8c939d;
}

.default-text {
  text-align: center;
  margin-top: 10px;
}

.meeting-title {
  font-size: 16px;
  font-weight: bold;
}

.meeting-subtitle {
  font-size: 12px;
  margin-top: 4px;
}

</style>