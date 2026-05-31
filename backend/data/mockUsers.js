// Generate 500 mock users
export function generateMockUsers() {
  const statuses = ['Active', 'Inactive', 'Pending', 'Blacklisted'];
  const organizations = ['Acme Corp', 'TechStart', 'Global Solutions', 'Innovation Labs', 'Digital Ventures', 'Enterprise Plus'];
  const users = [];
  
  const firstNames = ['Ahmed', 'Amira', 'Hassan', 'Fatima', 'Omar', 'Layla', 'Mohamed', 'Zainab', 'Ali', 'Noor', 'Ibrahim', 'Leena', 'Kareem', 'Dina', 'Rashid'];
  const lastNames = ['Khan', 'Ahmed', 'Hassan', 'Ali', 'Rahman', 'Ibrahim', 'Hassan', 'Mohamed', 'Ahmad', 'Malik'];

  for (let i = 1; i <= 500; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const phone = `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`;

    users.push({
      id: i,
      username: `${firstName.toLowerCase()}${i}`,
      email,
      phone,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      organization: organizations[Math.floor(Math.random() * organizations.length)],
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      lastActivity: new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString(),
      loanAmount: Math.floor(Math.random() * 500000) + 50000,
      accountBalance: Math.floor(Math.random() * 1000000),
    });
  }

  return users;
}

export const mockUsers = generateMockUsers();
