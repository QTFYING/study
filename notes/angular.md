# angularJs项目中要点

## AngularJs压缩出错

原因：由于AngularJS是通过控制器构造函数的参数名字来推断依赖服务名称的。所以如果你要压缩控制器的JS代码，它所有的参数也同时会被压缩，这时候依赖注入系统就不能正确的识别出服务了。

假如我们的Controller的名称为：BookCtrl，压缩前的代码为：

``` javascript
  var BookCtrl = function($scope, $http) { /* constructor body */ };
```

为了克服压缩引起的问题，只要在控制器函数里面给$inject属性赋值一个依赖服务标识符的数组：

``` javascript
  BookCtrl.$inject = ['$scope', '$http'];
```

另一种方法也可以用来指定依赖列表并且避免压缩问题——使用Javascript数组方式构造控制器：把要注入的服务放到一个字符串数组（代表依赖的名字）里，数组最后一个元素是控制器的方法函数：

``` javascript
var BookCtrl = ['$scope', '$http', function($scope, $http) { /* constructor body */ }];
```

上面提到的两种方法都能和AngularJS可注入的任何函数完美协作，要选哪一种方式完全取决于你们项目的编程风格， 建议使用数组方式。

## input 设置type为hidden时，form表单提交时拿不到该元素值

``` html
<input type="hidden" name="hotelQueryParam.maxPrice" ng-model="hotelPriceRange.max"/> 不正常
<input type="hidden" name="hotelQueryParam.maxPrice" ng-value="hotelPriceRange.max"/> 正常
<input hidden name="hotelQueryParam.maxPrice" ng-model="hotelPriceRange.max"/> 正常
```

原因分析：在angular中，隐藏域不支持双向数据绑定。

## angular组件的封装

* 定义模块和和获取已定义模块的区别
  * angular.module('app', []) 定义模块，并初始化
  * angular.module('app') 获取已定义的模块

* $watch和$observe的区别
  * $observe 仅监听attribute传入的值
  * $watch 监听作用域数据

* 组件的封装七剑客
  * constant
  * config
  * run
  * controller
  * directive
  * factories
  * services

* scope.$apply() 的妙用：触发脏检查，并入angular的消化周期
  * 第三方库的回调
  * DOM事件监听器
  * 异步操作

## 事件通知 $broadcast

解释：在 AngularJS 中，$broadcast 是一种用于在作用域（scope）树中向下传播事件的方法。它允许你将事件从父作用域传播到所有子作用域，从而实现不同组件之间的通信
场景：online首页进行差标选择时，自动将差标信息填充至表单中

```javascript
// 广播
ExternalOrderModel.getExternalOrderAutoInput(externalAutoInputParam, function (data) {
  if (data && data.resultData) {
      $scope.currentSelectedExternalOrderAutoInput = data.resultData.autoInputDto;
      $scope.externalGoTo(data.resultData.autoInputDto); // -> externalGoTo
      $scope.$broadcast("$ExternalOrderAutoInputChange"); // 广播
  }
});

// 接收
 scope.$on("$ExternalOrderAutoInputChange", function () {
    processExternalOrderAutoInput(scope);
});
```

