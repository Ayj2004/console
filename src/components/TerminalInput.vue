<template>
  <div class="terminal-input">
    <label>终端输入：</label>
    <input
      v-model="userInput"
      :class="{ error: isInputError }"
      placeholder="请输入指令..."
      autocomplete="off"
      :disabled="!isGameStarted"
      @keyup.enter="handleSubmit"
    />
    <button id="submit-btn" @click="handleSubmit" :disabled="!isGameStarted">
      执行指令
    </button>
    <button id="start-btn" @click="handleStart" :disabled="isGameStarted">
      开始游戏
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// 接收父组件参数
const props = defineProps({
  isGameStarted: {
    type: Boolean,
    default: false,
  },
});

// 定义事件
const emit = defineEmits(["start-game", "submit-input"]);

// 响应式数据
const userInput = ref("");
const isInputError = ref(false);

// 新增：清空输入框的方法
const clearInput = () => {
  userInput.value = "";
  isInputError.value = false; // 同时清除错误状态
};

// 监听输入错误状态，输入变化时清除错误
watch(userInput, () => {
  if (isInputError.value) {
    isInputError.value = false;
  }
});

// 开始游戏
const handleStart = () => {
  userInput.value = "";
  emit("start-game");
};

// 提交输入
const handleSubmit = () => {
  if (!userInput.value.trim()) return;
  // 触发父组件校验逻辑
  emit("submit-input", userInput.value);
  // 标记错误（父组件会通过校验结果更新）
  isInputError.value = true;
};

// 新增：暴露clearInput方法给父组件
defineExpose({
  clearInput,
});
</script>

<style scoped>
.terminal-input {
  width: 90%; /* 放大容器宽度 */
  max-width: 800px; /* 最大宽度 */
  margin: 20px auto; /* 居中 + 上下间距 */
  padding: 30px; /* 增加内边距，放大界面 */
  /* 背景图设置 */
  background-image: url("@/assets/bp.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px; /* 元素间距 */
}

.terminal-input label {
  color: #fff;
  font-size: 18px; /* 放大标签字体 */
  font-weight: bold;
}

.terminal-input input {
  flex: 1; /* 占满剩余宽度 */
  padding: 12px 15px; /* 放大输入框内边距 */
  font-size: 16px; /* 放大输入字体 */
  border: 2px solid #00ffdd;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  outline: none;
}

.terminal-input input.error {
  border-color: #ff4757;
}

.terminal-input input:disabled {
  border-color: #666;
  background: rgba(0, 0, 0, 0.3);
}

.terminal-input button {
  padding: 12px 25px; /* 放大按钮尺寸 */
  font-size: 16px; /* 放大按钮字体 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

#start-btn {
  background: #00ffdd;
  color: #000;
}

#submit-btn {
  background: #ffd166;
  color: #000;
}

button:disabled {
  background: #666;
  color: #ccc;
  cursor: not-allowed;
}
</style>
