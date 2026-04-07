export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  active?: boolean;
  verified?: boolean;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface EnhancedAuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  token: string;
  roles: string[];
  active: boolean;
  verified: boolean;
  issuedAt: string;
  expiresAt: string;
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  active: boolean;
  verified: boolean;
}

export interface UserProfileResponse {
  userId: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  active: boolean;
  verified: boolean;
  roles: string[];
  permissions: string[];
}
