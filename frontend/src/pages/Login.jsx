import React, { useState, useContext } from 'react'
import ShopContext from '../context/ShopContext.js'
import { loginUser, registerUser, adminLogin } from '../services/userService'
import { toast } from 'react-toastify'

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');
  const { login, navigate } = useContext(ShopContext);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
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

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (currentState === 'Sign Up') {
        // Register new user (admin login not available for sign up)
        if (isAdminLogin) {
          toast.error('Admin registration is not allowed. Please sign up as a regular user.');
          setLoading(false);
          return;
        }
        response = await registerUser(formData.name, formData.email, formData.password);
      } else {
        // Login existing user or admin
        if (isAdminLogin) {
          response = await adminLogin(formData.email, formData.password);
          if (response.success) {
            // Save admin token and info
            localStorage.setItem('adminToken', response.token);
            localStorage.setItem('adminUser', JSON.stringify(response.user));
            toast.success('Admin login successful!');
            navigate('/admin/dashboard');
            setLoading(false);
            return;
          } else {
            toast.error(response.message || 'Invalid admin credentials');
            setLoading(false);
            return;
          }
        } else {
          response = await loginUser(formData.email, formData.password);
        }
      }

      if (response.success) {
        // Save auth data and update context
        login(response.token, response.user);
        navigate('/');
      } else {
        toast.error(response.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell page-pad page-enter flex min-h-[78vh] items-center justify-center">
      <form onSubmit={onSubmitHandler} className='surface-card flex w-full max-w-md flex-col items-center gap-4 p-7 text-[#1d1a17] sm:p-10'>
        
        {/* Title Section */}
        <div className='mb-4 text-center'>
            <p className='eyebrow mb-3'>Welcome to Loomora</p>
            <h1 className='display-font text-4xl'>{isAdminLogin ? 'Admin Login' : currentState}</h1>
        </div>

        {/* Admin Login Toggle - Only visible during Login */}
        {currentState === 'Login' && (
          <div className='w-full flex items-center gap-2 -mt-2'>
            <input 
              type="checkbox" 
              id="adminLogin"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
              className='h-4 w-4'
            />
            <label htmlFor="adminLogin" className='text-sm text-gray-700 cursor-pointer'>
              Login as Admin
            </label>
          </div>
        )}

        {/* Name Input - Only visible during Sign Up */}
        {currentState === 'Sign Up' && !isAdminLogin && (
          <input 
            type="text" 
            name="name"
            className='w-full rounded-xl border px-4 py-3'
            placeholder='Name' 
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        
        {/* Email & Password Inputs */}
        <input 
          type="email" 
          name="email"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='Email' 
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          type="password" 
          name="password"
          className='w-full rounded-xl border px-4 py-3'
          placeholder='Password' 
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        {/* Forgot Password & Toggle Link */}
        <div className='w-full flex justify-between text-sm -mt-2'>
            {!isAdminLogin && (
              <p 
                onClick={() => navigate('/forgot-password')} 
                className='cursor-pointer hover:underline'
              >
                Forgot your password?
              </p>
            )}
            <div className={isAdminLogin ? 'w-full' : ''}>
            {
                currentState === 'Login'
                ? <p onClick={()=>{ setCurrentState('Sign Up'); setIsAdminLogin(false); }} className='cursor-pointer'>Create account</p>
                : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
            }
            </div>
        </div>

        {/* Submit Button */}
        <button 
          className='fashion-button mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50'
          disabled={loading}
        >
            {loading ? 'Please wait...' : (isAdminLogin ? 'Admin Sign In' : (currentState === 'Login' ? 'Sign In' : 'Sign Up'))}
        </button>

      </form>
    </main>
  )
}

export default Login
