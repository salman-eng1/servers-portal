
console.log('APP_URL:', window.APP_URL); // Verify this prints the expected URL
document.getElementById('check-services').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    checkServices();
});
document.getElementById('show-running-ports').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    showRunningPorts();
});
// document.getElementById('setup-server-link').addEventListener('click', function(event) {
//     event.preventDefault(); // Prevent any default behavior that might reload the page
//     setupNewServer();
// });

function checkServices() {
    // showProgressBar()
    axios.get(window.APP_URL+'/api/check-services')
        .then(response => {
            // hideProgressBar()
            // document.getElementById('messages').innerHTML = JSON.stringify('*******', null, 2);
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error checking services: ' + error;
        });
}

function showRunningPorts() {
    // showProgressBar()
    axios.get(window.APP_URL+'/api/check-ports')
        .then(response => {
            document.getElementById('messages').innerHTML = JSON.stringify(response.data, null, 2);
            // hideProgressBar()
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error showing running ports: ' + error;
        });
}






