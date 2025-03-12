  /**
   * 构造函数，用于初始化自定义元素
   */
class HelloWorld extends HTMLElement {
  constructor() {
      super();
      this.addEventListener('click', () => {
        console.log(this.innerHTML)
      });
  }
}

class ReverseTag extends HTMLElement {
  constructor() {
    super();
    const $box = document.createElement('p');
    let userName = this.getAttribute('name');
  }
}

customElements.define('hello-world', HelloWorld);