import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, OrderDetails, UserProfile, AdminNotification } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

export type TabType = 
  | 'home' 
  | 'shop' 
  | 'about' 
  | 'contact' 
  | 'cart' 
  | 'wishlist' 
  | 'product-details' 
  | 'checkout' 
  | 'order-confirmation'
  | 'auth'
  | 'orders'
  | 'profile'
  | 'admin';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  currentTab: TabType;
  navigateTo: (tab: TabType, productId?: string | null) => void;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  cart: CartItem[];
  wishlist: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastOrder: OrderDetails | null;
  setLastOrder: (order: OrderDetails | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist Actions
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Firebase Auth additions
  user: any | null;
  authLoading: boolean;
  userOrders: OrderDetails[];
  userOrdersLoading: boolean;
  userProfile: UserProfile | null;
  userProfileLoading: boolean;
  logout: () => Promise<void>;
  saveOrderToFirestore: (orderData: Omit<OrderDetails, 'id'>) => Promise<string>;
  fetchUserOrders: () => Promise<void>;
  updateUserProfile: (profileData: UserProfile) => Promise<void>;
  fetchUserProfile: () => Promise<void>;

  // Admin Portal Additions
  allOrders: OrderDetails[];
  allOrdersLoading: boolean;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, deliveryDate?: string) => Promise<void>;
  adminCreateOrder: (orderData: Omit<OrderDetails, 'id'>, customUserId?: string) => Promise<string>;

  // Admin Notifications
  adminNotifications: AdminNotification[];
  adminNotificationsLoading: boolean;
  fetchAdminNotifications: () => Promise<void>;
  markAdminNotificationRead: (id: string) => Promise<void>;

  // Demo / Bypass mode additions
  isDemoMode: boolean;
  loginAsDemo: (role: 'admin' | 'customer', customEmail?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Cart & Wishlist persistence with state hydration from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wecare_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wecare_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Firebase and Demo state variables
  const [user, setUser] = useState<any | null>(null);
  const [demoUser, setDemoUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('wecare_demo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('wecare_demo_mode') === 'true';
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [userOrders, setUserOrders] = useState<OrderDetails[]>([]);
  const [userOrdersLoading, setUserOrdersLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState<boolean>(false);

  // Admin state
  const [allOrders, setAllOrders] = useState<OrderDetails[]>([]);
  const [allOrdersLoading, setAllOrdersLoading] = useState<boolean>(false);

  // Admin notifications state
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [adminNotificationsLoading, setAdminNotificationsLoading] = useState<boolean>(false);

  // Computed effective user
  const effectiveUser = demoUser || user;

  // Sync demo mode status
  useEffect(() => {
    setIsDemoMode(demoUser !== null);
  }, [demoUser]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      const isDemo = localStorage.getItem('wecare_demo_mode') === 'true';
      if (!isDemo) {
        setAuthLoading(false);
        if (currentUser) {
          // Fetch orders and profile automatically
          loadProfileForUser(currentUser.uid, currentUser);
          loadOrdersForUser(currentUser.uid);
          if (currentUser.email === 'sitaula.ramchandra1@gmail.com' || currentUser.email === 'amritsitaula2022@gmail.com') {
            fetchAllOrders();
            fetchAdminNotifications();
          }
        } else {
          setUserOrders([]);
          setUserProfile(null);
          setAllOrders([]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Demo user specific bootstrapper hook
  useEffect(() => {
    const isDemo = localStorage.getItem('wecare_demo_mode') === 'true';
    if (isDemo && demoUser) {
      setAuthLoading(false);
      loadProfileForUser(demoUser.uid, demoUser);
      loadOrdersForUser(demoUser.uid);
      if (demoUser.uid === 'DEMO-ADMIN-UID') {
        fetchAllOrders();
        fetchAdminNotifications();
      }
    } else if (!user) {
      // If not demo and no firebase user, we stop loaders
      setAuthLoading(false);
    }
  }, [demoUser, user]);

  const loadProfileForUser = async (uid: string, fallbackUser?: any) => {
    setUserProfileLoading(true);
    const isDemo = uid.startsWith('DEMO-') || (demoUser !== null);
    
    if (isDemo) {
      const savedProfile = localStorage.getItem(`wecare_demo_profile_${uid}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        const initProfile: UserProfile = {
          name: fallbackUser?.displayName || (uid === 'DEMO-ADMIN-UID' ? 'Master Admin' : 'John Doe'),
          email: fallbackUser?.email || (uid === 'DEMO-ADMIN-UID' ? 'sitaula.ramchandra1@gmail.com' : 'customer@example.com'),
          phone: '(555) 019-2834',
          address: '100 Wellness Way, Suite A',
          city: 'Garden City',
          zipCode: '11530',
          location: 'Garden City, New York, US (Demo Coordinates)'
        };
        setUserProfile(initProfile);
      }
      setUserProfileLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        const initProfile: UserProfile = {
          name: fallbackUser?.displayName || '',
          email: fallbackUser?.email || '',
          phone: '',
          address: '',
          city: '',
          zipCode: '',
          location: ''
        };
        setUserProfile(initProfile);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setUserProfileLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const activeU = demoUser || user;
    if (activeU) {
      await loadProfileForUser(activeU.uid, activeU);
    }
  };

  const updateUserProfile = async (profileData: UserProfile) => {
    const activeU = demoUser || user;
    if (!activeU) throw new Error("Authentication required to update profile.");
    
    if (demoUser) {
      localStorage.setItem(`wecare_demo_profile_${activeU.uid}`, JSON.stringify(profileData));
      setUserProfile(profileData);
      return;
    }

    const path = `users/${activeU.uid}`;
    try {
      await setDoc(doc(db, 'users', activeU.uid), {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setUserProfile(profileData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const loadOrdersForUser = async (uid: string) => {
    setUserOrdersLoading(true);
    const isDemo = uid.startsWith('DEMO-') || (demoUser !== null);
    
    if (isDemo) {
      const saved = localStorage.getItem(`wecare_demo_orders_${uid}`);
      const orders = saved ? JSON.parse(saved) : [];
      setUserOrders(orders);
      setUserOrdersLoading(false);
      return;
    }

    const path = 'orders';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', uid)
      );
      const snapshot = await getDocs(q);
      const ordersList: any[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });

      // Sort locally by date string descending to avoid needing a Firestore composite Index requirement
      ordersList.sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateB - dateA;
      });

      setUserOrders(ordersList);
    } catch (err) {
      console.warn("Firestore error reading orders, falling back to local storage:", err);
      // Failsafe fallback to local storage
      const saved = localStorage.getItem(`wecare_demo_orders_${uid}`);
      const orders = saved ? JSON.parse(saved) : [];
      setUserOrders(orders);
    } finally {
      setUserOrdersLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    const activeU = demoUser || user;
    if (activeU) {
      await loadOrdersForUser(activeU.uid);
    }
  };

  const saveOrderToFirestore = async (orderData: Omit<OrderDetails, 'id'>): Promise<string> => {
    const activeU = demoUser || user;
    if (!activeU) throw new Error("Authentication required to store order.");
    
    const orderId = `WCM-${Math.floor(100000 + Math.random() * 900000)}-${(orderData.address || 'NY').slice(-5).toUpperCase().replace(/[^A-Z0-9]/g, '')}`;
    
    if (demoUser) {
      const uid = activeU.uid;
      const saved = localStorage.getItem(`wecare_demo_orders_${uid}`);
      const orders = saved ? JSON.parse(saved) : [];
      const newOrder = {
        ...orderData,
        id: orderId,
        userId: uid,
        createdAt: new Date().toISOString()
      };
      const updatedOrders = [newOrder, ...orders];
      localStorage.setItem(`wecare_demo_orders_${uid}`, JSON.stringify(updatedOrders));
      
      // Also update demo all orders list for the simulated admin portal
      const allSavedStr = localStorage.getItem('wecare_demo_all_orders');
      const allOrdersList = allSavedStr ? JSON.parse(allSavedStr) : [];
      localStorage.setItem('wecare_demo_all_orders', JSON.stringify([newOrder, ...allOrdersList]));

      setUserOrders(updatedOrders);

      // Add a notification for demo mode
      const newNotification: AdminNotification = {
        id: `NOTIF-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'order_placed',
        message: `New Order ${orderId} placed by ${orderData.name || 'Anonymous'} for $${(orderData.total || 0).toFixed(2)}`,
        createdAt: new Date().toISOString(),
        read: false,
        orderId: orderId,
        customerName: orderData.name,
        amount: orderData.total
      };
      const savedNotifs = localStorage.getItem('wecare_demo_notifications') || '[]';
      const updatedNotifs = [newNotification, ...JSON.parse(savedNotifs)];
      localStorage.setItem('wecare_demo_notifications', JSON.stringify(updatedNotifs));
      setAdminNotifications(updatedNotifs);

      return orderId;
    }

    const path = 'orders';
    try {
      await setDoc(doc(db, path, orderId), {
        ...orderData,
        userId: activeU.uid,
        createdAt: new Date().toISOString()
      });

      // Write notification to Firestore for real database mode
      const notifId = `NOTIF-${Math.floor(100000 + Math.random() * 900000)}`;
      await setDoc(doc(db, 'admin_notifications', notifId), {
        id: notifId,
        type: 'order_placed',
        message: `New Order ${orderId} placed by ${orderData.name || 'Anonymous'} for $${(orderData.total || 0).toFixed(2)}`,
        createdAt: new Date().toISOString(),
        read: false,
        orderId: orderId,
        customerName: orderData.name || 'Anonymous',
        amount: orderData.total || 0
      });

      // Reload local list
      await loadOrdersForUser(activeU.uid);
      return orderId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      throw err;
    }
  };

  const fetchAdminNotifications = async () => {
    setAdminNotificationsLoading(true);
    if (demoUser) {
      const saved = localStorage.getItem('wecare_demo_notifications') || '[]';
      setAdminNotifications(JSON.parse(saved));
      setAdminNotificationsLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'admin_notifications'));
      const snapshot = await getDocs(q);
      const notificationsList: AdminNotification[] = [];
      snapshot.forEach((doc) => {
        notificationsList.push({ id: doc.id, ...doc.data() } as AdminNotification);
      });

      // Sort by createdAt descending
      notificationsList.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setAdminNotifications(notificationsList);
    } catch (err) {
      console.warn("Firestore error getting notifications, falling back to local storage:", err);
      const saved = localStorage.getItem('wecare_demo_notifications') || '[]';
      setAdminNotifications(JSON.parse(saved));
    } finally {
      setAdminNotificationsLoading(false);
    }
  };

  const markAdminNotificationRead = async (id: string) => {
    if (demoUser) {
      const saved = localStorage.getItem('wecare_demo_notifications') || '[]';
      const notifs: AdminNotification[] = JSON.parse(saved);
      const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('wecare_demo_notifications', JSON.stringify(updated));
      setAdminNotifications(updated);
      return;
    }

    try {
      await setDoc(doc(db, 'admin_notifications', id), {
        read: true
      }, { merge: true });

      setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const logout = async () => {
    localStorage.removeItem('wecare_demo_user');
    localStorage.removeItem('wecare_demo_mode');
    setDemoUser(null);
    setIsDemoMode(false);
    setUserOrders([]);
    setUserProfile(null);
    setAllOrders([]);
    
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during Firebase signOut:", err);
    }
    
    navigateTo('home');
  };

  const fetchAllOrders = async () => {
    setAllOrdersLoading(true);
    if (demoUser) {
      const allSaved = localStorage.getItem('wecare_demo_all_orders') || '[]';
      setAllOrders(JSON.parse(allSaved));
      setAllOrdersLoading(false);
      return;
    }

    const path = 'orders';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      const ordersList: any[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });

      // Sort locally by date string descending
      ordersList.sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateB - dateA;
      });

      setAllOrders(ordersList);
    } catch (err) {
      console.warn("Firestore error reading all orders, falling back to local storage:", err);
      const allSaved = localStorage.getItem('wecare_demo_all_orders') || '[]';
      const fallbackList = JSON.parse(allSaved);
      if (fallbackList.length === 0) {
        // Seed default sandbox admin orders
        const demoOrdersDefault = [
          {
            id: 'WCM-928401-NY100',
            userId: 'cust-demo-1',
            name: 'Alexander Ross',
            email: 'alex.ross@example.com',
            phone: '212-555-0199',
            address: '742 Evergreen Terrace',
            city: 'Springfield',
            zipCode: '90210',
            paymentMethod: 'Credit Card',
            status: 'Pending',
            total: 124.99,
            subtotal: 119.00,
            shipping: 5.99,
            location: 'New York, US (Demo Coordinates)',
            date: new Date(Date.now() - 4 * 3600_000).toISOString(),
            createdAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
            items: [
              {
                product: { id: 'pro-1', name: 'Smart PureAura Diffuser', price: 89.00, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600', category: 'Aroma & Air' },
                quantity: 1
              },
              {
                product: { id: 'pro-3', name: 'Pure Cotton Gym Towel', price: 15.00, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600', category: 'Clean Activewear' },
                quantity: 2
              }
            ]
          },
          {
            id: 'WCM-304918-CA902',
            userId: 'cust-demo-2',
            name: 'Sophia Martinez',
            email: 'sophia.m@example.com',
            phone: '310-555-0144',
            address: '883 Ocean Breeze Way',
            city: 'Santa Monica',
            zipCode: '90401',
            paymentMethod: 'Apple Pay',
            status: 'Delivered',
            total: 79.50,
            subtotal: 79.50,
            shipping: 0.00,
            location: 'California, US (Demo Coordinates)',
            date: new Date(Date.now() - 28 * 3600_000).toISOString(),
            createdAt: new Date(Date.now() - 28 * 3600_000).toISOString(),
            items: [
              {
                product: { id: 'pro-2', name: 'AuraMist Organic Lavender Oil', price: 26.50, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600', category: 'Aroma & Air' },
                quantity: 3
              }
            ]
          }
        ];
        localStorage.setItem('wecare_demo_all_orders', JSON.stringify(demoOrdersDefault));
        setAllOrders(demoOrdersDefault);
      } else {
        setAllOrders(fallbackList);
      }
    } finally {
      setAllOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, deliveryDate?: string) => {
    if (demoUser) {
      const allSavedStr = localStorage.getItem('wecare_demo_all_orders') || '[]';
      const allOrdersList = JSON.parse(allSavedStr).map((o: any) => 
        o.id === orderId ? { ...o, status, ...(deliveryDate ? { deliveryDate } : {}) } : o
      );
      localStorage.setItem('wecare_demo_all_orders', JSON.stringify(allOrdersList));
      setAllOrders(allOrdersList);
      
      const uid = demoUser.uid;
      const saved = localStorage.getItem(`wecare_demo_orders_${uid}`);
      if (saved) {
        const userOrdersList = JSON.parse(saved).map((o: any) => 
          o.id === orderId ? { ...o, status, ...(deliveryDate ? { deliveryDate } : {}) } : o
        );
        localStorage.setItem(`wecare_demo_orders_${uid}`, JSON.stringify(userOrdersList));
        setUserOrders(userOrdersList);
      }
      return;
    }

    const path = `orders/${orderId}`;
    try {
      await setDoc(doc(db, 'orders', orderId), {
        status,
        ...(deliveryDate ? { deliveryDate } : {})
      }, { merge: true });

      // Live update states
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...(deliveryDate ? { deliveryDate } : {}) } : o));
      setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...(deliveryDate ? { deliveryDate } : {}) } : o));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const adminCreateOrder = async (orderData: Omit<OrderDetails, 'id'>, customUserId?: string): Promise<string> => {
    const orderId = `WCM-${Math.floor(100000 + Math.random() * 900000)}-${(orderData.address || 'NY').slice(-5).toUpperCase().replace(/[^A-Z0-9]/g, '')}`;
    
    if (demoUser) {
      const allSavedStr = localStorage.getItem('wecare_demo_all_orders') || '[]';
      const newOrder = {
        ...orderData,
        id: orderId,
        userId: customUserId || 'ADMIN-PLACED',
        createdAt: new Date().toISOString(),
        status: orderData.status || 'Pending'
      };
      const updatedOrders = [newOrder, ...JSON.parse(allSavedStr)];
      localStorage.setItem('wecare_demo_all_orders', JSON.stringify(updatedOrders));
      setAllOrders(updatedOrders);
      return orderId;
    }

    const path = 'orders';
    try {
      await setDoc(doc(db, path, orderId), {
        ...orderData,
        userId: customUserId || 'ADMIN-PLACED',
        createdAt: new Date().toISOString(),
        status: orderData.status || 'Pending'
      });

      // Fetch all orders to keep synchronicity
      await fetchAllOrders();
      return orderId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      throw err;
    }
  };

  const loginAsDemo = (role: 'admin' | 'customer', customEmail?: string) => {
    const isAd = role === 'admin';
    const mockProfile = {
      uid: isAd ? 'DEMO-ADMIN-UID' : 'DEMO-CUSTOMER-UID',
      email: customEmail || (isAd ? 'amritsitaula2022@gmail.com' : 'customer@example.com'),
      displayName: isAd ? 'Master Admin' : 'John Doe',
      emailVerified: true,
      isAnonymous: false
    };
    
    localStorage.setItem('wecare_demo_user', JSON.stringify(mockProfile));
    localStorage.setItem('wecare_demo_mode', 'true');
    setDemoUser(mockProfile);
    
    // Seed initial demo orders if empty
    const uid = mockProfile.uid;
    const currentOrders = localStorage.getItem(`wecare_demo_orders_${uid}`);
    if (!currentOrders) {
      const demoOrdersDefault = [
        {
          id: `WCM-492039-HOME`,
          userId: uid,
          name: mockProfile.displayName,
          email: mockProfile.email,
          address: '100 Wellness Way, Suite A',
          phone: '(555) 019-2834',
          paymentMethod: 'Credit Card',
          location: 'London, UK (Demo Coordinates)',
          items: [
            {
              product: {
                id: '1',
                name: 'Elite Blood Pressure Monitor',
                price: 59.99,
                category: 'Electronics',
                rating: 4.8,
                reviewCount: 124,
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
                gallery: [],
                description: 'Clinical grade upper arm blood pressure measurement device with dynamic cuff alignment detection.',
                fullDescription: 'Clinical grade upper arm blood pressure measurement device with dynamic cuff alignment detection.',
                specifications: [],
                stock: 15
              },
              quantity: 1
            }
          ],
          total: 59.99,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Shipped',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(`wecare_demo_orders_${uid}`, JSON.stringify(demoOrdersDefault));
      localStorage.setItem('wecare_demo_all_orders', JSON.stringify(demoOrdersDefault));
    }

    loadProfileForUser(uid, mockProfile);
    loadOrdersForUser(uid);
    if (isAd) {
      fetchAllOrders();
    }
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('wecare_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wecare_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle product lookup
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (selectedProductId) {
      import('../data/products').then(({ PRODUCTS }) => {
        const found = PRODUCTS.find(p => p.id === selectedProductId);
        setSelectedProduct(found || null);
      });
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId]);

  const navigateTo = (tab: TabType, productId: string | null = null) => {
    setCurrentTab(tab);
    setSelectedProductId(productId);
    // Smooth scroll back to top of preview on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Action Implementations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.stock);
        return updated;
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Wishlist Action Implementations
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        navigateTo,
        selectedProductId,
        selectedProduct,
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        quickViewProduct,
        setQuickViewProduct,
        lastOrder,
        setLastOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        toggleWishlist,
        isInWishlist,
        // Firebase additions
        user: effectiveUser,
        authLoading: demoUser ? false : authLoading,
        userOrders,
        userOrdersLoading,
        userProfile,
        userProfileLoading,
        logout,
        saveOrderToFirestore,
        fetchUserOrders,
        updateUserProfile,
        fetchUserProfile,
        // Admin Portal additions
        allOrders,
        allOrdersLoading,
        fetchAllOrders,
        updateOrderStatus,
        adminCreateOrder,
        adminNotifications,
        adminNotificationsLoading,
        fetchAdminNotifications,
        markAdminNotificationRead,
        isDemoMode,
        loginAsDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
