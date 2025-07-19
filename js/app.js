import { Router } from "./router/Router.js";
import { CalculatorPage } from "./pages/CalculatorPage.js";
import { SupplyPage } from "./pages/SupplyPage.js";
import { ContactPage } from "./pages/ContactPage.js";
import { DonatePage } from "./pages/DonatePage.js";
import { dataService } from "./services/dataService.js";

class App {
  constructor() {
    this.router = null;
    this.isInitialized = false;
    this.errorRetryCount = 0;
    this.maxRetries = 3;
  }

  async initialize() {
    try {
      this.showGlobalLoader("Initializing application...");

      await this.preloadCriticalData();

      this.setupRouter();

      this.registerPages();

      this.setupGlobalHandlers();

      const initialPage = this.getInitialPage();
      await this.router.navigateTo(initialPage);

      this.router.enableSPALinks();

      this.isInitialized = true;

      this.showStartupNotification();
    } catch (error) {
      await this.handleInitializationError(error);
    }
  }

  async preloadCriticalData() {
    await dataService.loadData();
  }

  setupRouter() {
    this.router = new Router();
  }

  registerPages() {
    this.router.addRoute("calculator", CalculatorPage);
    this.router.addRoute("supply", SupplyPage);
    this.router.addRoute("contact", ContactPage);
    this.router.addRoute("donate", DonatePage);
  }

  setupGlobalHandlers() {
    window.addEventListener("error", this.handleGlobalError.bind(this));
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection.bind(this),
    );

    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this),
    );

    window.addEventListener(
      "resize",
      this.debounce(this.handleWindowResize.bind(this), 250),
    );
  }

  getInitialPage() {
    const hash = window.location.hash.substring(1);
    if (hash && this.router.hasRoute(hash)) {
      return hash;
    }

    const lastPage = localStorage.getItem("anno1404_last_page");
    if (lastPage && this.router.hasRoute(lastPage)) {
      return lastPage;
    }

    return "calculator";
  }

  async handleInitializationError(error) {
    this.errorRetryCount++;

    if (this.errorRetryCount <= this.maxRetries) {
      this.showGlobalLoader(
        `Retrying... (${this.errorRetryCount}/${this.maxRetries})`,
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await this.initialize();
    } else {
      this.showFatalError(error);
    }
  }

  showFatalError(error) {
    const container = document.getElementById("app-content");
    if (container) {
      container.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e74c3c; margin-bottom: 20px; font-size: 24px;">
              Application Failed to Start
            </h2>
            <p style="color: #f4e4c1; margin-bottom: 30px; line-height: 1.6;">
              ${error.message || "An unexpected error occurred while starting the application."}
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <button class="btn" onclick="location.reload()" style="background: #27ae60;">
                Reload Page
              </button>
              <button class="btn" onclick="localStorage.clear(); location.reload()" style="background: #e74c3c;">
                Clear Data & Reload
              </button>
            </div>
            <details style="margin-top: 30px; text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px;">
              <summary style="cursor: pointer; color: #f39c12;">Technical Details</summary>
              <pre style="margin-top: 10px; font-size: 12px; color: #bdc3c7; white-space: pre-wrap;">${error.stack || error.message}</pre>
            </details>
          </div>
        `;
    }
  }

  showGlobalLoader(message = "Loading...") {
    const container = document.getElementById("app-content");
    if (container) {
      container.innerHTML = `
          <div class="loading" style="min-height: 400px;">
            <div style="text-align: center;">
              <div style="margin-bottom: 20px; font-size: 18px;">${message}</div>
            </div>
          </div>
        `;
    }
  }

  showStartupNotification() {
    const isFirstVisit = !localStorage.getItem("anno1404_visited");

    if (isFirstVisit) {
      localStorage.setItem("anno1404_visited", "true");
      setTimeout(() => {
        this.showNotification(
          "Welcome to Anno 1404 Production Calculator! Use Ctrl+Enter to calculate.",
          "info",
        );
      }, 1000);
    }
  }

  handleGlobalError(event) {
    if (
      event.error &&
      event.error.message &&
      !event.error.message.includes("Script error") &&
      !event.error.message.includes("Non-Error promise rejection")
    ) {
      this.showNotification(
        "An unexpected error occurred. Please try refreshing the page.",
        "error",
      );
    }
  }

  handleUnhandledRejection(event) {
    event.preventDefault();

    if (
      event.reason &&
      typeof event.reason === "object" &&
      event.reason.message
    ) {
      this.showNotification(
        `Operation failed: ${event.reason.message}`,
        "error",
      );
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      const currentPage = this.router?.getCurrentRoute();
      if (currentPage) {
        localStorage.setItem("anno1404_last_page", currentPage);
      }
    }
  }

  handleWindowResize() {
    const currentPageInstance = this.router?.getCurrentPage();
    if (
      currentPageInstance &&
      typeof currentPageInstance.onWindowResize === "function"
    ) {
      currentPageInstance.onWindowResize();
    }

    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle("mobile-view", isMobile);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
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
        animation: slideInRight 0.3s ease-out;
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
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, hideDelay);
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  navigateTo(page) {
    if (this.router) {
      this.router.push(page);
    }
  }

  getCurrentPage() {
    return this.router?.getCurrentPage();
  }

  getInitializationStatus() {
    return {
      isInitialized: this.isInitialized,
      errorRetryCount: this.errorRetryCount,
      hasRouter: !!this.router,
    };
  }
}

const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
  @keyframes slideInRight {
    from { 
      transform: translateX(100%); 
      opacity: 0; 
    }
    to { 
      transform: translateX(0); 
      opacity: 1; 
    }
  }
  
  @keyframes slideOutRight {
    from { 
      transform: translateX(0); 
      opacity: 1; 
    }
    to { 
      transform: translateX(100%); 
      opacity: 0; 
    }
  }
  
  body.mobile-view .nav {
    flex-direction: column;
    gap: 10px;
  }
  
  body.mobile-view .header {
    flex-direction: column;
    text-align: center;
  }
`;
document.head.appendChild(notificationStyles);

const app = App.getInstance();

document.addEventListener("DOMContentLoaded", async () => {
  console.log("[App] DOM loaded, starting application...");
  await app.initialize();
});
