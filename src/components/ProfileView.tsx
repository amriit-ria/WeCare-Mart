import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Building, Hash, ShieldCheck, Save, Sparkles, RefreshCw, ShoppingBag, Landmark, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfileView() {
  const { user, userProfile, userProfileLoading, updateUserProfile, fetchUserProfile, navigateTo, userOrders, logout } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    location: ''
  });

  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sychronize with context userProfile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || user?.displayName || '',
        email: userProfile.email || user?.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        zipCode: userProfile.zipCode || '',
        location: userProfile.location || ''
      });
    }
  }, [userProfile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setUpdating(true);

    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        location: formData.location
      });
      setSuccessMsg('Your security profile has been updated successfully.');
      setEditing(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error saving user profile coordinates.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="bg-white border border-neutral-150 rounded-2xl p-8 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 mx-auto mb-4">
            <User className="h-6 w-6" />
          </span>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Access Secure Profile</h2>
          <p className="text-sm text-neutral-500 mb-6">
            Please sign in or create an account to view and update your secure personalized settings.
          </p>
          <button
            onClick={() => navigateTo('auth')}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 text-xs tracking-wider uppercase transition-all"
          >
            Authenticate Profile
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = userOrders.length;
  const totalAmount = userOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      id="profile-page-wrapper" 
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 pb-24"
    >
      
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Your Digital Account</h1>
        </div>

        <button
          onClick={() => fetchUserProfile()}
          disabled={userProfileLoading}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${userProfileLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: AvatarCard and Quick Statistics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main User Card */}
          <div className="bg-white border border-neutral-150 rounded-2xl p-6 shadow-sm text-center">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-2xl ring-4 ring-emerald-500/15 shadow-inner">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </span>
              <span className="absolute bottom-0 right-0 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black" title="Verified Account Session">
                ✓
              </span>
            </div>

            <h3 className="text-base font-black text-neutral-900 truncate">
              {userProfile?.name || user.displayName || 'WeCare Member'}
            </h3>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2 text-left text-[11px] text-neutral-500">
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-neutral-400">Email Address</span>
                <span className="text-neutral-800 font-medium truncate">{userProfile?.email || user?.email || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-neutral-400">Phone Number</span>
                <span className="text-neutral-850 font-medium">{userProfile?.phone || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-neutral-400">Location</span>
                <span className="text-neutral-850 font-medium truncate">{userProfile?.location || userProfile?.city || 'Not Provided'}</span>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Wellness Statistics</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-150/60 p-4 rounded-xl shadow-sm text-center">
                <ShoppingBag className="h-4 w-4 text-emerald-600 mx-auto mb-1.5" />
                <p className="text-lg font-black text-neutral-900">{totalOrders}</p>
                <p className="text-[9px] font-bold text-neutral-400 uppercase">Orders</p>
              </div>

              <div className="bg-white border border-neutral-150/60 p-4 rounded-xl shadow-sm text-center">
                <Landmark className="h-4 w-4 text-emerald-600 mx-auto mb-1.5" />
                <p className="text-lg font-black text-neutral-900">${totalAmount.toFixed(2)}</p>
                <p className="text-[9px] font-bold text-neutral-400 uppercase">Invested</p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('orders')}
              className="w-full text-center py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Review Purchases
            </button>
          </div>

          {/* Security & Sign Out Section */}
          <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              <span>Security & Session</span>
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Sign out of your active session to end access to your secure digital coordinates and order archives.
            </p>
            <button
              onClick={async () => {
                await logout();
                navigateTo('home');
              }}
              className="w-full text-center py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Securely</span>
            </button>
          </div>

        </div>

        {/* Right Side: Profile Coordinates Fields */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Identity & Personal Contact Details */}
            <div className="bg-white border border-neutral-150 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span>Identity & Personal Contact details</span>
                </h3>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors"
                  >
                    Edit Accounts
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="h-3 w-3 text-neutral-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={!editing || updating}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Watson"
                    className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20 disabled:bg-neutral-50 disabled:border-neutral-200 focus:bg-white transition-colors ${
                      editing ? 'border-neutral-300' : 'border-neutral-150'
                    }`}
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-neutral-400" />
                    <span>Contact Email (Read-Only)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled
                    value={formData.email}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs bg-neutral-100 text-neutral-500 cursor-not-allowed font-medium"
                  />
                </div>

                {/* Phone contact */}
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-neutral-400" />
                    <span>Telephone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    disabled={!editing || updating}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 7911 123456"
                    className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20 disabled:bg-neutral-50 disabled:border-neutral-200 focus:bg-white transition-colors font-mono ${
                      editing ? 'border-neutral-300' : 'border-neutral-150'
                    }`}
                  />
                </div>

              </div>
            </div>

            {/* Separate Physical Location Section */}
            <div className="bg-white border border-neutral-150 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>Personal Physical Location & Shipping Coordinates</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* ZIP Postal Code */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Hash className="h-3 w-3 text-neutral-400" />
                    <span>Postal Zip Code</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    disabled={!editing || updating}
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="NW1 6XE"
                    className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20 disabled:bg-neutral-50 disabled:border-neutral-200 focus:bg-white transition-colors font-mono uppercase ${
                      editing ? 'border-neutral-300' : 'border-neutral-150'
                    }`}
                  />
                </div>

                {/* Town / City */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Building className="h-3 w-3 text-neutral-400" />
                    <span>Town / City Location</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    disabled={!editing || updating}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="London"
                    className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20 disabled:bg-neutral-50 disabled:border-neutral-200 focus:bg-white transition-colors ${
                      editing ? 'border-neutral-300' : 'border-neutral-150'
                    }`}
                  />
                </div>

                {/* Street Address */}
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-neutral-400" />
                    <span>Street Shipping Destination</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    disabled={!editing || updating}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="221B Baker Street"
                    className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20 disabled:bg-neutral-50 disabled:border-neutral-200 focus:bg-white transition-colors ${
                      editing ? 'border-neutral-300' : 'border-neutral-150'
                    }`}
                  />
                </div>

                {/* Custom Precise Location Coordinate Description */}
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Custom Delivery Location & Precise Coordinates</span>
                  </label>
                  <textarea
                    name="location"
                    disabled={!editing || updating}
                    value={formData.location}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Provide customized exact longitude/latitude coordinates, flat numbers, gate passcode guidelines or other spatial location description details for logistics dispatch..."
                    className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/20 disabled:bg-neutral-50 disabled:border-neutral-200 focus:bg-white transition-colors leading-relaxed font-sans ${
                      editing ? 'border-neutral-300' : 'border-neutral-150'
                    }`}
                  />
                </div>

              </div>

              {editing && (
                <div className="flex items-center gap-3 justify-end pt-5 border-t border-neutral-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="px-4 py-2 hover:bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-extrabold rounded-lg text-xs uppercase tracking-wider shadow transition-all"
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Profile & Location</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

          </form>

        </div>

      </div>

    </motion.div>
  );
}
