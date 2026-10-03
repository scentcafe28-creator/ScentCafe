// ScentCafe App JavaScript
// All functionality is integrated into index.html for PWA compatibility

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            navigateTo(screenId.replace('-screen', ''));
        });
    });

    // Service worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }

    // Handle app installation
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });
});

// Navigation helper
function navigateTo(page) {
    // Implementation in index.html
}

// Job tab switching
function switchJobTab(tab) {
    // Implementation in index.html
}

// Application tab switching
function switchAppTab(tab) {
    // Implementation in index.html
}