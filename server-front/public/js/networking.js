document.getElementById('submit-button').addEventListener('click', function() {
    console.log('hi form networking hhhhhhhhhhhhhhhh')
    const newIP = document.getElementById('new-ip').value;
    const newMask = document.getElementById('new-mask').value;
    const dns = document.getElementById('dns').value.split(',').map(d => d.trim());
    const gateway = document.getElementById('gateway').value;
    showProgressModal(); 
    axios.post(window.APP_URL + '/api/change-netplan-ip', {
        ip: newIP,
        mask: newMask,
        dns: dns,
        gateway: gateway
    })
    .then(response => {
        alert('Network configuration updated successfully!');
        console.log(response.data);
    })
    .catch(error => {
        alert('Failed to update network configuration.');
        console.error(error);
    })

    .finally(() => {
        hideProgressModal(); 
    });
});


