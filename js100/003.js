/**
 * 请求对象类型定义
 * @typedef {Object} Request
 * @property {string} url - 请求的URL路径
 * @property {string} method - HTTP方法（GET/POST等）
 * @property {Object} [headers] - 可选的请求头对象
 */

/**
 * 中间件函数类型定义
 * @callback Middleware
 * @param {Request} req - 请求对象
 * @param {Function} next - 触发下一个中间件的函数
 * @returns {void}
 */

/**
 * 日志中间件 - 记录请求时间、方法和URL
 * @param {Request} req - 请求对象
 * @param {Function} next - 触发下一个中间件的函数
 */
const loggerMiddleware = (req, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

/**
 * 认证中间件 - 添加Bearer Token认证头
 * @param {Request} req - 请求对象
 * @param {Function} next - 触发下一个中间件的函数
 */
const authMiddleware = (req, next) => {
  // 创建新headers对象避免覆盖原有headers
  req.headers = {
    ...req.headers,  // 保留原有headers（如果有）
    Authorization: 'Bearer token123'
  };
  next();
};

/**
 * 中间件执行器 - 按顺序执行中间件链
 * @param {Request} req - 初始请求对象
 * @param {Middleware[]} middlewares - 中间件函数数组
 */
const runMiddleware = (req, middlewares) => {
  // 创建迭代执行器（替代递归方案）
  const execute = (index) => {
    if (index < middlewares.length) {
      // 执行当前中间件并传入下一个执行函数
      middlewares[index](req, () => execute(index + 1));
    }
  };

  // 启动执行链
  execute(0);
};

// 测试用例
const request = { url: "/api/data", method: "GET" };
runMiddleware(request, [loggerMiddleware, authMiddleware]);
console.log("最终请求对象:", request);