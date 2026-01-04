<template>
  <div class="command-display">
    <h2>边缘指令代码</h2>
    <div class="command-text">{{ targetCommand || "—— 准备开始 ——" }}</div>
    <div class="timer">
      剩余时间：<span>{{ countdown }}</span
      >s
    </div>
  </div>
</template>

<script setup>
// 接收父组件参数
const props = defineProps({
  targetCommand: {
    type: String,
    default: "",
  },
  countdown: {
    type: Number,
    default: 10, // 默认值从5改为10
  },
});

// 定义事件（暂无）
const emit = defineEmits([]);
</script>

<style scoped>
.command-display {
  width: 90%; /* 放大容器宽度 */
  max-width: 800px; /* 最大宽度 */
  margin: 20px auto; /* 居中 + 上下间距 */
  padding: 30px; /* 增加内边距 */
  /* 移除背景图相关样式 */
  border-radius: 8px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7); /* 保留深色背景保证可读性 */
}

.command-display h2 {
  color: #00ffdd;
  font-size: 24px; /* 放大标题 */
  margin-bottom: 20px;
}

.command-text {
  font-size: 20px; /* 放大指令文字 */
  color: #fff;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  margin-bottom: 20px;
  min-height: 80px; /* 最小高度，避免内容过少时界面过小 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer {
  font-size: 20px; /* 放大倒计时字体 */
  color: #ffd166;
  font-weight: bold;
}

.timer span {
  color: #ff4757;
  font-size: 24px;
}
</style>
