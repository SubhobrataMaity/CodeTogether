# CodeTogether Backend

A Node.js/Express server providing real-time collaborative coding functionality with Socket.IO.

## Features

- 🚀 **Real-time Communication**: Socket.IO for live code synchronization
- 🔌 **RESTful API**: HTTP endpoints for room management
- 🔒 **CORS Support**: Proper cross-origin resource sharing
- 📊 **Health Monitoring**: API health check endpoint
- 🛡️ **Environment Configuration**: Flexible deployment settings

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Getting Started

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
HOST=localhost
FRONTEND_URL=http://localhost:3000
```

### Development

Start the development server with auto-reload:
```bash
npm run dev
```

The server will be available at `http://localhost:5000`

### Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Room Management
```
POST /api/rooms
```
Create a new room with the provided room code.

**Request Body:**
```json
{
  "roomCode": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "roomCode": "ABC123"
}
```

```
GET /api/rooms/:roomCode
```
Check if a room exists.

**Response:**
```json
{
  "exists": true
}
```

### Root Endpoint
```
GET /
```
Returns API information and available endpoints.

## Socket.IO Events

### Client to Server
- `join-room` - Join a specific room
- `leave-room` - Leave a room
- `code-change` - Broadcast code changes to room
- `check-room` - Check if room exists
- `create-room` - Create a new room

### Server to Client
- `code-update` - Receive code updates from other users
- `user-joined` - Notification when user joins
- `user-left` - Notification when user leaves


## Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── env.example        # Environment variables template
└── README.md         # This file
```

## Development

### Adding New Features

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Style

- Use ES6+ features
- Follow Express.js best practices
- Add proper error handling
- Include JSDoc comments for functions

## Monitoring and Logging

The server includes basic logging for:
- Server startup
- Socket connections/disconnections
- Room operations
- API requests

For production, consider adding:
- Structured logging (Winston)
- Error tracking (Sentry)
- Performance monitoring
- Health checks

## Security Considerations

- CORS is configured for specific origins
- Input validation on API endpoints
- Rate limiting (consider adding)
- Authentication (for future features)

## Future Enhancements

- Database integration for persistent storage
- User authentication and authorization
- Room access controls
- Code versioning
- File upload support
- Multiple file support per room

## License

MIT License - see LICENSE file for details 