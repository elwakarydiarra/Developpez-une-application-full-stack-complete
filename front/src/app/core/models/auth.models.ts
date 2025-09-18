export interface SignupRequest { email: string; username: string; password: string; }
export interface AuthRequest { identifier: string; password: string; }
export interface AuthResponse { token: string; }
