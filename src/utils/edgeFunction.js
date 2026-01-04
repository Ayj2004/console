// 指令池（关联ESA产品）
const commandPool = [
  {
    code: "pages-deploy-01",
    desc: "pages-deploy：阿里云Pages一键部署前端应用",
  },
  { code: "edge-func-08", desc: "edge-func：阿里云边缘函数，就近执行轻量代码" },
  {
    code: "edge-storage-12",
    desc: "edge-storage：阿里云边缘存储，低延迟读写数据",
  },
  {
    code: "edge-cache-05",
    desc: "edge-cache：阿里云边缘缓存，加速静态资源分发",
  },
  { code: "pages-domain-09", desc: "pages-domain：阿里云Pages自定义域名配置" },
];

/**
 * 随机生成指令（模拟边缘函数生成）
 * @returns {Object} 指令代码+描述
 */
export const generateRandomCommand = () => {
  const randomIndex = Math.floor(Math.random() * commandPool.length);
  return commandPool[randomIndex];
};

/**
 * 校验用户输入（模拟边缘函数就近校验）
 * @param {string} userInput 用户输入
 * @param {string} targetCommand 目标指令
 * @returns {boolean} 校验结果
 */
export const validateCommand = (userInput, targetCommand) => {
  return userInput.trim() === targetCommand;
};

/**
 * 计算响应速度（毫秒转秒）
 * @param {number} startTime 开始时间戳
 * @param {number} endTime 结束时间戳
 * @returns {number} 响应速度（秒，保留1位小数）
 */
export const calculateResponseSpeed = (startTime, endTime) => {
  return ((endTime - startTime) / 1000).toFixed(1);
};

/**
 * 计算正确率
 * @param {number} correctCount 正确次数
 * @param {number} totalCount 总次数
 * @returns {number} 正确率（百分比）
 */
export const calculateAccuracy = (correctCount, totalCount) => {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
};
