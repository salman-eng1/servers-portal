document.addEventListener('DOMContentLoaded', () => {
    const socket = io(window.APP_URL, {
        reconnection: false,  // Disable automatic reconnection
        reconnectionAttempts: 5,  // Number of reconnection attempts
        reconnectionDelay: 1000,  // Delay between attempts (in ms)
    });
    const messagesDiv = document.getElementById('messages');
    let reconnectAttempt = 0; // Track number of reconnection attempts

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        // Optionally, handle any UI changes here like showing a disconnection message
    });

    socket.on('terminal', (message) => {
        console.log('Received message from server:', message);
        const formattedMessage = document.createElement('div');
        formattedMessage.textContent = message;
        messagesDiv.appendChild(formattedMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Custom reconnect logic
    socket.on('reconnect_attempt', () => {
        reconnectAttempt++;
        if (reconnectAttempt > 5) {
            console.error('Maximum reconnection attempts reached');
            // Optionally show a message to the user
        } else {
            console.log(`Reconnecting... Attempt ${reconnectAttempt}`);
        }
    });

    socket.on('reconnect', () => {
        console.log('Reconnected to WebSocket server');
        reconnectAttempt = 0; // Reset reconnect attempt counter
    });

    socket.on('reconnect_error', (error) => {
        console.error('Reconnection failed: ', error);
    });
});
