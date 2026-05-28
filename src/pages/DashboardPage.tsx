import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import apiService from '../services/api';
import { DashboardStats } from '../types/index';
import '../styles/pages/Dashboard.scss';

/**
 * Dashboard Page Component
 */
const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back to Lendsqr Admin</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {isLoading ? (
            <div className="loading">
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <div className="stats-grid">
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon="👥"
              />
              <StatCard
                title="Active Users"
                value={stats?.activeUsers || 0}
                icon="✓"
              />
              <StatCard
                title="Users with Loans"
                value={stats?.usersWithLoans || 0}
                icon="💰"
              />
              <StatCard
                title="Total Transactions"
                value={stats?.totalTransactions || 0}
                icon="💳"
              />
              <StatCard
                title="Users Visited Today"
                value={stats?.usersVisitedToday || 0}
                icon="📊"
              />
              <StatCard
                title="Active Loans"
                value={stats?.activeLoans || 0}
                icon="📋"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
