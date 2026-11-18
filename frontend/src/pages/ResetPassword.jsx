import React, { useState } from 'react';
import { resetPassword } from '../services/userService';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    resetToken: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(
        formData.email,
        formData.resetToken,
        formData.newPassword
      );

      if (response.success) {
        toast.success(response.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
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
        <p className='eyebrow mb-3'>Choose a new password</p>
        <h1 className='display-font text-4xl'>Reset Password</h1>
      </div>

      <p className='text-sm text-gray-600 text-center mb-4'>
        Enter the 6-digit verification code from your email and your new password
      </p>

      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
        <input
          type="email"
          name="email"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='Email Address'
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="resetToken"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='6-Digit Verification Code'
          value={formData.resetToken}
          onChange={handleChange}
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          required
        />

        <input
          type="password"
          name="newPassword"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='New Password (min 8 characters)'
          value={formData.newPassword}
          onChange={handleChange}
          required
          minLength={8}
        />

        <input
          type="password"
          name="confirmPassword"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='Confirm New Password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={8}
        />

        <button
          type='submit'
          className='fashion-button mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50'
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
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

export default ResetPassword;
