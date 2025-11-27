import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

const { Link } = ReactRouterDOM;

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Helper to format currency to Naira
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * 1500); 
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-slate-900 dark:text-white">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
          Seems like you haven't found anything you like yet. Browse our shop to find amazing gadgets!
        </p>
        <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        My Wishlist
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {wishlist.map((product) => (
            <div key={product.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="w-full sm:w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">{product.category}</div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400">{product.name}</h3>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 line-clamp-1">{product.description}</p>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(product.price)}</div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => { addToCart(product); removeFromWishlist(product.id); }}
                  className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ShoppingCart className="w-4 h-4" /> Move to Cart
                </button>
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
