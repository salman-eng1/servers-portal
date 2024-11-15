document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io(window.APP_URL);
    const messagesDiv = document.getElementById('messages');

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
    });

    socket.on('terminal', (message) => {
        console.log('Received message from server:', message);
        const formattedMessage = document.createElement('div');
        formattedMessage.textContent = message; // Use textContent to prevent XSS and preserve formatting
        messagesDiv.appendChild(formattedMessage);

        // Auto-scroll to the bottom for new output
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
});
