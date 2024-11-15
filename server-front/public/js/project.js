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

    // Get system name from the button content (e.g., "QMS")
    const systemName = document.getElementById('enable-system').textContent.trim(); // Assuming "Enable System" button text
    
    // Enable System / Disable System Buttons
    document.getElementById('enable-system').addEventListener('click', () => {
        showProgressBar();

        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        
        // Get the system name from the <h1> element
        const systemName = document.getElementById('project-name').textContent.trim();

        axios.post(window.APP_URL + '/api/enable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        })
            .then(response => {
                hideProgressBar();
                refreshEnabledProjects();

                // Optionally update the table or UI
            })
            .catch(error => {
                hideProgressBar();
                console.error('Error enabling system:', error);
            });
    });

    document.getElementById('disable-system').addEventListener('click', () => {
        showProgressBar();
    
        // Get the state of the checkbox
        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        
        // Get the system name from the <h1> element
        const systemName = document.getElementById('project-name').textContent.trim();
    
        // Make the POST request with deleteAll and systemName as part of the request body
        axios.post(window.APP_URL + '/api/disable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        })
        .then(response => {
            hideProgressBar();
            refreshEnabledProjects();
            // Optionally update the table or UI based on the response
        })
        .catch(error => {
            hideProgressBar();
            console.error('Error disabling system:', error);
        });
    });
    


    function refreshEnabledProjects() {
        axios.get(window.APP_URL + '/api/get-enabled-projects')
            .then(response => {
                console.log(response);
                const projects = response.data.message; // Assuming this returns an array of projects
                const tableBody = document.getElementById('enabled-projects-table').getElementsByTagName('tbody')[0];
    
                // Clear any existing rows in the table body before populating
                tableBody.innerHTML = '';
    
                // Populate the table with the returned projects
                projects.forEach(project => {
                    // Remove the .conf extension
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
            console.log(response);
            const projects = response.data.message; // Assuming this returns an array of projects
            const tableBody = document.getElementById('enabled-projects-table').getElementsByTagName('tbody')[0];

            // Clear any existing rows in the table body before populating
            tableBody.innerHTML = '';

            // Populate the table with the returned projects
            projects.forEach(project => {
                // Remove the .conf extension
                const projectName = project.replace('.conf', '');

                const row = tableBody.insertRow();
                const cell = row.insertCell(0);
                cell.textContent = projectName;
            });
        })
        .catch(error => {
            console.error('Error fetching system projects:', error);
        });

    // Disable all enabled projects checkbox logic
    document.getElementById('disable-all-checkbox').addEventListener('change', (event) => {
        if (event.target.checked) {
            showProgressBar();
            axios.post(window.APP_URL + '/api/disable-all-enabled-projects')
                .then(response => {
                    hideProgressBar();
                    console.log('All enabled projects have been disabled');
                    // Optionally update the UI to reflect the change
                })
                .catch(error => {
                    hideProgressBar();
                    console.error('Error disabling all enabled projects:', error);
                });
        }
    });
});

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
            width += 5;
            document.getElementById('progress-bar').style.width = width + '%';
        }
    }, 100); // Adjust interval time to control the speed of the progress
}

// Function to hide the progress bar
function hideProgressBar() {
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.style.display = 'none';
}
