import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, AlertCircle, CheckCircle, Shield, User } from 'lucide-react';
import { LOGO_URL } from '../constants';

interface AuthPageProps {
  type: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Restored Admin Toggle State
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [view, setView] = useState<'default' | 'forgot'>('default'); 

  const { login, signup, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const success = login(email, password, rememberMe);
      if (success) {
        // Auto-redirect based on email/role logic
        if (email.toLowerCase() === 'admin@xavier.com') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError("Incorrect email or password. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const success = signup(name, email, password);
      if (success) {
        setSuccessMsg("Account created successfully! A confirmation email has been sent to " + email + ". Please check your inbox.");
      } else {
        setError("An account with this email already exists.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      forgotPassword(email);
      setSuccessMsg(`Password reset instructions have been sent to ${email}. Please check your inbox/spam folder.`);
      setIsLoading(false);
    }, 1000);
  };

  // Toggle Admin Mode visually
  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
    setError('');
    setSuccessMsg('');
  };

  if (view === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-6">
            <img src={LOGO_URL} alt="Xavier Hub" className="w-12 h-12 object-contain mx-auto mb-4 rounded bg-white/10" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Enter your email to receive a reset link.</p>
          </div>
          
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none" placeholder="name@example.com" />
             </div>
             <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
               {isLoading ? 'Sending...' : 'Send Reset Link'}
             </button>
          </form>
          <button onClick={() => setView('default')} className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900">
      
      {/* Left Side - Decorative Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070" 
             alt="Authentication Background" 
             className="w-full h-full object-cover opacity-40"
           />
           <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-slate-900/90 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 max-w-lg px-8 text-center">
          <div className="mb-8 flex justify-center">
            <img src={LOGO_URL} alt="Xavier Logo" className="w-24 h-24 object-contain rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm p-2" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            {isAdmin ? 'Admin Console' : 'XAVIER HUB'}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-light">
            {isAdmin 
              ? 'Secure gateway for system administration and inventory management.' 
              : 'Your premium destination for the latest smartphones, laptops, and accessories.'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-slate-50 dark:bg-slate-950">
        
        {/* Admin Toggle Button */}
        {type === 'login' && (
          <button 
            onClick={toggleAdmin}
            className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-600 dark:text-slate-300"
          >
            {isAdmin ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {isAdmin ? 'User Login' : 'Admin Access'}
          </button>
        )}

        <div className="max-w-md w-full space-y-8">
           <div className="text-center lg:text-left">
             <div className="lg:hidden flex justify-center mb-6">
                <img src={LOGO_URL} alt="Xavier Logo" className="w-16 h-16 object-contain rounded-xl" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
               {isAdmin ? 'Admin Portal' : (type === 'login' ? 'Welcome back' : 'Create Account')}
             </h2>
             <p className="mt-2 text-slate-600 dark:text-slate-400">
               {isAdmin 
                 ? 'Please enter your credentials to continue.' 
                 : (type === 'login' ? 'Enter your details to access your account.' : 'Join us to experience premium tech.')}
             </p>
           </div>

           {/* Feedback Messages */}
           {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
           )}
           {successMsg && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {successMsg}
              </div>
           )}

           <form className="space-y-5" onSubmit={type === 'login' ? handleLogin : handleSignup}>
              {type === 'signup' && (
                  <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20" placeholder="John Doe" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20" placeholder={isAdmin ? "admin@xavier.com" : "name@example.com"} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  {type === 'login' && (
                    <button type="button" onClick={() => setView('forgot')} className="text-xs font-medium text-blue-600 hover:underline">Forgot Password?</button>
                  )}
                </div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20" placeholder="••••••••" />
              </div>

              {/* Remember Me Checkbox */}
              {type === 'login' && (
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white dark:bg-slate-800 dark:border-slate-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Remember me
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${isAdmin ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
              >
                {isLoading ? 'Processing...' : (isAdmin ? 'Access Dashboard' : (type === 'login' ? 'Sign In' : 'Create Account'))}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
           </form>

           <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm">
             {type === 'login' ? (
               <p className="text-slate-600 dark:text-slate-400">
                 Don't have an account? <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">Sign up for free</Link>
               </p>
             ) : (
               <p className="text-slate-600 dark:text-slate-400">
                 Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">Sign in</Link>
               </p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};