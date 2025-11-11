import React, { useState, useMemo } from 'react';
import { LogoIcon } from '../icons/LogoIcon';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { signUp, logInWithGoogle, validatePassword } from '../../services/authService';

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin, onNavigateToLanding }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Real-time password validation
    const passwordValidation = useMemo(() => {
        if (!password) return null;
        return validatePassword(password);
    }, [password]);

    const passwordRequirements = useMemo(() => {
        if (!password) return {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
        };
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        };
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Validate password before submitting
        const validation = validatePassword(password);
        if (!validation.isValid) {
            setError(validation.error || 'Invalid password.');
            return;
        }

        setIsLoading(true);
        try {
            await signUp(email, password, name);
            // Auth state listener in App.tsx will handle the redirect
            // Note: setIsLoading(false) is not called here because the component will unmount
            // when the user is redirected after successful signup
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await logInWithGoogle();
            // Auth state listener in App.tsx will handle the redirect
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during Google sign-in.");
            }
            setIsLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4" style={{
      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }}>
      {/* Back Button */}
      <button 
        onClick={onNavigateToLanding}
        className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        <span className="text-sm">Back</span>
      </button>

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LogoIcon className="h-10 w-10 text-white" />
          <span className="ml-3 text-2xl font-semibold text-white">Bugless</span>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <div className="p-8">
            <h2 className="text-center text-2xl font-bold text-white mb-6">Create your account</h2>
            
            <p className="text-center text-sm text-gray-400 mb-6">
              ALREADY HAVE AN ACCOUNT?{' '}
              <button onClick={onNavigateToLogin} className="font-semibold text-white hover:underline">
                LOG IN
              </button>
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-300 mb-2 block">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full py-3 px-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="Your email"
                />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300 mb-2 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                      password && passwordValidation && !passwordValidation.isValid
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-700 focus:ring-white/20 focus:border-white/30'
                    }`}
                    placeholder="Your password"
                  />
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-400 mb-2">Password must contain:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                        <svg className={`w-4 h-4 mr-2 ${passwordRequirements.length ? 'text-green-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {passwordRequirements.length ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center text-xs ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                        <svg className={`w-4 h-4 mr-2 ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {passwordRequirements.uppercase ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        One uppercase letter (A-Z)
                      </div>
                      <div className={`flex items-center text-xs ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                        <svg className={`w-4 h-4 mr-2 ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {passwordRequirements.lowercase ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        One lowercase letter (a-z)
                      </div>
                      <div className={`flex items-center text-xs ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                        <svg className={`w-4 h-4 mr-2 ${passwordRequirements.number ? 'text-green-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {passwordRequirements.number ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        One number (0-9)
                      </div>
                      <div className={`flex items-center text-xs ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                        <svg className={`w-4 h-4 mr-2 ${passwordRequirements.special ? 'text-green-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {passwordRequirements.special ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        One special character (e.g., !@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-3 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900 text-gray-400">OR SIGN UP WITH</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full mt-4 bg-white text-black py-3 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
