import { createClient } from '@supabase/supabase-js';

/**
 * Configuration comes from the environment, with a fallback to the project's
 * published values.
 *
 * The fallback is deliberate: `.env.local` is gitignored, so a build running
 * anywhere the variables have not been configured (Vercel, a fresh clone, CI)
 * would otherwise construct the client with `undefined` and every request on
 * the site would fail. The publishable key is designed to ship in a browser
 * bundle — row level security is what guards the data, not secrecy of this
 * string — so committing it as a default costs nothing.
 */
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://bzeptsuqpjtgrekinoro.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  'sb_publishable_9Ih0Ipt6cudyct7LjwAuzA_jGAQ-dV6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          account_type: 'buyer' | 'seller';
          avatar_url: string | null;
          is_verified: boolean;
          marketing_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      seller_profiles: {
        Row: {
          id: string;
          user_id: string;
          store_name: string;
          store_slug: string;
          bio: string | null;
          location: string | null;
          avatar_url: string | null;
          is_verified: boolean;
          total_sales: number;
          store_views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seller_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['seller_profiles']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          stock_quantity: number;
          status: 'active' | 'pending' | 'out_of_stock' | 'draft' | 'archived';
          average_rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      carts: {
        Row: { id: string; user_id: string; created_at: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['carts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['carts']['Insert']>;
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          added_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'added_at'>;
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>;
      };
      wishlists: {
        Row: { id: string; user_id: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['wishlists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>;
      };
      wishlist_items: {
        Row: { id: string; wishlist_id: string; product_id: string; added_at: string };
        Insert: Omit<Database['public']['Tables']['wishlist_items']['Row'], 'id' | 'added_at'>;
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          shipping_cost: number;
          tax: number;
          total: number;
          shipping_email: string;
          shipping_first_name: string;
          shipping_last_name: string;
          shipping_address: string;
          shipping_city: string;
          shipping_postal_code: string;
          shipping_country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          seller_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'line_total'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          amount: number;
          status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method: 'card' | 'paypal' | 'google_pay' | 'apple_pay';
          card_last_four: string | null;
          transaction_id: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      seller_follows: {
        Row: { id: string; follower_id: string; seller_id: string; followed_at: string };
        Insert: Omit<Database['public']['Tables']['seller_follows']['Row'], 'id' | 'followed_at'>;
        Update: Partial<Database['public']['Tables']['seller_follows']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      deals: {
        Row: {
          id: string;
          product_id: string;
          discount_percent: number;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['deals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['deals']['Insert']>;
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          email_notifications: boolean;
          push_notifications: boolean;
          sms_notifications: boolean;
          marketing_emails: boolean;
          theme: 'light' | 'dark' | 'auto';
          language: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_settings']['Insert']>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>;
      };
    };
  };
};
