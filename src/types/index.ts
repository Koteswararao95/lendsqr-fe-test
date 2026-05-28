/**
 * User type definition for the application
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Blacklisted' | 'Pending';
  dateJoined: string;
  accountBalance: string;
  organization: string;
  loanPortfolio: string;
  savingsPortfolio: string;
  orgRiskRating?: string;
  jobRole?: string;
  levelOfAccess?: string;
  guarantor?: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  personalInfo?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    bvn: string;
    gender: string;
    maritalStatus: string;
    children: string;
    typeOfResidence: string;
  };
  educationAndEmployment?: {
    levelOfEducation: string;
    employmentStatus: string;
    sector: string;
    duration: string;
    officeEmail: string;
    monthlyIncome: string[];
    loanRepayment: string;
  };
  socialCapital?: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedIn: string;
  };
  additionalInfo?: {
    nextOfKin: string;
    nextOfKinPhone: string;
    preferredNotification: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  totalTransactions: number;
  usersVisitedToday: number;
  activeLoans: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuthUser {
  email: string;
  isAuthenticated: boolean;
}

export const UserStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
  Blacklisted: 'Blacklisted',
  Pending: 'Pending',
} as const;

export type UserStatusType = typeof UserStatus[keyof typeof UserStatus];
