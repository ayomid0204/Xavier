import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { WHATSAPP_NUMBER } from '../constants';
import { ArrowRight, Package, Heart, User, MessageCircle, ChevronRight } from 'lucide-react';

const { Link } = ReactRouterDOM;

export const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { products } = useProducts();
  
  // Get latest 4 products
  const featuredProducts = products.slice(0, 4);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * 1500); 
  };

  const handleBuyNow = (product: any) => {
    const message = `Hello, I am interested in buying the ${product.name} priced at ${formatCurrency(product.price)}. Is it available?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Logged In View (Dashboard)
  if (user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden border border-slate-700">
           <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-600/20 to-transparent"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-600 rounded-lg">
                 <User className="w-5 h-5 text-white" />
               </div>
               <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
             </div>
             <p className="text-slate-300 max-w-xl mb-8 text-lg">
               Your personal tech hub is ready. Check out the latest arrivals in Nigeria's premium gadget store.
             </p>
             <div className="flex flex-wrap gap-4">
               <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1">
                 Browse Shop <ArrowRight className="w-4 h-4" />
               </Link>
               <Link to="/profile" className="inline-flex items-center gap-2 bg-slate-700/50 text-white font-bold py-3 px-8 rounded-full backdrop-blur-sm hover:bg-slate-700 transition-all border border-slate-600">
                 Manage Profile
               </Link>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <Link to="/wishlist" className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Heart className="w-24 h-24 text-red-500" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Wishlist</h3>
                <p className="text-slate-500 dark:text-slate-400">{wishlist.length} saved items</p>
              </div>
           </Link>

           <Link to="/cart" className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Package className="w-24 h-24 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">My Cart</h3>
                <p className="text-slate-500 dark:text-slate-400">View pending orders</p>
              </div>
           </Link>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Need Help?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Our support team is available 24/7</p>
                <Link to="/contact" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Contact Support</Link>
              </div>
           </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{product.brand}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 truncate text-lg">{product.name}</h3>
                <div className="text-xl font-bold text-slate-900 dark:text-white mb-4">{formatCurrency(product.price)}</div>
                <div className="mt-auto flex gap-3">
                  <button onClick={() => addToCart(product)} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white text-slate-900 dark:text-white px-3 py-2.5 rounded-xl font-bold text-sm transition-all">
                    Add to Cart
                  </button>
                  <button onClick={() => handleBuyNow(product)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Guest View (The Requested Design)
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070" 
            alt="Retro Tech Background" 
            className="w-full h-full object-cover opacity-50"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Brand Name Styled Specifically */}
          <div className="mb-6 animate-in fade-in zoom-in duration-1000">
            <h1 className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 leading-tight">
              <span className="font-serif text-5xl md:text-8xl text-white font-bold tracking-tight">XAVIER</span>
              <span className="font-sans text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-lg">Gadget Hub</span>
            </h1>
          </div>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light tracking-wide animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-200">
            Your premium destination for the latest smartphones, laptops, and accessories in Nigeria.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300">
            <Link 
              to="/shop" 
              className="bg-white text-black font-bold py-4 px-10 rounded-full hover:bg-slate-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Shop Latest Gadgets
            </Link>
            <Link 
              to="/shop?category=Accessories" 
              className="bg-transparent border border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              View Accessories
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Preview Section */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Trending Now</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
            </div>
            <Link to="/shop" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              View Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden bg-slate-800 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <button onClick={() => addToCart(product)} className="absolute top-3 right-3 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-black">
                    <Package className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 relative z-10">
                  <p className="text-xs font-bold text-cyan-400 mb-1">{product.brand}</p>
                  <h3 className="text-white font-bold text-lg mb-2 truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-white">{formatCurrency(product.price)}</span>
                    <Link to={`/product/${product.id}`} className="text-sm text-slate-400 hover:text-white underline underline-offset-4">Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             {['Phones', 'Laptops', 'Watches', 'Speakers', 'Routers', 'Gaming'].map((cat, idx) => (
               <Link key={idx} to={`/shop`} className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all group">
                 <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{cat}</span>
               </Link>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};
