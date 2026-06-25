import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../types';
import { ShoppingBag, ChevronRight, Minimize2, Trash2, ArrowLeft, Ticket, Check, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CartView() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    navigateTo, 
    setSelectedCategory 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = couponCode.trim().toUpperCase();
    if (formatted === 'WECARE10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponError('This coupon code is incorrect or expired. Try "WECARE10"!');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
  };

  const subtotal = getCartTotal();
  // Free shipping on orders over $50, otherwise $5.99
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5.99;
  const discount = couponApplied ? subtotal * 0.10 : 0;
  const total = subtotal - discount + shipping;

  const handleGoToCheckout = () => {
    // If discount was applied, let's keep track of coupon inside sessionStorage if we want, or just rely on state
    if (couponApplied) {
      sessionStorage.setItem('wecare_coupon_applied', 'true');
    } else {
      sessionStorage.removeItem('wecare_coupon_applied');
    }
    navigateTo('checkout');
  };

  if (cart.length === 0) {
    return (
      <div id="cart-empty-view" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center pb-24">
        <div className="max-w-md mx-auto bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200 p-8 sm:p-12 flex flex-col items-center justify-center shadow-inner">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-6">
            <ShoppingBag className="h-8 w-8 text-neutral-400" />
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            Before setting off to checkout, you must add some premium wellness items to your shopping cart basket.
          </p>
          <button
            id="cart-empty-shop-now"
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 text-sm transition-all shadow-md active:scale-95"
          >
            <span>Start Shopping All Products</span>
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page-wrapper" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      
      <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-8">Shopping Basket</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Grid Area: Basket Item List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="border border-neutral-150 bg-white rounded-2xl overflow-hidden shadow-sm">
            
            {/* Table Header Details (Desktop Only) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4.5 bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none">
              <span className="col-span-6">Product Details</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Sum</span>
            </div>

            {/* List */}
            <div className="divide-y divide-neutral-100">
              {cart.map((item) => (
                <div 
                  id={`cart-item-row-${item.product.id}`}
                  key={item.product.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-5 sm:p-6 items-center"
                >
                  
                  {/* Photo & Titles Column */}
                  <div className="col-span-1 sm:col-span-6 flex gap-4">
                    <button 
                      onClick={() => navigateTo('product-details', item.product.id)}
                      className="h-20 w-20 rounded-xl overflow-hidden shrink-0 border border-neutral-150/60 bg-neutral-50 transition-transform hover:scale-102 cursor-pointer"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center" 
                      />
                    </button>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1">{item.product.category}</span>
                      <button 
                        onClick={() => navigateTo('product-details', item.product.id)}
                        className="text-left text-sm font-bold text-neutral-800 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </button>
                      <span className="text-xs text-neutral-400 mt-1 font-mono">Stock level: {item.product.stock} available</span>
                      
                      {/* Mobile action button */}
                      <button
                        id={`cart-mobile-remove-${item.product.id}`}
                        onClick={() => removeFromCart(item.product.id)}
                        className="flex sm:hidden items-center gap-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors w-fit mt-3 active:scale-95 border border-rose-100 bg-rose-50 px-2.5 py-1 rounded-md"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Unit Price Column */}
                  <div className="hidden sm:flex col-span-2 flex-col items-center justify-center">
                    <span className="text-sm font-semibold text-neutral-800 font-sans">{formatPrice(item.product.price)}</span>
                    {item.product.originalPrice && (
                      <span className="text-[11px] text-neutral-400 line-through font-mono mt-0.5">{formatPrice(item.product.originalPrice)}</span>
                    )}
                  </div>

                  {/* Quantity Ticker Column */}
                  <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-center gap-4">
                    <span className="text-xs font-semibold text-neutral-400 uppercase sm:hidden">Qty Selected</span>
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                      <button
                        id={`cart-qty-decrease-${item.product.id}`}
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-neutral-800">{item.quantity}</span>
                      <button
                        id={`cart-qty-increase-${item.product.id}`}
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition-colors disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pricing Sum Column + Desktop Delete action */}
                  <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 border-t border-dashed border-neutral-100 pt-3 sm:pt-0 sm:border-0">
                    <span className="text-xs font-semibold text-neutral-400 uppercase sm:hidden">Total Item Price</span>
                    <div className="flex sm:flex-col items-end gap-3 sm:gap-0">
                      <span className="text-sm font-black text-neutral-900 font-sans">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      
                      {/* Desktop Remove Button */}
                      <button
                        id={`cart-remove-${item.product.id}`}
                        onClick={() => removeFromCart(item.product.id)}
                        className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-rose-500 transition-colors mt-1 active:scale-95 cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

          <button
            id="back-to-catalog"
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors w-fit p-1"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping For Products
          </button>
        </div>

        {/* Right Grid Area: Pricing calculations Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-neutral-150 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-5">
              Order Summary
            </h2>

            {/* Price Calculations breakdown */}
            <div className="flex flex-col gap-3.5 border-b border-neutral-100 pb-5 text-sm">
              <div className="flex justify-between items-center text-neutral-500">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-neutral-800 font-sans">{formatPrice(subtotal)}</span>
              </div>
              
              {couponApplied && (
                <div id="coupon-disclaimer" className="flex justify-between items-center text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <span className="flex items-center gap-1"><Ticket className="h-3.5 w-3.5 shrink-0" /> Promo WECARE10 (-10%)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">-{formatPrice(discount)}</span>
                    <button
                      id="remove-coupon-badge"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] uppercase font-black tracking-widest text-neutral-400 hover:text-neutral-700 underline shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-neutral-500">
                <span>Priority Logistics (Shipping)</span>
                {shipping === 0 ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">Free Priority Delivery</span>
                ) : (
                  <span className="font-semibold text-neutral-800 font-sans">{formatPrice(shipping)}</span>
                )}
              </div>

              {shipping > 0 && (
                <p className="text-[10px] text-neutral-400 bg-neutral-50 border border-neutral-200/50 p-2.5 rounded-lg leading-relaxed">
                  💡 Add <span className="font-bold text-neutral-600 font-mono">{formatPrice(50 - subtotal)}</span> more to unlock free priority express delivery.
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-5 pb-6">
              <span className="text-sm font-bold text-neutral-800">Aggregate Total</span>
              <span className="text-xl font-black text-neutral-950 font-sans">{formatPrice(total)}</span>
            </div>

            {/* Checkout handles */}
            <button
              id="proceed-to-checkout"
              onClick={handleGoToCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 text-sm transition-all shadow-md shadow-emerald-500/15 group active:scale-95 hover:shadow-lg"
            >
              <span>Secure Direct checkout</span>
              <ChevronRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="flex items-center gap-2 justify-center text-[10px] text-neutral-400 font-semibold uppercase mt-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>SSL Secure checked environment</span>
            </div>
          </div>

          {/* Interactive Promo Coupon Application form */}
          {!couponApplied && (
            <div className="border border-neutral-150 bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-extrabold text-neutral-950 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Ticket className="h-4 w-4 text-emerald-600" /> Have a Coupon Code?
              </h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  id="cart-coupon-input"
                  type="text"
                  placeholder='Try "WECARE10"'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-250 bg-neutral-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white uppercase text-center font-mono font-bold tracking-wider"
                />
                <button
                  id="cart-coupon-submit"
                  type="submit"
                  className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2 px-3 text-xs transition-colors shadow-sm"
                >
                  Verify
                </button>
              </form>
              {couponError && (
                <p id="coupon-error-desc" className="text-[10px] font-semibold text-rose-500 mt-2 leading-relaxed">
                  ⚠️ {couponError}
                </p>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
