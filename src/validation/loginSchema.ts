import { z } from 'zod';

const commonPasswords = [
  'password',
  '123456',
  '123456789',
  'qwerty',
  'abc123',
  'password123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  '1234567890',
  'password1',
  'qwerty123',
  '123123',
  'welcome123',
  'admin123',
  'root',
  'toor',
];

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please input your email!')
    .refine((email) => {
      const atCount = (email.match(/@/g) || []).length;
      if (atCount !== 1) return false;

      if (!emailRegex.test(email)) return false;

      const [localPart, domainPart] = email.split('@');

      if (!localPart || localPart.length === 0) return false;
      if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) return false;

      if (!domainPart || domainPart.length === 0) return false;
      if (!domainPart.includes('.')) return false;
      if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) return false;

      const parts = domainPart.split('.');
      const tld = parts[parts.length - 1];
      if (!tld || tld.length < 2) return false;

      return true;
    }, 'Please enter a valid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must not exceed 64 characters')
    .refine((password) => {
      if (password !== password.trim()) return false;
      return true;
    }, 'Password cannot have leading or trailing spaces')
    .refine((password) => {
      return !commonPasswords.includes(password.toLowerCase());
    }, 'This password is too common. Please choose a stronger password')
    .refine((password) => {
      return /[a-z]/.test(password);
    }, 'Password must contain at least 1 lowercase letter')
    .refine((password) => {
      return /[A-Z]/.test(password);
    }, 'Password must contain at least 1 uppercase letter')
    .refine((password) => {
      return /\d/.test(password);
    }, 'Password must contain at least 1 number')
    .refine((password) => {
      return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);
    }, 'Password must contain at least 1 special character'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const getFieldError = (
  errors: any,
  fieldName: keyof LoginFormData
): string | undefined => {
  return errors[fieldName]?.message;
};

export const hasFieldError = (
  errors: any,
  fieldName: keyof LoginFormData
): boolean => {
  return !!errors[fieldName];
};
