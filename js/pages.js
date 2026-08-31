/**
 * STACKLY - Page Specific Logic (Filtering, Pricing, etc)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPricingToggle();
  initFilters();
});

function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  const prices = document.querySelectorAll('.price-amount');
  const labels = document.querySelectorAll('.price-label');

  if (toggle && prices.length > 0) {
    toggle.addEventListener('change', () => {
      const isYearly = toggle.checked;
      
      prices.forEach(price => {
        // Animate price change
        gsap.to(price, {
          opacity: 0, 
          y: -10,
          duration: 0.2, 
          onComplete: () => {
            const monthlyPrice = parseInt(price.getAttribute('data-monthly'));
            if (isYearly) {
              const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8); // 20% discount
              price.textContent = `$${yearlyPrice}`;
            } else {
              price.textContent = `$${monthlyPrice}`;
            }
            gsap.to(price, {opacity: 1, y: 0, duration: 0.3});
          }
        });
      });

      labels.forEach(label => {
        label.textContent = isYearly ? '/ Year' : '/ Month';
      });
    });
  }
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');
  
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Add active to clicked
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      filterItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          gsap.fromTo(item, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.4});
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
