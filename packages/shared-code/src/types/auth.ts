export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface JwtToken {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse extends JwtToken {
  user: User;
}
