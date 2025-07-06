<template>
  <div class="user-behavior-analysis">
    <!-- 行业动态分析 -->
    <h2 class="page-title">行业动态用户行为分析</h2>
    <div class="left-panel">
      <el-card>
        <div class="date-picker-group">
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="选择开始日期"
            style="margin-right: 8px"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="选择结束日期"
            style="margin-right: 12px"
          />
          <el-button type="primary" @click="fetchIndustryDynamics">查询</el-button>
        </div>
        <el-table
          v-loading="industryLoading"
          :data="industryTableData"
          style="width: 100%; margin-top: 20px"
          border
        >
          <el-table-column
            prop="dynamicTitle"
            label="行业动态标题"
            align="center"
          />
          <el-table-column
            prop="clickCount"
            label="点击量"
            align="center"
          />
        </el-table>
      </el-card>
    </div>

    <!-- 会议分析 -->
    <h2 class="page-title">会议用户行为分析</h2>
    <div class="right-panel">
      <el-card title="会议用户行为分析" class="meeting-card">
        <div class="chart-switch" slot="header">
          <el-button
            v-for="(btn, idx) in chartTypeList"
            :key="idx"
            type="text"
            @click="handleChartSwitch(btn.value)"
            :disabled="currentChartType === btn.value"
          >
            {{ btn.label }}
          </el-button>
        </div>
        <div class="chart-container" ref="meetingChart" style="width: 100%; height: 400px"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { ElMessage, ElCard, ElDatePicker, ElButton, ElTable, ElTableColumn } from 'element-plus';

// 类型定义
interface IndustryDynamic {
  dynamicTitle: string;
  clickCount: number;
}
interface MeetingData {
  name: string; 
  value: number; 
}
type ChartType = 'pie' | 'bar';

// 响应式数据
const startDate = ref<Date | undefined>(undefined);
const endDate = ref<Date | undefined>(undefined);
const industryLoading = ref(false);
const industryTableData = ref<IndustryDynamic[]>([]);
const meetingChart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;
const meetingData = ref<MeetingData[]>([]);
const chartTypeList = ref([
  { label: '饼状图', value: 'pie' as ChartType },
  { label: '柱状图', value: 'bar' as ChartType }
]);
const currentChartType = ref<ChartType>('pie');

// 获取行业动态
const fetchIndustryDynamics = async () => {
  if (!startDate.value || !endDate.value) {
    ElMessage.warning('请选择开始和结束日期');
    return;
  }
  
  // 将日期转换为 UTC 时间的 ISO 字符串（如 "2025-07-01T00:00:00Z"）
  const start = startDate.value.toUTCString(); 
  const end = endDate.value.toUTCString(); 
  console.log('前端传递的 UTC 日期:', { startDate: start, endDate: end });
  
  industryLoading.value = true;
  try {
    const response = await axios.get('http://localhost:8080/api/dynamics/mobiletopClicked', {
      params: { startDate: start, endDate: end }
    });
    industryTableData.value = response.data.map((item: any) => ({
      dynamicTitle: item.title, 
      clickCount: item.clickCount
    }));
  } catch (error) {
    ElMessage.error('获取行业动态数据失败');
    console.error(error);
  } finally {
    industryLoading.value = false;
  }
};
// 获取会议数据
const fetchMeetingData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/feedbackStats');
    meetingData.value = response.data.map((item: any) => ({
      name: item.catName,
      value: item.count
    }));
    renderMeetingChart();
  } catch (error) {
    ElMessage.error('获取会议数据失败');
    console.error(error);
  }
};

// 渲染会议图表（强化 DOM 校验和错误处理）
const renderMeetingChart = () => {
  nextTick(() => {
    try {
      if (!meetingChart.value) {
        console.warn('ECharts 容器未找到，跳过渲染');
        return;
      }
      // 销毁旧实例
      if (myChart) {
        myChart.dispose();
      }
      myChart = echarts.init(meetingChart.value);
      
      const option: echarts.EChartsOption = currentChartType.value === 'pie' 
        ? {
            title: { text: '各类会议比例', left: 'center' },
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                data: meetingData.value,
                label: {
                  show: true,
                  formatter: '{b}: {c} ({d}%)'
                }
              }
            ]
          } 
        : {
            title: { text: '各类会议数量', left: 'center' },
            xAxis: {
              type: 'category',
              data: meetingData.value.map(item => item.name)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                type: 'bar',
                data: meetingData.value.map(item => item.value),
                label: {
                  show: true,
                  position: 'top'
                }
              }
            ]
          };
      myChart.setOption(option);
      myChart.resize();
    } catch (error) {
      console.error('ECharts 渲染失败，尝试重试:', error);
      // 重试渲染（应对第三方脚本干扰）
      setTimeout(() => renderMeetingChart(), 200);
    }
  });
};

// 切换图表类型（强制 nextTick 确保更新）
const handleChartSwitch = (type: ChartType) => {
  currentChartType.value = type;
  nextTick(() => {
    renderMeetingChart();
  });
};

// 初始化：延迟确保 DOM 稳定
onMounted(() => {
  setTimeout(() => {
    fetchMeetingData();
  }, 100);
  
  window.addEventListener('resize', () => {
    myChart && myChart.resize();
  });
});

// 监听会议数据变化
watch(meetingData, () => {
  renderMeetingChart();
});
</script>

<style scoped>
.user-behavior-analysis {
  display: flex;
  padding: 20px;
  gap: 20px;
  flex-direction: column;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.left-panel, .right-panel {
  width: 100%;
}

.el-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chart-switch {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.chart-container {
  flex: 1;
  position: relative;
}

.date-picker-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>