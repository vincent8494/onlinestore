import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toProductUUID } from '@/lib/productIdMap';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface RawWishlistItem {
  id: string;
  products: {
    id: string;
    name: string;
    price: number;
    product_images: { image_url: string }[];
  } | null;
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistItems([]); return; }

    let { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wishlist) {
      const { data: newWishlist }: { data: { id: string } | null } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id })
        .select('id')
        .maybeSingle();
      wishlist = newWishlist;
    }

    if (!wishlist) return;
    setWishlistId(wishlist.id);

    const { data: items } = await supabase
      .from('wishlist_items')
      .select('id, products(id, name, price, product_images(image_url))')
      .eq('wishlist_id', wishlist.id);

    if (items) {
      setWishlistItems(
        (items as unknown as RawWishlistItem[])
          .filter(i => i.products)
          .map(i => ({
            id: i.products!.id,
            name: i.products!.name,
            price: i.products!.price,
            image: i.products!.product_images?.[0]?.image_url ?? '/placeholder.svg',
          }))
      );
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = useCallback(async (product: WishlistItem) => {
    if (!wishlistId) return;
    if (wishlistItems.find(i => i.id === product.id)) return;

    const { error } = await supabase
      .from('wishlist_items')
      .insert({ wishlist_id: wishlistId, product_id: toProductUUID(product.id) });

    if (!error) {
      toast({ title: 'Added to wishlist!', description: `${product.name} has been added to your wishlist.` });
      fetchWishlist();
    }
  }, [wishlistId, wishlistItems, toast, fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!wishlistId) return;
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', wishlistId)
      .eq('product_id', toProductUUID(productId));

    toast({ title: 'Removed from wishlist', description: 'Item has been removed from your wishlist.' });
    fetchWishlist();
  }, [wishlistId, toast, fetchWishlist]);

  const isInWishlist = (productId: string) => wishlistItems.some(i => i.id === productId);

  return { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist };
};
