import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/authApi';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

export const useTwoFactor = () => {
  return useMutation({
    mutationFn: authApi.verifyTwoFactor,
    onError: (error: any) => {
      console.error('2FA error:', error);
    },
  });
};

export const getErrorMessage = (error: any): string => {
  if (error.message === 'Network request failed') {
    return 'Network connection failed. Please check your internet connection.';
  }

  if (error.data && error.data.message) {
    return error.data.message;
  }

  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid credentials. Please try again.';
    case 403:
      return 'Access forbidden. Please verify your account.';
    case 404:
      return 'Service not found. Please contact support.';
    case 423:
      return 'Account is locked. Please contact support.';
    case 429:
      return 'Too many requests. Please wait before trying again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
