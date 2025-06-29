<template>
    <el-row :gutter="20" style="margin-bottom: 20px;">
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
        <el-col :span="3">
            <el-button type="primary" :icon="Search" @click="searchCombin">查询</el-button>
        </el-col>
        <el-col :span="2">
            <el-button type="primary" plain @click="meetingCreation = true">创建</el-button>
            <el-drawer v-model="meetingCreation" title="创建会议" size="50%">
                <div>
                    会议封面：<el-upload
                                class="avatar-uploader"
                                action="#"
                                :show-file-list="false"
                                :auto-upload="false"
                                :on-change="handleCoverChange"
                            >
                                <img v-if="cover_url" :src="cover_url" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                            </el-upload>
                            <el-button v-if="cover_url" type="text" @click="cover_url = ''">更换图片</el-button>
                            <br/>
                    会议名称：<el-input
                                v-model="meeting_name"
                                style="width: 240px"
                                placeholder="请输入会议名称"
                                clearable
                                /><br/>
                    开始时间：<el-date-picker
                                v-model="start_time"
                                style="width: 240px"
                                type="datetime"
                                placeholder="请选择开始时间"
                            /><br/>
                    结束时间：<el-date-picker
                                v-model="end_time"
                                style="width: 240px"
                                type="datetime"
                                placeholder="请选择预计结束时间"
                            /><br/> 
                    会议介绍：<el-input
                                v-model="content"
                                style="width: 240px; vertical-align: middle;"
                                autosize
                                type="textarea"
                                :maxlength="1000" 
                                show-word-limit  
                                placeholder="请输入会议介绍"
                            /><br/> 
                    创建时间：<el-date-picker
                                v-model="create_time"
                                style="width: 240px"
                                type="datetime"
                                placeholder="请选择创建时间"
                                :disabled-date="disabledDate"
                                :shortcuts="shortcuts"
                                clearable
                            /><br/>
                    创 建 人：<el-input
                                v-model="creator_name"
                                style="width: 240px"
                                placeholder="请输入创建人名字"
                                /><br/> 
                    会议状态：<el-select 
                                v-model="audit_status" 
                                style="width: 240px" 
                                placeholder="请选择会议状态"
                            >
                            <el-option label="未审核" value="未审核"></el-option>
                            <el-option label="已通过" value="已通过"></el-option>
                            <el-option label="未通过" value="未通过"></el-option>
                            </el-select><br/>
                    <el-button @click="updateContent = true">会议介绍详情</el-button>
                    <el-drawer v-model="updateContent" title="介绍详情" :append-to-body="true" :before-close="handleClose" >
                        <p>{{content}}</p>
                    </el-drawer>
                    <el-button @click="createMeeting">确认创建</el-button>
                    <el-button type="primary" @click="meetingCreation = false">取消</el-button>
                </div>
            </el-drawer>
        </el-col>
    </el-row>

     


    <el-dialog v-model="updateDialogVisible" title="修改会议信息" width="600">
        会议封面：<el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleUpdateCoverChange"
                >
                    <img v-if="ncover_url" :src="ncover_url" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <el-button v-if="ncover_url" type="text" @click="ncover_url = ''">更换图片</el-button><br/>
        会议名称：<el-input
                    v-model="nmeeting_name"
                    style="width: 240px"
                    clearable
                    /><br/>
        开始时间：<el-date-picker
                    v-model="nstart_time"
                    style="width: 240px"
                    type="datetime"
                /><br/>
        结束时间：<el-date-picker
                    v-model="nend_time"
                    style="width: 240px"
                    type="datetime"
                /><br/>  
        会议介绍：<el-input
                    v-model="ncontent"
                    style="width: 240px; vertical-align: middle;"
                    autosize
                    type="textarea"
                    :maxlength="1000" 
                    show-word-limit  
                /><br/> 
        创建时间： <el-date-picker
                    v-model="ncreate_time"
                    style="width: 240px"
                    type="datetime"
                    :disabled-date="disabledDate"
                    :shortcuts="shortcuts"
                    clearable
                /><br/>
        创 建 人：<el-input
                    v-model="ncreator_name"
                    style="width: 240px"
                    placeholder="Please input"
                    /><br/> 
        状    态：<el-select 
                    v-model="naudit_status" 
                    style="width: 240px" 
                    placeholder="请选择会议状态"
                >
                <el-option label="未审核" value="未审核"></el-option>
                <el-option label="已通过" value="已通过"></el-option>
                <el-option label="未通过" value="未通过"></el-option>
                </el-select><br/>
        <el-button type="primary" @click="updateData">确认修改</el-button>     
    </el-dialog>

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

    <el-drawer v-model="checkDetail" title="会议审查" size="40%">
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
            <el-select 
                    v-model="naudit_status" 
                    style="width: 240px" 
                    placeholder="请选择会议状态"
                >
                <el-option label="未审核" value="未审核"></el-option>
                <el-option label="已通过" value="已通过"></el-option>
                <el-option label="未通过" value="未通过"></el-option>
                </el-select><br/>
        </div>
        <template #footer>
            <el-button @click="check">确定</el-button>
            <el-button @click="checkDetail = false">取消</el-button>
        </template>
    </el-drawer>

    <el-table :data="tableData" style="width: 80%" align="center" v-loading="loading">
        <el-table-column prop="meeting_id" label="会议号" width="70" align="center"/>
        <el-table-column prop="cover_url" label="封面" width="120" align="center">
        <template #default="scope">
            <div 
                class="custom-image" 
                @click="openCustomPreview(scope.row.cover_url)"
            >
                <img :src="scope.row.cover_url" style="width: 100px; height: 100px" />
            </div>
        </template>
        </el-table-column>

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
        <el-table-column prop="meeting_name" label="会议名称" width="80" show-overflow-tooltip align="center"/>
        <el-table-column prop="start_time" label="会议时间" width="120" align="center"/>
        <el-table-column prop="create_time" label="创建时间" width="120" align="center"/>
        <el-table-column prop="creator_name" label="创建人" width="100" align="center"/>
        <el-table-column prop="audit_status" label="状态" width="100" align="center">
            <template #default="scope">
                <el-tag
                    :type="scope.row.audit_status === 0 ? 'info' : 
                            scope.row.audit_status === 1 ? 'success' : 
                            scope.row.audit_status === 2 ? 'danger' : 'default'"
                    effect="plain"
                    size="small"
                    style="padding: 4px 10px; font-size: 17px;"
                >
                {{  statusMap[scope.row.audit_status as keyof StatusMap] }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">
            <template #default="scope">
                <el-button link type="primary" plain @click="updateMeeting(scope.row)">修改</el-button>
                <el-button link type="primary" plain @click="deleteMeeting(scope.row.meeting_id)">删除</el-button>
                <el-button link type="primary" plain @click="detail(scope.row)">详情</el-button>
                <el-button link type="primary" plain @click="checkinfo(scope.row)">审查</el-button>
            </template>
        </el-table-column> 
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
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
import { ElMessage,ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import type { UploadProps,UploadFile } from 'element-plus';



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
    let audit_status = ref<number>(1)

    let updateDialogVisible = ref(false)
    let nmeeting_id = ref('')
    let ncover_url = ref('')
    let nmeeting_name = ref('')
    let nstart_time = ref('')
    let nend_time = ref('')
    let ncontent = ref('')
    let ncreate_time = ref('')
    let ncreator_name = ref('')
    let naudit_status = ref<string>('已通过')

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
    //信息详情
    let showDetail = ref(false)
    let currentMeeting:any = ref({})
    //审查详情
    let checkDetail = ref(false)

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

    // 图片上传处理 - 创建会议
    const handleCoverChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
        const file = uploadFile.raw
        if (file) {
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
        loading.value = true
        interface QueryParams {
            currentPage: number;
            pageSize: number;
            creator_name?: string;
            meeting_name?: string;
            start_time?: string;
        }
        const params:QueryParams = {
            currentPage: currentPage.value,
            pageSize: pageSize.value
        };
        
        // 只添加非空的查询条件
        if (creatorNameText.value.trim()) {
            params.creator_name = creatorNameText.value.trim();
        }
        if (meetingNameText.value.trim()) {
            params.meeting_name = meetingNameText.value.trim();
        }
        if (meetingDateText.value) {
            try {
                params.start_time = new Date(meetingDateText.value).toISOString();
            } catch (e) {
                ElMessage.error('日期格式错误');
                loading.value = false;
                return;
            }
        }

        axios.get('http://localhost:8080/getMeetingsBy', { params })
        .then(res => {
            console.log(res.data)
            tableData.value = (res.data.list || []).map((item: any) => ({
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
        })
        .catch(error => {
            console.error('查询失败:', error);
            ElMessage.error('查询失败');
            tableData.value = [];
        })
        .finally(() => {
            loading.value = false;
        });
    }

    function checkinfo(row:any) {
        checkDetail.value = true
        currentMeeting.value = {...row}
        nmeeting_id.value = row.meeting_id
        // 将数字状态转换为对应的字符串
        naudit_status.value = statusMap[row.audit_status] || '未审核'
    }
    //审查
    function check() {
        if (!nmeeting_id.value) {
            ElMessage.warning("请选择要审查的会议");
            return;
        }
        
        const statusNumber = statusReverseMap[naudit_status.value as keyof StatusReverseMap];
        if (statusNumber === undefined) {
            ElMessage.error("会议状态值无效，请选择 未审核/已通过/未通过");
            return;
        }
        
        // 使用POST请求并确保参数命名正确
        axios.post(`http://localhost:8080/updateStatu`, {
                meeting_id: Number(nmeeting_id.value),  // 确保参数名是meeting_id
                audit_status: statusNumber
        },{
                headers: {
                    'Content-Type': 'application/json'
                }
        })
        .then(res => {
            if (res.data > 0) {
                ElMessage.success("会议状态更新成功")
                checkDetail.value = false
                getAllMeeting()
            } else {
                ElMessage.error("会议状态更新失败")
            }
        })
        .catch(error => {
            console.error("审查出错：", error); 
            ElMessage.error("审查操作失败"); 
        })
    }
    //更新数据
    function updateMeeting(row:any){
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

    function deleteMeeting(no:number){
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
        if (!meeting_name.value ||!start_time.value ||!end_time.value || !content.value || !create_time.value || !creator_name.value || !audit_status.value) {
            ElMessage.error("请完善会议信息")
            return
        }
         // 检查时间有效性
        if (new Date(start_time.value) >= new Date(end_time.value)) {
            ElMessage.error("结束时间必须晚于开始时间")
            return
        }

        // 状态字符串转数字（核心修改）
        const statusNumber = statusReverseMap[audit_status.value as keyof StatusReverseMap];
        if (statusNumber === undefined) {
            ElMessage.error("会议状态值无效，请选择 未审核/已通过/未通过");
            return;
        }
        let meeting = {
            cover_url:cover_url.value,
            meeting_name: meeting_name.value,
            start_time: formatDateTime(start_time.value),
            end_time: formatDateTime(end_time.value),
            content: content.value,
            create_time: formatDateTime(create_time.value),
            creator_name: creator_name.value,
            audit_status: statusNumber
        };

        axios.post("http://localhost:8080/addMeeting",meeting,{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res.data)
            ElMessage.success("创建成功")
            meetingCreation.value = false
            cover_url.value=''
            meeting_name.value=''
            start_time.value=''
            end_time.value=''
            content.value=''
            create_time.value=''
            creator_name.value=''
            audit_status.value=0
            getAllMeeting()
        })
        .catch(error => {
            ElMessage.error("创建失败")
            console.log("创建会议失败：",error)
        })
    }

</script>

<style scoped>
    .table-wrap {
        display: flex;
        justify-content: center;
    }
    .custom-image-viewer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 99999 !important; /* 绝对最高层级 */
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: zoom-out;
    }

    .viewer-content {
        cursor: auto;
    }

    .viewer-content img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    }

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

    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
        cursor: pointer;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c8c8c;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
    }

    .custom-image {
        cursor: pointer;
    }
</style>
