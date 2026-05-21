import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthStatus = () => {
      if (pb.authStore.isValid) {
        if (pb.authStore.model.collectionName === 'admin_users') {
          setAdminUser(pb.authStore.model);
          setIsAdminAuthenticated(true);
        } else {
          setCurrentUser(pb.authStore.model);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (pb.authStore.isValid) {
        if (model?.collectionName === 'admin_users') {
          setAdminUser(model);
          setIsAdminAuthenticated(true);
          setCurrentUser(null);
          setIsAuthenticated(false);
        } else {
          setCurrentUser(model);
          setIsAuthenticated(true);
          setAdminUser(null);
          setIsAdminAuthenticated(false);
        }
      } else {
        setCurrentUser(null);
        setAdminUser(null);
        setIsAuthenticated(false);
        setIsAdminAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      return authData;
    } catch (err) {
      throw new Error(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const adminLogin = async (email, password) => {
    try {
      // Admin users are NOT in Supabase Auth — verify via backend API which
      // does direct bcrypt comparison against the admin_users table.
      const response = await apiServerClient.fetch('/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Invalid admin credentials.');
      }

      const data = await response.json();

      // Manually populate authStore so the rest of the app treats this as authenticated
      pb.authStore.saveAdmin(data.token, {
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.name,
        role: data.admin.role,
        collectionName: 'admin_users',
      });

      return data;
    } catch (err) {
      throw new Error(err.message || 'Invalid admin credentials.');
    }
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const signup = async (username, email, mobile, password) => {
    try {
      const response = await apiServerClient.fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, mobile, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create account.');
      }

      return login(email, password);
    } catch (err) {
      throw new Error(err.message || 'Failed to create account. Please check your details.');
    }
  };

  const googleSignUp = async () => {
    try {
      // Generate a unique username to prevent validation errors during OAuth creation
      const randomSuffix = crypto.randomUUID().replace(/-/g, '').substring(0, 8);
      const uniqueUsername = `user_${randomSuffix}`;
      
      const authData = await pb.collection('users').authWithOAuth2({ 
        provider: 'google',
        createData: {
          username: uniqueUsername,
        }
      });
      return authData;
    } catch (err) {
      throw new Error(err.message || 'Google login failed');
    }
  };

  const requestOTP = async (email) => {
    try {
      const tempPassword = crypto.randomUUID();
      // Generate unique dummy values for username and mobile to prevent 400 unique constraint errors
      // when creating a placeholder user for OTP login
      const tempId = crypto.randomUUID().replace(/-/g, '').substring(0, 10);
      
      await pb.collection('users').create({
        email: email,
        password: tempPassword,
        passwordConfirm: tempPassword,
        username: `u_${tempId}`,
        mobile: `000${tempId}`
      }, { $autoCancel: false });
    } catch (e) {
      // If user exists, unique validation will throw 400 - which is fine, proceed to request OTP
      if (e.status !== 400) {
        console.error("Account creation check failed:", e);
      }
    }
    return await pb.collection('users').requestOTP(email, { $autoCancel: false });
  };

  const authWithOTP = async (otpId, code) => {
    return await pb.collection('users').authWithOTP(otpId, code, { $autoCancel: false });
  };

  const clearError = () => setError('');

  const value = {
    currentUser,
    adminUser,
    isAuthenticated,
    isAdminAuthenticated,
    isLoading,
    error,
    clearError,
    login,
    adminLogin,
    logout,
    signup,
    googleSignUp,
    requestOTP,
    authWithOTP
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};