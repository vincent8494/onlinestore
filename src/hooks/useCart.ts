import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      const storedCart = localStorage.getItem('vmk_cart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error('Error parsing cart data:', error);
          localStorage.removeItem('vmk_cart');
        }
      }
      isInitialMount.current = false;
    }
  }, []);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    // Check authentication status
    const authStatus = isLoggedIn;
    
    if (!authStatus) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "default",
      });
      navigate('/login');
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      
      localStorage.setItem('vmk_cart', JSON.stringify(newCart));
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
      
      return newCart;
    });
  }, [isLoggedIn, navigate, toast]);

  const removeFromCart = (productId: number) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== productId);
      localStorage.setItem('vmk_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev => {
      const newCart = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('vmk_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('vmk_cart');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
};
