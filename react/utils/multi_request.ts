import { from, mergeMap } from 'rxjs';

/**
 * 批量请求函数，用于同时发送多个请求
 * @param urls 请求的URL数组
 * @param maxNum 最大并发数
 * @returns 返回一个 Promise，包含所有请求的结果按照 urls 顺序依次排列的数组
 */

export const multiRequest = (urls = [], maxNum = 5) => {
  // 请求总数量
  const len = urls.length;
  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(len).fill(false);
  // 当前完成的数量
  let count = 0;

  return new Promise((resolve) => {
    // 请求maxNum个
    while (count < maxNum) next();

    function next() {
      let current = count;
      // 处理边界条件
      if (current >= len) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        if (!result.includes(false)) {
          return resolve(result)
        }
      }

      const url = urls[current];
      fetch(url).then((res) => {
        // 保存请求结果
        result[current] = res;
        // 请求没有全部完成，就递归
        if (current < len) next();
      }).catch((err) => {
        result[current] = err;
        // 请求没有全部完成，就递归
        if (current < len) next();
      })
    }
  });
}

/**
 * 采用rxjs方法实现，简化上述实现
 * @param urls 请求的URL数组
 * @param maxNum 最大并发数
 * @returns 返回一个 Promise，包含所有请求的结果按照 urls 顺序依次排列的数组
 */

export const multiRequestUseRx = (urls = [], maxNum = 5) => {
  // 假设这是你的http请求函数
  function httpGet(url) {
    return new Promise(resolve => setTimeout(() => resolve(`Result: ${url}`), 2000));
  }

  // mergeMap 是专门用来处理并发处理的 rxjs 操作符
  // mergeMap 第二个参数2的意思是，from(array)每次并发量是2，只有promise执行结束才接着取array里面的数据
  // mergeMap第一个参数 httpGet的意思是每次并发，从from(array)中取的数据如何包装，这里是作为httpGet的参数
  return from(urls = [])
    .pipe(mergeMap(httpGet, 2))
    .subscribe(val => console.log(val));
}