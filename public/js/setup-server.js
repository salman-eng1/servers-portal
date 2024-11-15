document.addEventListener('DOMContentLoaded', () => {
    axios.get('/api/get-systems')
        .then(response => {
            const projects = response.data.message; // Access the "projects" array from the response
            if (Array.isArray(projects)) {
                const buttonContainer = document.getElementById('project-buttons');
                
                projects.forEach(project => {
                    const button = document.createElement('button');
                    button.textContent = project;
                    button.onclick = () => {
                        alert(`You clicked ${project}`);
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
