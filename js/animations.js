/**
 * STACKLY - GSAP & AOS Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }

  // Register ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {className: 'navbar-scrolled', targets: navbar},
        onUpdate: (self) => {
          if (self.direction === 1) {
            // scrolling down
            gsap.to(navbar, {y: -100, duration: 0.3, ease: 'power2.out'});
          } else {
            // scrolling up
            gsap.to(navbar, {y: 0, duration: 0.3, ease: 'power2.out', backgroundColor: 'rgba(5, 5, 5, 0.95)'});
          }
        }
      });
    }

    // Path steps scroll interaction
    const pathSteps = document.querySelectorAll('.path-step');
    if (pathSteps.length > 0) {
      pathSteps.forEach((step) => {
        const icon = step.querySelector('.step-icon');
        if (icon) {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 65%',
            end: 'bottom 35%',
            toggleClass: {targets: icon, className: 'active'}
          });
        }
      });
    }

    // Page Transition Setup (Intercept Links)
    initPageTransitions();

    // Add FX container to cards for advanced hover effects (Shine + Corner Draw)
    const cards = document.querySelectorAll('.glass-panel, .bootcamp-card, .pricing-card, .testimonial-card, .card, .blog-card, .mentor-card, .course-card, .feature-card, .benefit-card');
    cards.forEach(card => {
      if(!card.querySelector('.card-fx')) {
        const fx = document.createElement('div');
        fx.className = 'card-fx';
        card.appendChild(fx);
      }
    });

    // Generic GSAP Animations for sections
    const animateElements = (selector, fromVars) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        gsap.from(el, {
          ...fromVars,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });
    };

    animateElements('.gsap-fade-up', { y: 100 });
    animateElements('.gsap-fade-down', { y: -100 });
    animateElements('.gsap-fade-left', { x: -100 });
    animateElements('.gsap-fade-right', { x: 100 });
  }
});

window.triggerHeroAnimation = function() {
  if (typeof gsap === 'undefined') return;
  
  const heroText = document.querySelectorAll('.hero-text-animate');
  if (heroText.length > 0) {
    gsap.fromTo(heroText, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
    );
  }
  
  const heroVisual = document.querySelector('.hero-visual-animate');
  if (heroVisual) {
    gsap.fromTo(heroVisual,
      { x: 50, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.4, ease: 'back.out(1.7)' }
    );
  }

  // Counters animation
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && typeof ScrollTrigger !== 'undefined') {
    counters.forEach(counter => {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const target = parseInt(counter.getAttribute('data-target'));
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 1 }
          });
        }
      });
    });
  }
}

function initPageTransitions() {
  const links = document.querySelectorAll('a[href$=".html"]');
  const overlay = document.querySelector('.page-transition-overlay');
  
  if (!overlay) return;

  links.forEach(link => {
    // Ignore external links or target blank
    if (link.hostname !== window.location.hostname || link.getAttribute('target') === '_blank') return;
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      
      overlay.style.display = 'block';
      gsap.fromTo(overlay, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.inOut', onComplete: () => {
          window.location.href = target;
        }}
      );
    });
  });
}
