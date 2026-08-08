
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, ImagePlus, PencilLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditProduct = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock existing product data
  const [productData, setProductData] = useState({
    name: 'Product Name',
    description: 'High-quality product description',
    price: '299.99',
    category: 'electronics',
    stock: '15',
    images: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product updated!",
      description: "Your product has been successfully updated."});
    navigate('/sell');
  };

  const labelClass = 'text-xs font-bold uppercase tracking-wider text-muted-foreground';
  const inputClass = 'h-12 rounded-xl border-2';

  return (
    <PageShell>
      <div className="mb-8 flex items-center gap-4 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/sell" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunrise text-white shadow-lift-sm">
            <PencilLine className="h-6 w-6" />
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Edit{' '}
            <span className="text-gold-ink">Product</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <SectionCard
          title="Product Information"
          description="Update how this listing appears to buyers"
          icon={PencilLine}
          hue="amber"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className={labelClass}>Product Name</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className={labelClass}>Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product"
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="min-h-28 rounded-xl border-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price" className={labelClass}>Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className={labelClass}>Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Category</Label>
              <Select
                value={productData.category}
                onValueChange={(value) => setProductData({ ...productData, category: value })}
              >
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home &amp; Garden</SelectItem>
                  <SelectItem value="sports">Sports &amp; Outdoors</SelectItem>
                  <SelectItem value="books">Books &amp; Media</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Product Images</Label>
              <div className="group rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-brand-amber hover:bg-brand-amber/5">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-amber/10 transition-transform duration-300 group-hover:scale-110">
                  <ImagePlus className="h-7 w-7 text-brand-amber" />
                </div>
                <p className="mb-3 text-muted-foreground">
                  Drag and drop images here, or click to browse
                </p>
                <Button variant="outline" type="button">
                  <Upload className="h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="gradient" size="lg" className="flex-1">
                Update Product
              </Button>
              <Button variant="outline" size="lg" type="button" asChild>
                <Link to="/sell">Cancel</Link>
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default EditProduct;
