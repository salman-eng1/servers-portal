document.addEventListener('DOMContentLoaded', () => {
    const progressModal = document.getElementById('progress-modal');

    function showProgressModal() {
        progressModal.style.display = 'flex';
    }

    function hideProgressModal() {
        progressModal.style.display = 'none';
    }

    document.getElementById('enable-system').addEventListener('click', () => {
        showProgressModal(); // Show modal when request starts
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
            hideProgressModal(); // Hide modal when request completes
        });
    });

    document.getElementById('disable-system').addEventListener('click', () => {
        showProgressModal(); // Show modal when request starts
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
            hideProgressModal(); // Hide modal when request completes
        });
    });

    // Function to refresh the enabled projects table
    function refreshEnabledProjects() {
        showProgressModal(); // Show modal while fetching
        axios.get(window.APP_URL + '/api/get-enabled-projects')
            .then(response => {
                const projects = response.data.message;
                const tableBody = document.getElementById('enabled-projects-table').getElementsByTagName('tbody')[0];

                tableBody.innerHTML = ''; // Clear any existing rows

                // Populate table with enabled projects
                projects.forEach(project => {
                    const projectName = project.replace('.conf', '');
                    const row = tableBody.insertRow();
                    const cell = row.insertCell(0);
                    cell.textContent = projectName;
                });
            })
            .catch(error => {
                console.error('Error fetching enabled projects:', error);
            })
            .finally(() => {
                hideProgressModal(); // Hide modal when request completes
            });
    }

    // Initial fetch of enabled projects on page load
    refreshEnabledProjects();
});
