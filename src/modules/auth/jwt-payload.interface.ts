// auth/jwt-payload.interface.ts

export interface JwtPayload {
  sub: number; // Subject (typically user ID)
  email: string; // User's email address
  role: string; // User's role (e.g., 'admin', 'user')
  phone: string;
  emailVerified: string;
  phoneVerified: string;
}
