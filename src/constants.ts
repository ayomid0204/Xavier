import { Category, Product, Review } from './types';

export const LOGO_URL = "https://ui-avatars.com/api/?name=Xavier+Gadget+Hub&background=000000&color=ffffff&size=128&bold=true&font-size=0.33"; // Replace this URL with your uploaded image URL

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    category: Category.PHONE,
    description: 'The ultimate iPhone with titanium design.',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    brand: 'Apple'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299,
    category: Category.PHONE,
    description: 'Galaxy AI is here. Epic mountains to simulate photo capabilities.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800',
    brand: 'Samsung'
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    price: 1599,
    category: Category.LAPTOP,
    description: 'Mind-blowing. Head-turning. The best Mac ever.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800',
    brand: 'Apple'
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    price: 1499,
    category: Category.LAPTOP,
    description: 'High performance Windows laptop for creators.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800',
    brand: 'Dell'
  },
  {
    id: '5',
    name: 'JBL Flip 6',
    price: 129,
    category: Category.SPEAKER,
    description: 'Bold sound for every adventure. Waterproof.',
    image: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=800',
    brand: 'JBL'
  },
  {
    id: '6',
    name: 'JBL Pulse 5',
    price: 249,
    category: Category.SPEAKER,
    description: 'Sound you can see. Light show speaker.',
    image: 'https://images.unsplash.com/photo-1589003077984-833447f0dd24?auto=format&fit=crop&q=80&w=800',
    brand: 'JBL'
  },
  {
    id: '7',
    name: 'Apple Watch Ultra 2',
    price: 799,
    category: Category.WATCH,
    description: 'Rugged and capable. Built for the outdoors.',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=800',
    brand: 'Apple'
  },
  {
    id: '8',
    name: 'Netgear Nighthawk WiFi 6E',
    price: 499,
    category: Category.ROUTER,
    description: 'Blazing fast speeds for gaming and streaming.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80&w=800',
    brand: 'Netgear'
  },
  {
    id: '9',
    name: 'Logitech MX Master 3S',
    price: 99,
    category: Category.ACCESSORY,
    description: 'An icon remastered. The best mouse for productivity.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    brand: 'Logitech'
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userId: 'u1',
    userName: 'TechEnthusiast',
    rating: 5,
    comment: 'Absolutely stunning phone. The battery life is incredible.',
    date: '2024-02-15'
  },
  {
    id: 'r2',
    productId: '1',
    userId: 'u2',
    userName: 'Sarah M.',
    rating: 4,
    comment: 'Great phone but a bit pricey.',
    date: '2024-02-20'
  },
  {
    id: 'r3',
    productId: '5',
    userId: 'u3',
    userName: 'MusicLover99',
    rating: 5,
    comment: 'Best portable speaker I have ever owned. JBL rocks!',
    date: '2024-03-01'
  }
];

export const WHATSAPP_NUMBER = "2348000000000"; // Replace with actual dealer number