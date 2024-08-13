const signupFormHandler = async function (event) {
  event.preventDefault();

  const usernameEl = document.querySelector("#username-input-signup").value.trim();
  const passwordEl = document.querySelector("#password-input-signup").value.trim();
  const emailEl = document.querySelector("#email-input-signup").value.trim();
  
  const usernameFeedback = document.querySelector("#username-feedback");
  const passwordFeedback = document.querySelector("#password-feedback");

  // Clear previous feedback
  usernameFeedback.textContent = '';
  passwordFeedback.textContent = '';

  let isValid = true;

  // Username validation
  if (usernameEl.length < 3) { // Example minimum length
    usernameFeedback.textContent = 'Username must be at least 3 characters long.';
    isValid = false;
  }

  // Email validation
  if (!emailEl.includes('@')) {
    emailFeedback.textContent = 'Please enter a valid email address.';
    isValid = false;
  }

  // Password validation
  if (passwordEl.length < 8) {
    passwordFeedback.textContent = 'Password must be at least 8 characters long.';
    isValid = false;
  }

  if (isValid) {
    try {
      console.log(usernameEl, emailEl, passwordEl);

      const user = { username: usernameEl, email: emailEl, password: passwordEl };

      const response = await fetch("/signup", {
        method: "POST",
        body: JSON.stringify(user),       
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
        document.location.replace("/pageOne");
      } else {
        // Display server-side validation errors
        console.log(result.message);
        passwordFeedback.textContent = result.message || 'Failed to sign up';
      }
    } catch (error) {
      console.error('Error:', error);
      passwordFeedback.textContent = 'An unexpected error occurred. Please try again.';
    }
  } else {
    // Optionally, focus the first invalid field
    if (usernameFeedback.textContent) {
      document.querySelector("#username-input-signup").focus();
    } else if (passwordFeedback.textContent) {
      document.querySelector("#password-input-signup").focus();
    }
  }
};

document.querySelector("#signup-form").addEventListener("submit", signupFormHandler);
