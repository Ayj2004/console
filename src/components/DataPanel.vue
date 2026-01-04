<template>
  <div class="data-panel">
    <div class="chart-item">
      <h3>指令正确率</h3>
      <div id="accuracy-chart" class="chart"></div>
    </div>
    <div class="chart-item">
      <h3>平均响应速度</h3>
      <div id="speed-chart" class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import * as echarts from "echarts";

// 接收父组件图表数据
const props = defineProps({
  accuracyList: {
    type: Array,
    default: () => [],
  },
  speedList: {
    type: Array,
    default: () => [],
  },
});

// 初始化图表
let accuracyChart = null;
let speedChart = null;

const initCharts = () => {
  // 正确率图表
  accuracyChart = echarts.init(document.getElementById("accuracy-chart"));
  accuracyChart.setOption({
    backgroundColor: "rgba(0,0,0,0.5)",
    textStyle: { color: "#00ffdd" },
    xAxis: {
      type: "category",
      data: props.accuracyList.map((_, idx) => `第${idx + 1}轮`),
      axisLine: { lineStyle: { color: "#00ffdd" } },
    },
    yAxis: {
      type: "value",
      max: 100,
      name: "正确率(%)",
      axisLine: { lineStyle: { color: "#00ffdd" } },
      splitLine: { lineStyle: { color: "rgba(0,255,221,0.2)" } },
    },
    series: [
      {
        data: props.accuracyList,
        type: "line",
        itemStyle: { color: "#00ffdd" },
        lineStyle: { color: "#00ffdd", width: 2 },
        areaStyle: { color: "rgba(0,255,221,0.1)" },
        smooth: true,
      },
    ],
  });

  // 响应速度图表
  speedChart = echarts.init(document.getElementById("speed-chart"));
  speedChart.setOption({
    backgroundColor: "rgba(0,0,0,0.5)",
    textStyle: { color: "#00ffdd" },
    xAxis: {
      type: "category",
      data: props.speedList.map((_, idx) => `第${idx + 1}轮`),
      axisLine: { lineStyle: { color: "#00ffdd" } },
    },
    yAxis: {
      type: "value",
      name: "响应速度(s)",
      axisLine: { lineStyle: { color: "#00ffdd" } },
      splitLine: { lineStyle: { color: "rgba(0,255,221,0.2)" } },
    },
    series: [
      {
        data: props.speedList,
        type: "line",
        itemStyle: { color: "#ffd166" },
        lineStyle: { color: "#ffd166", width: 2 },
        areaStyle: { color: "rgba(255,209,102,0.1)" },
        smooth: true,
      },
    ],
  });
};

// 监听数据变化更新图表
watch([() => props.accuracyList, () => props.speedList], () => {
  if (accuracyChart && speedChart) {
    accuracyChart.setOption({
      xAxis: { data: props.accuracyList.map((_, idx) => `第${idx + 1}轮`) },
      series: [{ data: props.accuracyList }],
    });
    speedChart.setOption({
      xAxis: { data: props.speedList.map((_, idx) => `第${idx + 1}轮`) },
      series: [{ data: props.speedList }],
    });
  }
});

// 窗口大小变化时重置图表
onMounted(() => {
  initCharts();
  window.addEventListener("resize", () => {
    accuracyChart?.resize();
    speedChart?.resize();
  });
});
</script>

<style scoped>
.data-panel {
  width: 90%; /* 放大面板宽度，适配屏幕 */
  max-width: 1200px; /* 最大宽度限制 */
  margin: 0 auto; /* 居中显示 */
  padding: 20px;
  min-height: 600px; /* 最小高度，避免界面过小 */
  /* 移除背景图相关样式 */
  border-radius: 8px; /* 圆角优化 */
  background-color: rgba(0, 0, 0, 0.7); /* 保留深色背景保证可读性 */
}

.chart-item {
  margin-bottom: 40px; /* 增加项间距 */
  padding: 20px;
  background: rgba(0, 0, 0, 0.7); /* 半透明背景，提升文字可读性 */
  border-radius: 6px;
}

.chart-item h3 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 18px; /* 放大标题字体 */
}

.chart {
  width: 100%;
  height: 300px; /* 放大图表高度 */
}
</style>
