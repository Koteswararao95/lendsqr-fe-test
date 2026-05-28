import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import apiService from '../services/api';
import storageService from '../services/storage';
import { User } from '../types/index';
import '../styles/pages/UserDetails.scss';

/**
 * User Details Page Component
 */
const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError('');

        // Try to get from storage first
        let userDetail = await storageService.getUser(userId);

        // If not in storage, fetch from API
        if (!userDetail) {
          userDetail = await apiService.fetchUserById(userId);
          if (userDetail) {
            await storageService.saveUser(userDetail);
          }
        }

        if (userDetail) {
          setUser(userDetail);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to load user details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleStatusChange = async (newStatus: 'Active' | 'Inactive' | 'Blacklisted' | 'Pending') => {
    if (!user) return;

    try {
      const updated = await apiService.updateUser(user.id, { status: newStatus });
      if (updated) {
        setUser(updated);
        await storageService.saveUser(updated);
        setSuccessMessage(`User status updated to ${newStatus}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="user-details-page">
        <Header />
        <main className="user-details-content">
          <div className="user-details-container">
            <div className="loading">Loading user details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-details-page">
        <Header />
        <main className="user-details-content">
          <div className="user-details-container">
            <div className="error-container">
              <div className="alert alert-error">{error}</div>
              <button className="btn btn-primary" onClick={() => navigate('/users')}>
                Back to Users
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="user-details-page">
      <Header />

      <main className="user-details-content">
        <div className="user-details-container">
          <div className="details-header">
            <button className="btn btn-back" onClick={() => navigate('/users')}>
              ← Back to Users
            </button>
            <h1>User Details</h1>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="details-sections">
            {/* Personal Information */}
            <section className="details-section">
              <h2>Personal Information</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>User ID</label>
                  <p>{user.id}</p>
                </div>
                <div className="detail-item">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone Number</label>
                  <p>{user.phone}</p>
                </div>
              </div>
            </section>

            {/* Account Information */}
            <section className="details-section">
              <h2>Account Information</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Status</label>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    className="status-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
                <div className="detail-item">
                  <label>Date Joined</label>
                  <p>{user.dateJoined}</p>
                </div>
                <div className="detail-item">
                  <label>Organization</label>
                  <p>{user.organization}</p>
                </div>
                <div className="detail-item">
                  <label>Account Balance</label>
                  <p className="text-primary">{user.accountBalance}</p>
                </div>
              </div>
            </section>

            {/* Financial Information */}
            <section className="details-section">
              <h2>Financial Information</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Loan Portfolio</label>
                  <p className="text-primary">{user.loanPortfolio}</p>
                </div>
                <div className="detail-item">
                  <label>Savings Portfolio</label>
                  <p className="text-primary">{user.savingsPortfolio}</p>
                </div>
                {user.orgRiskRating && (
                  <div className="detail-item">
                    <label>Organization Risk Rating</label>
                    <p>{user.orgRiskRating}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Additional Details */}
            {user.jobRole && (
              <section className="details-section">
                <h2>Employment Details</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Job Role</label>
                    <p>{user.jobRole}</p>
                  </div>
                  {user.levelOfAccess && (
                    <div className="detail-item">
                      <label>Level of Access</label>
                      <p>{user.levelOfAccess}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Guarantor Information */}
            {user.guarantor && (
              <section className="details-section">
                <h2>Guarantor Information</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{user.guarantor.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{user.guarantor.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{user.guarantor.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Relationship</label>
                    <p>{user.guarantor.relationship}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetailsPage;
