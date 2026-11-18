import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/frontend_assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import ShopContext from "../context/ShopContext.js";
const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {showSearch, setShowSearch, getCartCount, user, logout, navigate} = useContext(ShopContext);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, []);

  const navLinkClass = "relative py-2 text-[11px] font-semibold tracking-[0.18em] text-[#4f4943] transition-colors hover:text-[#7d263d]";
  const mobileLinkClass = "mobile-nav-link rounded-2xl px-5 py-4 text-sm font-semibold tracking-[0.16em] transition-colors";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ded7cc]/80 bg-[#fffdf9]/90 backdrop-blur-xl">
      <div className="page-shell flex h-[76px] items-center justify-between gap-5">
        <Link to="/" className="shrink-0" aria-label="Loomora home">
          <img src={assets.loomora_logo} className="h-14 w-32 object-contain" alt="Loomora" />
        </Link>

        <nav className="hidden items-center gap-8 rounded-full border border-[#ded7cc] bg-white/70 px-8 sm:flex">
          {[
            ['/', 'Home'],
            ['/collection', 'Collection'],
            ['/about', 'Our story'],
            ['/contact', 'Contact']
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
              <span className="nav-indicator absolute inset-x-0 bottom-0 mx-auto h-px w-0 bg-[#7d263d] opacity-0 transition-all" />
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <Link to="/admin/dashboard" className="hidden rounded-full bg-[#1d1a17] px-4 py-2 text-[11px] font-semibold tracking-wider text-white lg:flex">
              Admin
            </Link>
          )}
          <button onClick={() => setShowSearch(!showSearch)} className="grid h-10 w-10 place-items-center rounded-full border border-[#ded7cc] bg-white transition hover:border-[#7d263d]" aria-label="Search products">
            <img src={assets.search_icon} className="w-4" alt="" />
          </button>
          <div className="group relative">
            <Link to={user ? '#' : '/login'} className="grid h-10 w-10 place-items-center rounded-full border border-[#ded7cc] bg-white transition hover:border-[#7d263d]" aria-label={user ? 'Account menu' : 'Sign in'}>
              <img src={assets.profile_icon} className="w-4" alt="" />
            </Link>
            {user && (
              <div className="invisible absolute right-0 top-full pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="surface-card flex w-44 flex-col gap-1 p-3 text-sm text-[#746d65]">
                  <p className="border-b border-[#ded7cc] px-2 pb-2 text-xs font-semibold text-[#1d1a17]">{user.name}</p>
                  <button onClick={() => navigate('/orders')} className="rounded-lg px-2 py-2 text-left hover:bg-[#f3eee5] hover:text-[#7d263d]">Orders</button>
                  <button onClick={logout} className="rounded-lg px-2 py-2 text-left hover:bg-[#f3eee5] hover:text-[#7d263d]">Logout</button>
                </div>
              </div>
            )}
          </div>
          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full border border-[#ded7cc] bg-white transition hover:border-[#7d263d]" aria-label="Shopping bag">
            <img src={assets.cart_icon} className="w-4" alt="" />
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#7d263d] px-1 text-[9px] text-white">{getCartCount()}</span>
          </Link>
          <button onClick={() => setVisible(true)} className="grid h-10 w-10 place-items-center rounded-full border border-[#ded7cc] bg-white sm:hidden" aria-label="Open menu">
            <img src={assets.menu_icon} className="w-4" alt="" />
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 bg-[#f8f5ef] transition-transform duration-500 sm:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="page-shell flex h-[76px] items-center justify-between border-b border-[#ded7cc]">
          <span className="display-font text-2xl">Loomora</span>
          <button onClick={() => setVisible(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#ded7cc]" aria-label="Close menu">×</button>
        </div>
        <nav className="page-shell flex flex-col gap-3 pt-10 text-[#1d1a17]">
          {[
            ['/', 'HOME'],
            ['/collection', 'COLLECTION'],
            ['/about', 'OUR STORY'],
            ['/contact', 'CONTACT']
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className={mobileLinkClass} onClick={() => setVisible(false)}>{label}</NavLink>
          ))}
          {isAdmin && <NavLink to="/admin/dashboard" className={mobileLinkClass} onClick={() => setVisible(false)}>ADMIN DASHBOARD</NavLink>}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
