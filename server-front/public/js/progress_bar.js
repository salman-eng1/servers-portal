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

