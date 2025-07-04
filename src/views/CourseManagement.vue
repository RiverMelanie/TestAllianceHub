<template>
	<el-form :inline="true" :model="queryParams" class="search-form">
		<el-form-item label="课程名">
			<el-input v-model="queryParams.courseName" placeholder="请输入课程名" clearable style="width: 200px" />
		</el-form-item>
		<el-form-item label="课程排序">
			<el-input v-model="queryParams.sort_order" placeholder="请输入课程排序" clearable style="width: 200px" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="handleQuery">查询</el-button>
			<el-button @click="resetQuery">重置</el-button>
			<el-button type="primary" @click="dialogVisible=true">添加课程</el-button>
		</el-form-item>
	</el-form>

	<el-table :data="tableData" style="width: 100%">
		<el-table-column fixed prop="course_id" label="id" width="100" />
		<el-table-column prop="course_name" label="课程名" width="400" />
		<el-table-column prop="description" label="课程简介" width="500" />
		<el-table-column label="状态" width="120">
			<template #default="scope">
				<el-tag :type="getStatusTagType(scope.row.status)">
					{{ getStatusText(scope.row.status) }}
				</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="操作" min-width="150">
			<template #default="scope">
				<el-button link type="primary" @click="delcrs(scope.row.course_id)" size="small">删除</el-button>
				<el-button link type="primary" size="small" @click="update(scope.row)">修改</el-button>
				<el-button link type="primary" size="small" @click="viewDetails(scope.row)">详情</el-button>
			</template>
		</el-table-column>
	</el-table>

	<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10"
		layout="total, prev, pager, next, jumper" :total="total" />

	<el-dialog v-model="dialogVisible" title="添加课程信息" width="900">
		<el-form :model="form" label-width="120px">
			<el-form-item label="课程名">
				<el-input v-model="form.course_name" style="width: 240px" placeholder="请输入课程名" clearable />
			</el-form-item>

			<el-form-item label="课程封面">
				<el-upload class="avatar-uploader" action="http://localhost:8080/upload/image" :show-file-list="false"
					:on-success="handleImageSuccess" :before-upload="beforeImageUpload">
					<img v-if="form.cover_url" :src="form.cover_url" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>

			<el-form-item label="课程简介">
				<el-input v-model="form.description" type="textarea" :rows="3" style="width: 80%"
					placeholder="请输入课程简介" />
			</el-form-item>

			<el-form-item label="课程排序">
				<el-input-number v-model="form.sort_order" :min="1" />
			</el-form-item>

			<el-form-item label="课程视频">
				<el-upload class="video-uploader" action="http://localhost:8080/upload/video" :show-file-list="false"
					:on-success="handleVideoSuccess" :before-upload="beforeVideoUpload">
					<el-button type="primary">点击上传</el-button>
					<div v-if="form.video_url" class="video-name">{{ getFileName(form.video_url) }}</div>
				</el-upload>
			</el-form-item>

			<el-form-item label="作者">
				<el-input v-model="form.author" style="width: 240px" placeholder="请输入作者" clearable />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="addcrs">提交</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>

	<el-dialog v-model="updateDialogVisible" title="修改课程信息" width="900">
		<el-form :model="updateForm" label-width="120px">
			<el-form-item label="课程名">
				<el-input v-model="updateForm.course_name" style="width: 240px" placeholder="请输入课程名" clearable />
			</el-form-item>

			<el-form-item label="课程封面">
				<el-upload class="avatar-uploader" action="http://localhost:8080/upload/image" :show-file-list="false"
					:on-success="handleUpdateImageSuccess" :before-upload="beforeImageUpload">
					<img v-if="updateForm.cover_url" :src="updateForm.cover_url" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>

			<el-form-item label="课程简介">
				<el-input v-model="updateForm.description" type="textarea" :rows="3" style="width: 80%"
					placeholder="请输入课程简介" />
			</el-form-item>

			<el-form-item label="课程排序">
				<el-input-number v-model="updateForm.sort_order" :min="1" />
			</el-form-item>

			<el-form-item label="课程视频">
				<el-upload class="video-uploader" action="http://localhost:8080/upload/video" :show-file-list="false"
					:on-success="handleUpdateVideoSuccess" :before-upload="beforeVideoUpload">
					<el-button type="primary">点击上传</el-button>
					<div v-if="updateForm.video_url" class="video-name">{{ getFileName(updateForm.video_url) }}</div>
				</el-upload>
			</el-form-item>

			<el-form-item label="作者">
				<el-input v-model="updateForm.author" style="width: 240px" placeholder="请输入作者" clearable />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="updatecrs">提交</el-button>
				<el-button @click="updateDialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>

	<el-dialog v-model="detailDialogVisible" title="课程详情" width="700px">
		<div v-if="currentCourse" class="course-details-container">
			<div class="header-section">
				<h2 class="course-title">{{ currentCourse.course_name }}</h2>
				<div class="meta-info">
					<div class="meta-item">
						<span class="meta-label">作者:</span>
						<span class="meta-value">{{ currentCourse.author }}</span>
					</div>
					<div class="meta-item">
						<span class="meta-label">创建者:</span>
						<span class="meta-value">{{ currentCourse.created_by_name || '未知' }}</span>
					</div>
				</div>
			</div>

			<div class="content-section">
				<div class="description-section">
					<h3 class="section-title">课程简介</h3>
					<p class="description-text">{{ currentCourse.description }}</p>
				</div>

				<div class="media-section">
					<div v-if="currentCourse.cover_url" class="media-item">
						<h3 class="section-title">课程封面</h3>
						<img :src="currentCourse.cover_url" class="cover-image" />
					</div>

					<div v-if="currentCourse.video_url" class="media-item">
						<h3 class="section-title">课程视频</h3>
						<video controls class="video-player" :key="currentCourse?.video_url">
							<source :src="currentCourse?.video_url" type="video/mp4">
							您的浏览器不支持视频播放
						</video>
					</div>
				</div>

				<div class="time-info">
					<div class="time-item">
						<span class="time-label">创建时间:</span>
						<span class="time-value">{{ formatDateTime(currentCourse.created_at) }}</span>
						<div class="time-item" v-if="currentCourse.updated_at">
							<span class="time-label">更新时间:</span>
							<span class="time-value">{{ formatDateTime(currentCourse.updated_at) }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue"
	import { ElMessage, ElMessageBox } from 'element-plus'
	import axios from "axios"
	import { Plus } from '@element-plus/icons-vue'

	const tableData = ref([])
	const queryParams = ref({
		courseName: '',
		sort_order: ''
	})
	const currentPage = ref(1)
	const total = ref(0)
	const loading = ref(false)
	let dialogVisible = ref(false)
	const updateDialogVisible = ref(false)
	const updateForm = ref({
		course_id: 0,
		course_name: '',
		cover_url: '',
		description: '',
		sort_order: 1,
		video_url: '',
		author: '',
		status: 1,
		created_by: 1,
		updated_at: null
	})
	const detailDialogVisible = ref(false)
	const currentCourse = ref(null)
	const currentUser = ref({
	  userId: null,  // 用于 created_by（外键）
	  nickname: ""   // 仅用于显示
	});
	
	// 查询方法
	const handleQuery = () => {
		currentPage.value = 1 // 查询时重置到第一页
		search()
	}

	// 重置查询
	const resetQuery = () => {
		queryParams.value = {
			courseName: '',
			sort_order: ''
		}
		handleQuery() // 重置后立即查询
	}

	const search = () => {
		loading.value = true
		axios.get("http://localhost:8080/getallcrs", {
			params: {
				pageNum: currentPage.value,
				pageSize: 10,
				courseName: queryParams.value.courseName.trim(), // 去除前后空格
				sortOrder: queryParams.value.sort_order ? parseInt(queryParams.value.sort_order) : null
			}
		})
			.then(res => {
				tableData.value = res.data.data
				total.value = res.data.total
			})
			.catch(error => {
				console.error("请求出错:", error)
				ElMessage.error('获取数据失败')
			})
			.finally(() => {
				loading.value = false
			})
	}

	const handleCurrentChange = (val : number) => {
		currentPage.value = val
		search()
	}

// 组件挂载时从 localStorage 获取用户信息
onMounted(() => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    currentUser.value = JSON.parse(userInfo);
    // 确保 created_by 是数字类型
    if (typeof currentUser.value.userId === 'string') {
      currentUser.value.userId = parseInt(currentUser.value.userId);
    }
  }
  search();
});

	const form = ref({
		course_name: '',
		cover_url: '',
		description: '',
		sort_order: 1,
		video_url: '',
		author: '',
		status: 0,
		created_by: 1, // 这里应该是当前登录用户ID
		updated_at: null
	})

	// 图片上传成功回调
	const handleImageSuccess = (response : any) => {
		if (response.code === 200) {
			form.value.cover_url = response.data.url
			ElMessage.success('封面图片上传成功')
		} else {
			ElMessage.error(response.message || '上传失败')
		}
	}

// 图片上传前校验
const beforeImageUpload = (file : File) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt5M = file.size / 1024 / 1024 < 5; // 修改为5MB

    if (!isJPG) {
        ElMessage.error('封面图片只能是 JPG/PNG 格式!');
    }
    if (!isLt5M) {
        ElMessage.error('封面图片大小不能超过 5MB!');
    }
    return isJPG && isLt5M;
}

	// 视频上传成功回调
	const handleVideoSuccess = (response : any) => {
		if (response.code === 200) {
			form.value.video_url = response.data.url
			ElMessage.success('视频上传成功')
		} else {
			ElMessage.error(response.message || '上传失败')
		}
	}

	// 视频上传前校验
	const beforeVideoUpload = (file : File) => {
		const isVideo = file.type.includes('video/')
		const isLt50M = file.size / 1024 / 1024 < 50

		if (!isVideo) {
			ElMessage.error('请上传视频文件!')
		}
		if (!isLt50M) {
			ElMessage.error('视频大小不能超过 50MB!')
		}
		return isVideo && isLt50M
	}

	// 获取文件名
	const getFileName = (url : string) => {
		return url.split('/').pop()
	}


	// 添加课程
const addcrs = () => {
  if (!form.value.course_name) {
    ElMessage.error("请填写课程名");
    return;
  }

  // 确保 currentUser.userId 是有效数字
  if (!currentUser.value.userId || isNaN(currentUser.value.userId)) {
    ElMessage.error("无法获取当前用户ID，请重新登录");
    return;
  }

  // 设置 created_by 为当前用户的数字ID
  form.value.created_by = currentUser.value.userId;

  axios.post("http://localhost:8080/addcrs", form.value)
    .then((res) => {
      if (res.data.success) {
        ElMessage.success("添加成功");
        dialogVisible.value = false;
        resetForm();
        search();
      } else {
        ElMessage.error(res.data.message || "添加失败");
      }
    })
    .catch((error) => {
      console.error("添加课程错误:", error.response?.data || error.message);
      ElMessage.error("添加失败: " + (error.response?.data?.message || error.message));
    });
};

	// 重置表单
	const resetForm = () => {
		form.value = {
			course_name: '',
			cover_url: '',
			description: '',
			sort_order: 1,
			video_url: '',
			author: '',
			status: 0,
			created_by: currentUser.value.userId, 
			updated_at: null
		}
	}

	function delcrs(id) {
		ElMessageBox.confirm('确认删除该课程吗?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			// 用户点击确定后执行删除操作
			axios.get("http://localhost:8080/delcrs?course_id=" + id)
				.then(res => {
					if (res.data > 0) {
						ElMessage.success("删除成功")
						search()
					} else {
						ElMessage.error("删除失败")
					}
				})
				.catch(error => {
					console.error("删除出错:", error)
					ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
				})
		}).catch(() => {
			// 用户点击取消
			ElMessage.info('已取消删除')
		})
	}


	const update = (row) => {
		updateForm.value = {
			course_id: row.course_id,
			course_name: row.course_name,
			cover_url: row.cover_url,
			description: row.description,
			sort_order: row.sort_order,
			video_url: row.video_url,
			author: row.author,
			status: row.status,
			created_by: row.created_by,
			updated_at: null
		}
		updateDialogVisible.value = true
	}

	// 图片上传成功回调（修改表单）
	const handleUpdateImageSuccess = (response : any) => {
		if (response.code === 200) {
			updateForm.value.cover_url = response.data.url
			ElMessage.success('封面图片上传成功')
		} else {
			ElMessage.error(response.message || '上传失败')
		}
	}

	// 视频上传成功回调（修改表单）
	const handleUpdateVideoSuccess = (response : any) => {
		if (response.code === 200) {
			updateForm.value.video_url = response.data.url
			ElMessage.success('视频上传成功')
		} else {
			ElMessage.error(response.message || '上传失败')
		}
	}

	//修改课程
  const updatecrs = () => {
    if (!updateForm.value.course_name) {
      ElMessage.error('请填写课程名')
      return
    }

    // 设置更新时间并将状态重置为审核中
    updateForm.value.updated_at = new Date().toISOString()
    updateForm.value.status = 0 // 设置为审核中状态

    axios.post("http://localhost:8080/upcrs", updateForm.value)
      .then(res => {
        if (res.data > 0) {
          ElMessage.success("修改成功，课程已重新进入审核状态")
          updateDialogVisible.value = false
          search() // 刷新列表
        } else {
          ElMessage.error("修改失败")
        }
      })
      .catch(error => {
        console.error("修改出错:", error)
        ElMessage.error('修改失败: ' + (error.response?.data?.message || error.message))
      })
  }

	// 查看详情方法
	const viewDetails = (row) => {
		if (row.status === 0) {
			ElMessage.warning('该课程正在审核中，暂时无法查看详情');
			return;
		}

		if (row.status === 2) {
			ElMessage.error('该课程未通过审核，无法查看详情');
			return;
		}

		axios.get("http://localhost:8080/getcrsdetails", {
			params: { course_id: row.course_id }
		})
			.then(res => {
				console.log("后端返回的数据:", res.data);
				if (res.data.success) {
					const course = res.data.data;
					if (course.video_url && !course.video_url.startsWith('http')) {
						course.video_url = 'http://localhost:8080' + course.video_url;
					}
					currentCourse.value = course;
					detailDialogVisible.value = true;
				}
			})
			.catch(error => {
				ElMessage.error('获取详情失败: ' + error.message);
			});
	};

	// 日期格式化方法
	const formatDateTime = (dateTime) => {
		if (!dateTime) return ''
		return new Date(dateTime).toLocaleString()
	}

	// 添加状态文本映射
	const getStatusText = (status : number) => {
		switch (status) {
			case 0: return '审核中';
			case 1: return '已通过';
			case 2: return '未通过';
			default: return '未知';
		}
	}

	// 添加状态标签类型映射
	const getStatusTagType = (status : number) => {
		switch (status) {
			case 0: return 'warning';
			case 1: return 'success';
			case 2: return 'danger';
			default: return 'info';
		}
	}
	
</script>

<style scoped>
/* 全局背景色 */
body {
  background-color: #f0f6ff; /* 浅蓝色背景 */
}

.search-form {
  padding: 20px;
  background: #ffffff; /* 白色背景 */
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.el-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  background-color: #ffffff; /* 白色背景 */
}

.el-table :deep(th) {
  background-color: #e5f1ff; /* 浅蓝色表头 */
  color: #3366cc; /* 蓝色文字 */
  font-weight: 600;
}

.el-pagination {
  justify-content: flex-end;
  margin-top: 20px;
}

.el-dialog {
  border-radius: 12px;
  background-color: #ffffff; /* 白色背景 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  margin-right: 0;
  background-color: #e5f1ff; /* 浅蓝色表头 */
  color: #3366cc; /* 蓝色文字 */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.el-dialog__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

/* 上传组件样式 */
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #3366cc; /* 蓝色虚线边框 */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  background: #fafafa;
}

.avatar-uploader .el-upload:hover {
  border-color: #3366cc; /* 蓝色边框 */
  background-color: #e5f1ff; /* 浅蓝色背景 */
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #3366cc; /* 蓝色图标 */
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.video-uploader {
  display: flex;
  align-items: center;
  gap: 10px;
}

.video-name {
  margin-left: 10px;
  color: #3366cc; /* 蓝色文字 */
  font-size: 14px;
}

/* 课程详情容器 */
.course-details-container {
  padding: 0 20px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
}

/* 头部区域 */
.header-section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.course-title {
  margin: 0 0 15px 0;
  font-size: 22px;
  color: #3366cc; /* 蓝色文字 */
  font-weight: 600;
}

.meta-info {
  display: flex;
  gap: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.meta-label {
  color: #888;
  margin-right: 8px;
}

.meta-value {
  color: #3366cc; /* 蓝色文字 */
  font-weight: 500;
}

/* 内容区域 */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 17px;
  color: #3366cc; /* 蓝色文字 */
  font-weight: 500;
  position: relative;
  padding-left: 10px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  height: 16px;
  width: 4px;
  background: #3366cc; /* 蓝色竖线 */
  border-radius: 2px;
}

.description-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #555;
}

/* 媒体区域 */
.media-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.cover-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.video-player {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 时间信息 */
.time-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 13px;
  color: #666;
}

.time-item {
  display: flex;
  margin-bottom: 8px;
}

.time-label {
  min-width: 80px;
  color: #888;
}

.time-value {
  color: #3366cc; /* 蓝色文字 */
}

.el-button--text {
  padding: 6px 8px;
}

.el-tag {
  font-weight: 500;
}
</style>