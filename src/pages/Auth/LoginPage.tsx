import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setLocalError('Please enter your administrator email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setLocalError('Please enter a valid email address format.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your administrator password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedEmail, password);
      if (!result.success) {
        setLocalError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-md shadow-primary/20 mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
              <circle cx="7" cy="8.2" r="2.2" />
              <circle cx="17" cy="8.2" r="2.2" />
              <circle cx="10.2" cy="4.8" r="2" />
              <circle cx="13.8" cy="4.8" r="2" />
              <path d="M12 10.8c-2.8 0-5.2 1.8-5.2 4.2 0 2.2 2 3.5 5.2 3.5s5.2-1.3 5.2-3.5c0-2.4-2.4-4.2-5.2-4.2z" />
            </svg>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Gotails Admin
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
            Administration &amp; Operations Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
          <div className="mb-6">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Sign In
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Enter your authorized credentials to access the platform.
            </p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-5 p-3.5 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-error animate-fade-in">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                error
              </span>
              <div className="text-body-sm font-medium leading-snug">
                {displayError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline pointer-events-none">
                  mail
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (displayError) {
                      setLocalError(null);
                      clearAuthError();
                    }
                  }}
                  placeholder="admin@gotails.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline pointer-events-none">
                  lock
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (displayError) {
                      setLocalError(null);
                      clearAuthError();
                    }
                  }}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-on-surface transition-colors rounded-lg flex items-center justify-center"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg font-semibold shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      login
                    </span>
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-center gap-1.5 text-outline text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-tertiary">
              verified_user
            </span>
            <span>256-bit SSL encrypted &bull; Role-Protected Access</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center font-label-sm text-outline mt-6">
          &copy; {new Date().getFullYear()} GoTails Quick Commerce. All rights reserved.
        </p>
      </div>
    </div>
  );
};
