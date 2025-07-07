# CodeTogether

A real-time collaborative coding platform that allows developers to code together in real-time. Built with React, Node.js, and Socket.IO.

## 🚀 Features

- **Real-time Collaboration**: Live code editing with instant synchronization
- **Modern UI**: Beautiful, responsive interface with dark/light theme support
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Multiple Languages**: Support for JavaScript, Python, Java, C#, C++, TypeScript, Go, PHP, and Ruby
- **Easy Sharing**: Simple 6-digit room codes for instant session sharing
- **Download Code**: Export your collaborative work with proper file extensions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This project follows a modern full-stack architecture with separate frontend and backend:

```
CodeTogether/
├── frontend/          # React application (Vite)
├── backend/           # Node.js/Express server
├── package.json       # Root workspace configuration
└── README.md         # This file
```

### Frontend (React + Vite)
- **Port**: 3000
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Port**: 5000
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **CORS**: Configured for cross-origin requests
- **Environment**: dotenv for configuration

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Monaco Editor
- Socket.IO Client
- Axios
- React Router DOM
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS
- dotenv

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm 8+

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd CodeTogether
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**

For Frontend:
```bash
cd frontend
cp env.example .env
```

For Backend:
```bash
cd backend
cp env.example .env
```

4. **Start development servers**
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) simultaneously.

## 🚀 Development

### Running Individual Services

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

### Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
npm run start
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### Backend (.env)
```env
PORT=5000
HOST=localhost
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### HTTP Endpoints

- `GET /api/health` - Health check
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:roomCode` - Check if room exists

### Socket.IO Events

#### Client to Server
- `join-room` - Join a specific room
- `code-change` - Broadcast code changes
- `check-room` - Check if room exists
- `create-room` - Create a new room

#### Server to Client
- `code-update` - Receive code updates from other users

## 🎯 Usage

1. **Create a Session**: Click "Create New Session" to start a new collaborative coding session
2. **Join a Session**: Enter a 6-digit session code to join an existing session
3. **Code Together**: Start coding! Changes are synchronized in real-time
4. **Share**: Use the "Save & Share" button to copy the session link
5. **Download**: Export your code with the "Download Code" button

## 🔧 Configuration

### Customizing the Editor

The Monaco Editor can be customized in `frontend/src/App.jsx`:

```javascript
<Editor
  height="100%"
  theme={theme === 'dark' ? 'vs-dark' : 'light'}
  language={language}
  value={unsavedCode}
  onChange={handleCodeChange}
  options={{
    fontSize: fontSize,
    minimap: { enabled: false },
    // Add more options here
  }}
/>
```

### Adding New Languages

To add support for new programming languages:

1. Add the language option in the select dropdown
2. Update the `fileExtensions` object in the `downloadCode` function
3. Monaco Editor will automatically provide syntax highlighting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor
- [Socket.IO](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/codetogether/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

**Happy coding together! 🚀**

