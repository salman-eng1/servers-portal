document.addEventListener('DOMContentLoaded', () => {
    // Check if the socket instance already exists
    if (window.socketInstance) {
        console.log('Socket connection already exists.');
        return;
    }

    const socket = io(window.APP_URL, {
        reconnection: false,
    });

    window.socketInstance = socket;
    const messagesDiv = document.getElementById('messages');
    let reconnectAttempt = 0;

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        alert('Connection lost. Please try refreshing the page if needed.');
    });

    socket.on('terminal', (message) => {
        console.log('Received terminal message:', message);
        const formattedMessage = document.createElement('div');
        formattedMessage.textContent = message;
        messagesDiv.appendChild(formattedMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    socket.on('reconnect_attempt', () => {
        reconnectAttempt++;
        console.log(`Reconnecting... Attempt ${reconnectAttempt}`);
    });

    socket.on('reconnect_error', (error) => {
        console.error('Reconnection failed:', error);
    });

    socket.on('reconnect', () => {
        console.log('Reconnected to WebSocket server');
        reconnectAttempt = 0;
    });
})