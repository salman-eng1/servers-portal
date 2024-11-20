// ./js/login.js
// import { EMAIL, PASSWORD } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    if (emailInput === EMAIL && passwordInput === PASSWORD) {
        
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
});






function showProgressModal() {
    const progressBarContainer = document.getElementById('progress-modal');
    const backdrop = document.getElementById('progress-modal-backdrop');
    if (!progressBarContainer || !backdrop) {
        console.error('Progress modal or backdrop element not found.');
        return;
    }
    progressBarContainer.style.display = 'block';
    backdrop.style.display = 'block';

    // Reset progress bar width
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }

    // Simulate progress bar movement
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += 5; // Adjust the step for the speed of progress
            progressBar.style.width = width + '%';
        }
    }, 100); // Adjust interval time to control the speed of the progress
}

function hideProgressModal() {
    const progressBarContainer = document.getElementById('progress-modal');
    const backdrop = document.getElementById('progress-modal-backdrop');
    if (!progressBarContainer || !backdrop) {
        console.error('Progress modal or backdrop element not found.');
        return;
    }
    progressBarContainer.style.display = 'none';
    backdrop.style.display = 'none';
}

