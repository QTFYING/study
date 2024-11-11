(function(FLY) {
  /**
   * fly.js
   * 版本: 1.0.0
   * fly.js尽量覆盖开发过程中的常见的场景，提高开发效率
   * 博客: https://blog.csdn.net/qtfying
   * 掘金: https://juejin.im/user/57deadcd0e3dd90069721916
   * QQ: 2811132560
   * 邮箱: qtfying@gamil.com
   */
  F = fly = f = FLY;
  F.T = F.T || {};
  F.T.Util = F.T.Util || {};
  var util = F.T.Util;

  /**
   * 测试工具库是否正常引入
   */
  util.test = function () {
    console.log('引入fly.js框架成功');
  };

  /**
   * 获取URL中某个参数的值
   * @returns {String}
   */
  util.getUrlParam =  function (name) {

  };

  /**
   * 将URL查询参数转换为Object
   * @returns {{object}}
   */
  util.queryParamsToObj = function () {

  };

  util.ajax = function (json) {
    var timer = null;
    json = json || {};
    if (!json.url) {
      alert('请求url不存在，请重新检查');
      return;
    }
    json.type = json.type || 'get';
    json.time = json.time || 10;
    json.data = json.data || {};
    var oAjax = new XMLHttpRequest();
  };
})(window.FLY = window.fly || {});