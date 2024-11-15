// Function to show the progress bar
function showProgressBar() {
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.style.display = 'block';

    // Simulate progress bar movement
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += 5; // Adjust the step for the speed of progress
            document.getElementById('progress-bar').style.width = width + '%';
        }
    }, 100); // Adjust interval time to control the speed of the progress
}

// Function to hide the progress bar
function hideProgressBar() {
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.style.display = 'none';
}