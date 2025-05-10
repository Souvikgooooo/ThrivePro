import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // To set user after successful reset

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get token from URL params
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (!token) {
       setError('Invalid or missing reset token.');
       setIsLoading(false);
       return;
    }

    try {
      const response = await axios.patch(`http://localhost:8000/api/auth/reset-password/${token}`, {
        password,
        passwordConfirm,
      });

      console.log('Password Reset Successful:', response.data);
      setMessage('Password has been reset successfully! Redirecting to login...');
      
      // Optionally log the user in immediately using the returned token/user data
      // Or just redirect to login page
      
      // Example: Set user context if backend returns user data and token
      // const userData = { ... }; 
      // setUser(userData);

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/'); // Navigate to landing page, which might trigger login modal if needed
        // Or potentially directly trigger the login modal if App state allows
      }, 3000);

    } catch (err) {
      console.error('Password Reset Failed:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to reset password. The token might be invalid or expired.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="bg-card text-card-foreground rounded-lg shadow-xl p-8 w-full max-w-md space-y-6 border border-border">
        <h2 className="text-2xl font-bold text-center text-primary">Reset Your Password</h2>

        {message ? (
           <p className="text-center text-green-600 dark:text-green-400">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter your new password below.
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Resetting Password...' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
