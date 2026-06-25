import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../types';
import { ShoppingBag, Package, Calendar, MapPin, CreditCard, ChevronRight, RefreshCw, Sparkles, ArrowLeft, Check, Clock, Truck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrdersView() {
  const { user, userOrders, userOrdersLoading, fetchUserOrders, navigateTo } = useApp();

  const stages = [
    { key: 'Placed', label: 'Placed', desc: 'Order received' },
    { key: 'Processing', label: 'Processing', desc: 'Preparing & packing items' },
    { key: 'Shipped', label: 'Shipped', desc: 'Dispatched in transit' },
    { key: 'Delivered', label: 'Delivered', desc: 'Delivered successfully' }
  ];

  const getCurrentStageIndex = (status?: string) => {
    const s = status || 'Pending';
    if (s === 'Delivered') return 3;
    if (s === 'Shipped') return 2;
    if (s === 'Processing') return 1;
    return 0; // 'Pending' represents 'Placed'
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="bg-white border border-neutral-150 rounded-2xl p-8 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 mx-auto mb-4">
            <Package className="h-6 w-6" />
          </span>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Access Order History</h2>
          <p className="text-sm text-neutral-500 mb-6">
            Please sign in to your WeCare Mart profile to review your transaction records.
          </p>
          <button
            onClick={() => navigateTo('auth')}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 text-xs tracking-wider uppercase transition-colors"
          >
            Authenticate Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="orders-page-wrapper" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 pb-24">
      
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Your Order History</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Registered records under <span className="font-semibold text-emerald-700">{user.displayName || user.email}</span>
          </p>
        </div>

        <button
          onClick={() => fetchUserOrders()}
          disabled={userOrdersLoading}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${userOrdersLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {userOrdersLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-2xl p-6 h-48 animate-pulse flex flex-col gap-4">
              <div className="h-6 bg-neutral-100 rounded-md w-1/3"></div>
              <div className="h-4 bg-neutral-100 rounded-md w-1/4 mt-2"></div>
              <div className="h-12 bg-neutral-100 rounded-md w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : userOrders.length === 0 ? (
        <div id="no-orders-banner" className="text-center py-16 bg-white border border-neutral-150 rounded-2xl p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 mx-auto mb-4">
            <ShoppingBag className="h-6 w-6" />
          </span>
          <h3 className="text-base font-bold text-neutral-950 mb-1">No Orders Logged Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
            You haven't authorized any purchases yet under this secure account. Start placing some premium wellness items!
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white transition-all uppercase tracking-wider"
          >
            <span>Explore Premium Products</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div id="orders-list-container" className="flex flex-col gap-6">
          {userOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white border border-neutral-150/80 rounded-2xl shadow-sm hover:shadow-md transition-all divide-y divide-neutral-100 overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="p-5 sm:p-6 bg-neutral-50/50 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {order.paymentMethod}
                  </span>
                  <h3 className="text-sm font-black text-neutral-900 mt-2 font-mono">
                    ID: <span className="text-neutral-500 font-semibold">{order.id}</span>
                  </h3>
                </div>
                <div className="text-right sm:text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Billing</p>
                  <p className="text-lg font-black text-emerald-950 font-sans">{formatPrice(order.total || 0)}</p>
                </div>
              </div>

              {/* Order Status Tracking Section */}
              <div className="px-5 py-6 sm:px-8 border-b border-neutral-100 bg-neutral-50/15">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest leading-none">Real-Time Delivery tracking</h4>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs font-semibold text-neutral-600">Status Stage:</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/60' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-100/60' :
                        order.status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60' :
                        'bg-amber-50 text-amber-700 border border-amber-100/60'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  {order.status === 'Delivered' && (
                    <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>Transaction completed. Thank you for selecting WeCare Mart!</span>
                    </p>
                  )}
                </div>

                {order.status === 'Cancelled' ? (
                  <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
                    <ShieldAlert className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-extrabold uppercase text-[10px] tracking-wider text-rose-900 mb-0.5">Order Terminated</h5>
                      <p className="font-medium text-rose-700 leading-relaxed">This secure checkout invoice record has been marked as Cancelled. No further delivery and logistics tracking operations can be performed.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Step progress bar */}
                    <div className="hidden sm:block relative py-4 px-2">
                      {/* Progress Track Background Line */}
                      <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-neutral-200 -translate-y-1/2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-700 ease-in-out"
                          style={{ width: `${(getCurrentStageIndex(order.status) / (stages.length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Steps Nodes Grid */}
                      <div className="relative flex justify-between items-center z-10">
                        {stages.map((stage, idx) => {
                          const stepIdx = getCurrentStageIndex(order.status);
                          const isCompleted = idx <= stepIdx;
                          const isActive = idx === stepIdx;

                          return (
                            <div key={stage.key} className="flex flex-col items-center flex-1">
                              {/* Visual Circle Node */}
                              <div 
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                  isCompleted 
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100/85 scale-105'
                                    : 'bg-white border-neutral-200 text-neutral-400'
                                } ${isActive ? 'ring-4 ring-emerald-500/15' : ''}`}
                              >
                                {isCompleted ? (
                                  <Check className="h-4 w-4 stroke-[3]" />
                                ) : (
                                  <span className="text-xs font-bold font-mono">{idx + 1}</span>
                                )}
                              </div>

                              {/* Text Metadata aligned below */}
                              <div className="text-center mt-3 max-w-[120px]">
                                <p className={`text-xs font-black tracking-tight ${idx <= stepIdx ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                  {stage.label}
                                </p>
                                <p className={`text-[9px] leading-snug mt-0.5 ${isActive ? 'text-emerald-700 font-bold' : 'text-neutral-400'}`}>
                                  {stage.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mobile Step Vertical progress list */}
                    <div className="sm:hidden flex flex-col gap-4 relative pl-3 py-2 border-l-2 border-dashed border-neutral-200">
                      {stages.map((stage, idx) => {
                        const stepIdx = getCurrentStageIndex(order.status);
                        const isCompleted = idx <= stepIdx;
                        const isActive = idx === stepIdx;

                        return (
                          <div key={stage.key} className="flex items-start gap-3 relative">
                            {/* Connector Pin */}
                            <div 
                              className={`absolute -left-[18px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors z-10 ${
                                isCompleted 
                                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                                  : 'bg-white border-neutral-200'
                              }`}
                            >
                              {isCompleted && <Check className="h-2 w-2 stroke-[3.5]" />}
                            </div>

                            {/* Text context cards */}
                            <div className="flex-1 min-w-0 bg-neutral-50/40 border border-neutral-150/40 rounded-xl p-3">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-bold ${isCompleted ? 'text-emerald-800' : 'text-neutral-400'}`}>
                                  Stage {idx + 1}: {stage.label}
                                </span>
                                {isActive && (
                                  <span className="text-[8px] font-extrabold text-emerald-850 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs font-bold mt-0.5 leading-tight ${isCompleted ? 'text-neutral-800 font-black' : 'text-neutral-400'}`}>
                                {stage.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Order Card Body details */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6 justify-between items-start">
                {/* Product list breakdown */}
                <div className="flex-1 w-full flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Purchased Products</p>
                  {order.items?.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 object-cover rounded-lg bg-neutral-50 border border-neutral-150"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-800 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          Qty: <span className="font-semibold text-neutral-700 font-mono">{item.quantity}</span> • Price: <span className="font-semibold text-neutral-700 font-mono">{formatPrice(item.product.price)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics breakdown */}
                <div className="w-full sm:w-64 shrink-0 flex flex-col gap-3 border-t sm:border-t-0 sm:border-l border-neutral-100 pt-5 sm:pt-0 sm:pl-6 text-xs text-neutral-500">
                  <div className="flex gap-2 items-start">
                    <Calendar className="h-4 w-4 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Order Date</p>
                      <p className="font-semibold text-neutral-800 mt-0.5">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start">
                    <Package className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Delivery</p>
                      <p className="font-semibold text-emerald-800 mt-0.5">{order.deliveryDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start">
                    <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Destination</p>
                      <p className="font-medium text-neutral-700 mt-0.5 leading-relaxed">{order.address}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
