import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage';
import '../styles/pages/Login.scss';

/**
 * Login Page Component
 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      storageService.saveAuthState(email);
      navigate('/dashboard');
      setIsLoading(false);
    }, 500);
  };

  const handleDemoLogin = () => {
    setEmail('demo@lendsqr.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1>Lendsqr</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <h2>Welcome</h2>
            <p className="login-subtitle">Enter your details below to login</p>

            {error && <div className="alert alert-error" role="alert">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="demo-login">
            <p className="text-light">Demo credentials:</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDemoLogin}
              aria-label="Use demo credentials"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
