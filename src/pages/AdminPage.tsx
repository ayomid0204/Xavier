import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useAdmin } from '../context/AdminContext';
import { Category, Product } from '../types';
import { Trash2, LogOut, LayoutDashboard, Package, Users, MessageSquare, Upload, Settings, Lock, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';

export const AdminPage: React.FC = () => {
  const { user, logout, allUsers, deleteUser, resetUserPassword, changePassword } = useAuth();
  const { products, addProduct, removeProduct } = useProducts();
  const { complaints, markComplaintAsRead } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'complaints' | 'settings'>('dashboard');

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: Category.PHONE,
    description: '',
    brand: '',
    image: ''
  });
  
  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guard clause for non-admins
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">This area is restricted to administrators only.</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Return to Store</button>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      addProduct({
        id: Date.now().toString(),
        name: newProduct.name!,
        price: Number(newProduct.price),
        category: newProduct.category || Category.PHONE,
        description: newProduct.description || '',
        image: newProduct.image || 'https://via.placeholder.com/300',
        brand: newProduct.brand || 'Generic'
      });
      // Reset
      setNewProduct({ name: '', price: 0, category: Category.PHONE, description: '', brand: '', image: '' });
      alert('Product added successfully!');
    }
  };

  const handleDeleteUser = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteUser(id);
    }
  };

  const handleResetPassword = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to reset the password for ${name} to 'password123'?`)) {
      resetUserPassword(id);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    changePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * 1500); 
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl flex-shrink-0 z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Xavier Admin" className="w-8 h-8 object-contain rounded bg-white/10" />
            <div>
              <h2 className="font-bold text-lg tracking-wide">XAVIER</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Admin Console</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Package className="w-5 h-5" /> Products
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5" /> Users
          </button>
          <button onClick={() => setActiveTab('complaints')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === 'complaints' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <MessageSquare className="w-5 h-5" /> Complaints
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
              <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-2 rounded-lg transition-colors text-sm font-bold">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
            <header className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
               <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                   <Package className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Products</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</h3>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                   <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Registered Users</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{allUsers.length}</h3>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-full text-yellow-600 dark:text-yellow-400">
                   <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Complaints</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{complaints.filter(c => c.status === 'new').length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><BarChart className="w-5 h-5" /> Recent Activity</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4 text-sm p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="flex-1 text-slate-600 dark:text-slate-300">Admin Login detected</p>
                    <span className="text-slate-400">Just now</span>
                 </div>
                 <div className="flex items-center gap-4 text-sm p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="flex-1 text-slate-600 dark:text-slate-300">New product view spike</p>
                    <span className="text-slate-400">1h ago</span>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
             <header className="flex justify-between items-center">
               <div>
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Management</h1>
                 <p className="text-slate-500 dark:text-slate-400">Add, edit, or remove inventory.</p>
               </div>
            </header>
            
            {/* Add Product Form */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2"><Package className="w-5 h-5" /> Add New Item</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Product Name</label>
                  <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. iPhone 15" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Price (USD Base)</label>
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 999" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Brand</label>
                  <input type="text" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Apple" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Description</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Product details..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Product Image</label>
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-sm">
                      <Upload className="w-4 h-4" /> Upload Image
                    </button>
                    {newProduct.image && <img src={newProduct.image} alt="Preview" className="h-12 w-12 object-cover rounded-lg border border-slate-200 dark:border-slate-600" />}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>
                </div>
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">Add Product to Inventory</button>
              </form>
            </div>

            {/* Existing Products List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Inventory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4">Price (NGN)</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-600" alt="" />
                            <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase">{product.category}</span>
                            <span className="text-xs text-slate-500">{product.brand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => removeProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remove Product">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
            <header>
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
               <p className="text-slate-500 dark:text-slate-400">Monitor and manage registered accounts.</p>
            </header>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">User Identity</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-right">Security Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs overflow-hidden border-2 border-white dark:border-slate-600">
                             <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-xs text-slate-400">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                         <div className="flex items-center justify-end gap-2">
                           <button type="button" onClick={(e) => handleResetPassword(e, u.id, u.name)} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium border border-blue-100 dark:border-blue-800 cursor-pointer z-10 relative">Reset PW</button>
                           {u.role !== 'admin' && (
                              <button type="button" onClick={(e) => handleDeleteUser(e, u.id, u.name)} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 font-medium border border-red-100 dark:border-red-800 cursor-pointer z-10 relative">Delete</button>
                           )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
             <header>
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customer Feedback</h1>
               <p className="text-slate-500 dark:text-slate-400">Manage support tickets and inquiries.</p>
             </header>

             {complaints.length === 0 ? (
               <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                 <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <p className="text-slate-500">No complaints registered yet.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {complaints.map(complaint => (
                   <div key={complaint.id} className={`bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm transition-all ${complaint.status === 'new' ? 'border-l-4 border-l-blue-500 border-y-slate-100 border-r-slate-100 dark:border-y-slate-700 dark:border-r-slate-700' : 'border-slate-200 dark:border-slate-700 opacity-80'}`}>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${complaint.type === 'complaint' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{complaint.type}</span>
                             <span className="text-sm font-bold text-slate-900 dark:text-white">{complaint.name}</span>
                          </div>
                          <p className="text-xs text-slate-400">{complaint.date}</p>
                        </div>
                        {complaint.status === 'new' && (
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </span>
                        )}
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-4">
                       <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{complaint.message}</p>
                     </div>
                     <div className="flex items-center justify-between">
                        <a href={`mailto:${complaint.email}`} className="text-blue-600 text-sm hover:underline font-medium flex items-center gap-1">Reply to {complaint.email}</a>
                        {complaint.status === 'new' && (
                          <button onClick={() => markComplaintAsRead(complaint.id)} className="text-xs bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-slate-600 dark:text-slate-300">Mark as Read</button>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
             <header className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security Settings</h1>
               <p className="text-slate-500 dark:text-slate-400">Manage your administrator credentials.</p>
             </header>
             
             <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-700">
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                   <Lock className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="font-bold text-xl text-slate-900 dark:text-white">Change Password</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Ensure your account uses a strong, unique password.</p>
                 </div>
               </div>
               
               <form onSubmit={handleChangePassword} className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                   <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                   <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">Update Credentials</button>
               </form>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};