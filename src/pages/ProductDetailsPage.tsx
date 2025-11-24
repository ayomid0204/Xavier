import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { WHATSAPP_NUMBER } from '../constants';
import { Star, ShoppingCart, Heart, ArrowLeft, User as UserIcon, Send, MessageCircle } from 'lucide-react';
import { Review } from '../types';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getProductReviews, addReview, getAverageRating } = useReviews();
  const { user } = useAuth();

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * 1500); 
  };

  const handleBuyNow = () => {
    if (!product) return;
    const message = `Hello, I am interested in buying the ${product.name} priced at ${formatCurrency(product.price)}. Is it available?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">Back to Shop</button>
      </div>
    );
  }

  const reviews = getProductReviews(product.id);
  const averageRating = getAverageRating(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newReview: Review = {
      id: Date.now().toString(),
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0]
    };

    addReview(newReview);
    setReviewText('');
    setRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
        </div>

        <div>
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">{product.category}</div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="flex items-center text-yellow-400">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
               ))}
             </div>
             <span className="text-slate-500 dark:text-slate-400 text-sm">({reviews.length} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{formatCurrency(product.price)}</div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
            {product.description} 
            Designed with precision and built for performance, the {product.name} from {product.brand} delivers an exceptional experience.
          </p>

          <div className="flex gap-4 mb-8 flex-wrap">
            <button onClick={() => addToCart(product)} className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> Buy Now
            </button>
            <button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)} className={`px-6 rounded-xl border-2 font-bold text-lg transition-all flex items-center justify-center gap-2 ${inWishlist ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'}`}>
              <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500 dark:text-slate-400">Brand:</span> <span className="font-medium text-slate-900 dark:text-white">{product.brand}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400">Availability:</span> <span className="font-medium text-green-600 dark:text-green-400">In Stock</span></div>
                <div><span className="text-slate-500 dark:text-slate-400">Warranty:</span> <span className="font-medium text-slate-900 dark:text-white">1 Year</span></div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Customer Reviews</h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
           {!user ? (
             <div className="text-center py-6">
               <p className="text-slate-600 dark:text-slate-400 mb-4">Please sign in to write a review.</p>
               <button onClick={() => navigate('/login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign In Now</button>
             </div>
           ) : (
             <form onSubmit={handleSubmitReview}>
               <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Write a Review</h3>
               <div className="mb-4">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                 <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                       <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                     </button>
                   ))}
                 </div>
               </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Review</label>
                 <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none" placeholder="What did you like or dislike?" />
               </div>
               <button type="submit" className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors flex items-center gap-2"><Send className="w-4 h-4" /> Post Review</button>
             </form>
           )}
        </div>
        <div className="space-y-6">
          {reviews.length === 0 ? <p className="text-slate-500 text-center">No reviews yet.</p> : reviews.map((review) => (
            <div key={review.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300"><UserIcon className="w-5 h-5" /></div>
                  <div><div className="font-bold text-slate-900 dark:text-white">{review.userName}</div><div className="text-xs text-slate-500 dark:text-slate-400">{review.date}</div></div>
                </div>
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />)}</div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};