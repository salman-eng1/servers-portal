
console.log('APP_URL:', window.APP_URL); // Verify this prints the expected URL
document.getElementById('check-services').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    checkServices();
});
document.getElementById('show-running-ports').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    showRunningPorts();
});
document.getElementById('setup-new-server').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    setupNewServer();
});

function checkServices() {
    showProgressBar()
    axios.get(window.APP_URL+'/api/check-services')
        .then(response => {
            hideProgressBar()
            // document.getElementById('messages').innerHTML = JSON.stringify('*******', null, 2);
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error checking services: ' + error;
        });
}

function showRunningPorts() {
    showProgressBar()
    axios.get(window.APP_URL+'/api/check-ports')
        .then(response => {
            document.getElementById('messages').innerHTML = JSON.stringify(response.data, null, 2);
            hideProgressBar()
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error showing running ports: ' + error;
        });
}

function setupNewServer() {
    window.open('./setup-server.html', '_blank'); 
}





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
            width += 5; // Adjust the step for the speed of progress
            document.getElementById('progress-bar').style.width = width + '%';
        }
    }, 100); // Adjust interval time to control the speed of the progress
}

// Function to hide the progress bar
function hideProgressBar() {
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.style.display = 'none';
}