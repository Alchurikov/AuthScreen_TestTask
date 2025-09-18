import {
  LoginCredentials,
  TwoFactorCredentials,
  AuthResponse,
  ApiError,
} from '../types/auth';

const mockResponses = {
  loginSuccess: { success: true, requiresTwoFactor: true },
  loginDirectSuccess: { success: true, token: 'mock-jwt-token' },
  twoFactorSuccess: { success: true, token: 'mock-jwt-token' },
  invalidCredentials: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
  },
  accountLocked: {
    code: 'ACCOUNT_LOCKED',
    message: 'Account locked due to multiple failed attempts',
  },
  emailNotVerified: {
    code: 'EMAIL_NOT_VERIFIED',
    message: 'Please verify your email address',
  },
  serverError: {
    code: 'SERVER_ERROR',
    message: 'Internal server error. Please try again later.',
  },
  networkError: { code: 'NETWORK_ERROR', message: 'Network connection failed' },
  rateLimited: {
    code: 'RATE_LIMITED',
    message: 'Too many requests. Please wait before trying again.',
  },
  invalidTwoFactor: {
    code: 'INVALID_2FA_CODE',
    message: 'Invalid verification code',
  },
  expiredTwoFactor: {
    code: 'EXPIRED_2FA_CODE',
    message: 'Verification code has expired',
  },
  twoFactorRequired: {
    code: '2FA_REQUIRED',
    message: 'Two-factor authentication is required',
  },
  maintenanceMode: {
    code: 'MAINTENANCE',
    message: 'System is under maintenance. Please try again later.',
  },
};

const getScenarioFromEmail = (email: string): string => {
  if (email.includes('locked')) return 'accountLocked';
  if (email.includes('unverified')) return 'emailNotVerified';
  if (email.includes('server-error')) return 'serverError';
  if (email.includes('network-error')) return 'networkError';
  if (email.includes('rate-limit')) return 'rateLimited';
  if (email.includes('maintenance')) return 'maintenanceMode';
  if (email.includes('direct-success')) return 'loginDirectSuccess';
  if (email.includes('invalid')) return 'invalidCredentials';
  return 'loginSuccess';
};

const simulateNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 200));

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await simulateNetworkDelay();

    const scenario = getScenarioFromEmail(credentials.email);

    if (scenario === 'networkError') {
      throw new Error('Network request failed');
    }

    if (scenario === 'serverError') {
      const error = new Error('Server Error') as any;
      error.status = 500;
      error.data = mockResponses.serverError;
      throw error;
    }

    if (scenario === 'rateLimited') {
      const error = new Error('Rate Limited') as any;
      error.status = 429;
      error.data = mockResponses.rateLimited;
      throw error;
    }

    if (scenario === 'maintenanceMode') {
      const error = new Error('Service Unavailable') as any;
      error.status = 503;
      error.data = mockResponses.maintenanceMode;
      throw error;
    }

    if (scenario === 'invalidCredentials') {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.data = mockResponses.invalidCredentials;
      throw error;
    }

    if (scenario === 'accountLocked') {
      const error = new Error('Account Locked') as any;
      error.status = 423;
      error.data = mockResponses.accountLocked;
      throw error;
    }

    if (scenario === 'emailNotVerified') {
      const error = new Error('Email Not Verified') as any;
      error.status = 403;
      error.data = mockResponses.emailNotVerified;
      throw error;
    }

    if (scenario === 'loginDirectSuccess') {
      return mockResponses.loginDirectSuccess;
    }

    return mockResponses.loginSuccess;
  },

  verifyTwoFactor: async (
    credentials: TwoFactorCredentials
  ): Promise<AuthResponse> => {
    await simulateNetworkDelay();

    const code = credentials.code;

    if (code === '000000') {
      const error = new Error('Invalid Code') as any;
      error.status = 400;
      error.data = mockResponses.invalidTwoFactor;
      throw error;
    }

    if (code === '111111') {
      const error = new Error('Expired Code') as any;
      error.status = 410;
      error.data = mockResponses.expiredTwoFactor;
      throw error;
    }

    if (code === '999999') {
      const error = new Error('Server Error') as any;
      error.status = 500;
      error.data = mockResponses.serverError;
      throw error;
    }

    return mockResponses.twoFactorSuccess;
  },
};
