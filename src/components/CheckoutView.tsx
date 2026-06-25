import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../types';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import AuthView from './AuthView';

export default function CheckoutView() {
  const { cart, getCartTotal, clearCart, setLastOrder, navigateTo, user, saveOrderToFirestore, userProfile } = useApp();

  const [formData, setFormData] = useState({
    name: user?.displayName || userProfile?.name || '',
    email: user?.email || userProfile?.email || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    zipCode: userProfile?.zipCode || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || '',
    paymentMethod: 'Cash on Delivery'
  });

  const [loading, setLoading] = useState(false);
  const [errorBox, setErrorBox] = useState('');

  // Auto-prefill if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || userProfile?.name || user.displayName || '',
        email: prev.email || userProfile?.email || user.email || '',
        phone: prev.phone || userProfile?.phone || '',
        address: prev.address || userProfile?.address || '',
        city: prev.city || userProfile?.city || '',
        zipCode: prev.zipCode || userProfile?.zipCode || '',
        location: prev.location || userProfile?.location || ''
      }));
    }
  }, [user, userProfile]);

  const couponApplied = sessionStorage.getItem('wecare_coupon_applied') === 'true';

  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const discount = couponApplied ? subtotal * 0.10 : 0;
  const total = subtotal - discount + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBox('');

    if (!user) {
      setErrorBox('Please sign in or create an account to authorize secure orders.');
      return;
    }

    if (formData.phone.replace(/[^0-9]/g, '').length < 7) {
      setErrorBox('Provide a valid customer phone contact number.');
      return;
    }

    setLoading(true);

    try {
      const today = new Date();
      const delivery = new Date(today);
      delivery.setDate(today.getDate() + 3);

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const formattedDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
      const formattedDelivery = `${monthNames[delivery.getMonth()]} ${delivery.getDate()}, ${delivery.getFullYear()}`;

      const destinationAddress = `${formData.address}, ${formData.city}, ${formData.zipCode.toUpperCase()}`;
      
      const randToken = Math.random().toString(36).substring(2, 10).toUpperCase();
      const token = `TXN-${randToken}`;

      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: destinationAddress,
        paymentMethod: formData.paymentMethod,
        items: [...cart],
        total: total,
        date: formattedDate,
        deliveryDate: formattedDelivery,
        location: formData.location,
        paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Under Review',
        status: 'Placed',
        transactionId: token
      };

      const orderId = await saveOrderToFirestore(orderData);

      setLastOrder({
        id: orderId,
        ...orderData
      });

      clearCart();
      sessionStorage.removeItem('wecare_coupon_applied');
      navigateTo('order-confirmation');
    } catch (err: any) {
      console.error(err);
      setErrorBox(err.message || 'An error occurred while compiling your check-out order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigateTo('cart');
    return null;
  }

  // Force Sign-In / Registration before checkout
  if (!user) {
    return (
      <div id="checkout-auth-boundary" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <button 
          id="checkout-back-to-cart"
          onClick={() => navigateTo('cart')}
          className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Basket
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: friendly security explanation & Auth interface */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-black text-emerald-950 tracking-tight">Account Required for Checkout</h2>
              <p className="text-xs text-emerald-800 leading-relaxed mt-2">
                At WeCare Mart, we route and protect all checkout transactions using verified customer profiles. 
                Registering is completely free and allows you to track orders and log your premium item history.
              </p>
            </div>

            {/* Render direct login forms here inline for seamless action! */}
            <div className="border border-neutral-100 rounded-2xl bg-white shadow-sm overflow-hidden p-2">
              {/* Force redirect back to checkout after auth */}
              {sessionStorage.setItem('wecare_auth_redirect', 'checkout')}
              <AuthView />
            </div>
          </div>

          {/* Right Column: Mini Bill Invoice so they see what they are buying */}
          <div className="lg:col-span-5">
            <div className="border border-neutral-150 bg-neutral-50/40 rounded-2xl p-6">
              <h2 className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-4">
                Your Pending Basket
              </h2>
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto mb-4 border-b border-neutral-150/50 pb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between gap-3 text-xs">
                    <span className="font-semibold text-neutral-600 flex gap-1.5 truncate">
                      <span className="text-neutral-400 font-mono">x{item.quantity}</span> 
                      <span className="truncate">{item.product.name}</span>
                    </span>
                    <span className="font-mono text-neutral-800 font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Subtotal:</span>
                <span className="text-lg font-black text-neutral-800 font-sans">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Authenticated user Checkout
  return (
    <div id="checkout-page-wrapper" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      
      <button 
        id="checkout-back-to-cart"
        onClick={() => navigateTo('cart')}
        className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Basket
      </button>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Secure Checkout</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Logged in as <span className="font-semibold text-emerald-700">{user.displayName || user.email}</span>
          </p>
        </div>
      </div>

      {errorBox && (
        <div id="checkout-validation-error" className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2 max-w-3xl">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorBox}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Column: Delivery coordinates */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-5">
              Delivery & Contact Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="checkout-name" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
                <input
                  id="checkout-name"
                  type="text"
                  name="name"
                  required
                  disabled={loading}
                  placeholder="John H. Watson"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="checkout-email" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                <input
                  id="checkout-email"
                  type="email"
                  name="email"
                  required
                  disabled={loading}
                  placeholder="john.watson@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="checkout-address" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Destination Address</label>
                <input
                  id="checkout-address"
                  type="text"
                  name="address"
                  required
                  disabled={loading}
                  placeholder="221B Baker Street, Flat 2"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="checkout-city" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Town / City</label>
                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  required
                  disabled={loading}
                  placeholder="London"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="checkout-zipCode" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Postal ZIP Code</label>
                <input
                  id="checkout-zipCode"
                  type="text"
                  name="zipCode"
                  required
                  disabled={loading}
                  placeholder="NW1 6XE"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white font-mono uppercase"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="checkout-phone" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Contact Number</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  name="phone"
                  required
                  disabled={loading}
                  placeholder="+44 7911 123456"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white font-mono"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="checkout-location" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Separate Physical Location / Coordinates</label>
                <input
                  id="checkout-location"
                  type="text"
                  name="location"
                  disabled={loading}
                  placeholder="e.g. London, NW1 6XE or customized coordinates"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white font-medium"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-sans">Payment Option</span>
                <div className="rounded-lg border border-neutral-150 px-3 py-2.5 text-xs bg-neutral-50 font-bold text-emerald-800 flex items-center gap-2 select-none">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>Cash on Delivery (Pay on Receipt)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Invoice Receipt */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border border-neutral-150 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-5">
              Review Invoice
            </h2>

            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto border-b border-neutral-100 pb-5 pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between gap-3 text-xs">
                  <div className="flex gap-2 min-w-0">
                    <span className="font-bold text-neutral-400 font-mono">x{item.quantity}</span>
                    <span className="font-semibold text-neutral-700 truncate">{item.product.name}</span>
                  </div>
                  <span className="font-mono text-neutral-800 shrink-0 font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3.5 border-b border-neutral-100 py-5 text-xs text-neutral-500">
              <div className="flex justify-between items-center">
                <span>Subtotal Invoice</span>
                <span className="font-semibold text-neutral-800">{formatPrice(subtotal)}</span>
              </div>
              
              {couponApplied && (
                <div className="flex justify-between items-center text-emerald-600 font-semibold">
                  <span>Coupon WECARE10 Applied</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Express Shipping Fee</span>
                {shipping === 0 ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Free Delivery</span>
                ) : (
                  <span className="font-semibold text-neutral-800">{formatPrice(shipping)}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-5 pb-6">
              <span className="text-sm font-bold text-neutral-800">Final Billing Amount</span>
              <span className="text-xl font-black text-emerald-950">{formatPrice(total)}</span>
            </div>

            <button
              id="checkout-submit-order"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl text-white font-extrabold py-4 px-6 text-xs transition-all shadow-md disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed uppercase tracking-wider bg-[#0551a5] hover:bg-[#04438b] active:scale-[0.98]"
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Place Order • {formatPrice(total)}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 justify-center text-[9px] text-neutral-400 font-semibold uppercase mt-4 text-center leading-relaxed font-sans">
              <span>Securely managed under your verified Account. No real transactions occur.</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
