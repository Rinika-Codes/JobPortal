import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import NotificationContainer from './components/shared/Notification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <NotificationContainer />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/post-job" 
            element={<ProtectedRoute roles={['employer']}><PostJob /></ProtectedRoute>} 
          />
          <Route 
            path="/applications" 
            element={<ProtectedRoute roles={['seeker']}><Applications /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute roles={['seeker']}><Profile /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} 
          />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="container page">
              <div className="empty-state">
                <div className="empty-icon">🔎</div>
                <h3>Page Not Found</h3>
                <p>The page you're looking for doesn't exist.</p>
                <button onClick={() => window.location.href = '/'} className="btn btn-primary" style={{ marginTop: 16 }}>
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;