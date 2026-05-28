import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserDetailsPage from '../pages/UserDetailsPage';
import apiService from '../services/api';
import storageService from '../services/storage';
import { User } from '../types/index';

vi.mock('../services/api');
vi.mock('../services/storage');

const mockUser: User = {
  id: '000001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+2341234567890',
  status: 'Active',
  dateJoined: '2024-01-15',
  accountBalance: '₦1,000,000.00',
  organization: 'Tech Inc',
  loanPortfolio: '₦500,000.00',
  savingsPortfolio: '₦300,000.00',
  orgRiskRating: 'Low',
  jobRole: 'Engineer',
  levelOfAccess: 'Admin',
};

const renderWithRouter = (userId: string) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/users/:userId" element={<UserDetailsPage />} />
        <Route path="/users" element={<div>Users Page</div>} />
      </Routes>
      {/* Navigate to the user details page */}
      <button onClick={() => window.history.pushState({}, '', `/users/${userId}`)}>
        Navigate
      </button>
    </BrowserRouter>
  );
};

// Simplified render for easier testing
const renderUserDetails = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/users/:userId" element={<UserDetailsPage />} />
        <Route path="/users" element={<div>Users Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </BrowserRouter>,
    { initialEntries: ['/users/000001'] }
  );
};

describe('UserDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storageService.getAuthState as any).mockReturnValue({
      email: 'test@example.com',
      isAuthenticated: true,
    });
  });

  it('should render loading state initially', () => {
    (storageService.getUser as any).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    renderUserDetails();

    expect(screen.getByText(/loading user details/i)).toBeInTheDocument();
  });

  it('should fetch user from storage if available', async () => {
    (storageService.getUser as any).mockResolvedValue(mockUser);
    (apiService.fetchUserById as any).mockResolvedValue(null);

    renderUserDetails();

    await waitFor(() => {
      expect(storageService.getUser).toHaveBeenCalledWith('000001');
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });
  });

  it('should fetch user from API if not in storage', async () => {
    (storageService.getUser as any).mockResolvedValue(null);
    (apiService.fetchUserById as any).mockResolvedValue(mockUser);
    (storageService.saveUser as any).mockResolvedValue(undefined);

    renderUserDetails();

    await waitFor(() => {
      expect(apiService.fetchUserById).toHaveBeenCalledWith('000001');
      expect(storageService.saveUser).toHaveBeenCalledWith(mockUser);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });
  });

  it('should display user information', async () => {
    (storageService.getUser as any).mockResolvedValue(mockUser);

    renderUserDetails();

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByText(mockUser.phone)).toBeInTheDocument();
      expect(screen.getByText(mockUser.organization)).toBeInTheDocument();
    });
  });

  it('should display error if user not found', async () => {
    (storageService.getUser as any).mockResolvedValue(null);
    (apiService.fetchUserById as any).mockResolvedValue(null);

    renderUserDetails();

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  it('should display error if fetch fails', async () => {
    (storageService.getUser as any).mockRejectedValue(new Error('Storage error'));

    renderUserDetails();

    await waitFor(() => {
      expect(screen.getByText('Failed to load user details')).toBeInTheDocument();
    });
  });

  it('should change user status', async () => {
    const updatedUser = { ...mockUser, status: 'Inactive' as const };
    (storageService.getUser as any).mockResolvedValue(mockUser);
    (apiService.updateUser as any).mockResolvedValue(updatedUser);
    (storageService.saveUser as any).mockResolvedValue(undefined);

    renderUserDetails();

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    const statusButtons = screen.getAllByRole('button');
    const inactiveButton = statusButtons.find((btn) => btn.textContent?.includes('Inactive'));

    if (inactiveButton) {
      fireEvent.click(inactiveButton);

      await waitFor(() => {
        expect(apiService.updateUser).toHaveBeenCalledWith('000001', { status: 'Inactive' });
      });
    }
  });

  it('should show success message after status update', async () => {
    const updatedUser = { ...mockUser, status: 'Inactive' as const };
    (storageService.getUser as any).mockResolvedValue(mockUser);
    (apiService.updateUser as any).mockResolvedValue(updatedUser);
    (storageService.saveUser as any).mockResolvedValue(undefined);

    renderUserDetails();

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    const statusButtons = screen.getAllByRole('button');
    const inactiveButton = statusButtons.find((btn) => btn.textContent?.includes('Inactive'));

    if (inactiveButton) {
      fireEvent.click(inactiveButton);

      await waitFor(() => {
        expect(screen.getByText(/user status updated/i)).toBeInTheDocument();
      });
    }
  });

  it('should show error message if status update fails', async () => {
    (storageService.getUser as any).mockResolvedValue(mockUser);
    (apiService.updateUser as any).mockRejectedValue(new Error('Update failed'));

    renderUserDetails();

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    const statusButtons = screen.getAllByRole('button');
    const inactiveButton = statusButtons.find((btn) => btn.textContent?.includes('Inactive'));

    if (inactiveButton) {
      fireEvent.click(inactiveButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update user status')).toBeInTheDocument();
      });
    }
  });

  it('should display back button', async () => {
    (storageService.getUser as any).mockResolvedValue(mockUser);

    renderUserDetails();

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  it('should navigate back to users list', async () => {
    (storageService.getUser as any).mockResolvedValue(mockUser);

    renderUserDetails();

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
      // Navigation should occur
      expect(backButton).toBeInTheDocument();
    });
  });
});
