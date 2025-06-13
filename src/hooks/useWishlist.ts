
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedWishlist = localStorage.getItem('vmk_wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev;
      }
      
      const newWishlist = [...prev, product];
      localStorage.setItem('vmk_wishlist', JSON.stringify(newWishlist));
      
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
      
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => item.id !== productId);
      localStorage.setItem('vmk_wishlist', JSON.stringify(newWishlist));
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
      
      return newWishlist;
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};
