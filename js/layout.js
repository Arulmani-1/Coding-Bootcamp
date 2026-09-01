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

// Global CTA Button Click Handler for Loading State -> 404
document.addEventListener('click', function(e) {
  const target = e.target.closest('a, button');
  if (!target) return;

  const targetTexts = [
    'get started', 'learn more', 'discover now', 
    'view all bootcamps', 'start plan', 'view location details', 
    'get career support', 'view all mentors', 'view all post', 
    'explore our bootcamps', 'view details'
  ];
  
  const text = target.innerText.toLowerCase().trim();
  let match = false;
  
  for (let t of targetTexts) {
    if (text.includes(t)) {
      match = true;
      break;
    }
  }

  if (match) {
    e.preventDefault();
    const originalWidth = target.offsetWidth;
    
    // Maintain width to prevent button from jumping
    if (originalWidth > 0) {
      target.style.width = originalWidth + 'px';
    }
    
    // Replace text with spinner
    target.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    target.style.pointerEvents = 'none';
    target.classList.add('disabled');
    target.style.opacity = '0.8';
    
    // Redirect after 1.5 seconds to the href of the link, or 404.html as fallback
    setTimeout(() => {
      const targetHref = target.getAttribute('href');
      if (targetHref && targetHref !== '#' && !targetHref.startsWith('javascript:')) {
        window.location.href = targetHref;
      } else {
        window.location.href = '404.html';
      }
    }, 1500);
  }
});

// Handle Back/Forward Cache (bfcache) to prevent stuck overlays or loading states
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    // If the page was restored from the browser cache (e.g. user clicked Go Back),
    // force a reload to reset the page transition overlay and any button loading states.
    window.location.reload();
  }
});
