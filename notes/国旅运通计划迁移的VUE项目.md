# 国旅运通项

## 项目地址

代码地址:[gitlab](https://gitlab.com/static/cits-admin)
文档地址：[Pure Admin](https://pure-admin.cn/pages/introduction/#%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88)
代码源仓：[[Pure Admin](https://github.com/pure-admin/vue-pure-admin)

## 改造后代码和原项目的区别

- 因为该项目基于main分支Dec 15, 2024的代码进行升级改版，和后续该分支的代码会有不一致
- 升级过程中，重点对vite(v6)、tailwind(v4)、eslint（v9）和vue技术栈均作了升级改造
- 补充一些目前flat脚手架的的一些功能，比如：完善了proxy、mock，cdn移除

## 静态资源推向存储桶

- 方案1：[自己写的脚本](https://github.com/qtfying/study/blob/master/gulp/s3/gulpfile.js#L48)
- 方案2：[bun](bun.sh/blog/bun-v1.2#s3-support-width-bun-s3) - 推荐使用这个