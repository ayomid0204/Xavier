import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Complaint } from '../types';

interface ContactPageProps {
  type: 'contact' | 'complaint' | 'about';
}

export const ContactPage: React.FC<ContactPageProps> = ({ type }) => {
  const [submitted, setSubmitted] = useState(false);
  const { addComplaint } = useAdmin();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', orderId: '' });
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      type: type === 'complaint' ? 'complaint' : 'contact',
      name: formData.name,
      email: formData.email,
      message: formData.message,
      orderId: formData.orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    };

    addComplaint(newComplaint);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '', orderId: '' });
  };

  if (type === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-slate-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">About Xavier Gadget Hub</h1>
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-center">
            We are passionate about connecting people with the best technology the world has to offer.
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
                alt="Office" 
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Founded in 2024, Xavier Gadget Hub started with a simple idea: technology should be accessible, reliable, and fun.
              </p>
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
                <li>Customer Obsession</li>
                <li>Tech Integrity</li>
                <li>Sustainable Innovation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {type === 'contact' ? 'Contact Us' : 'File a Complaint'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {type === 'contact' 
            ? 'Have a question? We\'d love to hear from you.' 
            : 'We take your feedback seriously. Please let us know what went wrong.'}
        </p>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center">
            <p className="font-medium">Thank you for your submission!</p>
            <p className="text-sm">We will get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-green-800 dark:text-green-400 underline text-sm">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none" placeholder="john@example.com" />
            </div>
            {type === 'complaint' && (
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order ID (Optional)</label>
                <input type="text" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none" placeholder="#ORD-12345" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
              {type === 'contact' ? 'Send Message' : 'Submit Complaint'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};