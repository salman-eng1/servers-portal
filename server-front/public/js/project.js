document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    const progressBarFill = document.querySelector('.progress-bar-fill');

    function showProgressBar() {
        progressBar.style.display = 'block';
        progressBarFill.style.width = '0%';
        setTimeout(() => {
            progressBarFill.style.width = '100%';
        }, 100); // Simulate gradual filling
    }

    function hideProgressBar() {
        progressBarFill.style.width = '100%';
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 500); // Hide after the transition completes
    }

    // Add event listeners to buttons with progress bar display logic
    document.getElementById('enable-system').addEventListener('click', () => {
        showProgressBar();
        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        const systemName = projectName.trim();

        axios.post(window.APP_URL + '/api/enable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        })
        .then(response => {
            console.log('System enabled successfully:', response.data);
            refreshEnabledProjects();
        })
        .catch(error => {
            console.error('Error enabling system:', error);
        })
        .finally(() => {
            hideProgressBar();
        });
    });

    document.getElementById('disable-system').addEventListener('click', () => {
        showProgressBar();
        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        const systemName = projectName.trim();

        axios.post(window.APP_URL + '/api/disable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        })
        .then(response => {
            console.log('System disabled successfully:', response.data);
            refreshEnabledProjects();
        })
        .catch(error => {
            console.error('Error disabling system:', error);
        })
        .finally(() => {
            hideProgressBar();
        });
    });
});
