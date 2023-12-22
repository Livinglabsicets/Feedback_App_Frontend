import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Import the CSS for this component

const LoginPage = ({ onLogin }) => {
  const [username, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post('https://feedback-app-v1-0.onrender.com/api/auth/login', { username, password });
      
      if (response.status === 200) {
        onLogin();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <input
        type="text"
        placeholder="User ID"
        value={username}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default LoginPage;
