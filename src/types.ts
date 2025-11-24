export enum Category {
  PHONE = 'Phones',
  LAPTOP = 'Laptops',
  ROUTER = 'Routers',
  WATCH = 'Wristwatches',
  SPEAKER = 'Speakers',
  ACCESSORY = 'Accessories'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category | string;
  description: string;
  image: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Added for mock auth
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AppState {
  cart: CartItem[];
  user: User | null;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Complaint {
  id: string;
  name: string;
  email: string;
  type: 'contact' | 'complaint';
  message: string;
  orderId?: string;
  date: string;
  status: 'new' | 'read';
}