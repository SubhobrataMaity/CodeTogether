const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const roomCode = {}; // Store latest code for each room
const activeRooms = new Set(); // Track active rooms

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('code-change', ({ room, code }) => {
    roomCode[room] = code;
    activeRooms.add(room);
    socket.to(room).emit('code-update', code);
  });

  socket.on('join-room', (room) => {
    socket.join(room);
    activeRooms.add(room);
    console.log(`User ${socket.id} joined room ${room}`);
    if (roomCode[room]) {
      socket.emit('code-update', roomCode[room]);
    }
  });

  socket.on('check-room', (room, callback) => {
    // If room exists in activeRooms or has code, consider it valid
    const exists = activeRooms.has(room) || roomCode[room];
    callback(!!exists);
  });

  socket.on('create-room', (room, callback) => {
    activeRooms.add(room);
    if (!roomCode[room]) {
      roomCode[room] = '// Start coding!';
    }
    callback(true);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API endpoint to create a room
app.post('/api/rooms', (req, res) => {
  const { roomCode: code } = req.body;
  if (!code || code.length !== 6) {
    return res.status(400).json({ error: 'Invalid room code' });
  }
  
  activeRooms.add(code);
  if (!roomCode[code]) {
    roomCode[code] = '// Start coding!';
  }
  
  res.json({ success: true, roomCode: code });
});

// API endpoint to check if a room exists
app.get('/api/rooms/:roomCode', (req, res) => {
  const { roomCode: code } = req.params;
  const exists = activeRooms.has(code) || roomCode[code];
  res.json({ exists: !!exists });
});

app.get('/', (req, res) => {
  res.send('CodeShareClone server is running!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 