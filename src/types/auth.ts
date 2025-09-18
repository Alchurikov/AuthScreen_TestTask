export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorCredentials {
  code: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  requiresTwoFactor?: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export enum AuthStep {
  LOGIN = 'login',
  TWO_FACTOR = 'twoFactor',
}
