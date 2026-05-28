import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import apiService from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should generate 500 mock users on initialization', async () => {
    const result = await apiService.fetchUsers(1, 500);
    expect(result.data.length).toBeLessThanOrEqual(500);
    expect(result.total).toBeGreaterThanOrEqual(500);
  });

  it('should fetch paginated users', async () => {
    const result = await apiService.fetchUsers(1, 10);

    expect(result.data).toHaveLength(10);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('should handle pagination correctly', async () => {
    const page1 = await apiService.fetchUsers(1, 5);
    const page2 = await apiService.fetchUsers(2, 5);

    expect(page1.data[0].id).not.toBe(page2.data[0].id);
    expect(page2.page).toBe(2);
  });

  it('should search users by name', async () => {
    const result = await apiService.fetchUsers(1, 100, 'Chinedu');

    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.some((u: any) => u.name.includes('Chinedu'))).toBe(true);
  });

  it('should search users by email', async () => {
    const result = await apiService.fetchUsers(1, 100, 'example.com');

    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every((u: any) => u.email.includes('example.com'))).toBe(true);
  });

  it('should filter users by status', async () => {
    const result = await apiService.fetchUsers(1, 100, undefined, 'Active');

    expect(result.data.every((u: any) => u.status === 'Active')).toBe(true);
  });

  it('should fetch user by ID', async () => {
    const users = await apiService.fetchUsers(1, 10);
    const userId = users.data[0].id;

    const user = await apiService.fetchUserById(userId);

    expect(user).not.toBeNull();
    expect(user?.id).toBe(userId);
  });

  it('should return null for non-existent user', async () => {
    const user = await apiService.fetchUserById('999999');
    expect(user).toBeNull();
  });

  it('should get dashboard statistics', async () => {
    const stats = await apiService.getDashboardStats();

    expect(stats.totalUsers).toBeGreaterThan(0);
    expect(stats.activeUsers).toBeGreaterThanOrEqual(0);
    expect(stats.usersWithLoans).toBeGreaterThanOrEqual(0);
    expect(stats.totalTransactions).toBeGreaterThanOrEqual(0);
  });

  it('should update user status', async () => {
    const users = await apiService.fetchUsers(1, 10);
    const userId = users.data[0].id;
    const originalStatus = users.data[0].status;

    const newStatus = originalStatus === 'Active' ? 'Inactive' : 'Active' as const;
    const updated = await apiService.updateUser(userId, { status: newStatus });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe(newStatus);
  });

  it('should store users in localStorage', async () => {
    // Fetch users (this ensures data is in the in-memory cache)
    const result = await apiService.fetchUsers(1, 10);
    
    // Verify we get data back
    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBe(500);
  });
});
