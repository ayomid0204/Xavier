import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Category } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewContext';
import { WHATSAPP_NUMBER } from '../constants';
import { Filter, Heart, Star, MessageCircle } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<Category | string>('All');
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getAverageRating } = useReviews();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * 1500); 
  };

  const handleBuyNow = (product: any) => {
    const message = `Hello, I am interested in buying the ${product.name} priced at ${formatCurrency(product.price)}. Is it available?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (searchQuery) setSelectedCategory('All');
  }, [searchQuery]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{searchQuery ? `Search Results for "${searchQuery}"` : 'Shop Devices'}</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">{filteredProducts.length} products</span>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">Categories</h2>
            </div>
            <div className="space-y-2">
              <button onClick={() => setSelectedCategory('All')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'All' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>All Products</button>
              {Object.values(Category).map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{cat}</button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const rating = getAverageRating(product.id);
              return (
                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full hover:shadow-md transition-all group">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
                    <Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" /></Link>
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 dark:text-white">{product.brand}</div>
                    <button onClick={(e) => { e.preventDefault(); inWishlist ? removeFromWishlist(product.id) : addToWishlist(product); }} className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${inWishlist ? 'bg-red-50 dark:bg-red-900/50 text-red-500' : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-red-500'}`}><Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} /></button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">{product.category}</div>
                      <div className="flex items-center text-yellow-400 gap-1 text-xs"><Star className="w-3 h-3 fill-current" /><span className="text-slate-600 dark:text-slate-300 font-medium">{rating > 0 ? rating.toFixed(1) : 'New'}</span></div>
                    </div>
                    <Link to={`/product/${product.id}`}><h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{product.name}</h3></Link>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="mt-auto">
                       <div className="flex justify-between items-center mb-3">
                         <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => addToCart(product)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">Add to Cart</button>
                         <button onClick={() => handleBuyNow(product)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"><MessageCircle className="w-4 h-4" /></button>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};