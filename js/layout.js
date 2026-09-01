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
              window.newsletterTimeoutId = setTimeout(() => {
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
        restoreScrollPosition();
      }, 100);
    } else {
      setTimeout(restoreScrollPosition, 100);
    }
  } catch (error) {
    console.error('Error loading layout components:', error);
  }
}

// Save scroll position before leaving the page
window.addEventListener('pagehide', function() {
  sessionStorage.setItem('scrollPos_' + window.location.pathname, window.scrollY);
});

// Save scroll position instantly when clicking any link
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.href && !link.href.startsWith('javascript:')) {
    sessionStorage.setItem('scrollPos_' + window.location.pathname, window.scrollY);
  }
});

// Helper function to restore scroll on back navigation
function restoreScrollPosition() {
  const key = 'scrollPos_' + window.location.pathname;
  const savedPos = sessionStorage.getItem(key);
  
  if (savedPos) {
    const targetY = parseInt(savedPos, 10);
    
    const doScroll = () => {
      window.scrollTo(0, targetY);
    };

    // Try scrolling immediately
    doScroll();
    
    // Try again after small delays in case of dynamic DOM or slow images
    setTimeout(doScroll, 100);
    setTimeout(doScroll, 500);
    
    // And wait for full page load just to be absolutely sure
    if (document.readyState === 'complete') {
      setTimeout(doScroll, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(doScroll, 100);
      });
    }
    
    // Remove it so it doesn't trigger on manual page reloads
    sessionStorage.removeItem(key);
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
    const originalHtml = target.innerHTML;
    
    // Maintain width to prevent button from jumping
    if (originalWidth > 0) {
      target.style.width = originalWidth + 'px';
    }
    
    // Save original HTML to restore when navigating back
    target.setAttribute('data-original-html', originalHtml);
    
    // Replace text with spinner
    target.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    target.style.pointerEvents = 'none';
    target.classList.add('disabled');
    target.style.opacity = '0.8';
    
    // Redirect after 1.5 seconds to the href of the link, or 404.html as fallback
    window.ctaTimeoutId = setTimeout(() => {
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
  // Always ensure page transition overlay is hidden and animations stopped
  // This fixes the solid purple screen issue when navigating back
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    if (typeof gsap !== 'undefined') gsap.killTweensOf(overlay);
    overlay.style.display = 'none';
    overlay.style.opacity = '0';
  }

  if (event.persisted) {
    // Clear any pending timeouts that were paused in bfcache
    if (window.ctaTimeoutId) clearTimeout(window.ctaTimeoutId);
    if (window.newsletterTimeoutId) clearTimeout(window.newsletterTimeoutId);
    window.isPageTransitioning = false;

    // Reset button loading states without reloading the page to preserve scroll position
    const loadingBtns = document.querySelectorAll('[data-original-html]');
    loadingBtns.forEach(btn => {
      btn.innerHTML = btn.getAttribute('data-original-html');
      btn.classList.remove('disabled');
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
      btn.removeAttribute('data-original-html');
    });
    
    // Also reset form submit buttons
    const disabledBtns = document.querySelectorAll('button:disabled');
    disabledBtns.forEach(btn => btn.disabled = false);
    
    // Ensure preloader is hidden
    const preloader = document.querySelector('.preloader');
    if (preloader) preloader.classList.add('fade-out');
    
    // Restore scroll position for bfcache load
    restoreScrollPosition();
  }
});
