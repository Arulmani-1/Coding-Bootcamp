/**
 * STACKLY - Layout Loader
 * Fetches and injects navbar.html and footer.html
 */

document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
});

async function loadComponents() {
  try {
    // Fetch and inject Navbar
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
      const navRes = await fetch('navbar.html');
      if (navRes.ok) {
        const navHtml = await navRes.text();
        navContainer.innerHTML = navHtml;
      }
    }

    // Fetch and inject Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      const footRes = await fetch('footer.html');
      if (footRes.ok) {
        const footHtml = await footRes.text();
        footerContainer.innerHTML = footHtml;
        
        // Newsletter subscription handler
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
          newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = document.getElementById('newsletter-message');
            if (msg) {
              msg.style.display = 'block';
              setTimeout(() => {
                window.location.href = '404.html';
              }, 1500); // 1.5 second delay before redirect
            }
          });
        }
      }
    }

    // Re-initialize logic from main.js now that DOM is updated
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initActiveLinks === 'function') initActiveLinks();
    
    // Trigger entrance animations if preloader is not blocking it
    if (typeof window.triggerHeroAnimation === 'function') {
      // Small timeout to allow DOM to render
      setTimeout(() => {
        window.triggerHeroAnimation();
      }, 100);
    }
  } catch (error) {
    console.error('Error loading layout components:', error);
  }
}
