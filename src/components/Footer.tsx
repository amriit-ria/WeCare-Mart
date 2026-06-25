import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, ShieldCheck, Heart, MessageCircle } from 'lucide-react';

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function Footer() {
  const { navigateTo, setSelectedCategory } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const shopCategory = (category: string) => {
    setSelectedCategory(category);
    navigateTo('shop');
  };

  return (
    <footer id="main-footer" className="bg-neutral-900 text-neutral-400">
      
      {/* Upper Brand Promo Area */}
      <div className="border-b border-neutral-800 bg-neutral-950/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-5 mb-6">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">Trusted Wellness Experience</span>
            <a
              id="footer-whatsapp-promo"
              href="https://wa.me/9779767992718"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-10 w-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/50 rounded-full p-2.5 transition-all duration-300 shrink-0 shadow-sm hover:scale-110"
              title="Chat on WhatsApp (+977 9767992718)"
            >
              <div className="relative flex items-center justify-center">
                <WhatsAppIcon className="h-5 w-5 fill-emerald-400 text-neutral-900 shrink-0" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
                <p className="text-xs text-neutral-500">256-bit SSL encrypted transactions.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400">
                <Send className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Express Delivery</h4>
                <p className="text-xs text-neutral-500">Free priority shipping on orders over $50.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400">
                <HelpCircle className="h-6 w-6" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Dedicated Care</h4>
                <p className="text-xs text-neutral-500">Always here to support your healthy lifestyle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 md:grid-cols-2">
          
          {/* Column 1: Brand Brand info */}
          <div className="flex flex-col gap-4">
            <button
              id="footer-logo"
              className="flex items-center gap-2 text-xl font-black text-white text-left self-start"
              onClick={() => navigateTo('home')}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-mono">W</span>
              <span>WeCare<span className="text-emerald-500">Mart</span></span>
            </button>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Providing thoughtfully curated, eco-safe, premium products that support healthy, balanced, modern lifestyles. We believe wellness is a daily journey.
            </p>
          </div>

          {/* Column 2: Quick Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <button id="footer-link-home" onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors">Home Dashboard</button>
              </li>
              <li>
                <button id="footer-link-shop" onClick={() => { setSelectedCategory(null); navigateTo('shop'); }} className="hover:text-emerald-400 transition-colors">Complete Catalog</button>
              </li>
              <li>
                <button id="footer-link-about" onClick={() => navigateTo('about')} className="hover:text-emerald-400 transition-colors">Our Vision & Mission</button>
              </li>
              <li>
                <button id="footer-link-contact" onClick={() => navigateTo('contact')} className="hover:text-emerald-400 transition-colors">Get In Touch</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">Core Departments</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <button id="footer-cat-electronics" onClick={() => shopCategory('Electronics')} className="hover:text-emerald-400 transition-colors text-left">Advanced Electronics</button>
              </li>
              <li>
                <button id="footer-cat-fashion" onClick={() => shopCategory('Fashion')} className="hover:text-emerald-400 transition-colors text-left">Sustainable Fashion</button>
              </li>
              <li>
                <button id="footer-cat-home" onClick={() => shopCategory('Home & Kitchen')} className="hover:text-emerald-400 transition-colors text-left">Modernist Kitchen & Home</button>
              </li>
              <li>
                <button id="footer-cat-beauty" onClick={() => shopCategory('Beauty')} className="hover:text-emerald-400 transition-colors text-left">Botanical & Beauty Care</button>
              </li>
              <li>
                <button id="footer-cat-sports" onClick={() => shopCategory('Sports')} className="hover:text-emerald-400 transition-colors text-left">Ergonomic Sports Gear</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Premium Newsletter & Contacts */}
          <div className="flex flex-col gap-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Health & Savings Newsletter</h4>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                Unlock 10% off your first checkout, premium wellness tips, and exclusive new designs!
              </p>
              
              {/* Form */}
              <form onSubmit={handleSubscribe} className="relative w-full">
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  disabled={subscribed}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800 text-neutral-200 placeholder:text-neutral-500 text-xs rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-neutral-700 disabled:opacity-50"
                />
                <button
                  id="footer-email-submit"
                  type="submit"
                  disabled={subscribed}
                  className="absolute right-1 top-1 h-8 w-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all disabled:bg-emerald-800"
                  aria-label="Subscribe"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              {subscribed && (
                <div id="newsletter-success" className="mt-2.5 flex items-center gap-2 text-emerald-400 text-xs font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>Subscribed! Check your inbox for the 10% coupon.</span>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-800 pt-4 flex flex-col gap-2.5 text-xs">
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                <a href="mailto:amrititaula2022@gmail.com" className="hover:text-emerald-400 hover:underline transition-colors">
                  amrititaula2022@gmail.com
                </a>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <a href="tel:+9779767992718" className="hover:text-emerald-400 hover:underline transition-colors">
                  +977 9767992718
                </a>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                Dhumbarahi, Kathmandu, Nepal.
              </span>
            </div>
          </div>
        </div>

        {/* Lower copyright bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} WeCare Mart Inc. All rights reserved.
          </div>
          <div className="flex flex-col sm:items-end items-center gap-1">
            <div className="flex items-center gap-1.5 justify-center">
              <span>Crafted with</span>
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500 animate-pulse" />
              <span>for healthy and safe lifestyles.</span>
            </div>
            <div className="text-[10px] text-neutral-600 font-medium tracking-wide">
              Demo website by <span className="text-emerald-500 font-semibold">Amrit Sitaula</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
