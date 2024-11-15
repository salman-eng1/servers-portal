document.addEventListener('DOMContentLoaded', () => {
    showProgressBar()
    axios.get(window.APP_URL + '/api/get-systems')
        .then(response => {
            const projects = response.data.message; // Access the "projects" array from the response
            if (Array.isArray(projects)) {
                const buttonContainer = document.getElementById('project-buttons');
                
                projects.forEach(project => {
                    const button = document.createElement('button');
                    button.textContent = project;
                    hideProgressBar()
                    button.onclick = () => {
                        // Redirect to the project page, passing the project name as a query parameter
                        window.location.href = `./project.html?project=${encodeURIComponent(project)}`;
                    };
                    buttonContainer.appendChild(button);
                });
            } else {
                console.error('Expected an array of projects, but received:', projects);
            }
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        });
});
