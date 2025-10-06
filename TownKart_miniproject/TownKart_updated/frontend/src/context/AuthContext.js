import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Base URL
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'BOOTSTRAP_DONE':
      return { ...state, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for saved user on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(savedUser) });
    } else {
      dispatch({ type: 'BOOTSTRAP_DONE' });
    }
  }, []);

  const login = async (email, password, role = 'customer') => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Check if user role matches the selected role
        if (data.user.role !== role) {
          throw new Error(`Please login as ${role} using the correct credentials`);
        }

        const userData = {
          ...data.user,
          token: data.token
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      toast.error(error.message);
      return false;
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const newUser = {
          ...data.user,
          token: data.token
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
        toast.success(`Welcome to TownKart, ${newUser.name}!`);
        return true;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      toast.error(error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};