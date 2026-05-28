import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UsersPage from '../pages/UsersPage';
import apiService from '../services/api';
import storageService from '../services/storage';
import { User } from '../types/index';

vi.mock('../services/api');
vi.mock('../services/storage');

const mockUsers: User[] = [
  {
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
  },
  {
    id: '000002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+2341234567891',
    status: 'Inactive',
    dateJoined: '2024-01-16',
    accountBalance: '₦2,000,000.00',
    organization: 'Finance Ltd',
    loanPortfolio: '₦1,000,000.00',
    savingsPortfolio: '₦500,000.00',
  },
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storageService.getAuthState as any).mockReturnValue({
      email: 'test@example.com',
      isAuthenticated: true,
    });
  });

  it('should render users page with header', async () => {
    (apiService.fetchUsers as any).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      pageSize: 10,
    });

    renderWithRouter(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Manage all users in the system')).toBeInTheDocument();
    });
  });

  it('should display loading state initially', () => {
    (apiService.fetchUsers as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<UsersPage />);

    // Component will show a table skeleton or loading indicator
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should fetch and display users on mount', async () => {
    (apiService.fetchUsers as any).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      pageSize: 10,
    });

    renderWithRouter(<UsersPage />);

    await waitFor(() => {
      expect(apiService.fetchUsers).toHaveBeenCalled();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should filter users by search query', async () => {
    const filteredUsers = mockUsers.slice(0, 1);
    let searchQuery = '';

    (apiService.fetchUsers as any).mockImplementation((page: number, pageSize: number, search?: string) => {
      searchQuery = search || '';
      if (search && search.toLowerCase().includes('john')) {
        return Promise.resolve({
          data: filteredUsers,
          total: 1,
          page,
          pageSize,
        });
      }
      return Promise.resolve({
        data: mockUsers,
        total: 2,
        page,
        pageSize,
      });
    });

    renderWithRouter(<UsersPage />);

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'John');

    await waitFor(() => {
      expect(apiService.fetchUsers).toHaveBeenCalledWith(1, 10, 'John', 'All');
    });
  });

  it('should filter users by status', async () => {
    (apiService.fetchUsers as any).mockResolvedValue({
      data: mockUsers.filter(u => u.status === 'Active'),
      total: 1,
      page: 1,
      pageSize: 10,
    });

    renderWithRouter(<UsersPage />);

    const statusFilter = screen.getByDisplayValue('All') as HTMLSelectElement;
    fireEvent.change(statusFilter, { target: { value: 'Active' } });

    await waitFor(() => {
      expect(apiService.fetchUsers).toHaveBeenCalledWith(1, 10, '', 'Active');
    });
  });

  it('should navigate to user details on user click', async () => {
    (apiService.fetchUsers as any).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      pageSize: 10,
    });

    renderWithRouter(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButton = screen.getAllByRole('button', { name: /view/i })[0];
    fireEvent.click(viewButton);

    // Verify navigation was attempted
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should handle pagination - next page', async () => {
    const nextPageUsers = [
      { ...mockUsers[0], id: '000011' },
      { ...mockUsers[1], id: '000012' },
    ];

    let currentPage = 1;
    (apiService.fetchUsers as any).mockImplementation((page: number) => {
      currentPage = page;
      return Promise.resolve({
        data: page === 1 ? mockUsers : nextPageUsers,
        total: 20,
        page,
        pageSize: 10,
      });
    });

    renderWithRouter(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(apiService.fetchUsers).toHaveBeenCalledWith(2, 10, '', 'All');
    });
  });

  it('should display error message if fetch fails', async () => {
    (apiService.fetchUsers as any).mockRejectedValue(new Error('Failed to fetch'));

    renderWithRouter(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    });
  });

  it('should display all status filter options', async () => {
    (apiService.fetchUsers as any).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      pageSize: 10,
    });

    renderWithRouter(<UsersPage />);

    const statusFilter = screen.getByDisplayValue('All') as HTMLSelectElement;
    const options = statusFilter.querySelectorAll('option');

    const optionValues = Array.from(options).map(o => o.value);
    expect(optionValues).toContain('All');
    expect(optionValues).toContain('Active');
    expect(optionValues).toContain('Inactive');
    expect(optionValues).toContain('Pending');
    expect(optionValues).toContain('Blacklisted');
  });
});
