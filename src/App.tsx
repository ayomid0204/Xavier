import React, { useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { AuthPage } from './pages/AuthPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProvider } from './context/AdminContext';

const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDOM;

// Component to handle global theme application to body
const ThemeController: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const body = document.body;
    const isAdminPage = location.pathname.startsWith('/admin');
    
    if (isAdminPage) {
       body.className = isDarkMode 
        ? 'bg-slate-950 text-slate-100 antialiased' 
        : 'bg-slate-100 text-slate-900 antialiased';
       body.style.backgroundImage = 'none';
    } else if (user) {
      body.className = isDarkMode 
        ? 'bg-slate-950 text-slate-100 antialiased transition-colors duration-300' 
        : 'bg-gray-50 text-slate-900 antialiased transition-colors duration-300';
      body.style.backgroundImage = 'none';
    } else {
      body.className = isDarkMode
        ? 'bg-slate-950 text-slate-100 antialiased transition-colors duration-300'
        : 'bg-slate-50 text-slate-900 antialiased transition-colors duration-300';
      
      if (!isDarkMode && !user) {
        // Dot pattern for guest pages
        body.style.backgroundImage = 'radial-gradient(#e2e8f0 1px, transparent 1px)';
        body.style.backgroundSize = '24px 24px';
      } else {
        body.style.backgroundImage = 'none';
      }
    }
  }, [user, isDarkMode, location.pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <AdminProvider>
              <CartProvider>
                <WishlistProvider>
                  <ReviewProvider>
                    <ThemeController />
                    <Routes>
                      {/* Standalone Admin Route - No User Layout */}
                      <Route path="/admin" element={<AdminPage />} />
                      
                      {/* Standalone Auth Routes */}
                      <Route path="/login" element={<AuthPage type="login" />} />
                      <Route path="/signup" element={<AuthPage type="signup" />} />
                      
                      {/* User Routes wrapped in Main Layout */}
                      <Route path="/*" element={
                        <Layout>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/product/:id" element={<ProductDetailsPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/contact" element={<ContactPage type="contact" />} />
                            <Route path="/complaints" element={<ContactPage type="complaint" />} />
                            <Route path="/about" element={<ContactPage type="about" />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Layout>
                      } />
                    </Routes>
                  </ReviewProvider>
                </WishlistProvider>
              </CartProvider>
            </AdminProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
