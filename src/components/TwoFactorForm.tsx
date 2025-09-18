import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { useTwoFactor, getErrorMessage } from '../hooks/useAuth';

interface TwoFactorFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ onSuccess, onBack }) => {
  const [countdown, setCountdown] = useState(45);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState('');
  const inputRefs = useRef<(InputRef | null)[]>([]);
  const twoFactorMutation = useTwoFactor();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      if (fullCode === '000000') {
        setIsCodeInvalid(true);
        setCustomErrorMessage('Invalid code');
        return;
      }

      if (fullCode === '111111') {
        setIsCodeInvalid(true);
        setCustomErrorMessage('Expired code');
        return;
      }

      if (fullCode === '999999') {
        setIsCodeInvalid(true);
        setCustomErrorMessage('Server error');
        return;
      }

      try {
        const response = await twoFactorMutation.mutateAsync({
          code: fullCode,
        });
        if (response.success) {
          onSuccess();
        }
      } catch (error) {
        setIsCodeInvalid(true);
        setCustomErrorMessage('');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setIsCodeInvalid(false);
    setCustomErrorMessage('');

    if (twoFactorMutation.error) {
      twoFactorMutation.reset();
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (
      newCode.every((digit) => digit !== '') &&
      newCode.join('').length === 6
    ) {
      handleSubmit();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleGetNewCode = () => {
    setCountdown(45);
    setCode(['', '', '', '', '', '']);
    setIsCodeInvalid(false);
    setCustomErrorMessage('');
    twoFactorMutation.reset();
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const isCodeComplete = code.every((digit) => digit !== '');
  const shouldShowButton = countdown === 0 || isCodeComplete;

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
            position: 'relative',
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{
              padding: 0,
              position: 'absolute',
              left: 0,
              top: -3,
              height: '40px',
              width: '40px',
            }}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <img
            src="/_Logo Placeholder.svg"
            alt="Company Logo"
            style={{
              height: '24px',
              paddingBottom: '20px',
              paddingTop: '20px',
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
              color: '#000000E0',
              marginBottom: '4px',
            }}
          >
            Two-Factor Authentication
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#000000E0',
              marginBottom: '24px',
              marginTop: 0,
              fontSize: '16px',
              fontWeight: 400,
            }}
          >
            Enter the 6-digit code from the Google <br /> Authenticator app
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              maxLength={1}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                width: '52px',
                height: '60px',
                fontSize: '24px',
                textAlign: 'center',
                fontWeight: 600,
                borderRadius: '8px',
                border: isCodeInvalid
                  ? '1px solid #ff4d4f'
                  : '1px solid #d9d9d9',
              }}
            />
          ))}
        </div>

        {(twoFactorMutation.error || isCodeInvalid) && (
          <div
            style={{
              color: '#ff4d4f',
              fontSize: '14px',
              textAlign: 'left',
              marginTop: '8px',
            }}
          >
            {isCodeInvalid && customErrorMessage
              ? customErrorMessage
              : isCodeInvalid
              ? 'Invalid code'
              : getErrorMessage(twoFactorMutation.error)}
          </div>
        )}

        {countdown > 0 && !isCodeComplete && (
          <div
            style={{
              textAlign: 'center',
              color: '#000000A6',
              fontSize: '16px',
              marginTop: '16px',
            }}
          >
            Get a new code in {formatTime(countdown)}
          </div>
        )}

        {shouldShowButton && (
          <Button
            type="primary"
            onClick={countdown === 0 ? handleGetNewCode : handleSubmit}
            loading={twoFactorMutation.isPending}
            disabled={isCodeInvalid && isCodeComplete}
            style={{
              width: '100%',
              height: '40px',
              marginTop: '16px',
              fontSize: '16px',
              fontWeight: 400,
              backgroundColor:
                isCodeInvalid && isCodeComplete ? '#0000000A' : undefined,
              borderColor:
                isCodeInvalid && isCodeComplete ? '#d9d9d9' : undefined,
            }}
          >
            {countdown === 0 ? 'Get new' : 'Continue'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TwoFactorForm;
