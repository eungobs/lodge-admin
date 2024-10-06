import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Ensure this path to firebaseConfig is correct
import '../styles/Login.css'; // Optional CSS for styling the login form

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous error

    // Hardcoded admin credentials
    const adminEmail = 'lodge@gmail.com';
    const adminPassword = '111111';

    if (email === adminEmail && password === adminPassword) {
      try {
        // Attempt to sign in with Firebase Authentication
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful, navigating to accommodations');
        navigate('/accommodations'); // Navigate to AccommodationList page on successful login
      } catch (error) {
        console.error('Login error:', error.code, error.message);
        setError('Failed to log in. Please check your credentials.');
      }
    } else {
      setError('Invalid credentials! Only the admin can log in.');
    }

    setLoading(false); // Stop the loading spinner
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
