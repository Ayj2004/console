// 存储键名
const STORAGE_KEYS = {
  HIGH_SCORE: "edge_command_high_score",
  GAME_COUNT: "edge_command_game_count",
  ACCURACY_LIST: "edge_command_accuracy_list",
  SPEED_LIST: "edge_command_speed_list",
};

/**
 * 存储数据到边缘存储（模拟，实际对接阿里云边缘存储API）
 * @param {string} key 键名
 * @param {any} value 值
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("存储失败：", e);
  }
};

/**
 * 从边缘存储获取数据（模拟）
 * @param {string} key 键名
 * @returns {any} 存储值
 */
export const getStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.warn("获取存储失败：", e);
    return null;
  }
};

/**
 * 记录游戏结果
 * @param {Object} result 结果对象
 */
export const recordGameResult = (result) => {
  // 记录游戏次数
  const gameCount = getStorage(STORAGE_KEYS.GAME_COUNT) || 0;
  setStorage(STORAGE_KEYS.GAME_COUNT, gameCount + 1);

  // 记录正确率列表
  const accuracyList = getStorage(STORAGE_KEYS.ACCURACY_LIST) || [];
  accuracyList.push(result.accuracy);
  // 仅保留最近10条
  if (accuracyList.length > 10) accuracyList.shift();
  setStorage(STORAGE_KEYS.ACCURACY_LIST, accuracyList);

  // 记录速度列表
  const speedList = getStorage(STORAGE_KEYS.SPEED_LIST) || [];
  speedList.push(result.speed);
  if (speedList.length > 10) speedList.shift();
  setStorage(STORAGE_KEYS.SPEED_LIST, speedList);

  // 更新最高记录
  const highScore = getStorage(STORAGE_KEYS.HIGH_SCORE) || {
    accuracy: 0,
    speed: 999,
  };
  if (
    result.accuracy > highScore.accuracy ||
    (result.accuracy === highScore.accuracy && result.speed < highScore.speed)
  ) {
    setStorage(STORAGE_KEYS.HIGH_SCORE, {
      accuracy: result.accuracy,
      speed: result.speed,
    });
  }
};

/**
 * 获取图表数据
 * @returns {Object} 正确率+速度列表
 */
export const getChartData = () => {
  return {
    accuracyList: getStorage(STORAGE_KEYS.ACCURACY_LIST) || [],
    speedList: getStorage(STORAGE_KEYS.SPEED_LIST) || [],
  };
};

/**
 * 获取最高记录
 * @returns {Object} 最高记录
 */
export const getHighScore = () => {
  return getStorage(STORAGE_KEYS.HIGH_SCORE) || { accuracy: 0, speed: 0 };
};
