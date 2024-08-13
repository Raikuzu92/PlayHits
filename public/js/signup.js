const signupFormHandler = async function (event) {
  event.preventDefault();

  const usernameEl = document.querySelector("#username-input-signup").value.trim();
  const passwordEl = document.querySelector("#password-input-signup").value.trim();
  
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

  if (passwordEl.length < 8) {
    passwordFeedback.textContent = 'Password must be at least 8 characters long.';
    isValid = false;
  }

  if (isValid) {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          username: usernameEl,
          password: passwordEl,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
        document.location.replace("/");
      } else {
        // Display server-side validation errors
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
