import { User, DashboardStats, PaginatedResponse } from '../types/index';

/**
 * Generate mock user data for demonstration
 */
function generateMockUsers(count: number): User[] {
  const firstNames = [
    'Chinedu', 'Amara', 'Emeka', 'Funmi', 'Zainab', 'Uche', 'Kofo', 'Lekan',
    'Adanna', 'Segun', 'Mercy', 'Ikechukwu', 'Tunde', 'Bianca', 'Ade', 'Precious',
    'Chioma', 'Ibrahim', 'Folake', 'Innocent', 'Victoria', 'Mohammed', 'Blessing',
    'Chijioke', 'Fatima', 'Okonkwo', 'Modupe', 'Bamidele', 'Amarachi', 'Taiwo'
  ];

  const lastNames = [
    'Okafor', 'Eze', 'Adeleke', 'Johnson', 'Ahmed', 'Williams', 'Brown', 'Smith',
    'Adeyemi', 'Oluwaseun', 'Akinfewa', 'Mensah', 'Kofi', 'Anyanwu', 'Obasi',
    'Isiaka', 'Okoro', 'Oyedeji', 'Agbaje', 'Ibrahim', 'Chukwu', 'Osei', 'Damola',
    'Adebayo', 'Eze', 'Obi', 'Owolabi', 'Nwosu', 'Ezeoke'
  ];

  const organizations = [
    'Acme Corp', 'Tech Solutions', 'Finance Hub', 'Global Traders', 'Market Leaders',
    'Innovation Inc', 'Digital Minds', 'Enterprise Pro', 'Future Systems', 'Smart Business'
  ];

  const statuses: ('Active' | 'Inactive' | 'Blacklisted' | 'Pending')[] = [
    'Active', 'Inactive', 'Blacklisted', 'Pending'
  ];

  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;

    users.push({
      id: String(i + 1).padStart(6, '0'),
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phone: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dateJoined: new Date(
        2022 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toLocaleDateString(),
      accountBalance: `₦${(Math.random() * 10000000).toFixed(2)}`,
      organization: organizations[Math.floor(Math.random() * organizations.length)],
      loanPortfolio: `₦${(Math.random() * 5000000).toFixed(2)}`,
      savingsPortfolio: `₦${(Math.random() * 2000000).toFixed(2)}`,
      orgRiskRating: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    });
  }

  return users;
}

/**
 * Mock API Service
 * Simulates API calls with local data
 */
class MockApiService {
  private users: User[] = [];
  private readonly storageKey = 'lendsqr_mock_users';

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const storedUsers = localStorage.getItem(this.storageKey);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = generateMockUsers(500);
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    }
  }

  /**
   * Fetch paginated users with optional filtering
   */
  async fetchUsers(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    status?: string
  ): Promise<PaginatedResponse<User>> {
    // Simulate network delay
    await this.delay(300);

    let filtered = [...this.users];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(search) ||
          user.id.includes(search)
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(user => user.status === status);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filtered.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Fetch a single user by ID
   */
  async fetchUserById(id: string): Promise<User | null> {
    await this.delay(200);
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay(300);

    const activeUsers = this.users.filter(u => u.status === 'Active').length;
    const usersWithLoans = this.users.filter(u => {
      const loanAmount = parseFloat(u.loanPortfolio.replace(/₦|,/g, ''));
      return loanAmount > 0;
    }).length;

    return {
      totalUsers: this.users.length,
      activeUsers,
      usersWithLoans,
      totalTransactions: Math.floor(this.users.length * 2.5),
      usersVisitedToday: Math.floor(activeUsers * 0.3),
      activeLoans: Math.floor(usersWithLoans * 0.8),
    };
  }

  /**
   * Update user details
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    await this.delay(200);

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(this.users));

    return this.users[userIndex];
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MockApiService();
