/**
 * 随机工具函数
 */

/**
 * 生成指定范围内的随机整数
 */
export function randomIntRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机整数
 */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * 从数组中随机选择一个元素
 */
export function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 随机打乱数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 随机生成布尔值
 */
export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

/**
 * 从数组中随机选择多个元素（不重复）
 */
export function sampleMultiple<T>(array: T[], count: number): T[] {
  if (count >= array.length) return shuffleArray(array);
  return shuffleArray(array).slice(0, count);
}
