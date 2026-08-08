import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toProductUUID } from '@/lib/productIdMap';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface RawCartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    product_images: { image_url: string }[];
  } | null;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }

    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart }: { data: { id: string } | null } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .maybeSingle();
      cart = newCart;
    }

    if (!cart) return;
    setCartId(cart.id);

    const { data: items } = await supabase
      .from('cart_items')
      .select('id, quantity, products(id, name, price, product_images(image_url))')
      .eq('cart_id', cart.id);

    if (items) {
      setCartItems(
        (items as unknown as RawCartItem[])
          .filter(i => i.products)
          .map(i => ({
            id: i.products!.id,
            name: i.products!.name,
            price: i.products!.price,
            quantity: i.quantity,
            image: i.products!.product_images?.[0]?.image_url ?? '/placeholder.svg',
          }))
      );
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (product: Omit<CartItem, 'quantity'>) => {
    if (!isLoggedIn || !user) {
      toast({ title: 'Login Required', description: 'Please log in to add items to your cart.' });
      navigate('/login');
      return;
    }

    let cid = cartId;
    if (!cid) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .maybeSingle();
      cid = newCart?.id ?? null;
      setCartId(cid);
    }
    if (!cid) return;

    const dbProductId = toProductUUID(product.id);
    const existing = cartItems.find(i => i.id === product.id);

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('cart_id', cid)
        .eq('product_id', dbProductId);
    } else {
      await supabase
        .from('cart_items')
        .insert({ cart_id: cid, product_id: dbProductId, quantity: 1 });
    }

    toast({ title: 'Added to cart!', description: `${product.name} has been added to your cart.` });
    fetchCart();
  }, [isLoggedIn, user, cartId, cartItems, navigate, toast, fetchCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!cartId) return;
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId)
      .eq('product_id', toProductUUID(productId));
    fetchCart();
  }, [cartId, fetchCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cartId) return;
    if (quantity <= 0) { removeFromCart(productId); return; }
    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('cart_id', cartId)
      .eq('product_id', toProductUUID(productId));
    fetchCart();
  }, [cartId, fetchCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (!cartId) return;
    await supabase.from('cart_items').delete().eq('cart_id', cartId);
    setCartItems([]);
  }, [cartId]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice };
};
