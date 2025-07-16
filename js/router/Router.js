export class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        this.container = document.getElementById('app-content');
        this.navItems = document.querySelectorAll('.nav-item');
        
        this.init();
    }

    addRoute(path, pageClass) {
        this.routes.set(path, pageClass);
    }

    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
                
                history.pushState({ page }, '', `#${page}`);
            });
        });

        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || this.getInitialRoute();
            this.navigateTo(page, false);
        });

        window.addEventListener('hashchange', () => {
            const page = this.getCurrentRoute();
            this.navigateTo(page, false);
        });
    }

    async navigateTo(page, pushState = true) {

        try {
            this.showLoader();

            await this.destroyCurrentPage();

            await this.createPage(page);

            this.updateActiveNav(page);

            if (pushState) {
                history.pushState({ page }, '', `#${page}`);
            }

        } catch (error) {
            this.showError(`Failed to load page: ${page}`);
        }
    }

    async destroyCurrentPage() {
        if (this.currentPage) {

            if (typeof this.currentPage.destroy === 'function') {
                await this.currentPage.destroy();
            }
            
            this.currentPage = null;
        }
    }

    async createPage(page) {
        const PageClass = this.routes.get(page);
        
        if (!PageClass) {
            throw new Error(`Page not found: ${page}`);
        }
        
        this.currentPage = new PageClass();
        
        if (typeof this.currentPage.init === 'function') {
            await this.currentPage.init();
        }

        await this.currentPage.render(this.container);
        
    }

    updateActiveNav(page) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
    }

    showLoader() {
        this.container.innerHTML = '<div class="loading">Loading...</div>';
    }

    showError(message) {
        this.container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #e74c3c; margin-bottom: 20px;">Error</h2>
                <p style="color: #f4e4c1; margin-bottom: 20px;">${message}</p>
                <button class="btn" onclick="location.reload()">Reload Page</button>
            </div>
        `;
    }

    getCurrentRoute() {
        const hash = window.location.hash.substring(1);
        return hash || this.getInitialRoute();
    }

    getInitialRoute() {
        return 'calculator';
    }

    push(page) {
        this.navigateTo(page, true);
    }

    replace(page) {
        this.navigateTo(page, false);
        history.replaceState({ page }, '', `#${page}`);
    }

    getCurrentPage() {
        return this.currentPage;
    }

    hasRoute(page) {
        return this.routes.has(page);
    }

    enableSPALinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('href').substring(1);
                if (this.hasRoute(page)) {
                    this.push(page);
                }
            }
        });
    }
}