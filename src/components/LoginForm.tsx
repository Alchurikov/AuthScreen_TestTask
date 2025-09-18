import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, getErrorMessage } from '../hooks/useAuth';
import {
  loginSchema,
  LoginFormData,
  getFieldError,
  hasFieldError,
} from '../validation/loginSchema';

interface LoginFormProps {
  onSuccess: (requiresTwoFactor: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const loginMutation = useLogin();
  const [serverErrors, setServerErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerErrors({});
      const response = await loginMutation.mutateAsync(data);
      if (response.success) {
        onSuccess(response.requiresTwoFactor || false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage.toLowerCase().includes('password')) {
        setServerErrors({ password: errorMessage });
      } else {
        setServerErrors({ email: errorMessage });
      }
    }
  };

  const handleFieldChange = () => {
    setServerErrors({});
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 376,
          padding: '32px',
          backgroundColor: 'white',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/_Logo Placeholder.svg'}
            alt="Company Logo"
            style={{
              height: '24px',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              lineHeight: '32px',
              fontWeight: 600,
              color: '#000000E0',
              marginBottom: '24px',
            }}
          >
            Sign in to your account to <br />
            continue
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              marginBottom:
                hasFieldError(errors, 'email') || serverErrors.email
                  ? '24px'
                  : '16px',
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined style={{ color: '#00000073' }} />}
                  placeholder="Email"
                  status={
                    hasFieldError(errors, 'email') || serverErrors.email
                      ? 'error'
                      : ''
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                  style={{
                    height: '40px',
                    fontWeight: 400,
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'transparent !important',
                      boxShadow: 'none !important',
                    },
                  }}
                />
              )}
            />
            {(getFieldError(errors, 'email') || serverErrors.email) && (
              <div
                style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}
              >
                {serverErrors.email || getFieldError(errors, 'email')}
              </div>
            )}
          </div>

          <div
            style={{
              marginBottom:
                hasFieldError(errors, 'password') || serverErrors.password
                  ? '24px'
                  : '16px',
            }}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  prefix={<LockOutlined style={{ color: '#00000073' }} />}
                  placeholder="Password"
                  status={
                    hasFieldError(errors, 'password') || serverErrors.password
                      ? 'error'
                      : ''
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                  style={{
                    height: '40px',
                    fontWeight: 400,
                  }}
                />
              )}
            />
            {(getFieldError(errors, 'password') || serverErrors.password) && (
              <div
                style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}
              >
                {serverErrors.password || getFieldError(errors, 'password')}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 0 }}>
            <Button
              type={isValid ? 'primary' : 'default'}
              htmlType="submit"
              loading={loginMutation.isPending}
              disabled={!isValid}
              style={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
                fontWeight: 400,
                backgroundColor: isValid ? undefined : '#f5f5f5',
                borderColor: isValid ? undefined : '#d9d9d9',
                color: isValid ? undefined : '#00000040',
              }}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
