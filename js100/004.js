/**
 * 日志中间件 - 记录请求时间、方法和URL
 * @param {Object} req - 请求对象
 * @param {Function} next - 触发下一个中间件的函数
 */
function* loggerMiddleware(req, next) {
  const timestamp = new Date().toISOString();
  console.log(`日志插件 [${timestamp}] ${req.method} ${req.url} - 开始`);
  yield* next();
  console.log(`日志插件 [${timestamp}] ${req.method} ${req.url} - 完成`);
}

/**
 * 认证中间件 - 添加Bearer Token认证头
 * @param {Object} req - 请求对象
 * @param {Function} next - 触发下一个中间件的函数
 */
function* authMiddleware(req, next) {
  console.log(`认证插件 - 开始`);
  // 创建新headers对象避免覆盖原有headers
  req.headers = { ...req.headers, Authorization: 'Bearer token123', 'X-Auth-Time': new Date().toISOString()};
  yield* next();
  console.log(`认证插件 - 完成`);
}

/**
 * 响应处理中间件 - 模拟API响应
 * @param {Object} req - 请求对象
 * @param {Function} next - 触发下一个中间件的函数
 */
function* responseMiddleware(req, next) {
  console.log(`响应插件 - 开始`);
  yield* next();

  // 模拟API响应
  req.response = {
    status: 200,
    data: {
      message: '请求处理成功',
      url: req.url
    },
    headers: req.headers
  };
  console.log(`响应插件 - 完成`);
}

/**
 * Generator中间件执行器
 * @param {Object} req - 请求对象
 * @param {GeneratorFunction[]} middlewares - 中间件Generator函数数组
 */
function runMiddleware(req, middlewares) {
  /**
   * 递归执行中间件链
   * @param {number} index - 当前中间件索引
   */
  function* execute(index) {
    if (index < middlewares.length) {
      const middleware = middlewares[index];
      yield* middleware(req, () => execute(index + 1));
    }
  }

  // 创建Generator并执行
  const generator = execute(0);
  const iterator = generator;

  // 手动驱动Generator执行
  function drive() {
    const result = iterator.next();
    if (!result.done) drive();
  }

  drive();
}

/**
 * 改进版执行器 - 使用for...of自动迭代
 * @param {Object} req - 请求对象
 * @param {GeneratorFunction[]} middlewares - 中间件Generator函数数组
 */
function runMiddlewareAuto(req, middlewares) {
  function* compose() {
    function* dispatch(index) {
      if (index >= middlewares.length) return;
      yield* middlewares[index](req, () => dispatch(index + 1));
    }
    yield* dispatch(0);
  }

  // 使用for...of自动迭代Generator
  for (const _ of compose()) {
    // 空循环，仅用于驱动Generator执行
  }
}

// 测试用例
console.log('=== 测试用例1: 手动驱动执行器 ===');
const request1 = {
  url: "/api/data",
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
};
runMiddleware(request1, [loggerMiddleware, authMiddleware, responseMiddleware]);
console.log("最终请求对象-1:", request1);

console.log('\n=== 测试用例2: 自动迭代执行器 ===');
const request2 = {
  url: "/api/users",
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  }
};
runMiddlewareAuto(request2, [loggerMiddleware, authMiddleware, responseMiddleware]);
console.log("最终请求对象-2:", request2);

console.log('\n=== 测试用例3: 仅日志中间件 ===');
const request3 = {
  url: "/api/health",
  method: "GET"
};
runMiddlewareAuto(request3, [loggerMiddleware]);
console.log("最终请求对象-3:", request3);