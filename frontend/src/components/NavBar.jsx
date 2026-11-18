import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ShopContext from '../context/ShopContext.js'

const NavBar = () => {
  const [visible, setVisible] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { showSearch, setShowSearch, getCartCount, user, logout, navigate } = useContext(ShopContext)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const cartCount = getCartCount()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    setIsAdmin(Boolean(adminToken && adminUser))
  }, [location.pathname, user])

  useEffect(() => {
    setVisible(false)
  }, [location.pathname])

  const handleSearch = () => {
    if (location.pathname !== '/collection') {
      setShowSearch(true)
      navigate('/collection')
      return
    }
    setShowSearch(!showSearch)
  }

  const navLinkClass = `relative py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${
    isHome
      ? 'text-white/75 hover:text-white focus-visible:ring-white'
      : 'text-[#4f4943] hover:text-[#7d263d] focus-visible:ring-[#7d263d]'
  }`
  const iconButtonClass = `grid h-10 w-10 place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 ${
    isHome
      ? 'border-white/25 bg-black/15 text-white backdrop-blur hover:border-white/60 hover:bg-white/10 focus-visible:ring-white'
      : 'border-[#ded7cc] bg-white hover:border-[#7d263d] focus-visible:ring-[#7d263d]'
  }`
  const mobileLinkClass = 'mobile-nav-link rounded-2xl px-5 py-4 text-sm font-semibold tracking-[0.16em] transition-colors'

  return (
    <header className={`${isHome ? 'absolute border-white/15 bg-transparent' : 'fixed border-[#ded7cc]/80 bg-[#fffdf9]/90 backdrop-blur-xl'} inset-x-0 top-0 z-50 border-b`}>
      <div className='page-shell flex h-[88px] items-center justify-between gap-5'>
        <Link to='/' className='shrink-0' aria-label='Loomora home'>
          <img
            src={isHome ? assets.loomora_white : assets.loomora_black}
            className='h-10 w-auto object-contain sm:h-11'
            alt='Loomora'
          />
        </Link>

        <nav className='hidden items-center gap-7 md:flex lg:gap-9' aria-label='Primary navigation'>
          {[
            ['/', 'Home'],
            ['/collection', 'Collection'],
            ['/about', 'Our story'],
            ['/contact', 'Contact']
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
              <span className={`nav-indicator absolute inset-x-0 bottom-0 mx-auto h-px w-0 opacity-0 transition-all ${isHome ? 'bg-white' : 'bg-[#7d263d]'}`} />
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-2 sm:gap-3'>
          {isAdmin && (
            <Link
              to='/admin/dashboard'
              className={`hidden rounded-full px-4 py-2 text-[11px] font-semibold tracking-wider text-white lg:flex ${isHome ? 'border border-white/25 bg-white/10' : 'bg-[#1d1a17]'}`}
            >
              Admin
            </Link>
          )}

          <button type='button' onClick={handleSearch} className={iconButtonClass} aria-label='Search products'>
            <img src={assets.search_icon} className={`w-4 ${isHome ? 'brightness-0 invert' : ''}`} alt='' />
          </button>

          <Link
            to='/cart'
            className={`relative flex items-center transition focus-visible:outline-none focus-visible:ring-2 ${
              isHome
                ? 'h-10 gap-2 rounded-full border border-white/25 bg-black/15 px-4 text-white backdrop-blur hover:border-white/60 hover:bg-white/10 focus-visible:ring-white'
                : `${iconButtonClass} h-10 w-10`
            }`}
            aria-label='Shopping bag'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.75'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-[18px] h-[18px] shrink-0'
              aria-hidden='true'
            >
              <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' />
              <line x1='3' x2='21' y1='6' y2='6' />
              <path d='M16 10a4 4 0 0 1-8 0' />
            </svg>
            {isHome && <span className='text-xs font-semibold'>Bag</span>}
            {cartCount > 0 && <span className='absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#7d263d] px-1 text-[9px] text-white'>{cartCount}</span>}
          </Link>

          <div className='group relative'>
            <Link
              to={user ? '#' : '/login'}
              className={iconButtonClass}
              aria-label={user ? 'Account menu' : 'Sign in'}
              title={user ? 'Account' : 'Log in'}
            >
              <img
                src={assets.profile_icon}
                className={`w-4 ${isHome ? 'brightness-0 invert' : ''}`}
                alt=''
              />
            </Link>
            {user && (
              <div className='invisible absolute right-0 top-full pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100'>
                <div className='surface-card flex w-44 flex-col gap-1 p-3 text-sm text-[#746d65]'>
                  <p className='border-b border-[#ded7cc] px-2 pb-2 text-xs font-semibold text-[#1d1a17]'>{user.name}</p>
                  <button type='button' onClick={() => navigate('/orders')} className='rounded-lg px-2 py-2 text-left hover:bg-[#f3eee5] hover:text-[#7d263d]'>Orders</button>
                  <button type='button' onClick={logout} className='rounded-lg px-2 py-2 text-left hover:bg-[#f3eee5] hover:text-[#7d263d]'>Logout</button>
                </div>
              </div>
            )}
          </div>

          <button type='button' onClick={() => setVisible(true)} className={`${iconButtonClass} sm:hidden`} aria-label='Open menu'>
            <img src={assets.menu_icon} className={`w-4 ${isHome ? 'brightness-0 invert' : ''}`} alt='' />
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 bg-[#f8f5ef] transition-transform duration-500 sm:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!visible}>
        <div className='page-shell flex h-[88px] items-center justify-between border-b border-[#ded7cc]'>
          <img src={assets.loomora_black} className='h-10 w-auto object-contain' alt='Loomora' />
          <button type='button' onClick={() => setVisible(false)} className='grid h-11 w-11 place-items-center rounded-full border border-[#ded7cc] text-xl text-[#1d1a17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d263d]' aria-label='Close menu'>×</button>
        </div>
        <nav className='page-shell flex flex-col gap-3 pt-10 text-[#1d1a17]'>
          {[
            ['/', 'HOME'],
            ['/collection', 'COLLECTION'],
            ['/about', 'OUR STORY'],
            ['/contact', 'CONTACT']
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className={mobileLinkClass}>{label}</NavLink>
          ))}
          {user ? (
            <>
              <NavLink to='/orders' className={mobileLinkClass}>ORDERS</NavLink>
              <button type='button' onClick={() => { logout(); setVisible(false) }} className={`${mobileLinkClass} text-left`}>LOG OUT</button>
            </>
          ) : (
            <NavLink to='/login' className={mobileLinkClass}>ACCOUNT / SIGN IN</NavLink>
          )}
          {isAdmin && <NavLink to='/admin/dashboard' className={mobileLinkClass}>ADMIN DASHBOARD</NavLink>}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
