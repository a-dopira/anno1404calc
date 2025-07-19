export class BasePage {
  constructor() {
    this.container = null;
    this.eventListeners = [];
    this.components = [];
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    await this.onInit();

    this.isInitialized = true;
  }

  async onInit() {
    // pass
  }

  async render(container) {
    this.container = container;

    container.innerHTML = "";

    const html = await this.getHTML();
    container.innerHTML = html;

    await this.initializeComponents();

    this.bindEvents();

    await this.onRendered();
  }

  async getHTML() {
    return "<div>Base Page</div>";
  }

  async initializeComponents() {
    // pass
  }

  bindEvents() {
    // pass
  }

  async onRendered() {
    // pass
  }
  addEventListener(element, event, handler) {
    if (!element) {
      return;
    }

    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  querySelector(selector) {
    return this.container ? this.container.querySelector(selector) : null;
  }

  querySelectorAll(selector) {
    return this.container ? this.container.querySelectorAll(selector) : [];
  }
  registerComponent(component) {
    this.components.push(component);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            max-width: 400px;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideIn 0.3s ease-out;
        `;

    const colors = {
      error: { bg: "#e74c3c", text: "white" },
      success: { bg: "#27ae60", text: "white" },
      warning: { bg: "#f39c12", text: "white" },
      info: { bg: "#3498db", text: "white" },
    };

    const color = colors[type] || colors.info;
    notification.style.background = color.bg;
    notification.style.color = color.text;

    notification.textContent = message;
    document.body.appendChild(notification);

    const hideDelay = type === "error" ? 8000 : 4000;
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, hideDelay);
  }

  showLoader(message = "Loading...") {
    if (this.container) {
      this.container.innerHTML = `<div class="loading">${message}</div>`;
    }
  }

  async destroy() {
    await this.onDestroy();

    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    });
    this.eventListeners = [];

    for (const component of this.components) {
      if (component && typeof component.destroy === "function") {
        await component.destroy();
      }
    }
    this.components = [];

    if (this.container) {
      this.container.innerHTML = "";
      this.container = null;
    }
  }

  async onDestroy() {
    // pass
  }
}

const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
