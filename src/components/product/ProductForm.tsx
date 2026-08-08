import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  ImagePlus,
  AlertTriangle,
  Loader2,
  LogIn,
  PackagePlus,
  PencilLine,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  validateProductFields,
  parseMoney,
  parseCount,
  VALID_STATUSES,
  type ProductStatus,
} from '@/lib/productRules';

interface Category {
  id: string;
  name: string;
}

interface FormState {
  sku: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  status: ProductStatus;
}

const EMPTY: FormState = {
  sku: '',
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '',
  categoryId: '',
  imageUrl: '',
  status: 'active',
};

const labelClass = 'text-xs font-bold uppercase tracking-wider text-muted-foreground';
const inputClass = 'h-12 rounded-md border-2';

/**
 * Create/edit form for a single product.
 *
 * Both pages render this so there is one place where a product is validated
 * and written. It applies the same rules as the bulk importer via
 * `validateProductFields`, so a product accepted here would also import.
 */
const ProductForm = ({ mode, productId }: { mode: 'create' | 'edit'; productId?: string }) => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  /** Primary image row id, so an edit updates rather than piles up rows. */
  const [imageRowId, setImageRowId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (authLoading) return;

      const { data: cats } = await supabase.from('categories').select('id, name').order('name');
      if (!cancelled) setCategories((cats ?? []) as Category[]);

      if (mode === 'edit' && productId && user) {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(id, image_url, is_primary)')
          .eq('id', productId)
          .maybeSingle();

        if (cancelled) return;

        // RLS already hides other sellers' drafts, but an explicit ownership
        // check keeps an active product belonging to someone else from opening
        // in an editor that could not save anyway.
        if (error || !data || (data as { seller_id: string }).seller_id !== user.id) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const p = data as unknown as {
          sku: string | null;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          stock_quantity: number;
          category_id: string | null;
          status: ProductStatus;
          product_images: { id: string; image_url: string; is_primary: boolean }[] | null;
        };

        const primary =
          [...(p.product_images ?? [])].sort(
            (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
          )[0] ?? null;

        setImageRowId(primary?.id ?? null);
        setForm({
          sku: p.sku ?? '',
          name: p.name,
          description: p.description ?? '',
          price: String(p.price ?? ''),
          originalPrice: p.original_price != null ? String(p.original_price) : '',
          stock: String(p.stock_quantity ?? ''),
          categoryId: p.category_id ?? '',
          imageUrl: primary?.image_url ?? '',
          status: p.status ?? 'active',
        });
      }

      if (!cancelled) setLoading(false);
    };

    load().catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [mode, productId, user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const price = parseMoney(form.price);
    const originalPrice = form.originalPrice ? parseMoney(form.originalPrice) : null;
    const stock = parseCount(form.stock);
    const sku = form.sku.trim() || null;

    const found = validateProductFields({
      sku,
      name: form.name.trim(),
      price,
      originalPrice,
      stock,
      categoryId: form.categoryId || null,
      imageUrl: form.imageUrl.trim() || null,
    });

    if (found.length > 0) {
      setIssues(found);
      return;
    }
    setIssues([]);
    setSaving(true);

    try {
      // Catch a clashing SKU before the write, so the seller gets a sentence
      // rather than a Postgres constraint name. The unique index is still the
      // real guarantee — this only improves the message.
      if (sku) {
        const { data: clash } = await supabase
          .from('products')
          .select('id, name')
          .eq('seller_id', user.id)
          .ilike('sku', sku);

        const other = ((clash ?? []) as { id: string; name: string }[]).find(
          r => r.id !== productId
        );
        if (other) {
          setIssues([`SKU "${sku}" is already used by "${other.name}"`]);
          setSaving(false);
          return;
        }
      }

      const payload = {
        seller_id: user.id,
        sku,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price,
        original_price: originalPrice,
        stock_quantity: stock,
        category_id: form.categoryId,
        status: form.status,
      };

      let savedId = productId ?? null;

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('products')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        savedId = (data as { id: string }).id;
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', productId);
        if (error) throw error;
      }

      // Image lives in its own table, so it is written separately.
      const imageUrl = form.imageUrl.trim();
      if (savedId) {
        if (imageUrl && imageRowId) {
          await supabase.from('product_images').update({ image_url: imageUrl }).eq('id', imageRowId);
        } else if (imageUrl) {
          await supabase.from('product_images').insert({
            product_id: savedId,
            image_url: imageUrl,
            is_primary: true,
            display_order: 0,
          });
        } else if (imageRowId) {
          await supabase.from('product_images').delete().eq('id', imageRowId);
        }
      }

      toast({
        title: mode === 'create' ? 'Product created' : 'Product updated',
        description: `"${payload.name}" is saved to your store.`,
      });
      navigate('/sell');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Please try again.';
      // 23505 is the unique index doing its job if two saves race.
      setIssues([
        message.includes('products_seller_sku_key')
          ? `SKU "${sku}" is already used by another of your products`
          : message,
      ]);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId || !window.confirm('Delete this product? This cannot be undone.')) return;
    setSaving(true);
    const { error } = await supabase.from('products').delete().eq('id', productId);
    setSaving(false);
    if (error) {
      setIssues([error.message]);
      return;
    }
    toast({ title: 'Product deleted' });
    navigate('/sell');
  };

  if (!authLoading && !isLoggedIn) {
    return (
      <PageShell>
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold">Sign in to continue</h1>
          <p className="mb-8 text-muted-foreground">Products are saved to your own store.</p>
          <Button asChild>
            <Link to={`/login?redirect=${mode === 'create' ? '/sell/new-product' : '/sell'}`}>
              Sign In
            </Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  if (notFound) {
    return (
      <PageShell>
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold">Product not found</h1>
          <p className="mb-8 text-muted-foreground">
            It may have been deleted, or it belongs to another seller.
          </p>
          <Button asChild>
            <Link to="/sell">Back to dashboard</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const isCreate = mode === 'create';
  const Icon = isCreate ? PackagePlus : PencilLine;

  return (
    <PageShell>
      <div className="mb-8 flex items-center gap-4 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/sell" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-lift-sm',
              isCreate ? 'bg-mint' : 'bg-sunrise'
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {isCreate ? 'Add New' : 'Edit'}{' '}
            <span className="text-gold-ink">Product</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <SectionCard
          title="Product Information"
          description={isCreate ? "Tell buyers what you're selling" : 'Update how this listing appears'}
          icon={Icon}
          hue={isCreate ? 'teal' : 'amber'}
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {issues.length > 0 && (
                <div
                  role="alert"
                  className="rounded-md border-2 border-sale/30 bg-sale/10 p-4"
                >
                  <p className="flex items-center gap-2 font-bold text-sale">
                    <AlertTriangle className="h-4 w-4" />
                    {issues.length === 1 ? 'One problem to fix' : `${issues.length} problems to fix`}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku" className={labelClass}>
                    SKU <span className="normal-case text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="sku"
                    placeholder="VMK-ELEC-001"
                    value={form.sku}
                    onChange={e => set('sku', e.target.value)}
                    className={cn(inputClass, 'font-mono')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your own stock code. Used to spot duplicates on bulk import.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className={labelClass}>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={v => set('status', v as ProductStatus)}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_STATUSES.map(s => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className={labelClass}>Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={labelClass}>Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  className="min-h-28 rounded-md border-2"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price" className={labelClass}>Price ($)</Label>
                  <Input
                    id="price"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className={labelClass}>
                    Was ($)
                  </Label>
                  <Input
                    id="originalPrice"
                    inputMode="decimal"
                    placeholder="optional"
                    value={form.originalPrice}
                    onChange={e => set('originalPrice', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className={labelClass}>Stock</Label>
                  <Input
                    id="stock"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.stock}
                    onChange={e => set('stock', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Category</Label>
                <Select value={form.categoryId} onValueChange={v => set('categoryId', v)}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className={labelClass}>Product Image</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://... or /images/products/..."
                  value={form.imageUrl}
                  onChange={e => set('imageUrl', e.target.value)}
                  className={inputClass}
                />
                {form.imageUrl.trim() ? (
                  <div className="mt-2 flex items-center gap-3 rounded-md border p-3">
                    <img
                      src={form.imageUrl}
                      alt=""
                      className="h-16 w-16 rounded object-cover"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Preview. Falls back to a placeholder if the link cannot be loaded.
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-3 rounded-md border border-dashed p-3 text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                    <p className="text-xs">
                      Paste an image link. File uploads are not wired up yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" size="lg" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : isCreate ? (
                    'Create Product'
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" size="lg" type="button" asChild>
                  <Link to="/sell">Cancel</Link>
                </Button>
                {!isCreate && (
                  <Button
                    variant="destructive"
                    size="lg"
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </form>
          )}
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default ProductForm;
