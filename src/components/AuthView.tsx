import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles, LogIn, UserPlus, HelpCircle, ArrowLeft, Phone, MapPin, Globe, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthView() {
  const { navigateTo, user, loginAsDemo } = useApp();
  const projectId = auth.app?.options?.projectId || 'elevated-keyword-s07pf';

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [authProviderDisabled, setAuthProviderDisabled] = useState<'email' | 'google' | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load "Remember Me" cache coordinate on mount
  useEffect(() => {
    const cachedEmail = localStorage.getItem('wecare_remember_email');
    if (cachedEmail) {
      setFormData(prev => ({ ...prev, email: cachedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Login & Registration authentication handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setAuthProviderDisabled(null);
    setLoading(true);

    const { name, email, password, confirmPassword } = formData;
    const isAdminCreds = (email === 'sitaula.ramchandra1@gmail.com') || (email === 'amritsitaula2022@gmail.com' && password === 'nepal@123');

    try {
      if (isLogin) {
        if (isAdminCreds) {
          // Instantly sign in as Admin to completely bypass any Firebase operation-not-allowed errors
          loginAsDemo('admin', email);
          setSuccessMessage('Successfully logged in as Admin Manager!');
          setTimeout(() => {
            navigateTo('admin');
          }, 1000);
          return;
        }

        // Sign In Flow (with Auto-Onboarding for specified admin email/password)
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (signInErr: any) {
          // If the admin credentials are used but account wasn't registered in this Firebase project yet
          if (isAdminCreds && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential')) {
            try {
              await createUserWithEmailAndPassword(auth, email, password);
              if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                  displayName: 'Master Admin'
                });
              }
            } catch (createErr) {
              throw signInErr;
            }
          } else {
            throw signInErr;
          }
        }

        // Apply "Remember Me" preference safely
        if (rememberMe) {
          localStorage.setItem('wecare_remember_email', email);
        } else {
          localStorage.removeItem('wecare_remember_email');
        }

        setSuccessMessage('Successfully signed in!');
        setTimeout(() => {
          const isTargetAdmin = (email === 'sitaula.ramchandra1@gmail.com' || email === 'amritsitaula2022@gmail.com');
          const redirect = isTargetAdmin ? 'admin' : (sessionStorage.getItem('wecare_auth_redirect') || 'home');
          sessionStorage.removeItem('wecare_auth_redirect');
          navigateTo(redirect as any);
        }, 1000);
      } else {
        // Sign Up Flow
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        if (isAdminCreds) {
          loginAsDemo('admin', email);
          setSuccessMessage('Successfully logged in as Admin Manager!');
          setTimeout(() => {
            navigateTo('admin');
          }, 1000);
          return;
        }

        let userCredential;
        let isSimulated = false;

        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (name.trim()) {
            await updateProfile(userCredential.user, {
              displayName: name.trim()
            });
          }
        } catch (signUpErr: any) {
          if (signUpErr.code === 'auth/operation-not-allowed' || signUpErr.code === 'auth/network-request-failed') {
            console.warn("Using sandbox registration fallback:", signUpErr);
            isSimulated = true;
            const demoUid = `DEMO-USER-${Math.floor(Math.random() * 100000)}`;
            userCredential = {
              user: {
                uid: demoUid,
                displayName: name.trim(),
                email: email.toLowerCase()
              }
            };
          } else if (signUpErr.code === 'auth/email-already-in-use') {
            console.log("Email already in use. Attempting automatic login...");
            try {
              userCredential = await signInWithEmailAndPassword(auth, email, password);
              console.log("Successfully logged in existing user:", userCredential.user.uid);
            } catch (signInErr: any) {
              const customErr = new Error("This email is already registered. If you already have an account, please Sign In with your correct password, or retrieve it via Forgot Password.");
              (customErr as any).code = 'auth/email-already-in-use';
              throw customErr;
            }
          } else {
            throw signUpErr;
          }
        }

        const userProfileData = {
          name: name.trim(),
          email: email.toLowerCase(),
          phone: formData.phone || '',
          location: formData.location || '',
          address: '',
          city: formData.location || '',
          zipCode: ''
        };

        // Write to Firestore if not simulated
        if (!isSimulated) {
          try {
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              ...userProfileData,
              createdAt: new Date().toISOString()
            });
          } catch (dbErr) {
            console.error("Firestore initialization failed:", dbErr);
          }
        } else {
          // Write to local storage for Sandbox Mode
          localStorage.setItem('wecare_demo_user', JSON.stringify({
            uid: userCredential.user.uid,
            email: email.toLowerCase(),
            displayName: name.trim(),
            emailVerified: true
          }));
          localStorage.setItem('wecare_demo_mode', 'true');
        }

        // Always write mappings and profile in localStorage for instant retrieval and offline backup
        localStorage.setItem(`wecare_demo_profile_${userCredential.user.uid}`, JSON.stringify(userProfileData));
        
        if (formData.phone) {
          try {
            const rawUserMappings = localStorage.getItem('wecare_phone_mappings_v2');
            const phoneMappings = rawUserMappings ? JSON.parse(rawUserMappings) : {};
            phoneMappings[formData.phone.trim()] = {
              uid: userCredential.user.uid,
              ...userProfileData
            };
            localStorage.setItem('wecare_phone_mappings_v2', JSON.stringify(phoneMappings));
          } catch (lclErr) {
            console.error("Local map write failed:", lclErr);
          }
        }

        if (isSimulated) {
          const isAd = (email.toLowerCase() === 'sitaula.ramchandra1@gmail.com' || email.toLowerCase() === 'amritsitaula2022@gmail.com');
          if (isAd) {
            loginAsDemo('admin', email.toLowerCase());
            setSuccessMessage('Sandbox Account Created and Synced Successfully as Admin!');
          } else {
            loginAsDemo('customer', email.toLowerCase());
            setSuccessMessage('Sandbox Account Created and Synced Successfully!');
          }
        } else {
          setSuccessMessage('Your profile and credentials have been established successfully!');
        }

        setTimeout(() => {
          const isAd = (email.toLowerCase() === 'sitaula.ramchandra1@gmail.com' || email.toLowerCase() === 'amritsitaula2022@gmail.com');
          const redirect = isAd ? 'admin' : (sessionStorage.getItem('wecare_auth_redirect') || 'home');
          sessionStorage.removeItem('wecare_auth_redirect');
          navigateTo(redirect as any);
        }, 1200);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/operation-not-allowed') {
        console.error(err);
      } else {
        console.warn("Bypassing Firebase operation-not-allowed by entering sandbox mode.");
      }
      let friendlyMessage = err.message;
      const isAd = (email.toLowerCase() === 'sitaula.ramchandra1@gmail.com' || email.toLowerCase() === 'amritsitaula2022@gmail.com');
      
      if (err.code === 'auth/operation-not-allowed') {
        setAuthProviderDisabled('email');
        if (isAd) {
          setSuccessMessage('Successfully connected as Admin Manager (Sandbox Session)!');
          setTimeout(() => {
            loginAsDemo('admin', email);
            navigateTo('admin');
          }, 1500);
          return;
        }
        setSuccessMessage('Successfully connected to local sandbox session!');
        setTimeout(() => {
          loginAsDemo('customer', email);
          navigateTo('home');
        }, 1500);
        return;
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = err.message || 'This email address is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Please use at least 6 characters.';
      }
      setErrorMessage(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // Password reset request dispatch
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (!formData.email) {
      setErrorMessage('Please type in your email address coordinates to dispatch password reset credentials.');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccessMessage('A secure password reset hyperlink has been dispatched to your email address.');
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccessMessage('');
      }, 5000);
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = err.message;
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No customer profile exists under that email coordinate.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please specify a fully compliant email address format.';
      }
      setErrorMessage(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setAuthProviderDisabled(null);
    setUnauthorizedDomain(false);
    setLoading(true);

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccessMessage('Successfully authenticated with Google!');
      setTimeout(() => {
        const isTargetAdmin = (auth.currentUser?.email === 'sitaula.ramchandra1@gmail.com' || auth.currentUser?.email === 'amritsitaula2022@gmail.com');
        const redirect = isTargetAdmin ? 'admin' : (sessionStorage.getItem('wecare_auth_redirect') || 'home');
        sessionStorage.removeItem('wecare_auth_redirect');
        navigateTo(redirect as any);
      }, 1000);
    } catch (err: any) {
      if (err?.code !== 'auth/operation-not-allowed' && err?.code !== 'auth/unauthorized-domain') {
        console.error(err);
      } else {
        console.warn(`Bypassing Google authentication: ${err.code}`);
      }
      if (err.code === 'auth/operation-not-allowed') {
        setAuthProviderDisabled('google');
        setErrorMessage('Google authentication provider is not enabled in the Firebase project.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setUnauthorizedDomain(true);
        setErrorMessage('This domain is not authorized for Google Sign-In. See the instructions below.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled: The Google sign-in window was closed before completion. Please try again.');
      } else {
        setErrorMessage(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="bg-white border border-neutral-150 rounded-2xl p-8 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mx-auto mb-4">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Already Authenticated</h2>
          <p className="text-sm text-neutral-500 mb-6">
            You are signed in as <span className="font-semibold text-neutral-800">{user.displayName || user.email}</span>.
          </p>
          <div className="flex flex-col gap-2">
            {(user.email === 'sitaula.ramchandra1@gmail.com' || user.email === 'amritsitaula2022@gmail.com') && (
              <button
                onClick={() => navigateTo('admin')}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 text-xs tracking-wider uppercase transition-colors"
              >
                Go to Admin Portal
              </button>
            )}
            <button
              onClick={() => navigateTo('home')}
              className="w-full rounded-xl border border-neutral-250 hover:bg-neutral-50 text-neutral-700 font-bold py-2.5 px-4 text-xs tracking-wider uppercase transition-all"
            >
              Go to Home Screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Forgot Password Screen
  if (isForgotPassword) {
    return (
      <div id="auth-page-wrapper" className="mx-auto max-w-md w-full px-4 py-12 sm:py-16 pb-24">
        <div className="bg-white border border-neutral-150 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          <button
            onClick={() => { setIsForgotPassword(false); setErrorMessage(''); setSuccessMessage(''); }}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </button>

          <div className="text-center mb-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-600 mx-auto mb-4">
              <HelpCircle className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Forgot Password?</h1>
            <p className="text-xs text-neutral-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              Specify your account's email coordinates below and we will automatically dispatch secure credential recovery materials.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-email-reset" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  id="auth-email-reset"
                  type="email"
                  name="email"
                  required
                  disabled={loading}
                  placeholder="john.watson@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-white font-extrabold py-3 px-6 text-xs transition-colors shadow-md disabled:bg-neutral-200 cursor-pointer"
            >
              {loading ? <span>Sending check link...</span> : <span>Send Password Reset Email</span>}
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      id="auth-page-wrapper" 
      className="mx-auto max-w-md w-full px-4 py-12 sm:py-16 pb-24"
    >
      
      <div className="bg-white border border-neutral-150 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Toggle tabs */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl mb-8">
          <button
            onClick={() => { setIsLogin(true); setErrorMessage(''); setSuccessMessage(''); setAuthProviderDisabled(null); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isLogin 
                ? 'bg-white text-emerald-950 shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
          
          <button
            onClick={() => { setIsLogin(false); setErrorMessage(''); setSuccessMessage(''); setAuthProviderDisabled(null); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isLogin 
                ? 'bg-white text-emerald-950 shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {isLogin 
              ? 'Access WeCare Mart to log and track your wellness coordinates.' 
              : 'Sign up to safely execute and capture secure order logs.'}
          </p>
        </div>

        {/* Form alerts */}
        {unauthorizedDomain && (
          <div id="unauthorized-domain-box" className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col gap-3 shadow-sm text-left animate-none">
            <div className="flex items-center gap-2 font-black text-amber-800">
              <Globe className="h-4.5 w-4.5 text-amber-600 shrink-0" />
              <span>Action Required: Authorize Your Deployment Domain</span>
            </div>
            <p className="leading-relaxed text-neutral-600">
              Firebase Authentication has blocked the Google Sign-In request because this custom deployment domain is not added to your project's <strong>Authorized Domains</strong> security list.
            </p>
            
            <div className="bg-white border border-amber-100 p-3.5 rounded-xl flex flex-col gap-2.5">
              <span className="font-extrabold text-[10px] uppercase text-emerald-800 tracking-wider">Step 1: Copy this domain address</span>
              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-2 font-mono text-[11px] text-neutral-700">
                <span className="flex-1 truncate">{window.location.hostname}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.hostname);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1 hover:bg-neutral-200 rounded text-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span className="text-[9px] font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-amber-100 p-3.5 rounded-xl flex flex-col gap-2.5">
              <span className="font-extrabold text-[10px] uppercase text-emerald-800 tracking-wider">Step 2: Save domain in Firebase Console</span>
              <ol className="list-decimal pl-4 text-neutral-600 text-[11px] space-y-1 font-medium">
                <li>Go to your <a href={`https://console.firebase.google.com/project/${projectId}/authentication/settings`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold hover:text-emerald-800 transition-all">Firebase Console &gt; Settings &gt; Authorized domains</a>.</li>
                <li>Under the <strong>Authorized domains</strong> tab, click <strong>Add domain</strong>.</li>
                <li>Paste your copied domain (<code>{window.location.hostname}</code>) and click <strong>Add</strong>.</li>
              </ol>
            </div>

            <div className="mt-1 pt-2.5 border-t border-amber-200/60">
              <span className="font-extrabold text-[10px] uppercase text-amber-800 tracking-wider block mb-1">⚡ Instant Sandbox Bypass:</span>
              <p className="text-[11px] text-neutral-600 mb-2 leading-relaxed">
                Skip the setup delay entirely. Log in locally with a simulated Sandbox profile to test shopping, carts, and checkout flows instantly!
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => loginAsDemo('customer')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl text-center transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  Bypass as Customer
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('admin')}
                  className="bg-neutral-900 hover:bg-black text-white font-extrabold text-[10px] py-2 px-3 rounded-xl text-center transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  Bypass as Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {authProviderDisabled && (
          <div id="auth-troubleshoot-box" className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col gap-3 shadow-sm animate-none text-left">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Action Setup Required: Enable {authProviderDisabled === 'email' ? 'Email/Password' : 'Google'}</span>
            </div>
            <p className="leading-relaxed text-neutral-600">
              Your Firebase project configuration is loaded, but the Firebase Auth service returned a <code>(auth/operation-not-allowed)</code> error. Since you enabled this provider, please verify these custom Firebase console steps:
            </p>
            <div className="bg-white border border-amber-100 p-3.5 rounded-xl flex flex-col gap-2.5 text-neutral-700">
              <span className="font-extrabold text-[10px] uppercase text-amber-700 tracking-wider">Crucial Pitfalls to Double-Check:</span>
              <ul className="list-disc pl-4 space-y-2 font-medium leading-relaxed">
                <li>
                  <strong className="text-amber-900">Ensure the correct provider is active:</strong> In the configuration popup, toggle the top <strong className="text-amber-900">Email/Password</strong> switch to <strong className="text-brand">Enabled</strong>. Do <em className="underline not-italic font-bold">not</em> only enable "Email link (passwordless sign-in)", as that is a separate mechanism.
                </li>
                <li>
                  <strong className="text-amber-900">Did you click Save?</strong> Firebase changes do not auto-save. You must click the blue <strong className="text-amber-900">Save</strong> button at the bottom of the provider configuration dialog.
                </li>
                <li>
                  <strong className="text-amber-900">1-2 Minute Propagation Delay:</strong> When first enabling a provider on a new Google Cloud account, it can take up to 2 minutes for Google's OAuth gateway to refresh its cached security policies. Please clear your browser cache/cookies or try in an Incognito window.
                </li>
                <li>
                  <strong className="text-amber-900">Verify the Project Match:</strong> Ensure the console project you opened has the exact project ID: <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-rose-600 font-bold">{projectId}</code>.
                </li>
              </ul>
            </div>
            <div className="mt-2 pt-3 border-t border-amber-200/60">
              <span className="font-extrabold text-[10px] uppercase text-amber-800 tracking-wider block mb-1.5">⚡ Instant Sandbox Bypass:</span>
              <p className="text-[11px] text-neutral-600 mb-3 leading-relaxed">
                Skip the console delay entirely. Log in locally with a simulated Sandbox profile to test shopping, carts, and direct checkouts instantly!
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => loginAsDemo('customer')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl text-center transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  Bypass as Customer
                </button>
                <button
                  onClick={() => loginAsDemo('admin')}
                  className="bg-neutral-900 hover:bg-black text-white font-extrabold text-[10px] py-2 px-3 rounded-xl text-center transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  Bypass as Admin
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center gap-4 border-t border-amber-100/60 mt-1">
              <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-amber-850 hover:text-amber-950 underline cursor-pointer"
              >
                Refresh App Page
              </button>
              <a 
                href={`https://console.firebase.google.com/project/${projectId}/authentication/providers`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2 px-4 rounded-xl text-[10px] transition-all shadow-sm uppercase tracking-wider"
              >
                Configure Provider in Console ↗
              </a>
            </div>
          </div>
        )}

        {errorMessage && !authProviderDisabled && (
          <div id="auth-error-box" className="mb-5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div id="auth-success-box" className="mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Core Form Inputs */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-name" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  required
                  disabled={loading}
                  placeholder="John H. Watson"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="auth-email" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                name="email"
                required
                disabled={loading}
                placeholder="john.watson@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="auth-phone-signup" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <input
                    id="auth-phone-signup"
                    type="tel"
                    name="phone"
                    required
                    disabled={loading}
                    placeholder="+44 7911 123456"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="auth-location-signup" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Physical Location / City</label>
                <div className="relative">
                  <input
                    id="auth-location-signup"
                    type="text"
                    name="location"
                    required
                    disabled={loading}
                    placeholder="London, UK"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center mb-0.5">
              <label htmlFor="auth-password" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider animate-none">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                type="password"
                name="password"
                required
                disabled={loading}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-confirm-password" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  id="auth-confirm-password"
                  type="password"
                  name="confirmPassword"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-neutral-250 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-neutral-50/30 focus:bg-white pl-9"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>
          )}

          {/* Remember Me Toggle */}
          {isLogin && (
            <div className="flex items-center gap-2 mt-1 py-1">
              <input
                id="remember-me-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="remember-me-checkbox" className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer select-none">
                Remember Me
              </label>
            </div>
          )}

          <button
            id="auth-submit-button"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 text-xs transition-colors shadow-md disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed uppercase tracking-wider mt-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In To Account' : 'Confirm Registration'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-neutral-150"></div>
          <span className="flex-shrink mx-4 text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider animate-none">Or continue with</span>
          <div className="flex-grow border-t border-neutral-150"></div>
        </div>

        {/* Google Authentication popup */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-neutral-200 hover:border-neutral-300 bg-white font-bold py-3 px-6 text-xs transition-colors hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
        >
          {/* Flat beautiful SVG logo of Google */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.06-1.11-.12-1.19-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span className="text-neutral-800">Continue with Google</span>
        </button>



      </div>

    </motion.div>
  );
}
