import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, clearCurrentUser, authenticateUser, getUsers } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userId, pin) => {
    const authenticatedUser = authenticateUser(userId, pin);
    if (authenticatedUser) {
      // Remove sensitive data before storing in state
      const userForSession = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        shortName: authenticatedUser.shortName || authenticatedUser.name,
        role: authenticatedUser.role,
        canEditAll: authenticatedUser.canEditAll,
        canManageTransfers: authenticatedUser.canManageTransfers,
      };
      setUser(userForSession);
      setCurrentUser(userForSession);
      return { success: true, user: userForSession };
    }
    return { success: false, error: 'PIN incorrecto' };
  };

  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };

  const getAllUsers = () => {
    return getUsers().map((u) => ({
      id: u.id,
      name: u.name,
      shortName: u.shortName || u.name,
    }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getAllUsers,
    isAuthenticated: !!user,
    isParent: user?.role === 'parent',
    canManageTransfers: user?.canManageTransfers || false,
    canEditAll: user?.canEditAll || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
