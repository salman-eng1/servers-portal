document.getElementById('submit-button').addEventListener('click', function() {
    console.log('hi form networking hhhhhhhhhhhhhhhh')
    const newIP = document.getElementById('new-ip').value;
    const newMask = document.getElementById('new-mask').value;
    const dns = document.getElementById('dns').value.split(',').map(d => d.trim());
    const gateway = document.getElementById('gateway').value;
    showProgressModal(); 
    axios.post(window.APP_URL + '/api/change-netplan-ip', {
        ip: newIP,
        mask: newMask,
        dns: dns,
        gateway: gateway
    })
    .then(response => {
        alert('Network configuration updated successfully!');
        console.log(response.data);
    })
    .catch(error => {
        alert('Failed to update network configuration.');
        console.error(error);
    })

    .finally(() => {
        hideProgressModal(); // Hide modal when request completes
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
