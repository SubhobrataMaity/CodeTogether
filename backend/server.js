require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// In-memory storage (replace with database in production)
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
    // Normalize room code to uppercase for consistency
    const normalizedRoom = room.toUpperCase();
    socket.join(normalizedRoom);
    activeRooms.add(normalizedRoom);
    console.log(`User ${socket.id} joined room ${normalizedRoom}`);
    if (roomCode[normalizedRoom]) {
      socket.emit('code-update', roomCode[normalizedRoom]);
    }
  });

  socket.on('check-room', (room, callback) => {
    // Normalize room code to uppercase for consistency
    const normalizedRoom = room.toUpperCase();
    // If room exists in activeRooms or has code, consider it valid
    const exists = activeRooms.has(normalizedRoom) || roomCode[normalizedRoom];
    callback(!!exists);
  });

  socket.on('create-room', (room, callback) => {
    // Normalize room code to uppercase for consistency
    const normalizedRoom = room.toUpperCase();
    activeRooms.add(normalizedRoom);
    if (!roomCode[normalizedRoom]) {
      roomCode[normalizedRoom] = '// Start coding!';
    }
    callback(true);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CodeTogether backend is running!',
    timestamp: new Date().toISOString()
  });
});

// API endpoint to create a room
app.post('/api/rooms', (req, res) => {
  const { roomCode: code } = req.body;
  if (!code || code.length !== 6) {
    return res.status(400).json({ error: 'Invalid room code' });
  }
  
  // Normalize room code to uppercase for consistency
  const normalizedCode = code.toUpperCase();
  
  activeRooms.add(normalizedCode);
  if (!roomCode[normalizedCode]) {
    roomCode[normalizedCode] = '// Start coding!';
  }
  
  res.json({ success: true, roomCode: normalizedCode });
});

// API endpoint to check if a room exists
app.get('/api/rooms/:roomCode', (req, res) => {
  const { roomCode: code } = req.params;
  // Normalize room code to uppercase for consistency
  const normalizedCode = code.toUpperCase();
  const exists = activeRooms.has(normalizedCode) || roomCode[normalizedCode];
  res.json({ exists: !!exists });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CodeTogether API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      createRoom: '/api/rooms',
      checkRoom: '/api/rooms/:roomCode'
    }
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`🚀 CodeTogether backend server running on http://${HOST}:${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}); 