import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Product, OrderDetails, CartItem, formatPrice } from '../types';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Clipboard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  RefreshCw, 
  LogOut, 
  UserCheck, 
  Lock,
  Sparkles,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminView() {
  const { 
    user, 
    allOrders, 
    allOrdersLoading, 
    fetchAllOrders, 
    updateOrderStatus, 
    adminCreateOrder, 
    adminNotifications,
    adminNotificationsLoading,
    fetchAdminNotifications,
    markAdminNotificationRead,
    logout, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'create-order' | 'notifications' | 'security'>('orders');
  
  // Orders List states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // New Order Form states
  const [newOrderForm, setNewOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'Credit Card',
    status: 'Pending'
  });
  const [orderItemsList, setOrderItemsList] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>(PRODUCTS[0]?.id || '');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Security Form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [secSuccess, setSecSuccess] = useState<string>('');
  const [secError, setSecError] = useState<string>('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  useEffect(() => {
    // Only verify and fetch if user is authorized admin
    if (user && (user.email === 'sitaula.ramchandra1@gmail.com' || user.email === 'amritsitaula2022@gmail.com')) {
      fetchAllOrders();
    }
  }, [user]);

  // Deny access if not admin
  if (!user || (user.email !== 'sitaula.ramchandra1@gmail.com' && user.email !== 'amritsitaula2022@gmail.com')) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mx-auto mb-4">
            <XCircle className="h-6 w-6" />
          </span>
          <h2 className="text-xl font-black text-rose-950 mb-2">Unauthorized Access</h2>
          <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">
            This module contains highly classified commercial archives of WeCare Mart. You must authenticate with the master admin credentials.
          </p>
          <button
            onClick={() => navigateTo('auth')}
            className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-4 text-xs uppercase tracking-wider transition-colors"
          >
            Authenticate Admin Credentials
          </button>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrdersPlaced = allOrders.length;
  const pendingOrders = allOrders.filter(o => !o.status || o.status === 'Pending').length;
  const fulfilledOrders = allOrders.filter(o => o.status === 'Delivered').length;

  // Filtered orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const currentStatus = order.status || 'Pending';
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle adding product to new order
  const handleAddProductToOrder = () => {
    const product = PRODUCTS.find(p => p.id === selectedProductToAdd);
    if (!product) return;

    setOrderItemsList(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });
    setQuantityToAdd(1);
  };

  const handleRemoveProductFromOrder = (prodId: string) => {
    setOrderItemsList(prev => prev.filter(item => item.product.id !== prodId));
  };

  // Get Order Items Total
  const getOrderItemsTotal = () => {
    return orderItemsList.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  // Admin New Order Submit
  const handleAdminSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (orderItemsList.length === 0) {
      setFormError('Please add at least one product item to place this order.');
      return;
    }

    setIsSubmittingOrder(true);
    const orderTotal = getOrderItemsTotal();
    
    // Delivery estimated to be exactly 7 calendar days from today
    const orderDateObj = new Date();
    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 7);

    const formattedOrderDate = orderDateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedDeliveryDate = deliveryDateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fullAddress = `${newOrderForm.address}, ${newOrderForm.city}, ${newOrderForm.zipCode}`;

    try {
      await adminCreateOrder({
        name: newOrderForm.name,
        email: newOrderForm.email,
        phone: newOrderForm.phone,
        address: fullAddress,
        paymentMethod: newOrderForm.paymentMethod,
        items: orderItemsList as CartItem[],
        total: orderTotal,
        date: formattedOrderDate,
        deliveryDate: formattedDeliveryDate,
        status: newOrderForm.status
      });

      setFormSuccess('New order has been registered successfully from the admin end.');
      // Reset form
      setNewOrderForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'Credit Card',
        status: 'Pending'
      });
      setOrderItemsList([]);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while launching order record.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Update order status trigger
  const handleUpdateStatus = async (orderId: string, currentStatus: string, nextStatus: string) => {
    setUpdatingStatusId(orderId);
    let nextDelivery = undefined;
    
    if (nextStatus === 'Delivered') {
      nextDelivery = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    try {
      await updateOrderStatus(orderId, nextStatus, nextDelivery);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: nextStatus, ...(nextDelivery ? { deliveryDate: nextDelivery } : {}) } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Update master credentials password function
  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSecError('Passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setSecError('Secret key password must contain at least 6 characters.');
      return;
    }

    setIsUpdatingPassword(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        await updatePassword(currentUser, passwordForm.newPassword);
        setSecSuccess('Your master administrator password has been updated securely.');
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      } catch (err: any) {
        setSecError(err.message || 'Failed to update credentials. Please try signing out and logging back in first.');
      } finally {
        setIsUpdatingPassword(false);
      }
    } else {
      setSecError('Session expired. Please authenticate again.');
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 border-b border-neutral-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-100 text-emerald-850 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> Master Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            WeCare Mart <span className="text-emerald-700 font-medium font-serif italic">Admin Portal</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Secure command center to analyze billing history, manage shipments, and dispatch order coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAllOrders()}
            disabled={allOrdersLoading}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${allOrdersLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live Records</span>
          </button>
          
          <button
            onClick={async () => {
              await logout();
              navigateTo('home');
            }}
            className="flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-700 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit Portal</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white border border-neutral-150 rounded-2xl p-4 sm:p-5 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Gross Billing</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="h-4 w-4" /></span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-mono">{formatPrice(totalRevenue)}</p>
          <div className="flex items-center gap-1 mt-1 font-semibold text-emerald-600 text-[10px]">
            <TrendingUp className="h-3 w-3" />
            <span>100% Secure Flow</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-150 rounded-2xl p-4 sm:p-5 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Total Dispatch</span>
            <span className="p-1.5 bg-neutral-50 text-neutral-600 rounded-lg"><Clipboard className="h-4 w-4" /></span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-mono">{totalOrdersPlaced}</p>
          <p className="text-[10px] text-neutral-405 font-medium mt-1">Orders tracked in database</p>
        </div>

        <div className="bg-white border border-neutral-150 rounded-2xl p-4 sm:p-5 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Pending Release</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Clock className="h-4 w-4" /></span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-mono">{pendingOrders}</p>
          <p className="text-[10px] text-amber-605 font-semibold mt-1">Requires status update</p>
        </div>

        <div className="bg-white border border-neutral-150 rounded-2xl p-4 sm:p-5 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Completed Deliveries</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><CheckCircle className="h-4 w-4" /></span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-mono">{fulfilledOrders}</p>
          <p className="text-[10px] text-teal-605 font-semibold mt-1">Safely dispersed and finalized</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs inside Admin */}
      <div className="flex border-b border-neutral-150 gap-4 mb-8 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
          className={`py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 px-1 cursor-pointer ${
            activeTab === 'orders' 
              ? 'border-emerald-600 text-emerald-900' 
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Dispatch Registry ({totalOrdersPlaced})
        </button>

        <button
          onClick={() => { setActiveTab('create-order'); setSelectedOrder(null); }}
          className={`py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 px-1 cursor-pointer ${
            activeTab === 'create-order' 
              ? 'border-emerald-600 text-emerald-900' 
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Inject New Order
        </button>

        <button
          onClick={() => { setActiveTab('notifications'); setSelectedOrder(null); }}
          className={`py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 px-1 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'notifications' 
              ? 'border-emerald-600 text-emerald-900' 
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          <span>Order Alerts</span>
          {adminNotifications.filter(n => !n.read).length > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white px-1 shadow-sm">
              {adminNotifications.filter(n => !n.read).length}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('security'); setSelectedOrder(null); }}
          className={`py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 px-1 cursor-pointer ${
            activeTab === 'security' 
              ? 'border-emerald-600 text-emerald-900' 
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Console Credentials
        </button>
      </div>

      {/* Main Core Views Panel */}
      <div className="min-h-[400px]">
        
        {/* Tab 1: Dispatch Registry list & management sidepane */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Orders List left-side column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Search & Filter tools */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full sm:flex-1">
                  <input
                    type="text"
                    placeholder="Search orders, clients, emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-neutral-250 px-3 py-2 pl-9 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 self-stretch sm:self-center">
                  <Filter className="h-3.5 w-3.5 text-neutral-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 sm:flex-initial rounded-xl border border-neutral-250 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="All">All Deliveries</option>
                    <option value="Pending">Pending Approval</option>
                    <option value="Shipped">In Logistics Transit</option>
                    <option value="Delivered">Delivered Successfully</option>
                    <option value="Cancelled">Cancelled Order</option>
                  </select>
                </div>
              </div>

              {allOrdersLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-white border border-neutral-100 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm">
                  <Package className="h-10 w-10 text-neutral-350 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-neutral-700">No Orders Match Query</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto mt-1">
                    No order registry entries matched your search keywords or active status filters.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredOrders.map(order => {
                    const status = order.status || 'Pending';
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                          isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10' : 'border-neutral-150 hover:border-neutral-250'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              status === 'Delivered' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                              status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {status}
                            </span>
                            <h3 className="text-xs font-black text-neutral-900 mt-2 font-mono">ID: {order.id}</h3>
                            <p className="text-xs font-semibold text-neutral-700 mt-0.5 mt-1">{order.name}</p>
                            <p className="text-[10px] text-neutral-450">{order.email} • {order.items?.length || 0} product(s)</p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-black text-neutral-900 font-mono">{formatPrice(order.total || 0)}</p>
                            <p className="text-[9px] text-neutral-400 mt-1">{order.date}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Order detail / management card */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {selectedOrder ? (
                  <motion.div
                    key={selectedOrder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white border border-neutral-150 rounded-2xl p-6 shadow-md sticky top-24"
                  >
                    <div className="flex justify-between items-start gap-4 border-b border-neutral-100 pb-4 mb-4">
                      <div>
                        <h2 className="text-sm font-black text-neutral-900 font-mono">REGISTRY DETAIL</h2>
                        <p className="text-[11px] text-neutral-500 font-semibold">{selectedOrder.id}</p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-xs font-bold text-neutral-400 hover:text-neutral-600 uppercase"
                      >
                        deselect
                      </button>
                    </div>

                    {/* Logistics Status Controls section */}
                    <div className="mb-6 bg-neutral-50/50 rounded-xl p-4 border border-neutral-150">
                      <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-3">Adjust Delivery Stage</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'Pending', label: 'Set Pending', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
                          { key: 'Processing', label: 'Set Processing', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' },
                          { key: 'Shipped', label: 'Set Shipped', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
                          { key: 'Delivered', label: 'Set Delivered', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200' },
                          { key: 'Cancelled', label: 'Cancel Order', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' }
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            disabled={updatingStatusId === selectedOrder.id || selectedOrder.status === btn.key}
                            onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status || 'Pending', btn.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${btn.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <span>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                      {updatingStatusId === selectedOrder.id && (
                        <p className="text-[9px] text-neutral-400 italic mt-2 animate-pulse">Propagating safety rules update to Cloud Firestore...</p>
                      )}
                    </div>

                    {/* Delivery & client identity specifications */}
                    <div className="flex flex-col gap-4 text-xs">
                      
                      <div className="flex items-start gap-2.5">
                        <User className="h-4 w-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Client Identity</p>
                          <p className="font-bold text-neutral-800 mt-0.5">{selectedOrder.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Mail className="h-4 w-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Email Coordinates</p>
                          <p className="font-semibold text-neutral-700 mt-0.5">{selectedOrder.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Phone className="h-4 w-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Telephone Channel</p>
                          <p className="font-medium text-neutral-700 mt-0.5">{selectedOrder.phone || 'No phone recorded'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Destination</p>
                          <p className="font-medium text-neutral-700 mt-0.5 leading-relaxed">{selectedOrder.address}</p>
                        </div>
                      </div>

                      {selectedOrder.location && (
                        <div className="flex items-start gap-2.5 col-span-1 sm:col-span-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                          <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest leading-none">Separate Physical Location</p>
                            <p className="font-semibold text-neutral-800 text-xs mt-1.5 whitespace-pre-line leading-relaxed">{selectedOrder.location}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2.5">
                        <CreditCard className="h-4 w-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Payment configuration</p>
                          <p className="font-bold text-emerald-800 mt-0.5">{selectedOrder.paymentMethod}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Truck className="h-4 w-4 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Logistics Estimates</p>
                          <p className="font-semibold text-neutral-800 mt-0.5">{selectedOrder.deliveryDate}</p>
                        </div>
                      </div>

                    </div>

                    {/* Bought items lists */}
                    <div className="mt-6 border-t border-neutral-100 pt-5">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">Item Breakdown</p>
                      <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto">
                        {selectedOrder.items?.map((item) => (
                          <div key={item.product.id} className="flex gap-2 items-center justify-between">
                            <div className="flex gap-2 items-center min-w-0">
                              <img 
                                src={item.product.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=60"} 
                                alt={item.product.name} 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=60";
                                }}
                                className="h-8 w-8 object-cover rounded bg-neutral-50 border border-neutral-150"
                              />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-neutral-800 truncate">{item.product.name}</p>
                                <p className="text-[9px] text-neutral-450 font-mono">Qty: {item.quantity} x {formatPrice(item.product.price)}</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-black text-neutral-900 font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-5 pt-4 border-t border-neutral-100 border-dashed text-xs">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Invoice</p>
                        <p className="text-sm font-black text-emerald-950 font-mono">{formatPrice(selectedOrder.total || 0)}</p>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl p-8 py-16 text-center sticky top-24">
                    <Clipboard className="h-8 w-8 text-neutral-350 mx-auto mb-3" />
                    <p className="text-xs font-bold text-neutral-600">No registry entry active</p>
                    <p className="text-[10px] text-neutral-400 mt-1 max-w-xs mx-auto">
                      Select an order dispatch from the log on the left side to adjust tracking statuses, audit coordinates or view invoices.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* Tab 2: Inject New Order (Manual Placement) */}
        {activeTab === 'create-order' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form for user coordinates */}
            <form onSubmit={handleAdminSubmitOrder} className="lg:col-span-7 bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <h2 className="text-sm font-black text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3 mb-1">
                Customer Delivery Specifications
              </h2>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700">
                  {formSuccess}
                </div>
              )}

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alice Smith"
                    value={newOrderForm.name}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alice.smith@example.com"
                    value={newOrderForm.email}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 432-1234"
                    value={newOrderForm.phone}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="128 Maple Ave, Suite B"
                    value={newOrderForm.address}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    placeholder="San Francisco"
                    value={newOrderForm.city}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Zip Code</label>
                  <input
                    type="text"
                    required
                    placeholder="94103"
                    value={newOrderForm.zipCode}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Payment Method</label>
                  <select
                    value={newOrderForm.paymentMethod}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Credit Card">Credit Card Auth</option>
                    <option value="PayPal">PayPal Balance</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Initial Delivery State</label>
                <select
                  value={newOrderForm.status}
                  onChange={(e) => setNewOrderForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="Pending">Pending Approval / Placed</option>
                  <option value="Processing">In Processing / Packing</option>
                  <option value="Shipped">In Logistics Transit</option>
                  <option value="Delivered">Delivered (Direct Dispatch)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2 disabled:bg-neutral-200 disabled:text-neutral-400 cursor-pointer"
              >
                {isSubmittingOrder ? (
                  <span>Registering database entry...</span>
                ) : (
                  <>
                    <span>Inject Master Order Record</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Shopping Cart building for Admin */}
            <div className="lg:col-span-5 bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-black text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3 mb-1">
                  Add Stock Items
                </h3>
              </div>

              {/* Item selection tools */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Select Product</label>
                  <select
                    value={selectedProductToAdd}
                    onChange={(e) => setSelectedProductToAdd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatPrice(p.price)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Visual live preview for selected product */}
                {(() => {
                  const selectProduct = PRODUCTS.find(p => p.id === selectedProductToAdd);
                  if (!selectProduct) return null;
                  return (
                    <div className="flex gap-2.5 items-center bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-150 animate-fadeIn shrink-0">
                      <img 
                        src={selectProduct.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=60"} 
                        alt={selectProduct.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=60";
                        }}
                        className="h-10 w-10 object-cover rounded-lg bg-white border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                          {selectProduct.category}
                        </span>
                        <p className="font-extrabold text-neutral-800 text-[11px] mt-1 leading-tight truncate">{selectProduct.name}</p>
                        <p className="text-[9px] text-neutral-400 mt-0.5 font-mono">Stock level: {selectProduct.stock || 20} available</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Qty</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantityToAdd}
                      onChange={(e) => setQuantityToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded-lg border border-neutral-250 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddProductToOrder}
                    className="self-end px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg h-[34px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Selected items registry lists */}
              <div className="mt-2 text-xs border-t border-neutral-100 pt-5 flex-1">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">Invoice Contents</p>
                {orderItemsList.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 italic text-[11px]">
                    No cart items added yet. Choose premium products from the collection above.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                    {orderItemsList.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center bg-neutral-50 p-2 rounded-xl border border-neutral-100 gap-3">
                        <div className="flex gap-2.5 items-center min-w-0 flex-1">
                          <img 
                            src={item.product.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=60"} 
                            alt={item.product.name} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=60";
                            }}
                            className="h-8 w-8 object-cover rounded bg-white border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-neutral-800 truncate text-[11px]">{item.product.name}</p>
                            <p className="text-[10px] text-neutral-450 font-mono">Qty: {item.quantity} x {formatPrice(item.product.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-neutral-900 font-mono text-[11px]">{formatPrice(item.product.price * item.quantity)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProductFromOrder(item.product.id)}
                            className="p-1 px-1.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-100 border-dashed pt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Gross Total</span>
                <span className="text-base font-black text-emerald-950 font-mono">{formatPrice(getOrderItemsTotal())}</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2.5: Order Alerts (Notifications) */}
        {activeTab === 'notifications' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-neutral-150 pb-4 mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Bell className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-neutral-900 tracking-tight">Active Management Alerts</h2>
                    <p className="text-xs text-neutral-400">Notifications of customer orders placed through the website</p>
                  </div>
                </div>

                {adminNotifications.some(n => !n.read) && (
                  <button
                    onClick={async () => {
                      const unread = adminNotifications.filter(n => !n.read);
                      for (const n of unread) {
                        await markAdminNotificationRead(n.id);
                      }
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-50 bg-white"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              {adminNotificationsLoading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-neutral-450 font-bold">Retrieving alerts feeds...</p>
                </div>
              ) : adminNotifications.length === 0 ? (
                <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-150 border-dashed">
                  <Bell className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                  <p className="font-bold text-neutral-800 text-sm">No Active Alerts</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    When customers place orders on the WeCare Mart storefront, instant secure alerts will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {adminNotifications.map((notif) => {
                    const matchedOrder = allOrders.find(o => o.id === notif.orderId);
                    return (
                      <div 
                        key={notif.id} 
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                          notif.read 
                            ? 'bg-neutral-50/50 border-neutral-150' 
                            : 'bg-emerald-50/20 border-emerald-100 ring-1 ring-emerald-500/5'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            notif.read 
                              ? 'bg-neutral-100 text-neutral-400' 
                              : 'bg-emerald-100 text-emerald-800 animate-pulse'
                          }`}>
                            <Bell className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className={`text-xs leading-relaxed ${notif.read ? 'text-neutral-600' : 'text-neutral-900 font-extrabold'}`}>
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {!notif.read && (
                            <button
                              onClick={() => markAdminNotificationRead(notif.id)}
                              className="text-[10px] font-extrabold uppercase tracking-wider bg-white hover:bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-250 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
                            >
                              Mark Read
                            </button>
                          )}
                          
                          {matchedOrder && (
                            <button
                              onClick={() => {
                                setSelectedOrder(matchedOrder);
                                setActiveTab('orders');
                              }}
                              className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-white transition-colors shadow-sm cursor-pointer"
                            >
                              Inspect Order ↗
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Security Credentials */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2 border-b border-neutral-105 pb-4">
              <Lock className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm font-black text-neutral-900 tracking-tight uppercase">Update Console Code</h3>
                <p className="text-[10px] text-neutral-400">Change password credentials required for the {user?.email || 'admin'} account.</p>
              </div>
            </div>

            {secSuccess && (
              <div className="mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700">
                {secSuccess}
              </div>
            )}

            {secError && (
              <div className="mb-5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700">
                {secError}
              </div>
            )}

            <form onSubmit={handleUpdateAdminPassword} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  disabled={isUpdatingPassword}
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10 pl-3"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  required
                  disabled={isUpdatingPassword}
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/10 pl-3"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2 disabled:bg-neutral-200 cursor-pointer"
              >
                {isUpdatingPassword ? (
                  <span>Updating security credentials...</span>
                ) : (
                  <>
                    <span>Commit New Password</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
