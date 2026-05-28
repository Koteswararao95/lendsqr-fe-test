import React from 'react';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage';
import '../styles/components/Header.scss';

/**
 * Header Component
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const auth = storageService.getAuthState();

  const handleLogout = () => {
    storageService.clearAuthState();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <h1 className="logo">Lendsqr</h1>
        </div>

        <nav className="header-nav">
          <button
            className="nav-link"
            onClick={() => navigate('/dashboard')}
            aria-label="Go to dashboard"
          >
            Dashboard
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/users')}
            aria-label="Go to users"
          >
            Users
          </button>
        </nav>

        <div className="header-user">
          <span className="user-email">{auth?.email}</span>
          <button
            className="btn btn-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
