
document.getElementById('check-services').addEventListener('click', checkServices);
document.getElementById('show-running-ports').addEventListener('click', showRunningPorts);
document.getElementById('setup-new-server').addEventListener('click', setupNewServer);

function checkServices() {
    axios.get('/api/check-services')
        .then(response => {
            // document.getElementById('messages').innerHTML = JSON.stringify('*******', null, 2);
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error checking services: ' + error;
        });
}

function showRunningPorts() {
    axios.get('/api/check-ports')
        .then(response => {
            document.getElementById('messages').innerHTML = JSON.stringify(response.data, null, 2);
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error showing running ports: ' + error;
        });
}

function setupNewServer() {
    window.open('./setup-server.html', '_blank'); 
}