// Main application functionality
class BloomApp {
    constructor() {
        this.currentModule = null;
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupModuleNavigation();
        this.setupTabNavigation();
    }

    setupSidebar() {
        const menuIcon = document.getElementById('menuIcon');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        menuIcon.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
               
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
               
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
    }

    setupModuleNavigation() {
        const moduleCards = document.querySelectorAll('.module-card');
        
        moduleCards.forEach(card => {
            card.addEventListener('click', () => {
                const moduleName = card.getAttribute('data-module');
                this.loadModule(moduleName, card);
            });
        });
    }

    async loadModule(moduleName, cardElement) {
        // Remove active class from all module cards
        document.querySelectorAll('.module-card').forEach(card => {
            card.classList.remove('active');
        });
       
        // Add active class to clicked module card
        cardElement.classList.add('active');
       
        // Hide the modules grid
        document.getElementById('modulesGrid').classList.add('hidden');
       
        try {
            // Load module HTML
            const response = await fetch(`modules/${moduleName}.html`);
            const html = await response.text();
            
            // Update module content area
            const moduleContent = document.getElementById('module-content');
            moduleContent.innerHTML = html;
            moduleContent.classList.add('active');
           
            // Load module-specific CSS
            this.loadModuleCSS(moduleName);
            
            // Load module-specific JS
            this.loadModuleJS(moduleName);
           
            // Update current module
            this.currentModule = moduleName;
           
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error loading module:', error);
            alert('Error loading module. Please try again.');
        }
    }

    loadModuleCSS(moduleName) {
        // Remove existing module CSS
        const existingLink = document.getElementById('module-css');
        if (existingLink) {
            existingLink.remove();
        }

        // Add new module CSS
        const link = document.createElement('link');
        link.id = 'module-css';
        link.rel = 'stylesheet';
        link.href = `styles/${moduleName}.css`;
        document.head.appendChild(link);
    }

    loadModuleJS(moduleName) {
        // Remove existing module JS
        const existingScript = document.getElementById('module-js');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new module JS
        const script = document.createElement('script');
        script.id = 'module-js';
        script.src = `js/${moduleName}.js`;
        document.body.appendChild(script);
    }

    goBackToMain() {
        // Remove active class from all module cards
        document.querySelectorAll('.module-card').forEach(card => {
            card.classList.remove('active');
        });
       
        // Show the modules grid
        document.getElementById('modulesGrid').classList.remove('hidden');
       
        // Hide module content
        const moduleContent = document.getElementById('module-content');
        moduleContent.classList.remove('active');
        moduleContent.innerHTML = '';
       
        // Remove module-specific CSS and JS
        const moduleCSS = document.getElementById('module-css');
        const moduleJS = document.getElementById('module-js');
        if (moduleCSS) moduleCSS.remove();
        if (moduleJS) moduleJS.remove();
       
        // Reset current module
        this.currentModule = null;
       
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            alert('Logging out...');
            // Redirect to login page
            window.location.href = 'login.html';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.bloomApp = new BloomApp();
});

// Global function for back button
function goBackToMain() {
    if (window.bloomApp) {
        window.bloomApp.goBackToMain();
    }
}

// Global function for logout
function logout() {
    if (window.bloomApp) {
        window.bloomApp.logout();
    }
}