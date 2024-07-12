document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
    });

    socket.on('checkServices', (message) => {
        console.log('Received message from server:', message);
        const formattedMessage = message.replace(/\n/g, '<br>'); // Replace newlines with <br> tags for HTML rendering
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<p>${formattedMessage}</p>`;
    });

    socket.on('checkServicesError', (message) => {
        console.log('Received message from server:', message);
        const formattedMessage = message.replace(/\n/g, '<br>'); // Replace newlines with <br> tags for HTML rendering
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<p>${formattedMessage}</p>`;
    });
    socket.on('checkPorts', (message) => {
        console.log('Received message from server:', message);
        const formattedMessage = message.replace(/\n/g, '<br>'); // Replace newlines with <br> tags for HTML rendering
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<p>${formattedMessage}</p>`;
    });

});
