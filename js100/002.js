/**
 * 防抖函数
 * 类型：手写题
 * @param {Function} func 需要防抖的函数
 * @param {number} wait 延迟时间，单位毫秒
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */

const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;

    if (timeout) clearTimeout(timeout);

    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  }
}