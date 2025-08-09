// pages/signup.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedInput from '@components/ProtectedInput';
import Layout from '@components/Layout';

// Define the step types for the signup process
type SignupStep = 'username' | 'email' | 'password' | 'confirmPassword';

const Signup: React.FC = () => {
  const router = useRouter();
  const { username: urlUsername } = router.query;
  
  // State for form data
  const [currentStep, setCurrentStep] = useState<SignupStep>('username');
  const [formData, setFormData] = useState({
    username: typeof urlUsername === 'string' ? urlUsername : '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // State for validation and loading
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Effect to handle username from URL
  useEffect(() => {
    if (urlUsername && typeof urlUsername === 'string' && !formData.username) {
      setFormData(prev => ({ ...prev, username: urlUsername }));
      // If username is provided, skip to email step
      setCurrentStep('email');
    }
  }, [urlUsername, formData.username]);

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, _, and -';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[!@#$%^&*])/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle next step
  const handleNext = () => {
    let isValid = true;
    let newErrors = { ...errors };
    
    switch (currentStep) {
      case 'username':
        newErrors.username = validateUsername(formData.username);
        if (newErrors.username) isValid = false;
        break;
        
      case 'email':
        newErrors.email = validateEmail(formData.email);
        if (newErrors.email) isValid = false;
        break;
        
      case 'password':
        newErrors.password = validatePassword(formData.password);
        if (newErrors.password) isValid = false;
        break;
        
      case 'confirmPassword':
        newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (newErrors.confirmPassword) isValid = false;
        break;
    }
    
    setErrors(newErrors);
    
    if (isValid) {
      if (currentStep === 'confirmPassword') {
        handleSignup();
      } else {
        const steps: SignupStep[] = ['username', 'email', 'password', 'confirmPassword'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
          setCurrentStep(steps[currentIndex + 1]);
        }
      }
    }
  };

  // Handle signup submission
  const handleSignup = async () => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Signup ', formData);
      
      // Redirect to login or dashboard on success
      router.push('/login?message=account_created');
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: 'An error occurred during signup. Please try again.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle previous step
  const handleBack = () => {
    const steps: SignupStep[] = ['username', 'email', 'password', 'confirmPassword'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Handle key press (Enter)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  // Progress percentage
  const getProgress = () => {
    const steps = ['username', 'email', 'password', 'confirmPassword'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <Layout title="Create Your Account • thebiolink.lol" noNav>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#1a1a2e] to-[#16213e] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Container */}
        <div className="container mx-auto max-w-md relative z-10">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span className={currentStep === 'username' ? 'text-green-400' : ''}>
                {currentStep === 'username' ? '●' : '○'} Username
              </span>
              <span className={currentStep === 'email' ? 'text-green-400' : ''}>
                {currentStep === 'email' ? '●' : '○'} Email
              </span>
              <span className={['password', 'confirmPassword'].includes(currentStep) ? 'text-green-400' : ''}>
                {['password', 'confirmPassword'].includes(currentStep) ? '●' : '○'} Password
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
              <p className="text-gray-400">
                {currentStep === 'username' && "Choose your unique username"}
                {currentStep === 'email' && "Enter your email address"}
                {currentStep === 'password' && "Create a secure password"}
                {currentStep === 'confirmPassword' && "Confirm your password"}
              </p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Username Step */}
              {currentStep === 'username' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Username
                  </label>
                  <ProtectedInput
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    placeholder="yourname"
                    onKeyPress={handleKeyPress}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-2">{errors.username}</p>
                  )}
                </div>
              )}

              {/* Email Step */}
              {currentStep === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Email Address
                  </label>
                  <ProtectedInput
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="you@example.com"
                    onKeyPress={handleKeyPress}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>
              )}

              {/* Password Step */}
              {currentStep === 'password' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Password
                  </label>
                  <ProtectedInput
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="••••••••"
                    onKeyPress={handleKeyPress}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2">{errors.password}</p>
                  )}
                  <div className="mt-4 text-xs text-gray-400 space-y-1">
                    <p>Password must include:</p>
                    <p>• At least 8 characters</p>
                    <p>• One uppercase letter</p>
                    <p>• One lowercase letter</p>
                    <p>• One number</p>
                    <p>• One special character</p>
                  </div>
                </div>
              )}

              {/* Confirm Password Step */}
              {currentStep === 'confirmPassword' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Confirm Password
                  </label>
                  <ProtectedInput
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="••••••••"
                    onKeyPress={handleKeyPress}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : currentStep === 'confirmPassword' ? 'Create Account' : 'Continue →'}
              </button>

              {currentStep !== 'username' && (
                <button
                  onClick={handleBack}
                  className="w-full text-gray-400 hover:text-white transition-colors duration-300"
                >
                  ← Back
                </button>
              )}

              <div className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-green-400 hover:underline transition-colors">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
