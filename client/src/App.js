import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { useTheme } from './components/theme-provider';
import {
  Code2,
  Plus,
  Users,
  Zap,
  Share2,
  Download,
  Moon,
  Sun,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Settings,
} from 'lucide-react';

/**
 * Generate a random 6-character alphanumeric room code
 */
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Link copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

/**
 * Download code as a file
 */
function downloadCode(code, language, roomCode) {
  const fileExtensions = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    csharp: 'cs',
    cpp: 'cpp',
    typescript: 'ts',
    go: 'go',
    php: 'php',
    ruby: 'rb'
  };
  
  const extension = fileExtensions[language] || 'txt';
  const filename = `codeshare-${roomCode}.${extension}`;
  
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Landing page component for joining or creating rooms
 */
function LandingPage() {
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme, mounted } = useTheme();

  // Initialize Socket.io connection on mount
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Handle creating a new room
  const handleCreateRoom = () => {
    const newRoom = generateRoomCode();
    socketRef.current.emit('create-room', newRoom, (created) => {
      if (created) {
        navigate(`/room/${newRoom}`);
      } else {
        // If creation fails, try again
        handleCreateRoom();
      }
    });
  };

  // Handle joining an existing room
  const handleJoinRoom = () => {
    if (!joinCode.trim()) return;

    setLoading(true);
    setJoinError('');
    socketRef.current.emit('check-room', joinCode, (exists) => {
      setLoading(false);
      if (exists) {
        navigate(`/room/${joinCode}`);
      } else {
        setJoinError('No Session found with that code.');
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && joinCode.trim()) {
      handleJoinRoom();
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 lg:p-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">CodeTogether</span>
          </div>

          <Button variant="outline" size="sm" onClick={toggleTheme} className="rounded-full bg-transparent">
            {theme === "dark" ? (
              <Sun className="w-4 h-4" style={{ color: '#FFD600', border: '2px solid #FFD600', borderRadius: '9999px', boxSizing: 'content-box' }} />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl mx-auto">
            {/* Hero section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Real-time collaborative coding</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                Code
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Together
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Create, share, and collaborate on code in real-time. Perfect for pair programming, code reviews, and
                teaching.
              </p>
            </div>

            {/* Action cards */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Create room card */}
              <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                <CardHeader className="relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Plus className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <CardTitle className="text-xl dark:text-blue-300">Start New Session</CardTitle>
                  </div>
                  <CardDescription className="text-base dark:text-slate-400">
                    Create a new collaborative coding Session and invite others to join
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button
                    onClick={handleCreateRoom}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Session
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Join room card */}
              <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                <CardHeader className="relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600 dark:text-blue-300" />
                    </div>
                    <CardTitle className="text-xl dark:text-blue-300">Join Session</CardTitle>
                  </div>
                  <CardDescription className="text-base dark:text-slate-400">
                    Enter a Session code to join an existing collaborative session
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit Session code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 text-center font-mono text-lg tracking-widest"
                      maxLength={6}
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />

                    {joinError && (
                      <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="dark:text-red-300">{joinError}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Button
                    onClick={handleJoinRoom}
                    disabled={!joinCode.trim() || loading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        Join Session
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-time Sync</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  See changes instantly as you and your team code together
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Easy Sharing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Share Session links with one click and collaborate instantly
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Export Code</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Download your code with proper file extensions
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Built for developers who love to collaborate</p>
        </footer>
      </div>
    </div>
  );
}

/**
 * Room editor component for collaborative coding
 */
function RoomEditor() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Programming language for syntax highlighting
  const [language, setLanguage] = useState('javascript');
  // Shared code (last saved and broadcasted)
  const [code, setCode] = useState('// Start coding!');
  // Local unsaved code (editor value)
  const [unsavedCode, setUnsavedCode] = useState('// Start coding!');
  // Whether the user has joined a room
  const [joined, setJoined] = useState(false);
  // Socket.io reference (persists across renders)
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [joinError, setJoinError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [permission, setPermission] = useState('edit'); // 'edit' or 'view'
  const [isCreator, setIsCreator] = useState(false);

  // Initialize Socket.io connection on mount
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Track session creator in localStorage
  useEffect(() => {
    if (!roomCode) return;
    const creatorKey = `codeshare_session_creator_${roomCode}`;
    if (!localStorage.getItem(creatorKey)) {
      // If not set, set as creator
      localStorage.setItem(creatorKey, 'true');
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }
  }, [roomCode]);

  // Check if room exists and join it
  useEffect(() => {
    if (!roomCode) return;
    
    setLoading(true);
    setJoinError('');
    socketRef.current.emit('check-room', roomCode, (exists) => {
      if (exists) {
        setLoading(false);
        setJoined(true);
      } else {
        // Try to create the room if it doesn't exist
        socketRef.current.emit('create-room', roomCode, (created) => {
          setLoading(false);
          if (created) {
            setJoined(true);
          } else {
            setJoinError('Failed to create room.');
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        });
      }
    });
  }, [roomCode, navigate]);

  // Join the specified room and set up code update listener
  useEffect(() => {
    if (!joined || !roomCode) return;
    const socket = socketRef.current;
    socket.emit('join-room', roomCode);
    socket.on('code-update', (newCode) => {
      setCode(newCode);
      setUnsavedCode(newCode); // Update editor with new code from others
    });
    return () => {
      socket.off('code-update');
    };
  }, [joined, roomCode]);

  // Handle code changes in the editor (local only)
  const handleCodeChange = (value) => {
    setUnsavedCode(value);
    setSaveSuccess(false);
  };

  // Save & Share button handler
  const handleSaveAndShare = () => {
    setSaving(true);
    setCode(unsavedCode);
    if (joined && permission === 'edit') {
      socketRef.current.emit('code-change', { room: roomCode, code: unsavedCode });
    }
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      // Share link
      const roomLink = `${window.location.origin}/room/${roomCode}`;
      copyToClipboard(roomLink);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }, 500);
  };

  // Handle downloading code
  const handleDownloadCode = () => {
    downloadCode(code, language, roomCode);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-600 dark:text-slate-400">Joining room...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (joinError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{joinError}</p>
          <p className="text-slate-600 dark:text-slate-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  // Main editor UI after joining a room
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border-b border-white/20 dark:border-slate-700/30">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg mr-3">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <span 
            className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
            onClick={() => navigate('/')}
          >
            CodeTogether
          </span>
          <span className="ml-6 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono text-lg">Session: {roomCode}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleSaveAndShare}
            disabled={saving || (unsavedCode === code && !saveSuccess) || (permission === 'view' && !isCreator)}
            className={`bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 px-6 py-2 rounded-lg font-semibold transition shadow-md flex items-center ${saving ? 'cursor-not-allowed' : ''}`}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save & Share'}
          </Button>
          {shareSuccess && <span className="text-green-500 font-medium">Link copied!</span>}
          {saveSuccess && <span className="text-green-500 font-medium">Saved!</span>}
          <Button
            onClick={handleDownloadCode}
            variant="outline"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Code
          </Button>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full bg-transparent border-0"
            title="Settings"
          >
            <Settings className="w-5 h-5" style={{ color: theme === 'dark' ? '#fff' : undefined }} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full bg-transparent"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" style={{ color: '#FFD600', border: '2px solid #FFD600', borderRadius: '9999px', boxSizing: 'content-box' }} />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Monaco Editor for collaborative coding */}
      <div className="flex flex-col flex-1 min-h-0" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            language={language}
            value={unsavedCode}
            onChange={permission === 'edit' || isCreator ? handleCodeChange : undefined}
            options={{
              fontSize: fontSize,
              minimap: { enabled: false },
              fontFamily: 'Fira Mono, monospace',
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              automaticLayout: true,
              readOnly: permission === 'view' && !isCreator,
            }}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              onClick={() => setSettingsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Session Settings</h2>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">Font Size</label>
              <input
                type="range"
                min="12"
                max="28"
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="text-center mt-2 text-slate-600 dark:text-slate-300">{fontSize}px</div>
            </div>
            {isCreator && (
              <div className="mb-6">
                <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">Permission</label>
                <select
                  value={permission}
                  onChange={e => setPermission(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="edit">Editable (Everyone can edit)</option>
                  <option value="view">View Only (Only you can edit)</option>
                </select>
              </div>
            )}
            <Button onClick={() => setSettingsOpen(false)} className="w-full mt-2">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main App component for CodeShareClone
 * - Handles theme toggle (dark/light)
 * - Allows joining a room for collaboration
 * - Integrates Monaco Editor with language selection
 * - Implements real-time code sharing using Socket.io
 * - Supports sharing room links via URL
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:roomCode" element={<RoomEditor />} />
      </Routes>
    </Router>
  );
}

export default App; 