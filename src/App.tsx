import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import LoginForm from './components/LoginForm';
import TwoFactorForm from './components/TwoFactorForm';
import { AuthStep } from './types/auth';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStep.LOGIN);

  const handleLoginSuccess = (requiresTwoFactor: boolean) => {
    if (requiresTwoFactor) {
      setCurrentStep(AuthStep.TWO_FACTOR);
    } else {
      setCurrentStep(AuthStep.LOGIN);
      setTimeout(() => setCurrentStep(AuthStep.LOGIN), 2000);
    }
  };

  const handleTwoFactorSuccess = () => {
    setTimeout(() => setCurrentStep(AuthStep.LOGIN), 2000);
  };

  const handleBack = () => {
    setCurrentStep(AuthStep.LOGIN);
  };

  return (
    <ConfigProvider>
      {currentStep === AuthStep.LOGIN && (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}

      {currentStep === AuthStep.TWO_FACTOR && (
        <TwoFactorForm onSuccess={handleTwoFactorSuccess} onBack={handleBack} />
      )}
    </ConfigProvider>
  );
};

export default App;
