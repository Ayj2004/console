<template>
  <div class="console-container">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <span>边缘节点：[华东-杭州]</span>
      <span>网络延迟：2ms</span>
      <span>游戏状态：{{ isGameStarted ? "进行中" : "未开始" }}</span>
    </div>

    <!-- 指令展示组件 -->
    <CommandDisplay
      :target-command="currentCommand.code"
      :countdown="countdown"
    />

    <!-- 终端输入组件：新增ref引用 -->
    <TerminalInput
      ref="terminalInputRef"
      :is-game-started="isGameStarted"
      @start-game="startGame"
      @submit-input="submitInput"
    />

    <!-- 数据面板组件 -->
    <DataPanel :accuracy-list="accuracyList" :speed-list="speedList" />

    <!-- 结果弹窗 -->
    <div class="result-modal" v-if="showResultModal">
      <div class="modal-content">
        <h3>{{ isCorrect ? "指令执行成功" : "指令执行失败" }}</h3>
        <p>正确率：{{ currentAccuracy }}% | 响应速度：{{ currentSpeed }}s</p>
        <p id="esa-knowledge">{{ currentCommand.desc }}</p>
        <p>
          最高记录：正确率{{ highScore.accuracy }}% | 响应速度{{
            highScore.speed
          }}s
        </p>
        <button @click="restartGame">再来一轮</button>
        <button @click="endGame" style="margin-left: 10px">结束游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import CommandDisplay from "./components/CommandDisplay.vue";
import TerminalInput from "./components/TerminalInput.vue";
import DataPanel from "./components/DataPanel.vue";
import {
  generateRandomCommand,
  validateCommand,
  calculateResponseSpeed,
  calculateAccuracy,
} from "./utils/edgeFunction";
import {
  recordGameResult,
  getChartData,
  getHighScore,
} from "./utils/edgeStorage";

// 新增：获取TerminalInput组件实例
const terminalInputRef = ref(null);

// 响应式数据
const isGameStarted = ref(false); // 游戏是否开始
const countdown = ref(10); // 倒计时修改为10秒（原5秒）
const currentCommand = reactive({ code: "", desc: "" }); // 当前指令
const startTime = ref(0); // 开始时间戳
const currentAccuracy = ref(0); // 当前正确率
const currentSpeed = ref(0); // 当前响应速度
const showResultModal = ref(false); // 是否显示结果弹窗
const isCorrect = ref(false); // 输入是否正确

// 图表数据
const { accuracyList: initAccuracyList, speedList: initSpeedList } =
  getChartData();
const accuracyList = ref(initAccuracyList);
const speedList = ref(initSpeedList);

// 最高记录
const highScore = ref(getHighScore());

// 倒计时定时器
let countdownTimer = null;

// 开始游戏
const startGame = () => {
  // 重置状态
  isGameStarted.value = true;
  countdown.value = 10; // 开始游戏时重置倒计时为10秒（原5秒）
  showResultModal.value = false;
  // 生成随机指令
  const randomCmd = generateRandomCommand();
  currentCommand.code = randomCmd.code;
  currentCommand.desc = randomCmd.desc;
  // 记录开始时间
  startTime.value = Date.now();
  // 启动倒计时
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      // 超时判定为错误
      handleResult(false);
    }
  }, 1000);
};

// 提交输入
const submitInput = (userInput) => {
  // 停止倒计时
  clearInterval(countdownTimer);
  isGameStarted.value = false;
  // 校验输入
  const correct = validateCommand(userInput, currentCommand.code);
  // 计算结果
  handleResult(correct);
};

// 处理游戏结果
const handleResult = (correct) => {
  isCorrect.value = correct;
  // 计算响应速度和正确率
  const endTime = Date.now();
  currentSpeed.value = calculateResponseSpeed(startTime.value, endTime);
  const correctCount = correct
    ? accuracyList.value.length
      ? accuracyList.value.filter((v) => v === 100).length + 1
      : 1
    : accuracyList.value.length
    ? accuracyList.value.filter((v) => v === 100).length
    : 0;
  const totalCount = accuracyList.value.length + 1;
  currentAccuracy.value = calculateAccuracy(correctCount, totalCount);

  // 更新图表数据
  accuracyList.value.push(currentAccuracy.value);
  speedList.value.push(parseFloat(currentSpeed.value));

  // 记录结果到边缘存储
  recordGameResult({
    accuracy: currentAccuracy.value,
    speed: parseFloat(currentSpeed.value),
  });

  // 更新最高记录
  highScore.value = getHighScore();

  // 显示结果弹窗
  showResultModal.value = true;
};

// 重新开始游戏：新增清空输入框逻辑
const restartGame = () => {
  showResultModal.value = false;
  // 调用子组件的清空方法
  terminalInputRef.value?.clearInput();
  startGame();
};

// 结束游戏：新增清空输入框逻辑
const endGame = () => {
  // 重置所有游戏状态
  showResultModal.value = false;
  isGameStarted.value = false;
  clearInterval(countdownTimer);
  countdown.value = 10;
  currentCommand.code = "";
  currentCommand.desc = "";
  // 调用子组件的清空方法
  terminalInputRef.value?.clearInput();
  // 可根据需求是否清空图表数据
  // accuracyList.value = [];
  // speedList.value = [];
};

// 页面卸载时清除定时器
onMounted(() => {
  window.addEventListener("beforeunload", () => {
    clearInterval(countdownTimer);
  });
});
</script>
