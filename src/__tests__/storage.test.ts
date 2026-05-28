import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import storageService from '../services/storage';
import { User } from '../types/index';

const mockUser: User = {
  id: '000001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+2341234567890',
  status: 'Active',
  dateJoined: '2024-01-15',
  accountBalance: '₦1,000,000.00',
  organization: 'Test Org',
  loanPortfolio: '₦500,000.00',
  savingsPortfolio: '₦300,000.00',
};

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
    // Note: IndexedDB initialization is skipped in test environment
    // Tests focus on localStorage functionality which is the fallback
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save user to localStorage', () => {
    storageService.saveUser(mockUser);

    const stored = localStorage.getItem('lendsqr_user_details');
    expect(stored).not.toBeNull();

    const parsedUsers = JSON.parse(stored!);
    expect(parsedUsers).toHaveLength(1);
    expect(parsedUsers[0].id).toBe(mockUser.id);
  });

  it('should retrieve saved user', () => {
    storageService.saveUser(mockUser);

    const retrieved = storageService.getStoredUsers().find(u => u.id === mockUser.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(mockUser.id);
    expect(retrieved?.name).toBe(mockUser.name);
  });

  it('should return null for non-existent user', () => {
    const stored = storageService.getStoredUsers();
    const retrieved = stored.find(u => u.id === '999999');
    expect(retrieved).toBeUndefined();
  });

  it('should update existing user', () => {
    storageService.saveUser(mockUser);

    const updatedUser = { ...mockUser, status: 'Inactive' as const };
    storageService.saveUser(updatedUser);

    const retrieved = storageService.getStoredUsers().find(u => u.id === mockUser.id);
    expect(retrieved?.status).toBe('Inactive');
  });

  it('should get all stored users', () => {
    const user1 = { ...mockUser, id: '000001' };
    const user2 = { ...mockUser, id: '000002', name: 'Jane Doe' };

    storageService.saveUser(user1);
    storageService.saveUser(user2);

    const stored = storageService.getStoredUsers();
    expect(stored).toHaveLength(2);
  });

  it('should save auth state', () => {
    storageService.saveAuthState('test@example.com');

    const auth = storageService.getAuthState();
    expect(auth).not.toBeNull();
    expect(auth?.email).toBe('test@example.com');
    expect(auth?.isAuthenticated).toBe(true);
  });

  it('should clear auth state', () => {
    storageService.saveAuthState('test@example.com');
    storageService.clearAuthState();

    const auth = storageService.getAuthState();
    expect(auth).toBeNull();
  });

  it('should handle multiple users', () => {
    const users = [
      { ...mockUser, id: '000001' },
      { ...mockUser, id: '000002', name: 'Jane Doe' },
      { ...mockUser, id: '000003', name: 'Bob Smith' },
    ];

    for (const user of users) {
      storageService.saveUser(user);
    }

    const stored = storageService.getStoredUsers();
    expect(stored).toHaveLength(3);

    const retrieved1 = stored.find(u => u.id === '000001');
    const retrieved2 = stored.find(u => u.id === '000002');
    const retrieved3 = stored.find(u => u.id === '000003');

    expect(retrieved1?.name).toBe('John Doe');
    expect(retrieved2?.name).toBe('Jane Doe');
    expect(retrieved3?.name).toBe('Bob Smith');
  });
});
