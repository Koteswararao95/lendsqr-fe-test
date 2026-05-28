import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import apiService from '../services/api';
import storageService from '../services/storage';

vi.mock('../services/api');
vi.mock('../services/storage');

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storageService.getAuthState as any).mockReturnValue({
      email: 'test@example.com',
      isAuthenticated: true,
    });
  });

  it('should render dashboard header', () => {
    (apiService.getDashboardStats as any).mockResolvedValue({
      totalUsers: 500,
      activeUsers: 400,
      usersWithLoans: 250,
      totalTransactions: 1200,
      usersVisitedToday: 120,
      activeLoans: 200,
    });

    renderWithRouter(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome back to Lendsqr Admin')).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    (apiService.getDashboardStats as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<DashboardPage />);

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('should render all stat cards with correct data', async () => {
    const mockStats = {
      totalUsers: 500,
      activeUsers: 400,
      usersWithLoans: 250,
      totalTransactions: 1200,
      usersVisitedToday: 120,
      activeLoans: 200,
    };

    (apiService.getDashboardStats as any).mockResolvedValue(mockStats);

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('Users with Loans')).toBeInTheDocument();
      expect(screen.getByText('Total Transactions')).toBeInTheDocument();
      expect(screen.getByText('Users Visited Today')).toBeInTheDocument();
      expect(screen.getByText('Active Loans')).toBeInTheDocument();
    });
  });

  it('should display error message if stats fetch fails', async () => {
    (apiService.getDashboardStats as any).mockRejectedValue(
      new Error('Failed to fetch')
    );

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard statistics')).toBeInTheDocument();
    });
  });

  it('should format large numbers correctly', async () => {
    const mockStats = {
      totalUsers: 500000,
      activeUsers: 400000,
      usersWithLoans: 250000,
      totalTransactions: 1200000,
      usersVisitedToday: 120000,
      activeLoans: 200000,
    };

    (apiService.getDashboardStats as any).mockResolvedValue(mockStats);

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('500,000')).toBeInTheDocument();
      expect(screen.getByText('400,000')).toBeInTheDocument();
    });
  });

  it('should call getDashboardStats on component mount', async () => {
    (apiService.getDashboardStats as any).mockResolvedValue({
      totalUsers: 0,
      activeUsers: 0,
      usersWithLoans: 0,
      totalTransactions: 0,
      usersVisitedToday: 0,
      activeLoans: 0,
    });

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(apiService.getDashboardStats).toHaveBeenCalledTimes(1);
    });
  });
});
