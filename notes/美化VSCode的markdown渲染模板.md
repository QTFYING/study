# 美化VSCode的Markdown渲染模板

* 第一步，下载插件：markdown preview enhanced
* 第二步，在插件的设置中，选择自定义CSS：Command+Shift+P，选择Markdown Preview Enhanced: Customize CSS，选择Global CSS，粘贴下面的CSS代码：

``` css
.markdown-preview.markdown-preview {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size  : 14px;

  /**
 * 首先在父元素中（在这里是 body 元素），初始化你想要编号的最大标题的计数。
 */
  body,
  html {
    counter-reset: hbody;
    margin       : 0;
    padding      : 0;
  }

  /**
 * 然后父标题初始化子标题的计数，下面以此类推。
 */
  h1 {
    counter-reset: h1;

    &::before {
      content: '💠';
    }
  }

  h2 {
    counter-reset: h2;
    border-bottom: 1px solid #ececec;
  }

  h3 {
    counter-reset: h3;
  }

  h4 {
    counter-reset: h4;
  }

  h5 {
    counter-reset: h5;
  }


  /**
 * 接着在每个标题前面自动加上编号
 *
 * 如果不想从 h1 开始自动编号，而是把 h1 当成文章题目，从 h2 开始自动编号，那么
 * 1. 把 h1:before 注释
 * 2. 从 h2:before 开始到 h6:before，把编号开头的 counter(hbody) "." 这一部分删除
 */
  // h1:before {
  //   counter-increment: hbody;
  //   content: counter(hbody) " ";
  // }

  h2:before {
    counter-increment: h1;
    content          : counter(h1) " ";
  }

  h3:before {
    counter-increment: h2;
    content          : counter(h1) "."counter(h2) " ";
  }

  h4:before {
    counter-increment: h3;
    content          : counter(h1) "."counter(h2) "."counter(h3) " ";
  }

  h5:before {
    counter-increment: h4;
    content          : counter(h1) "."counter(h2) "."counter(h3) "."counter(h4) " ";
  }

  h6:before {
    counter-increment: h5;
    content          : counter(h1) "."counter(h2) "."counter(h3) "."counter(h4) "."counter(h5) " ";
  }

  table {
    display  : inline-block !important;
    font-size: 12px;
    width    : auto;
    max-width: 100%;
    overflow : auto;
    border   : solid 1px #f6f6f6;
  }

  thead {
    background: #f6f6f6;
    color     : #000;
    text-align: left;
  }

  tr:nth-child(2n) {
    background-color: #fcfcfc;
  }

  th,
  td {
    padding    : 7px 7px;
    line-height: 24px;
  }

  td {
    min-width: 120px;
  }
}
```
