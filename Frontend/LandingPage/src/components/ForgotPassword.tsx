import React, { useState } from 'react';
import axios from 'axios';

interface ForgotPasswordProps {
  onClose: () => void;
  onLoginClick: () => void; // To switch back to Login modal
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Call the actual backend endpoint
      const response = await axios.post('http://localhost:8000/api/auth/forgot-password', { email, phone });

      console.log('Forgot password request successful:', response.data);
      setMessage(response.data.message || 'If an account matches the details provided, a password reset link will be sent.');
      // Optionally clear fields after success
      // setEmail('');
      // setPhone('');

    } catch (err) {
      // Handle Axios errors specifically if possible
      if (axios.isAxiosError(err) && err.response) {
        console.error('Forgot Password Request Failed:', err.response.data);
        setError(err.response.data.message || 'Failed to send reset request. Please check details and try again.');
      } else {
        // Handle non-Axios errors or errors without a response
        console.error('Forgot Password Request Failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
        setError(errorMessage);
      }
    } finally { // Correct placement of finally
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-card text-card-foreground rounded-lg shadow-xl p-8 w-full max-w-md space-y-6 border border-border">
        <h2 className="text-2xl font-bold text-center text-primary">Forgot Password</h2>
        
        {message ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 dark:text-green-400">{message}</p>
            <button
              onClick={onClose}
              className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter your email and phone number to request a password reset.
            </p>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel" // Use 'tel' for phone numbers
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Sending Request...' : 'Request Password Reset'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button" // Important: type="button" to prevent form submission
                onClick={onLoginClick}
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </button>
            </div>
             <button
                type="button" // Important: type="button" to prevent form submission
                onClick={onClose}
                className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg mt-2 hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
