export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For discount display
  category: string;
  subCategory?: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  description: string;
  fullDescription: string;
  specifications: Specification[];
  stock: number;
  isTrending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface OrderDetails {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
  date: string;
  deliveryDate: string;
  status?: string;
  location?: string;
  paymentStatus?: string;
  transactionId?: string;
}

export type Category = 'Electronics' | 'Fashion' | 'Home & Kitchen' | 'Beauty' | 'Sports';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  location?: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  orderId?: string;
  customerName?: string;
  amount?: number;
}

export function formatPrice(price: number): string {
  // Convert standard USD base prices to realistic Nepalese Rupees (NPR) by multiplying by 130
  const nprPrice = price * 130;
  return `Rs. ${Math.round(nprPrice).toLocaleString()}`;
}



