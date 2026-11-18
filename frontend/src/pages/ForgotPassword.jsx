import React, { useState } from 'react';
import { requestPasswordReset } from '../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await requestPasswordReset(email);

      if (response.success) {
        toast.success(response.message);
        // Store the reset token (in production, this would be sent via email)
        setResetToken(response.resetToken);
        
        // Redirect to reset password page with email
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='page-shell page-pad page-enter flex min-h-[78vh] items-center justify-center'>
    <div className='surface-card flex w-full max-w-md flex-col items-center gap-4 p-7 text-[#1d1a17] sm:p-10'>
      
      {/* Title Section */}
      <div className='mb-2 text-center'>
        <p className='eyebrow mb-3'>Account recovery</p>
        <h1 className='display-font text-4xl'>Forgot Password</h1>
      </div>

      <p className='text-sm text-gray-600 text-center mb-4'>
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
        <input
          type="email"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='Email Address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type='submit'
          className='fashion-button mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {resetToken && (
          <div className='mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded'>
            <p className='text-sm font-semibold mb-2'>Development Mode - Reset Token:</p>
            <p className='text-xs break-all bg-white p-2 rounded border'>{resetToken}</p>
            <p className='text-xs text-gray-600 mt-2'>
              Copy this token - you'll need it on the next page.
            </p>
          </div>
        )}
      </form>

      <div className='w-full text-center mt-4'>
        <p className='text-sm text-gray-600'>
          Remember your password?{' '}
          <span
            onClick={() => navigate('/login')}
            className='text-black cursor-pointer hover:underline'
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
    </main>
  );
};

export default ForgotPassword;
