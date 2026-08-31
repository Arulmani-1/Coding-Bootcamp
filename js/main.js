/**
 * STACKLY - Main Global JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveLinks();
  initPreloader();
  initPricingToggle();
  initTestimonialSlider();
});

function initTestimonialSlider() {
  const track = document.getElementById('testi-track');
  const btnPrev = document.getElementById('testi-prev');
  const btnNext = document.getElementById('testi-next');
  
  if (!track || !btnPrev || !btnNext) return;
  
  let currentIndex = 0;

  function updateSlider() {
    const isMobile = window.innerWidth <= 767;
    const maxIndex = isMobile ? 3 : 2;
    
    // Ensure index doesn't exceed new max on resize
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    
    // Percentage to move per index is 100 / itemsToShow
    const percentToMove = isMobile ? 100 : 50;
    const translateX = -(currentIndex * percentToMove);
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update arrow colors
    btnPrev.style.color = currentIndex > 0 ? 'var(--brand-pink)' : '#ccc';
    btnPrev.style.borderColor = currentIndex > 0 ? 'var(--brand-pink)' : '#eee';
    
    btnNext.style.color = currentIndex < maxIndex ? 'var(--brand-pink)' : '#ccc';
    btnNext.style.borderColor = currentIndex < maxIndex ? 'var(--brand-pink)' : '#eee';
  }

  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  btnNext.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 767;
    const maxIndex = isMobile ? 3 : 2;
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });

  // Auto move every 5 seconds
  setInterval(() => {
    const isMobile = window.innerWidth <= 767;
    const maxIndex = isMobile ? 3 : 2;
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  }, 5000);

  window.addEventListener('resize', updateSlider);
  updateSlider();
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (toggleBtn && overlay) {
    toggleBtn.addEventListener('click', () => {
      overlay.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (overlay.classList.contains('active')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x-lg');
      } else {
        icon.classList.remove('bi-x-lg');
        icon.classList.add('bi-list');
      }
    });
  }
}

function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .mobile-menu-overlay .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'home.html') || (currentPath === 'index.html' && href === 'home.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    // Add a slight delay to ensure a smooth reveal
    setTimeout(() => {
      preloader.classList.add('fade-out');
      // Trigger global GSAP entrance after preloader
      if (typeof window.triggerHeroAnimation === 'function') {
        window.triggerHeroAnimation();
      }
    }, 2000);
  }
}

function initPricingToggle() {
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleAnnually = document.getElementById('toggle-annually');
  const priceValues = document.querySelectorAll('.price-value');
  const pricePeriods = document.querySelectorAll('.pricing-card .text-muted.fs-7:last-child');

  if (toggleMonthly && toggleAnnually && priceValues.length === 2) {
    const monthlyPrices = ['$29.99', '$49.99'];
    const annualPrices = ['$299.99', '$499.99'];

    toggleMonthly.addEventListener('click', () => {
      if (!toggleMonthly.classList.contains('active')) {
        toggleMonthly.classList.add('active');
        toggleAnnually.classList.remove('active');
        
        priceValues[0].textContent = monthlyPrices[0];
        priceValues[1].textContent = monthlyPrices[1];
        
        pricePeriods.forEach(p => p.textContent = 'Per month');
      }
    });

    toggleAnnually.addEventListener('click', () => {
      if (!toggleAnnually.classList.contains('active')) {
        toggleAnnually.classList.add('active');
        toggleMonthly.classList.remove('active');
        
        priceValues[0].textContent = annualPrices[0];
        priceValues[1].textContent = annualPrices[1];
        
        pricePeriods.forEach(p => p.textContent = 'Per year');
      }
    });
  }
}

