'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { validators } from '@/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    const emailRequiredError = validators.required(email, 'Email');
    const emailFormatError = validators.email(email);
    if (emailRequiredError) {
      newErrors.email = emailRequiredError;
      isValid = false;
    } else if (emailFormatError) {
      newErrors.email = emailFormatError;
      isValid = false;
    }

    const passwordRequiredError = validators.required(password, 'Password');
    const passwordLengthError = validators.minLength(password, 6, 'Password');
    if (passwordRequiredError) {
      newErrors.password = passwordRequiredError;
      isValid = false;
    } else if (passwordLengthError) {
      newErrors.password = passwordLengthError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    // Validate credentials
    if (email === 'admin@test.com' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      setErrors({ 
        email: '', 
        password: 'Invalid email or password' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back!</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Login to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="admin@test.com"
              className="py-3"
            />

            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              className="py-3"
            />

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              fullWidth
              size="md"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">Test Credentials:</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Email: <span className="font-mono font-semibold">admin@test.com</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Password: <span className="font-mono font-semibold">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-white text-sm">
          Built by <strong>Muneeb Ur Rehman</strong>
        </p>
      </div>
    </div>
  );
}
