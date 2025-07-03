<template>
  <div class="common-layout">
    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <span class="logo-text">测盟汇</span>
          <span class="logo-subtext">测盟汇Web端管理系统</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="220px" class="app-sidebar">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            router
          >
            <el-menu-item index="/UserManagement" class="menu-item">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>

            <el-menu-item index="/IndustryDynamicsManagement" class="menu-item">
              <el-icon><TrendCharts /></el-icon>
              <span>行业动态管理</span>
            </el-menu-item>

            <el-menu-item index="/CourseManagement" class="menu-item">
              <el-icon><Reading /></el-icon>
              <span>课程管理</span>
            </el-menu-item>

            <el-menu-item index="/MeetingManagement" class="menu-item">
              <el-icon><Calendar /></el-icon>
              <span>会议管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="app-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
	import {
	User,
	TrendCharts,
	Reading,
	Calendar
	} from '@element-plus/icons-vue'
</script>

<style scoped>
	.common-layout {
	height: 100vh;
	display: flex;
	flex-direction: column;
	}

	.app-header {
	background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
	color: white;
	text-align: left;
	line-height: 60px;
	height: 80px;
	padding: 0 30px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	}

	.header-content {
	display: flex;
	flex-direction: column;
	}

	.logo-text {
	font-size: 24px;
	font-weight: bold;
	line-height: 1.2;
	}

	.logo-subtext {
	font-size: 14px;
	opacity: 0.8;
	line-height: 1;
	}

	.app-sidebar {
	background-color: #ffffff;
	color: #333;
	height: calc(100vh - 80px);
	border-right: 1px solid #e6e6e6;
	box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
	}

	.el-menu-vertical-demo {
	border-right: none;
	}

	.menu-item {
	height: 56px;
	margin: 4px 0;
	border-radius: 4px;
	transition: all 0.3s;
	}

	.menu-item:hover {
	background-color: #f0f7ff;
	color: #409EFF;
	}

	.menu-item.is-active {
	background-color: #ecf5ff;
	color: #409EFF;
	font-weight: 500;
	}

	.app-main {
	background-color: #f5f7fa;
	color: #333;
	padding: 20px;
	min-height: calc(100vh - 80px);
	overflow-y: auto;
	}
</style>