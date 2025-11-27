import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../constants';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, MessageCircle } from 'lucide-react';

const { Link } = ReactRouterDOM;

export const CartPage: React.FC = () => {
  const { items, addToCart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * 1500); 
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = "Hello Xavier Gadget Hub, I would like to place an order:\n\n";
    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}): ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\nTotal: ${formatCurrency(total)}`;
    message += `\n\nPlease provide payment details.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-slate-900 dark:text-white">
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30">
          Browse Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                <div className="text-blue-600 dark:text-blue-400 font-bold mt-1">{formatCurrency(item.price)}</div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-1">
                <button 
                   onClick={() => updateQuantity(item.id, item.quantity - 1)}
                   className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-colors text-slate-600 dark:text-slate-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold w-4 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                <button 
                   onClick={() => updateQuantity(item.id, item.quantity + 1)}
                   className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-colors text-slate-600 dark:text-slate-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button onClick={clearCart} className="text-red-500 text-sm font-medium hover:underline">Clear Cart</button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping Estimate</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax Estimate</span>
                <span>{formatCurrency(total * 0.075)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                <span>Order Total</span>
                <span>{formatCurrency(total * 1.075)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-6 h-6" /> Buy on WhatsApp
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
              Checkout securely via our official WhatsApp business channel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
