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
function restoreScrollPosition(force = false) {
  const navEntry = performance.getEntriesByType("navigation")[0];
  const isBackForward = navEntry && navEntry.type === 'back_forward';
  
  if (force || isBackForward) {
    const savedPos = sessionStorage.getItem('scrollPos_' + window.location.pathname);
    if (savedPos) {
      // Small delay to ensure browser doesn't override our scroll
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPos, 10));
      }, 50);
    }
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
    restoreScrollPosition(true);
  }
});
