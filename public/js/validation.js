document.getElementById('signup-form').addEventListener('submit', function(event) {
  const passwordInput = document.getElementById('password-input-signup');
  const passwordFeedback = document.getElementById('password-feedback');
  
  if (passwordInput.value.length < 8) {
    passwordInput.classList.add('is-invalid');
    passwordFeedback.textContent = 'Password must be at least 8 characters long.';
    event.preventDefault(); // Prevent form submission
  } else {
    passwordInput.classList.remove('is-invalid');
    passwordFeedback.textContent = '';
  }
});
