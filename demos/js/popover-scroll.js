/*
 * 优化浏览器滚动条
 * */
var doc = document;
var _wheelData = -1;

//移动端touch滚动事件
function load(obj, handler, element) {

  // 由于touch滚动的特殊性，不能使用刚刚封装的bind函数，touchstart，touchmove，touchend另外写
  document.addEventListener('touchstart', touch, {
    passive: false
  });

  document.addEventListener('touchmove', touch, {
    passive: false
  });
  document.addEventListener('touchend', touch, {
    passive: false
  });

  function touch(event) {
    var event = event || window.event;
    var distance, clientY_start, clientY_end, minRange = 10;
    var elT = element.style.top; //目标元素css的top值
    var elH = element.style.height; //目标元素高度
    var elParentH = element.parentNode.style.height; //目标元素直属父节点高度
    this.clientY_start;
    this.direction;
    //如果滚动的不是目标元素，此处只有触摸的是a时才能滚动，否则直接return;
    if (event.changedTouches[0].target.tagName !== 'A') return false;
    this.callbackFun = function () {
      this.direction == '1' ? console.log('往回滑') : console.log('往下滑');
      if (elT === '0rem' && this.direction == '1') console.log('到顶了不要再向上滑了');
      if (elT === parseInt(elParentH) - parseInt(elH) + 'rem' && this.direction == '0') console.log('到底了不要再往下滑了');
    };

    // 切记pageY = clientY + 页面滚动高度
    switch (event.type) {
      case "touchstart":
        clientY_start = event.touches[0].clientY; //触摸点在Y轴方向的坐标
        this.clientY_start = clientY_start;
        //显示滚动条
        // element.parentNode.setAttribute('style', 'transition: opacity 500ms ease-in-out; opacity: 1');
        element.parentNode.cssText += 'transition: opacity 500ms ease-in-out;';
        setTimeout(function () {
          element.parentNode.style.opacity = '1';
        }, 500);
        break;
      case "touchend":
        this.callbackFun();
        //隐藏滚动条
        // element.parentNode.setAttribute('style', 'transition: opacity 500ms ease-in-out; opacity: 0'); //这种方法会将目标元素原来的css给重写，故不能用setAttribute
        element.parentNode.cssText += 'transition: opacity 500ms ease-in-out';
        setTimeout(function () {
          element.parentNode.style.opacity = '0';
        }, 500);
        break;
      case "touchmove":
        event.preventDefault();
        clientY_end = event.changedTouches[0].clientY;
        //判断移动的方向
        distance = clientY_end - this.clientY_start;
        // console.log(distance);
        handler(-distance);
        if (this.clientY_start + minRange < clientY_end) {
          this.direction = '1';
        } else if (this.clientY_start - minRange > clientY_end) {
          this.direction = '0';
        }
        break;
    }
  }
}

function addScroll() {
  this.init.apply(this, arguments);
}

addScroll.prototype = {
  init: function (mainBox, contentBox, className) {
    var mainBox = doc.getElementById(mainBox);
    var contentBox = doc.getElementById(contentBox);
    var scrollDiv = this._createScroll(mainBox, className);
    this._resizeScorll(scrollDiv, mainBox, contentBox); //调整滚动条
    this._touchScroll(scrollDiv, mainBox, contentBox); //调整滚动条
  },

  //创建滚动条
  _createScroll: function (mainBox, className) {
    var _scrollBox = doc.createElement('div');
    var _scroll = doc.createElement('div');
    _scrollBox.appendChild(_scroll);
    _scroll.className = className;
    mainBox.appendChild(_scrollBox);
    return _scroll;
  },

  //调整滚动条
  _resizeScorll: function (element, mainBox, contentBox) {
    var p = element.parentNode;
    var conHeight = contentBox.offsetHeight;
    var _width = mainBox.clientWidth;
    var _height = mainBox.clientHeight;
    var _scrollWidth = element.offsetWidth;
    var _left = _width - _scrollWidth;
    p.style.width = "3px";
    p.style.height = _height / 100 * 2 + "rem";
    p.style.left = _left / 100 * 2 + "rem";
    p.style.top = "0rem";
    p.style.position = "absolute";
    p.style.background = "#ccc";
    console.log('_width:' + _width + '---_height:' + _height + '---_scrollWith:' + _scrollWidth + '---_left:' + _left + '---conHeight:' + conHeight);
    var _scrollHeight = parseInt(_height * (_height / conHeight));
    if (_scrollHeight >= mainBox.clientHeight) {
      p.style.display = "none";
    } else {
      p.style.opacity = "0"; //有滚动条的话先将透明度设置为0
    }
    element.style.height = _scrollHeight / 100 * 2 + "rem";
  },

  //移动端touch滚动事件
  _touchScroll: function (element, mainBox, contentBox) {
    var node = typeof mainBox == "string" ? $(mainBox) : mainBox;
    var flag = 0,
      rate = 0,
      wheelFlag = 0;
    if (node) {
      load(node, function (data) {
        wheelFlag += data;
        if (_wheelData >= 0) {
          flag = _wheelData;
          element.style.top = flag / 100 * 2 + "rem";
          wheelFlag = _wheelData * 12;
          _wheelData = -1;
        } else {
          flag = wheelFlag / 12;
        }
        if (flag <= 0) {
          flag = 0;
          wheelFlag = 0;

        }
        if (flag >= (mainBox.offsetHeight - element.offsetHeight)) {
          flag = (mainBox.clientHeight - element.offsetHeight);
          wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;
        }
        element.style.top = flag / 100 * 2 + "rem";
        var contentBoxStyleTop = -flag * (contentBox.offsetHeight / mainBox.offsetHeight) / 100 * 2 + "rem";
        contentBox.style.top = contentBoxStyleTop;
        contentBox.style.cssText += 'transition: top 100ms ease';
        // contentBox.setAttribute('style', 'transition: top 100ms ease; top: ' + contentBoxStyleTop + ';position: absolute; right: 0; ');
      }, element);
    }
  }
};
new addScroll('scroll-wrapper', 'popover-scroll', 'scrollDiv');
