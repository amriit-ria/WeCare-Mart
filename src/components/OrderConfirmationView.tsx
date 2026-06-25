import { useApp } from '../context/AppContext';
import { formatPrice } from '../types';
import { CheckCircle2, Ticket, ShieldCheck, Mail, Calendar, Truck, ArrowRight, Activity } from 'lucide-react';

export default function OrderConfirmationView() {
  const { lastOrder, navigateTo } = useApp();

  if (!lastOrder) {
    navigateTo('home');
    return null;
  }

  const order = lastOrder;

  return (
    <div id="confirmation-page-wrapper" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 pb-24">
      
      {/* 1. Large Circular Success Icon and greeting */}
      <div className="text-center mb-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-6 shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="h-9 w-9 animate-scale-in" />
        </span>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
          Signature Verified & Decoded
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-3 mb-2">
          Your Order Has Been Confirmed!
        </h1>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Fantastic news, {order.name}! Your order has successfully registered in our processing queue. We've sent a dispatch notification summary to your email.
        </p>
      </div>

      {/* 2. Primary order detail blocks */}
      <div className="flex flex-col gap-6">
        
        {/* Detail grid block 1 */}
        <div className="bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Order Identifier</span>
            <span className="text-sm font-extrabold text-neutral-900 font-mono select-all uppercase">{order.id}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Authorization Timestamp</span>
            <span className="text-sm font-semibold text-neutral-800">{order.date}</span>
          </div>
          <div className="border-t border-neutral-50 pt-4 sm:border-0 sm:pt-0">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Truck className="h-3 w-3 text-emerald-600" /> Dispatch Method</span>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50/50 rounded-lg px-2.5 py-1 w-fit block mt-1">Priority Courier (Free)</span>
          </div>
          <div className="border-t border-neutral-50 pt-4 sm:border-0 sm:pt-0">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Calendar className="h-3 w-3 text-emerald-500" /> Est. Arrival Window</span>
            <span className="text-sm font-extrabold text-neutral-850">{order.deliveryDate}</span>
          </div>
        </div>

        {/* Detail grid block 2: Shipping details & invoice summary */}
        <div className="bg-white border border-neutral-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest">Cargo Shipping Destination</h2>
          </div>
          <div className="p-6 text-xs flex flex-col sm:flex-row gap-6 justify-between">
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="text-neutral-400 font-semibold uppercase tracking-wider block mb-0.5">Shipment Consignee</span>
                <span className="font-bold text-neutral-800 text-sm">{order.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 font-semibold uppercase tracking-wider block mb-0.5">Telephone Contacts</span>
                <span className="font-mono text-neutral-700 font-bold">{order.phone}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="text-neutral-400 font-semibold uppercase tracking-wider block mb-0.5">Full Physical Address</span>
                <span className="font-semibold text-neutral-700 leading-relaxed max-w-xs block text-sm">{order.address}</span>
              </div>
              <div>
                <span className="text-neutral-400 font-semibold uppercase tracking-wider block mb-0.5">Channel Selected</span>
                <span className="font-bold text-neutral-800">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice breakdown of items */}
        <div className="bg-white border border-neutral-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest">Order Cargo List</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {order.items.map((item) => (
              <div key={item.product.id} className="p-5 flex justify-between items-center gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-150 shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover rounded-lg" 
                    />
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-800">{item.product.name}</h4>
                    <span className="text-[11px] text-neutral-400 mt-0.5 block font-mono">Department: {item.product.category} • x{item.quantity} units</span>
                  </div>
                </div>
                <span className="font-mono text-neutral-900 font-bold shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex justify-between items-baseline">
            <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Cumulative Bill Sum</span>
            <span className="text-xl font-black text-neutral-950 font-sans">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Secure certificate placeholder and Navigation back button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>SSL Secured & Encrypted Transaction</span>
          </div>

          <button
            id="confirmation-back-to-home"
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-black py-3 px-6 text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>Return to Brand Home</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
