document.addEventListener('DOMContentLoaded', () => {
    // Extract the project name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('projectName'); // Ensure this matches the key in loadProjectPage

    if (projectName) {
        // Update the project title and button labels
        document.getElementById('project-name').textContent = projectName;
        document.getElementById('enable-system').textContent = `${projectName} Enable System`;
        document.getElementById('disable-system').textContent = `${projectName} Disable System`;
    } else {
        console.error('Project name is missing from the URL parameters.');
    }

    // Function to handle system enabling
    document.getElementById('enable-system').addEventListener('click', () => {
        if (!projectName) {
            console.error('Project name is not defined.');
            return;
        }
        
        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        const systemName = projectName.trim(); // Use extracted projectName directly

        showProgressModal(); // Show modal when request starts

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

    // Function to handle system disabling
    document.getElementById('disable-system').addEventListener('click', () => {
        if (!projectName) {
            console.error('Project name is not defined.');
            return;
        }

        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        const systemName = projectName.trim(); // Use extracted projectName directly

        showProgressModal(); // Show modal when request starts

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


