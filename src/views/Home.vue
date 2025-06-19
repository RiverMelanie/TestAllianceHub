<template>
	<div class="common-layout">
	    <el-container>
	      <el-header>测盟汇</el-header>
	      <el-container>
	        <el-aside width="200px">
			  <el-menu
				default-active="2"
				class="el-menu-vertical-demo"
				router
			  >
				<el-menu-item index="/UserManagement">
				  <span>用户管理</span>
				</el-menu-item>

				<el-menu-item index="/IndustryDynamicsManagement">
				  <span>行业动态管理</span>
				</el-menu-item>

				<el-menu-item index="/CourseManagement">
				  <span>课程管理</span>
				</el-menu-item>

				<el-menu-item index="/MeetingManagement">
				  <span>会议管理</span>
				</el-menu-item>

			  </el-menu>
			</el-aside>
	        <el-main>
				<router-view></router-view>
			</el-main>
	      </el-container>
	    </el-container>
	  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
	  .el-header{
	    background-color: #B3C0D1;
	    color: #333;
	    text-align: center;
	    line-height: 60px;
		font-size: 30px;
	  }
	  
	  .el-aside {
	    background-color: #D3DCE6;
	    color: #333;
	    text-align: center;
	    line-height: 200px;
		height: 700px;
	  }
	  
	  .el-main {
	    background-color: #E9EEF3;
	    color: #333;
	    text-align: center;
	    line-height: 60px;
	  }
	  
	  body > .el-container {
	    margin-bottom: 40px;
	  }
</style>