  /**
   * 构造函数，用于初始化自定义元素
   */
class UserRegistration extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
          <form id="registrationForm">
              <input type="text" id="username" placeholder="用户名" required>
              <input type="email" id="email" placeholder="邮箱" required>
              <button type="submit">注册</button>
          </form>
      `;
  }

  connectedCallback() {
      this.shadowRoot.getElementById('registrationForm').addEventListener('submit', (event) => {
          event.preventDefault();
          const username = this.shadowRoot.getElementById('username').value;
          const email = this.shadowRoot.getElementById('email').value;

          // 触发自定义事件
          this.dispatchEvent(new CustomEvent('user-registered', {
              detail: { username, email },
              bubbles: true,
              composed: true,
          }));
      });
  }
}

customElements.define('user-registration', UserRegistration);

// 监听自定义事件
document.addEventListener('user-registered', (event) => {
    console.log('注册用户:', event.detail.username, '邮件:', event.detail.email);
    // 进行进一步处理，如提交数据到服务器
});
