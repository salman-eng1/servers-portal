document.addEventListener('DOMContentLoaded', () => {
    // Get the project name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('project'); // Get the project name from the URL query

    if (projectName) {
        // Set the project name in the <h1> and buttons
        document.getElementById('project-name').textContent = projectName;
        document.getElementById('enable-system').textContent = `${projectName} Enable System`;
        document.getElementById('disable-system').textContent = `${projectName} Disable System`;
    }

    // Enable System / Disable System Buttons
    document.getElementById('enable-system').addEventListener('click', () => {

        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        
        // Get the system name from the <h1> element
        const systemName = document.getElementById('project-name').textContent.trim();

        axios.post(window.APP_URL + '/api/enable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        })
            .then(response => {
                refreshEnabledProjects();
            })
            .catch(error => {
                console.error('Error enabling system:', error);
            });
    });

    document.getElementById('disable-system').addEventListener('click', () => {
    
        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        
        // Get the system name from the <h1> element
        const systemName = document.getElementById('project-name').textContent.trim();
    
        axios.post(window.APP_URL + '/api/disable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        })
        .then(response => {
            refreshEnabledProjects();
        })
        .catch(error => {
            console.error('Error disabling system:', error);
        });
    });

    function refreshEnabledProjects() {
        axios.get(window.APP_URL + '/api/get-enabled-projects')
            .then(response => {
                console.log(response);
                const projects = response.data.message; 
                const tableBody = document.getElementById('enabled-projects-table').getElementsByTagName('tbody')[0];
    
                // Clear any existing rows in the table body before populating
                tableBody.innerHTML = '';
    
                projects.forEach(project => {
                    const projectName = project.replace('.conf', '');
                    const row = tableBody.insertRow();
                    const cell = row.insertCell(0);
                    cell.textContent = projectName;
                });
            })
            .catch(error => {
                console.error('Error fetching system projects:', error);
            });
    }

    // Fetch and display system projects based on system name
    axios.get(window.APP_URL + '/api/get-enabled-projects')
        .then(response => {
            const projects = response.data.message;
            const tableBody = document.getElementById('enabled-projects-table').getElementsByTagName('tbody')[0];
    
            // Clear any existing rows in the table body before populating
            tableBody.innerHTML = '';
    
            projects.forEach(project => {
                const projectName = project.replace('.conf', '');
                const row = tableBody.insertRow();
                const cell = row.insertCell(0);
                cell.textContent = projectName;
            });
        })
        .catch(error => {
            console.error('Error fetching enabled projects:', error);
        });
});

