import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint } from '../types';

interface AdminContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  markComplaintAsRead: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const addComplaint = (complaint: Complaint) => {
    setComplaints(prev => [complaint, ...prev]);
  };

  const markComplaintAsRead = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'read' } : c));
  };

  return (
    <AdminContext.Provider value={{ complaints, addComplaint, markComplaintAsRead }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};