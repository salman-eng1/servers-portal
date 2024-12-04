function loadConfigurationProjects() {
    showProgressModal();
    axios.get(window.APP_URL + '/api/get-systems')
        .then(response => {
            console.log('API response:', response.data); // Log the API response
            const projects = response.data.message;

            if (Array.isArray(projects)) {
                // Select the container for radio buttons (only for migrate section)
                const migrateContainer = document.getElementById('migrate-project-container');
                const permissionsContainer = document.getElementById('fix-permissions-container');
                const clearCacheContainer = document.getElementById('clearcache-project-container'); // Add this line for clear cache container

                // Clear existing radio buttons in migrate, clear cache, and permissions sections
                migrateContainer.innerHTML = '';
                clearCacheContainer.innerHTML = ''; // Clear clear cache section
                permissionsContainer.innerHTML = '';

                // Create radio buttons for each project in "Migrate Database" and "Clear Cache" sections
                projects.forEach(project => {
                    // Create a radio button and label for "Migrate Database" section
                    const radioMigrate = document.createElement('input');
                    radioMigrate.type = 'radio';
                    radioMigrate.name = 'migrate-project'; // Same name to group radio buttons
                    radioMigrate.value = project;
                    radioMigrate.id = `migrate-${project}`;

                    const labelMigrate = document.createElement('label');
                    labelMigrate.htmlFor = `migrate-${project}`;
                    labelMigrate.textContent = project;

                    // Append to "Migrate Database" section
                    migrateContainer.appendChild(radioMigrate);
                    migrateContainer.appendChild(labelMigrate);
                    migrateContainer.appendChild(document.createElement('br')); // Line break for better layout

                    // Create a radio button and label for "Fix Permissions" section
                    const radioPermissions = document.createElement('input');
                    radioPermissions.type = 'radio';
                    radioPermissions.name = 'fix-permissions'; // Same name to group radio buttons
                    radioPermissions.value = project;
                    radioPermissions.id = `permissions-${project}`;

                    const labelPermissions = document.createElement('label');
                    labelPermissions.htmlFor = `permissions-${project}`;
                    labelPermissions.textContent = project;

                    // Append to "Fix Permissions" section
                    permissionsContainer.appendChild(radioPermissions);
                    permissionsContainer.appendChild(labelPermissions);
                    permissionsContainer.appendChild(document.createElement('br')); // Line break for better layout

                    // Create a radio button and label for "Clear Cache" section
                    const radioClearCache = document.createElement('input');
                    radioClearCache.type = 'radio';
                    radioClearCache.name = 'clearcache-project'; // Same name to group radio buttons
                    radioClearCache.value = project;
                    radioClearCache.id = `clearcache-${project}`;

                    const labelClearCache = document.createElement('label');
                    labelClearCache.htmlFor = `clearcache-${project}`;
                    labelClearCache.textContent = project;

                    // Append to "Clear Cache" section
                    clearCacheContainer.appendChild(radioClearCache);
                    clearCacheContainer.appendChild(labelClearCache);
                    clearCacheContainer.appendChild(document.createElement('br')); // Line break for better layout
                });

            } else {
                console.error('Expected an array of projects, but received:', projects);
            }
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        })
        .finally(() => {
            hideProgressModal();
        });
}

// Event listener for "Migrate Database" submit button
document.getElementById('migrate-submit').addEventListener('click', () => {
    const selectedProject = document.querySelector('#migrate-project-container input[type="radio"]:checked');
    if (selectedProject) {
        console.log('Selected project for migration:', selectedProject.value);

        // Trigger the migration request
        migrateDatabase(selectedProject.value); // Call the function to send the request
    } else {
        console.log('No project selected for migration.');
    }
});

document.getElementById('fix-submit').addEventListener('click', () => {
    const selectedProject = document.querySelector('#fix-permissions-container input[type="radio"]:checked');
    if (selectedProject) {
        console.log('Selected project for fix permissions:', selectedProject.value);

        // Trigger the fix permissions request
        fixPermissions(selectedProject.value); // Call the function to send the request
    } else {
        console.log('No project selected for fix permissions.');
    }
});

// Event listener for "Clear Cache" submit button
document.getElementById('clearcache-submit').addEventListener('click', () => {
    const selectedProject = document.querySelector('#clearcache-project-container input[type="radio"]:checked');
    if (selectedProject) {
        console.log('Selected project for clearing cache:', selectedProject.value);

        // Trigger the cache clearing process, passing the selected project name
        clearCache(selectedProject.value); // Pass the project value to the function
    } else {
        console.log('No project selected for clearing cache.');
    }
});

// Event listener for "Fix Symlinks" submit button (no radio buttons needed)
document.getElementById('symlinks-submit').addEventListener('click', () => {
    fixSymlinks();
});

// Function to handle migration request
function migrateDatabase(projectName) {
    showProgressModal(); // Show progress modal

    axios.post(window.APP_URL + '/api/migrate-fresh', {
        systemName: projectName
    })
        .then(response => {
            console.log('Migration started for project:', projectName);
            console.log('API response:', response.data);
        })
        .catch(error => {
            console.error('Error triggering migration:', error);
        })
        .finally(() => {
            hideProgressModal();
        });
}

// Function to clear cache and send the project name in the request body
function clearCache(projectName) {
    showProgressModal(); // Show progress modal

    axios.post(window.APP_URL + '/api/clear-cache', {
        systemName: projectName
    })
        .then(response => {
            console.log('Cache cleared for project:', projectName);
            console.log('API response:', response.data);
        })
        .catch(error => {
            console.error('Error clearing cache:', error);
        })
        .finally(() => {
            hideProgressModal();
        });
}

function fixSymlinks() {
    showProgressModal(); // Show progress modal

    axios.post(window.APP_URL + '/api/fix-symlinks')
        .then(response => {
            console.log('Symlinks fixed:', response.data);
        })
        .catch(error => {
            console.error('Error fixing symlinks:', error);
        })
        .finally(() => {
            hideProgressModal();
        });
}

// Function to fix permissions for a selected project
function fixPermissions(projectName) {
    showProgressModal(); // Show progress modal

    axios.post(window.APP_URL + '/api/fix-permissions', {
        systemName: projectName
    })
        .then(response => {
            console.log('Permissions fixed for project:', projectName);
            console.log('API response:', response.data);
        })
        .catch(error => {
            console.error('Error fixing permissions:', error);
        })
        .finally(() => {
            hideProgressModal();
        });
}

// Load the projects when the page loads
window.onload = loadConfigurationProjects;
