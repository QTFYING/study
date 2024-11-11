    var doc = document;
    var _wheelData = -1;
    var mainBox = doc.getElementById('mainBox');

    function bind(obj, type, handler) {
      var node = typeof obj == "string" ? $(obj) : obj;
      if (node.addEventListener) {
        node.addEventListener(type, handler, false);
      } else if (node.attachEvent) {
        node.attachEvent('on' + type, handler);
      } else {
        node['on' + type] = handler;
      }
    }
    //鼠标滚动
    function mouseWheel(obj, handler) {
      var node = typeof obj == "string" ? $(obj) : obj;
      bind(node, 'mousewheel', function (event) {
        var data = -getWheelData(event);
        handler(data);
        if (document.all) {
          window.event.returnValue = false;
        } else {
          event.preventDefault();
        }
      });
      //火狐
      bind(node, 'DOMMouseScroll', function (event) {
        var data = getWheelData(event);
        handler(data);
        event.preventDefault();
      });

      function getWheelData(event) {
        var e = event || window.event;
        return e.wheelDelta ? e.wheelDelta : e.detail * 40;
      }
    }

    //移动端touch滚动事件
    function load(obj, handler, element) {
      var node = typeof obj == "string" ? $(obj) : obj;
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
        if (event.changedTouches[0].target.tagName !== 'DIV') return false;

        var event = event || window.event;
        var distance, clientY_start, clientY_end, minRange = 10;
        var elT = element.style.top; //目标元素css的top值
        var elH = element.style.height; //目标元素高度
        var elParentH = element.parentNode.style.height; //目标元素直属父节点高度
        this.clientY_start;
        this.direction;


        this.callbackFun = function () {
          if (elT === '0px' && this.direction == '1') console.log('到顶了不要再向上滑了');
          if (elT === parseInt(elParentH) - parseInt(elH) + 'px' && this.direction == '0') console.log('到底了不要再往下滑了');
        };

        // 切记pageY = clientY + 页面滚动高度
        switch (event.type) {
          case "touchstart":
            clientY_start = event.touches[0].clientY; //触摸点在Y轴方向的坐标
            this.clientY_start = clientY_start;
            //显示滚动条
            break;
          case "touchend":
            this.callbackFun();
            //隐藏滚动条
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
        this._tragScroll(scrollDiv, mainBox, contentBox); //拖动滚动条
        this._wheelChange(scrollDiv, mainBox, contentBox); //鼠标滚轮滚动
        this._clickScroll(scrollDiv, mainBox, contentBox); //调整滚动条
        this._touchScroll(scrollDiv, mainBox, contentBox); //调整滚动条
      },
      //创建滚动条
      _createScroll: function (mainBox, className) {
        var _scrollBox = doc.createElement('div')
        var _scroll = doc.createElement('div');
        var span = doc.createElement('span');
        _scrollBox.appendChild(_scroll);
        _scroll.appendChild(span);
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
        p.style.width = _scrollWidth + "px";
        p.style.height = _height + "px";
        p.style.left = _left + "px";
        p.style.position = "absolute";
        p.style.background = "#ccc";
        console.log('_width:' + _width + '---_height:' + _height + '---_scrollWith:' + _scrollWidth + '---_left:' + _left + '---conHeight:' + conHeight);
        contentBox.style.width = (mainBox.offsetWidth - _scrollWidth) + "px";
        console.log(contentBox);
        console.log(mainBox.offsetWidth);
        console.log(_scrollWidth);
        var _scrollHeight = parseInt(_height * (_height / conHeight));
        if (_scrollHeight >= mainBox.clientHeight) {
          element.parentNode.style.display = "none";
        }
        element.style.height = _scrollHeight + "px";
      },
      //拖动滚动条
      _tragScroll: function (element, mainBox, contentBox) {
        var mainHeight = mainBox.clientHeight;
        var scrollStart = element.onmousedown || element.touchstart;
        element.onmousedown = function (event) {

          var _this = this;
          var _scrollTop = element.offsetTop;
          var e = event || window.event;
          var top = e.clientY;
          //this.onmousemove=scrollGo;
          document.onmousemove = scrollGo;
          document.onmouseup = function (event) {
            this.onmousemove = null;
          }

          function scrollGo(event) {
            var e = event || window.event;
            var _top = e.clientY;
            var _t = _top - top + _scrollTop;
            if (_t > (mainHeight - element.offsetHeight)) {
              _t = mainHeight - element.offsetHeight;
            }
            if (_t <= 0) {
              _t = 0;
            }
            element.style.top = _t + "px";
            contentBox.style.top = -_t * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
            _wheelData = _t;
          }
        }
        element.onmouseover = function () {
          this.style.background = "red";
        }
        element.onmouseout = function () {
          this.style.background = "yellow";
        }
      },
      //鼠标滚轮滚动，滚动条滚动
      _wheelChange: function (element, mainBox, contentBox) {
        var node = typeof mainBox == "string" ? $(mainBox) : mainBox;
        var flag = 0,
          rate = 0,
          wheelFlag = 0;
        if (node) {
          mouseWheel(node, function (data) {
            wheelFlag += data;
            if (_wheelData >= 0) {
              flag = _wheelData;
              element.style.top = flag + "px";
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
            element.style.top = flag + "px";
            contentBox.style.top = -flag * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
          });
        }
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
              element.style.top = flag + "px";
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
            element.style.top = flag + "px";
            contentBox.style.top = -flag * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
          }, element);
        }
      },
      //点击滚动条区域，滚动条移动至
      _clickScroll: function (element, mainBox, contentBox) {
        var p = element.parentNode;
        p.onclick = function (event) {
          var e = event || window.event;
          var t = e.target || e.srcElement;
          var sTop = document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop;
          var top = mainBox.offsetTop;
          var _top = e.clientY + sTop - top - element.offsetHeight / 2;
          if (_top <= 0) {
            _top = 0;
          }
          if (_top >= (mainBox.clientHeight - element.offsetHeight)) {
            _top = mainBox.clientHeight - element.offsetHeight;
          }
          if (t != element) {
            element.style.top = _top + "px";
            contentBox.style.top = -_top * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
            _wheelData = _top;
          }
        }
      }
    }
    new addScroll('mainBox', 'content', 'scrollDiv');