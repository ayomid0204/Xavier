import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string, rememberMe?: boolean) => boolean;
  signup: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => void;
  changePassword: (newPassword: string) => void;
  // Admin functions
  allUsers: User[];
  deleteUser: (userId: string) => void;
  resetUserPassword: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Admin User
const ADMIN_USER: User = {
  id: 'admin_01',
  name: 'System Administrator',
  email: 'admin@xavier.com',
  password: 'XavierSecure#2024',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff'
};

// Mock initial users
const INITIAL_USERS: User[] = [
  ADMIN_USER,
  { id: 'u1', name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user', bio: 'Regular customer', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'user', bio: 'Tech enthusiast', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load User Database from Local Storage or fall back to Initial Users
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('xavier_users_db');
    return storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
  });

  // Current active session user
  const [user, setUser] = useState<User | null>(null);

  // Persist User Database whenever it changes
  useEffect(() => {
    localStorage.setItem('xavier_users_db', JSON.stringify(allUsers));
  }, [allUsers]);

  // Load active user session from Remember Me storage
  useEffect(() => {
    const storedUser = localStorage.getItem('xavier_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate that this user still exists in our "database"
        const dbUser = allUsers.find(u => u.id === parsedUser.id);
        if (dbUser) {
          setUser(dbUser);
        } else {
          // User was deleted from DB, so clear session
          localStorage.removeItem('xavier_user');
        }
      } catch (e) {
        localStorage.removeItem('xavier_user');
      }
    }
  }, []);

  // Keep session user in sync with database user (e.g. if profile/password changes)
  useEffect(() => {
    if (user) {
      const dbUser = allUsers.find(u => u.id === user.id);
      if (dbUser && JSON.stringify(dbUser) !== JSON.stringify(user)) {
        setUser(dbUser);
        // Update local storage if they were remembered
        if (localStorage.getItem('xavier_user')) {
          localStorage.setItem('xavier_user', JSON.stringify(dbUser));
        }
      }
    }
  }, [allUsers, user]);

  const login = (email: string, password?: string, rememberMe: boolean = false) => {
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      if (foundUser.password === password) {
        setUser(foundUser);
        if (rememberMe) {
          localStorage.setItem('xavier_user', JSON.stringify(foundUser));
        } else {
          // If not remember me, ensure we don't leave old data
          localStorage.removeItem('xavier_user');
        }
        return true;
      }
    }
    return false;
  };

  const signup = (name: string, email: string, password?: string) => {
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // User already exists
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      bio: 'New member',
    };
    
    setAllUsers(prev => [...prev, newUser]);
    
    // Simulate sending confirmation email
    console.log(`[System] Sending confirmation email to ${email}...`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xavier_user');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      // Update both state and db
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      setUser(updatedUser);
    }
  };

  const forgotPassword = (email: string) => {
    const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      console.log(`[System] Sending password reset link to ${email}`);
    }
  };

  const changePassword = (newPassword: string) => {
    if (user) {
      const updatedUser = { ...user, password: newPassword };
      // Update DB
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      // Update Session
      setUser(updatedUser);
      alert("Password changed successfully.");
    }
  };

  // Admin actions
  const deleteUser = (userId: string) => {
    // Filter out the user
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    
    // If the admin deleted themselves (unlikely but possible in logic), log them out
    if (user && user.id === userId) {
      logout();
    }
  };

  const resetUserPassword = (userId: string) => {
    // Actually reset the password in the "database"
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, password: 'password123' };
      }
      return u;
    }));
    
    // Find the user name for the alert
    const targetUser = allUsers.find(u => u.id === userId);
    if (targetUser) {
      alert(`Password for user "${targetUser.name}" has been reset to 'password123'.`);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      logout, 
      updateUserProfile, 
      isAuthenticated: !!user,
      forgotPassword,
      changePassword,
      allUsers,
      deleteUser,
      resetUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};