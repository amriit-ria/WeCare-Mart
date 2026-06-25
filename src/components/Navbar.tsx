import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, Search, Menu, X, ArrowRight, User, LogOut, Package, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { 
    currentTab, 
    navigateTo, 
    getCartCount, 
    wishlist, 
    searchQuery, 
    setSearchQuery,
    user,
    logout,
    isDemoMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const navLinks = [
    { label: 'Home', tab: 'home' as const },
    { label: 'Shop All', tab: 'shop' as const },
    { label: 'Our Story', tab: 'about' as const },
    { label: 'Contact Us', tab: 'contact' as const },
    ...(user ? [
      { label: 'My Orders', tab: 'orders' as const },
      { label: 'My Profile', tab: 'profile' as const }
    ] : []),
    ...((user?.email === 'sitaula.ramchandra1@gmail.com' || user?.email === 'amritsitaula2022@gmail.com') ? [
      { label: 'Admin Portal', tab: 'admin' as const }
    ] : [])
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('shop');
    setSearchOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full glassmorphism transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <button 
            id="logo-button"
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-neutral-900 group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-105">
              <svg className="h-5 w-5 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35 50 C35 35 45 35 50 25 C55 35 65 35 65 50 C65 65 55 65 50 75 C45 65 35 65 35 50 Z" fill="white" opacity="0.3" />
                <path d="M50 32 V68 M32 50 H68" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-sans flex items-center gap-1.5">
              <span>WeCare<span className="text-emerald-600">Mart</span></span>
              {isDemoMode && !user && (
                <span className="text-[9px] bg-amber-100 text-amber-805 font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                  Sandbox
                </span>
              )}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                id={`nav-${link.tab}`}
                key={link.tab}
                onClick={() => navigateTo(link.tab)}
                className={`relative py-2 text-sm font-medium transition-colors hover:text-emerald-600 ${
                  currentTab === link.tab ? 'text-emerald-600' : 'text-neutral-600'
                }`}
              >
                {link.label}
                {currentTab === link.tab && (
                  <motion.span 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-600"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Inline Desktop Search Container */}
            <div className="relative hidden lg:block w-64">
              <form onSubmit={handleSearchSubmit}>
                <input
                  id="navbar-search-input"
                  type="text"
                  placeholder="Search premium products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (currentTab !== 'shop') {
                      navigateTo('shop');
                    }
                  }}
                  className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 pl-10 text-xs outline-none transition-all placeholder:text-neutral-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                />
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              </form>
            </div>

            {/* Tap Search Icon (For tablet/mobile or small screens) */}
            <button 
              id="mobile-search-toggle"
              onClick={() => {
                setSearchOpen(!searchOpen);
                navigateTo('shop');
              }}
              className="p-2 text-neutral-600 hover:text-emerald-600 rounded-full hover:bg-neutral-100 lg:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button
              id="navbar-wishlist-button"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 text-neutral-600 hover:text-emerald-600 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State Widget */}
            {user ? (
              <div className="relative group/user flex items-center">
                <button
                  id="navbar-profile-button"
                  onClick={() => navigateTo('profile')}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] ring-2 ring-emerald-500/20 hover:ring-emerald-500 transition-all cursor-pointer shadow-sm"
                  title={`Logged in as ${user.displayName || user.email}`}
                >
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </button>
                <div className="absolute right-0 top-full mt-2 hidden group-hover/user:flex flex-col bg-white border border-neutral-150 rounded-xl shadow-lg py-2 w-48 text-left z-50">
                  <div className="px-4 py-1.5 border-b border-neutral-100 mb-1.5">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Signed In As</p>
                    <p className="text-xs font-bold text-neutral-800 truncate">{user.displayName || user.email}</p>
                    {(user?.email === 'sitaula.ramchandra1@gmail.com' || user?.email === 'amritsitaula2022@gmail.com') && (
                      <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">Admin</span>
                    )}
                  </div>
                  {(user?.email === 'sitaula.ramchandra1@gmail.com' || user?.email === 'amritsitaula2022@gmail.com') && (
                    <button
                      onClick={() => navigateTo('admin')}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 bg-emerald-50/20 transition-colors text-left border-b border-neutral-100 pb-2 mb-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Admin Control Panel</span>
                    </button>
                  )}
                  <button
                    onClick={() => navigateTo('profile')}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-neutral-50 text-neutral-600 hover:text-emerald-700 transition-colors text-left"
                  >
                    <User className="h-3.5 w-3.5 text-neutral-400" />
                    <span>My Account Profile</span>
                  </button>
                  <button
                    onClick={() => navigateTo('orders')}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-neutral-50 text-neutral-600 hover:text-emerald-700 transition-colors text-left"
                  >
                    <Package className="h-3.5 w-3.5 text-neutral-400" />
                    <span>My Order History</span>
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      navigateTo('home');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-rose-50 text-rose-600 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="navbar-auth-link"
                onClick={() => navigateTo('auth')}
                className={`p-2 rounded-full hover:bg-neutral-100 text-neutral-650 hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer`}
                aria-label="Account Access"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline font-bold tracking-tight text-[11px]">Sign In</span>
              </button>
            )}

            {/* Cart */}
            <button
              id="navbar-cart-button"
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-neutral-600 hover:text-emerald-600 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-600 hover:text-emerald-600 rounded-full hover:bg-neutral-100 transition-colors md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide down Search Bar for Non-Laptop monitors */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            id="mobile-search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-100 bg-white lg:hidden overflow-hidden"
          >
            <div className="px-4 py-3 mx-auto max-w-7xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  id="mobile-search-input"
                  type="text"
                  placeholder="What can we find for you today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2 pl-10 text-sm outline-none focus:border-emerald-500"
                />
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-100 bg-neutral-50/50">
              <span className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35 50 C35 35 45 35 50 25 C55 35 65 35 65 50 C65 65 55 65 50 75 C45 65 35 65 35 50 Z" fill="white" opacity="0.3" />
                    <path d="M50 32 V68 M32 50 H68" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                  </svg>
                </span>
                <span>WeCare Menu</span>
              </span>
              <button
                id="close-mobile-drawer"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-600 rounded-full hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              {/* Mobile Search input */}
              <div className="w-full">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Product Search</p>
                <div id="drawer-search-container" className="relative">
                  <input
                    id="drawer-search-input"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 px-3 py-2 pl-9 text-xs outline-none focus:border-emerald-500"
                  />
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Navigation</p>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <button
                      id={`drawer-nav-${link.tab}`}
                      key={link.tab}
                      onClick={() => {
                        navigateTo(link.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left text-lg font-medium py-1.5 transition-colors flex items-center justify-between group ${
                        currentTab === link.tab ? 'text-emerald-600' : 'text-neutral-700 hover:text-emerald-600'
                      }`}
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-600" />
                    </button>
                  ))}
                </nav>
              </div>

              <div id="drawer-quick-stats" className="mt-auto border-t border-neutral-100 pt-6">
                {user ? (
                  <div className="bg-neutral-50 rounded-xl p-3 mb-5 border border-neutral-150 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-150 text-emerald-800 font-extrabold text-[10px]">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight font-sans">Active session</p>
                        <p className="text-xs font-bold text-neutral-850 truncate">{user.displayName || user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await logout();
                        navigateTo('home');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-1.5 border border-rose-200 hover:bg-rose-50 rounded-lg text-[11px] font-bold text-rose-600 transition-colors uppercase tracking-wider mt-1 cursor-pointer"
                    >
                      Sign Out Session
                    </button>
                  </div>
                ) : (
                  <div className="mb-5 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        navigateTo('auth');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2.5 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-xs font-extrabold text-white transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>Sign In / Create Account</span>
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4 text-xs text-neutral-400 font-semibold tracking-wider uppercase">
                  <span>Current Wishlist</span>
                  <span className="bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full">{wishlistCount} Items</span>
                </div>
                <button
                  id="drawer-view-wishlist"
                  onClick={() => {
                    navigateTo('wishlist');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition-all mb-3"
                >
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500/25" /> View Wishlist
                </button>
                <button
                  id="drawer-view-cart"
                  onClick={() => {
                    navigateTo('cart');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/15"
                >
                  <ShoppingBag className="h-4 w-4" /> View Cart ({cartCount})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
