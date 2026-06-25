import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrderConfirmationView from './components/OrderConfirmationView';
import WishlistView from './components/WishlistView';
import ProductDetailsView from './components/ProductDetailsView';
import AuthView from './components/AuthView';
import OrdersView from './components/OrdersView';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';
import { motion } from 'motion/react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

const BACKGROUND_ORBS = [
  {
    id: 1,
    className: "absolute top-[-15%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-emerald-400/35 via-teal-300/20 to-transparent blur-[110px]",
    animate: {
      x: [0, 80, -40, 0],
      y: [0, -100, 60, 0],
      scale: [1, 1.25, 0.85, 1],
      rotate: [0, 90, -90, 0],
    },
    duration: 35
  },
  {
    id: 2,
    className: "absolute bottom-[-15%] right-[-15%] w-[85vw] h-[85vw] rounded-full bg-gradient-to-tr from-amber-200/25 via-emerald-300/20 to-transparent blur-[130px]",
    animate: {
      x: [0, -90, 50, 0],
      y: [0, 70, -80, 0],
      scale: [1, 0.8, 1.25, 1],
      rotate: [0, -60, 60, 0],
    },
    duration: 40
  },
  {
    id: 3,
    className: "absolute top-[35%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-l from-teal-300/25 via-cyan-200/20 to-transparent blur-[100px]",
    animate: {
      x: [0, -50, 40, 0],
      y: [0, 80, -50, 0],
      scale: [0.9, 1.15, 0.9, 0.9],
    },
    duration: 30
  },
  {
    id: 4,
    className: "absolute bottom-[30%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-r from-emerald-300/25 via-amber-100/15 to-transparent blur-[120px]",
    animate: {
      x: [0, 60, -30, 0],
      y: [0, -50, 70, 0],
      scale: [1.1, 0.9, 1.1, 1.1],
    },
    duration: 45
  }
];

const FLOATING_PARTICLES = Array.from({ length: 18 }, (_, idx) => ({
  id: idx,
  size: Math.floor(Math.random() * 8) + 4, // 4px to 12px
  x: Math.random() * 100, // 0 to 100%
  y: Math.random() * 100, // 0 to 100%
  duration: Math.random() * 15 + 15, // 15s to 30s
  delay: Math.random() * -30, // negative delay so they show immediately
  opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 opacity
}));

function AppContent() {
  const { currentTab, navigateTo, clearCart, setLastOrder, saveOrderToFirestore } = useApp();
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return sessionStorage.getItem('wecare_banner_dismissed') === 'true';
  });

  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const transactionUuid = params.get('transaction_uuid');
    
    if (paymentStatus === 'esewa-success') {
      // Clear URL query parameters cleanly
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      const pendingStr = localStorage.getItem('wecare_pending_order');
      if (pendingStr) {
        try {
          const pendingOrder = JSON.parse(pendingStr);
          
          const processOrder = async () => {
            try {
              const txToken = `ESW-TOK-${Math.floor(100000 + Math.random() * 900000)}`;
              const verifiedId = await saveOrderToFirestore({
                name: pendingOrder.name,
                email: pendingOrder.email,
                phone: pendingOrder.phone,
                address: pendingOrder.address,
                paymentMethod: pendingOrder.paymentMethod,
                items: pendingOrder.items,
                total: pendingOrder.total,
                date: pendingOrder.date,
                deliveryDate: pendingOrder.deliveryDate,
                location: pendingOrder.location,
                paymentStatus: 'Paid',
                transactionId: txToken
              });

              setLastOrder({
                name: pendingOrder.name,
                email: pendingOrder.email,
                phone: pendingOrder.phone,
                address: pendingOrder.address,
                paymentMethod: pendingOrder.paymentMethod,
                items: pendingOrder.items,
                total: pendingOrder.total,
                date: pendingOrder.date,
                deliveryDate: pendingOrder.deliveryDate,
                location: pendingOrder.location,
                paymentStatus: 'Paid',
                transactionId: txToken,
                id: verifiedId
              });

              clearCart();
              sessionStorage.removeItem('wecare_coupon_applied');
              localStorage.removeItem('wecare_pending_order');
              
              setPaymentSuccessMsg("Your eSewa payment was secured and verified successfully!");
              navigateTo('order-confirmation');
            } catch (err: any) {
              console.error("eSewa order saving failed:", err);
              setPaymentErrorMsg("Payment succeeded, but order creation failed: " + err.message);
            }
          };
          processOrder();
        } catch (e) {
          console.error("Error parsing pending order:", e);
        }
      }
    } else if (paymentStatus === 'esewa-failure') {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      localStorage.removeItem('wecare_pending_order');
      setPaymentErrorMsg("The eSewa transaction was cancelled or declined.");
      navigateTo('checkout');
    }
  }, []);

  const dismissBanner = () => {
    sessionStorage.setItem('wecare_banner_dismissed', 'true');
    setBannerDismissed(true);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'wishlist':
        return <WishlistView />;
      case 'product-details':
        return <ProductDetailsView />;
      case 'auth':
        return <AuthView />;
      case 'orders':
        return <OrdersView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/30 text-neutral-800 font-sans antialiased selection:bg-emerald-500/10 selection:text-emerald-700 relative overflow-hidden">
      
      {/* Toast Notifications */}
      {paymentSuccessMsg && (
        <div id="payment-toast-success" className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500 animate-slide-in">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{paymentSuccessMsg}</span>
          <button type="button" onClick={() => setPaymentSuccessMsg(null)} className="ml-2 hover:text-emerald-200 cursor-pointer">✕</button>
        </div>
      )}
      {paymentErrorMsg && (
        <div id="payment-toast-error" className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-rose-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2 border border-rose-500 animate-slide-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{paymentErrorMsg}</span>
          <button type="button" onClick={() => setPaymentErrorMsg(null)} className="ml-2 hover:text-rose-200 cursor-pointer">✕</button>
        </div>
      )}
      
      {/* Dynamic Animated Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b9810f_1px,transparent_1px)] [background-size:20px_20px] opacity-75" />
        
        {/* Luminous Moving Orbs */}
        {BACKGROUND_ORBS.map((orb) => (
          <motion.div
            key={orb.id}
            animate={orb.animate}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={orb.className}
          />
        ))}

        {/* Small rising shiny particles */}
        {FLOATING_PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: "110%", x: `${particle.x}%`, opacity: 0 }}
            animate={{
              y: "-10%",
              opacity: [0, particle.opacity, particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full bg-emerald-400/35 blur-[0.5px]"
            style={{
              width: particle.size,
              height: particle.size,
              left: 0,
            }}
          />
        ))}
      </div>
      
      {/* Premium Notification Banner bar */}
      {!bannerDismissed && (
        <motion.div 
          id="pdp-notification-banner" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-neutral-900 border-b border-neutral-800 text-white py-2.5 select-none overflow-hidden relative flex items-center justify-between"
        >
          <div className="flex-1 overflow-hidden relative">
            {/* Desktop View (Centered, Static) */}
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest px-12 leading-none">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Grand Opening savings: Use code <span className="font-bold text-emerald-400 font-mono">WECARE10</span> at checkout for 10% off • Free premium US logistics above $50</span>
            </div>

            {/* Mobile View (Auto-scrolling marquee for smaller screens) */}
            <div className="sm:hidden flex items-center w-full relative overflow-hidden h-4 px-10">
              <motion.div 
                className="flex whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  ease: "linear",
                  duration: 18,
                  repeat: Infinity,
                }}
              >
                <div className="flex items-center gap-1.5 pr-8 shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Grand Opening savings: Use code <span className="font-bold text-emerald-400 font-mono">WECARE10</span> at checkout for 10% off • Free premium US logistics above $50</span>
                </div>
                <div className="flex items-center gap-1.5 pr-8 shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Grand Opening savings: Use code <span className="font-bold text-emerald-400 font-mono">WECARE10</span> at checkout for 10% off • Free premium US logistics above $50</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Dismiss button */}
          <button 
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss banner"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-full cursor-pointer z-10"
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </motion.div>
      )}

      <Navbar />
      
      {/* Content Injection Main Area */}
      <main className="flex-1 w-full flex flex-col">
        {renderActiveView()}
      </main>

      <Footer />
      
      {/* Universal Quick View dialog trigger */}
      <QuickViewModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
