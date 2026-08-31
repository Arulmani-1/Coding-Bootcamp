/**
 * STACKLY - Authentication Pages Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggle();
  initAuthValidation();
  initPreloader();
});

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1000);
  }
}

function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll('.password-toggle');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      } else {
        input.type = 'password';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      }
    });
  });
}

function initAuthValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Prevent actual submit for demo purposes
        event.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
          const isRegisterPage = window.location.pathname.includes('register.html');
          
          if (isRegisterPage) {
            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            
            if (nameInput) localStorage.setItem('stackly_name', nameInput.value);
            if (emailInput) localStorage.setItem('stackly_email', emailInput.value);
            
            window.location.href = 'login.html';
          } else {
            const roleSelect = document.getElementById('roleSelect');
            const emailInput = document.getElementById('email');
            
            if (emailInput) localStorage.setItem('stackly_email', emailInput.value);
            
            if (roleSelect) {
              const role = roleSelect.value;
              if (role === 'admin') {
                window.location.href = 'admin-dashboard.html';
              } else {
                window.location.href = 'user-dashboard.html';
              }
            }
          }
        }, 1500);
      }
      form.classList.add('was-validated');
    }, false);
  });
}
