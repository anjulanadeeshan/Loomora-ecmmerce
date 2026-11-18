import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/userService';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminLogin(formData.email, formData.password);

      if (response.success) {
        // Save admin token and info
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(response.message || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eee7dc] px-4 py-12 sm:px-6 lg:px-8">
      <div className="surface-card w-full max-w-md space-y-8 p-8 sm:p-10">
        <div>
          <p className="eyebrow text-center">Loomora studio</p>
          <h2 className="display-font mt-3 text-center text-4xl text-[#1d1a17]">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full rounded-xl border px-4 py-3 text-sm text-[#1d1a17] placeholder-[#8c847b]"
                placeholder="Admin email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative mt-3 block w-full rounded-xl border px-4 py-3 text-sm text-[#1d1a17] placeholder-[#8c847b]"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Back to customer login
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="fashion-button group relative w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-300 group-hover:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {loading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
