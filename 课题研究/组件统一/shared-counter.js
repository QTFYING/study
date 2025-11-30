class SharedCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        button {
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        span {
          margin: 0 10px;
          font-weight: bold;
        }
      </style>
      <button id="decrement">-</button>
      <span id="count">0</span>
      <button id="increment">+</button>
    `;
  }

  // 生命周期方法，当元素被插入DOM时回调
  connectedCallback() {
    this.shadowRoot.getElementById('increment').addEventListener('click', () => this.updateCount(1));
    this.shadowRoot.getElementById('decrement').addEventListener('click', () => this.updateCount(-1));
  }

  updateCount(change) {
    this.count += change;
    this.shadowRoot.getElementById('count').textContent = this.count;
    this.dispatchEvent(new CustomEvent('count-change', { detail: this.count }));
  }
}

// 注册自定义元素
customElements.define('shared-counter', SharedCounter);