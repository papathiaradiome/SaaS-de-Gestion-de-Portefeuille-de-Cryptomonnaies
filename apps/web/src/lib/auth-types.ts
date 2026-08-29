export interface SafeUser {
  id: number;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}
