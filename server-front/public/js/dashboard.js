document.addEventListener('DOMContentLoaded', () => {
    const troubleshootingLink = document.getElementById('troubleshooting-link');
    const setupNetworkInterfaceLink = document.getElementById('setup-network-interface-link');
    const setupServerLink = document.getElementById('setup-server-link');
    const configurationLink = document.getElementById('configuration-link');

    const troubleshootingSection = document.getElementById('troubleshooting-section');
    const setupNetworkInterfaceSection = document.getElementById('setup-network-interface-section');
    const setupNewServerSection = document.getElementById('setup-new-server-section');
    const configurationSection = document.getElementById('configuration-section');
    const projectButtonsContainer = document.getElementById('project-buttons');

    // Function to hide all content sections
    function hideAllSections() {
        console.log('Hiding all sections');
        troubleshootingSection.style.display = 'none';
        setupNetworkInterfaceSection.style.display = 'none';
        setupNewServerSection.style.display = 'none';
        configurationSection.style.display = 'none';
    }

    // Show troubleshooting section
    troubleshootingLink.addEventListener('click', () => {
        hideAllSections();
        troubleshootingSection.style.display = 'block';
    });

    // Show setup network interface section and load the networking.html page
    setupNetworkInterfaceLink.addEventListener('click', () => {
        hideAllSections();
        setupNetworkInterfaceSection.style.display = 'block';
        loadNetworkingPage(); // Load networking.html
    });

    // Show setup new server section and load projects
    setupServerLink.addEventListener('click', () => {
        hideAllSections();
        setupNewServerSection.style.display = 'block';
        loadProjects(); // Load projects for the setup new server section
    });

    // Show configuration section
    configurationLink.addEventListener('click', () => {
        hideAllSections();
        configurationSection.style.display = 'block';
    });

    // Function to load projects for the "Setup New Server" section
    function loadProjects() {
        axios.get(window.APP_URL + '/api/get-systems')
            .then(response => {
                console.log('API response:', response.data); // Log the API response
                const projects = response.data.message;

                if (Array.isArray(projects)) {
                    projectButtonsContainer.innerHTML = ''; // Clear existing buttons

                    projects.forEach(project => {
                        const button = document.createElement('button');
                        button.textContent = project;
                        button.addEventListener('click', () => {
                            console.log(`Button clicked: ${project}`); // Debug log to check if the click event is fired
                            loadProjectPage(project); // Load the corresponding project page
                        });
                        projectButtonsContainer.appendChild(button);
                    });
                } else {
                    console.error('Expected an array of projects, but received:', projects);
                }
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }

    // Function to load a project page into an iframe
    function loadProjectPage(project) {
        // Clear existing content
        setupNewServerSection.innerHTML = '';

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `project.html`; // Replace with your actual path format

        // Dynamically adjust iframe height based on .main-content height
        const mainContentHeight = document.querySelector('.main-content').offsetHeight;
        iframe.style.width = '100%';
        iframe.style.height = `${mainContentHeight}px`; // Match the height of .main-content
        iframe.style.border = 'none';

        // Append the iframe to the section
        setupNewServerSection.appendChild(iframe);

        console.log(`Iframe created for project: ${project}`); // Debug log to confirm iframe creation
    }

    // Function to load the networking.html page into an iframe
    function loadNetworkingPage() {
        // Clear existing content
        setupNetworkInterfaceSection.innerHTML = '';

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `networking.html`; // Path to your networking page

        // Dynamically adjust iframe height based on .main-content height
        const mainContentHeight = document.querySelector('.main-content').offsetHeight;
        iframe.style.width = '100%';
        iframe.style.height = `${mainContentHeight}px`; // Match the height of .main-content
        iframe.style.border = 'none';

        // Append the iframe to the section
        setupNetworkInterfaceSection.appendChild(iframe);

        console.log(`Iframe created for networking page`); // Debug log to confirm iframe creation
    }

    // Default section shown on page load
    if (troubleshootingSection) {
        troubleshootingSection.style.display = 'block'; // Show troubleshooting section by default
    } else {
        console.error('troubleshootingSection not found');
    }
});
