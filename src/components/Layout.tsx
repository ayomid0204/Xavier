import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, Facebook, Twitter, Instagram, Heart, Search, LogOut, Bell, Moon, Sun, Shield, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductContext';
import { ChatWidget } from './ChatWidget';
import { LOGO_URL } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { items } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = document.body;
    if (user) {
      body.className = isDarkMode 
        ? 'bg-slate-950 text-slate-100 antialiased transition-colors duration-300' 
        : 'bg-gray-50 text-slate-900 antialiased transition-colors duration-300';
    } else {
      body.className = isDarkMode
        ? 'bg-slate-950 text-slate-100 antialiased transition-colors duration-300'
        : 'bg-slate-50 text-slate-900 antialiased transition-colors duration-300';
      
      if (!isDarkMode && !user) {
        body.style.backgroundImage = 'radial-gradient(#e2e8f0 1px, transparent 1px)';
        body.style.backgroundSize = '24px 24px';
      } else {
        body.style.backgroundImage = 'none';
      }
    }
  }, [user, isDarkMode]);

  const isActive = (path: string) => location.pathname === path 
    ? 'text-blue-600 dark:text-blue-400 font-bold' 
    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowSuggestions(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = searchQuery.length > 0 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (typeof p.category === 'string' && p.category.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img src={LOGO_URL} alt="Xavier Gadget Hub" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block font-heading">XAVIER HUB</span>
            </Link>

            <div className="flex-1 max-w-lg relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </form>
              
              {showSuggestions && searchQuery.length > 0 && (
                <div className="absolute mt-2 w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map(product => (
                      <Link 
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center group"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 capitalize bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">{product.category}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No results found</div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/shop" className={isActive('/shop')}>Shop</Link>
              <Link to="/about" className={isActive('/about')}>About</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-red-500 font-bold flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg"><Shield className="w-4 h-4" /> Admin</Link>
              )}
            </div>

            <div className="flex items-center space-x-4 sm:space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Welcome to Xavier Hub!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/wishlist" className="relative cursor-pointer hover:opacity-80 text-slate-600 dark:text-slate-400 transition-colors">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{wishlist.length}</span>}
              </Link>

              <Link to="/cart" className="relative cursor-pointer hover:opacity-80 text-slate-600 dark:text-slate-400 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{items.length}</span>}
              </Link>

              {user ? (
                <div className="relative" ref={profileRef}>
                   <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 pl-2 focus:outline-none">
                     <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600">
                       {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>}
                     </div>
                   </button>
                   
                   {isProfileOpen && (
                     <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50">
                       <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                         <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.role === 'admin' ? 'Administrator' : user.email}</p>
                       </div>
                       {user.role === 'admin' ? (
                         <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2" onClick={() => setIsProfileOpen(false)}>
                           <Shield className="w-4 h-4" /> Dashboard
                         </Link>
                       ) : (
                         <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2" onClick={() => setIsProfileOpen(false)}>
                           <UserIcon className="w-4 h-4" /> Profile
                         </Link>
                       )}
                       <button onClick={() => { logout(); navigate('/'); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                         <LogOut className="w-4 h-4" /> Logout
                       </button>
                     </div>
                   )}
                </div>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-sm">
                  Sign In
                </Link>
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-700 dark:text-slate-300 p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4 shadow-lg">
             <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input type="text" className="block w-full pl-4 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>
            </div>
            <Link to="/" className="block text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="block text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/wishlist" className="block text-slate-600 dark:text-slate-300 font-medium p-2 flex justify-between" onClick={() => setIsMenuOpen(false)}>Wishlist {wishlist.length > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{wishlist.length}</span>}</Link>
            <Link to="/cart" className="block text-slate-600 dark:text-slate-300 font-medium p-2 flex justify-between" onClick={() => setIsMenuOpen(false)}>Cart {items.length > 0 && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">{items.length}</span>}</Link>
             {user ? (
               <>
                {user.role === 'admin' ? (
                   <Link to="/admin" className="block text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                ) : (
                   <Link to="/profile" className="block text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                )}
                <button onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }} className="text-red-500 font-medium w-full text-left flex items-center gap-2 p-2"><LogOut className="w-4 h-4" /> Logout</button>
               </>
             ) : (
               <Link to="/login" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
             )}
          </div>
        )}
      </nav>

      <main className="flex-grow relative z-10">{children}</main>

      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img src={LOGO_URL} alt="Xavier Gadget Hub" className="w-8 h-8 object-contain rounded bg-white/10" />
                <span className="font-bold text-xl text-white tracking-tight">XAVIER HUB</span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-400">
                Your premium destination for the latest electronics, gadgets, and smart devices. Experience the future today with our curated selection.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="https://www.facebook.com/share/1ZJSCMw65G/?mibextid=wwXIfr" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/xavier_gadget_hub?igsh=cTN6aDljMTQweWVu&utm_source=qr" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/home" className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/shop" className="hover:text-blue-400 transition-colors">Shop All Products</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/complaints" className="hover:text-blue-400 transition-colors">File a Complaint</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>Computer Village, Ikeja Lagos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>+2347061002464</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>oluwadamilareafolabi2909@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Newsletter</h4>
              <p className="text-sm text-slate-400 mb-4">Subscribe to receive updates on new arrivals and special offers.</p>
              <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" required />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2024 Xavier Gadget Hub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
};
