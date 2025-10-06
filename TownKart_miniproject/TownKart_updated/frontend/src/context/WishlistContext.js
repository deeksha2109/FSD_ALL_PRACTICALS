import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload };

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product) => {
    if (state.items.some(item => item.id === product.id)) {
      toast.error('Item already in wishlist');
      return;
    }
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    toast.success(`${product.name} added to wishlist`);
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    toast.success('Item removed from wishlist');
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider value={{
      ...state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};