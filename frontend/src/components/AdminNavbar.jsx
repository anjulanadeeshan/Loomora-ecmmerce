import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setVisible(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  return (
    <>
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
          className="grid h-10 w-10 place-items-center rounded-full bg-[#1d1a17] text-white transition hover:bg-[#7d263d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d263d] focus-visible:ring-offset-2"
          aria-label="Log out"
          title="Log out"
        >
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#ded7cc] sm:hidden"
          aria-label="Open admin menu"
          aria-expanded={visible}
        >
          <img src={assets.menu_icon} className="w-5" alt="" />
        </button>
      </div>
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
    </>
  );
};

export default AdminNavbar;
