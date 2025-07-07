# CodeTogether Frontend

A modern React application for real-time collaborative coding built with Vite, Tailwind CSS, and Monaco Editor.

## Features

- 🚀 **Real-time Collaboration**: Live code editing with Socket.IO
- 🎨 **Modern UI**: Beautiful interface with dark/light theme support
- 📝 **Monaco Editor**: Professional code editor with syntax highlighting
- 🌐 **Multiple Languages**: Support for JavaScript, Python, Java, and more
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔗 **Easy Sharing**: Simple 6-digit room codes for session sharing

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

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

3. Update `.env` with your backend URL:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   └── theme-provider.jsx
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── package.json
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## API Integration

The frontend communicates with the backend through:

1. **HTTP API calls** (using Axios) for room management
2. **Socket.IO** for real-time code synchronization

### API Endpoints Used

- `GET /api/health` - Health check
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:roomCode` - Check if room exists

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 