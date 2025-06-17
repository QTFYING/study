# 国旅运通Online和App

## angular的坑

### AngularJs压缩出错

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


## 时间选择区间组件

* 1321

## app

* 1231