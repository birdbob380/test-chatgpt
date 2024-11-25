const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create the app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Notify when a user joins
    socket.on('new-user', (username) => {
        socket.username = username;
        io.emit('user-connected', username);
    });

    // Broadcast messages
    socket.on('chat-message', (message) => {
        io.emit('chat-message', { username: socket.username, message });
    });

    // Notify when a user disconnects
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('user-disconnected', socket.username);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use Render's dynamic PORT
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
