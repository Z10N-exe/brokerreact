import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/deposit" 
            element={user ? <Deposit user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/withdraw" 
            element={user ? <Withdraw user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/transactions" 
            element={user ? <Transactions user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
