import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setVisible(false);
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'DASHBOARD' },
    { path: '/admin/products', label: 'PRODUCTS' },
    { path: '/admin/orders', label: 'ORDERS' },
    { path: '/admin/users', label: 'USERS' },
    { path: '/admin/feedback', label: 'FEEDBACK' }
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between border-b border-[#ded7cc] bg-[#fffdf9]/90 px-4 font-medium backdrop-blur-xl sm:px-[5vw] md:px-[7vh] lg:px-[9vh]">
      <Link to='/admin/dashboard'>
        <img src={assets.loomora_logo} className="h-10 w-auto object-contain" alt="Loomora" />
      </Link>
      
      <ul className="hidden items-center gap-2 rounded-full border border-[#ded7cc] bg-white/70 p-1 text-xs text-[#4f4943] sm:flex">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`rounded-full px-4 py-2 transition ${location.pathname === item.path ? 'bg-[#7d263d] text-white' : 'hover:bg-[#eee7dc]'}`}
          >
            <p className={location.pathname === item.path ? 'font-semibold' : ''}>{item.label}</p>
          </Link>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-sm">View Store</span>
        </Link>
        
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full bg-[#1d1a17] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#7d263d]"
        >
          Logout
        </button>
        
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`fixed inset-0 z-[60] overflow-y-auto bg-[#fffdf9] transition-transform duration-300 sm:hidden ${
          visible ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        aria-hidden={!visible}
      >
        <div className="flex min-h-full flex-col text-[#4f4943]">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 border-b border-[#ded7cc] p-5 text-left"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </button>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`border-b border-[#ded7cc] px-6 py-4 ${location.pathname === item.path ? 'bg-[#f3eee5] font-semibold text-[#7d263d]' : ''}`}
              onClick={() => setVisible(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            className="border-b border-[#ded7cc] px-6 py-4"
            onClick={() => setVisible(false)}
          >
            VIEW STORE
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="border-b border-[#ded7cc] px-6 py-4 text-left font-semibold text-[#7d263d]"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
