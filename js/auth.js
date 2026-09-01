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
      let customError = false;
      const isRegisterPage = window.location.pathname.includes('register.html');
      const password = document.getElementById('password');
      const errorContainer = isRegisterPage ? document.getElementById('register-error') : document.getElementById('login-error');
      
      if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.innerText = '';
      }

      if (password && password.value.length > 0 && password.value.length < 8) {
        if (errorContainer) {
          errorContainer.innerText = 'Password must be at least 8 characters long.';
          errorContainer.style.display = 'block';
        }
        customError = true;
      }

      if (isRegisterPage && !customError) {
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword && confirmPassword.value.length > 0 && confirmPassword.value.length < 8) {
           if (errorContainer) {
             errorContainer.innerText = 'Confirm Password must be at least 8 characters long.';
             errorContainer.style.display = 'block';
           }
           customError = true;
        } else if (password && confirmPassword && password.value !== confirmPassword.value) {
           if (errorContainer) {
             errorContainer.innerText = 'Passwords do not match.';
             errorContainer.style.display = 'block';
           }
           customError = true;
        }
      }

      if (!form.checkValidity() || customError) {
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
          if (isRegisterPage) {
            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            
            if (nameInput) localStorage.setItem('stackly_name', nameInput.value);
            if (emailInput) localStorage.setItem('stackly_email', emailInput.value);
            
            window.location.href = 'login.html';
          } else {
            const roleInput = document.querySelector('input[name="role"]:checked');
            const emailInput = document.getElementById('email');
            
            if (emailInput) localStorage.setItem('stackly_email', emailInput.value);
            
            if (roleInput) {
              const role = roleInput.value;
              if (role === 'admin') {
                window.location.href = 'admin-dashboard.html';
              } else {
                window.location.href = 'user-dashboard.html';
              }
            } else {
              // Fallback just in case
              window.location.href = 'user-dashboard.html';
            }
          }
        }, 1500);
      }
      form.classList.add('was-validated');
    }, false);
  });
}
