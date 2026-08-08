import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  CopyX,
  Loader2,
  LogIn,
  Table2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  readWorkbook,
  validateRows,
  buildTemplate,
  dedupeKey,
  type ParsedRow,
  type ValidationResult,
  type RawSheet,
  type ProductStatus,
} from '@/lib/productImport';

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Active — visible immediately' },
  { value: 'draft', label: 'Draft — hidden until you publish' },
  { value: 'pending', label: 'Pending review' },
];

const ImportProducts = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [existingKeys, setExistingKeys] = useState<Set<string>>(new Set());
  const [skuReady, setSkuReady] = useState(true);
  const [loadingContext, setLoadingContext] = useState(true);

  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [sheet, setSheet] = useState<RawSheet | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ProductStatus>('active');
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState<number | null>(null);

  // Categories and the seller's existing product names — both are needed
  // before a sheet can be judged, so the upload stays disabled until they land.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (authLoading) return;
      if (!user) {
        setLoadingContext(false);
        return;
      }

      const [{ data: cats }, { data: mine, error: mineError }] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('products').select('sku, name').eq('seller_id', user.id),
      ]);

      if (cancelled) return;

      const rows = (cats ?? []) as { id: string; name: string }[];
      setCategories(new Map(rows.map(c => [c.name.toLowerCase(), c.id])));
      setCategoryNames(rows.map(c => c.name));

      // Selecting `sku` fails while the column is missing, which is how we
      // detect that scripts/add-product-sku.sql has not been run yet.
      if (mineError) {
        setSkuReady(false);
        const { data: fallback } = await supabase
          .from('products')
          .select('name')
          .eq('seller_id', user.id);
        setExistingKeys(
          new Set(
            ((fallback ?? []) as { name: string }[]).map(p =>
              dedupeKey({ sku: null, name: p.name })
            )
          )
        );
      } else {
        setExistingKeys(
          new Set(
            ((mine ?? []) as { sku: string | null; name: string }[]).map(p =>
              dedupeKey({ sku: p.sku, name: p.name })
            )
          )
        );
      }
      setLoadingContext(false);
    };

    load().catch(() => {
      if (!cancelled) setLoadingContext(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const handleFile = useCallback(
    async (file: File) => {
      setImported(null);
      setFileName(file.name);
      setParsing(true);
      try {
        const parsed = await readWorkbook(file);
        setSheet(parsed);
        setResult(validateRows(parsed, { categories, existingKeys, defaultStatus }));
      } catch (err) {
        setSheet(null);
        setResult(null);
        toast({
          title: 'Could not read that file',
          description:
            err instanceof Error ? err.message : 'Expected a .xlsx or .csv spreadsheet.',
          variant: 'destructive',
        });
      } finally {
        setParsing(false);
      }
    },
    [categories, existingKeys, defaultStatus, toast]
  );

  // The default status feeds validation, so a change after upload must
  // re-evaluate the sheet rather than leave a stale preview on screen.
  useEffect(() => {
    if (!sheet || imported !== null) return;
    setResult(validateRows(sheet, { categories, existingKeys, defaultStatus }));
  }, [defaultStatus, sheet, categories, existingKeys, imported]);

  const handleDownloadTemplate = async () => {
    const blob = await buildTemplate(categoryNames);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vmk-product-import-template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!user || !result) return;
    const ready = result.rows.filter(r => r.status === 'ready');
    if (ready.length === 0) return;

    setImporting(true);
    try {
      const payload = ready.map(r => ({
        seller_id: user.id,
        ...(skuReady ? { sku: r.sku } : {}),
        category_id: r.categoryId,
        name: r.name,
        description: r.description,
        price: r.price,
        original_price: r.originalPrice,
        stock_quantity: r.stock,
        status: r.status_value,
      }));

      // The preview's duplicate check is a snapshot; two tabs or a retried
      // request could both pass it. Where the SKU index exists, let the
      // database be the authority: ON CONFLICT DO NOTHING means a duplicate is
      // impossible rather than merely unlikely. Only rows that actually landed
      // come back in `inserted`.
      const query = skuReady
        ? supabase
            .from('products')
            .upsert(payload, { onConflict: 'seller_id,sku', ignoreDuplicates: true })
        : supabase.from('products').insert(payload);

      const { data: inserted, error } = await query.select('id, sku, name');

      if (error) throw error;

      // Attach images for the rows that carried one. Done after the products
      // land so each image can be tied to its new product id.
      const created = (inserted ?? []) as { id: string; sku: string | null; name: string }[];
      const byKey = new Map(created.map(p => [dedupeKey({ sku: p.sku ?? null, name: p.name }), p.id]));
      const images = ready
        .filter(r => r.imageUrl && byKey.has(dedupeKey(r)))
        .map(r => ({
          product_id: byKey.get(dedupeKey(r)) as string,
          image_url: r.imageUrl as string,
          is_primary: true,
          display_order: 0,
        }));

      if (images.length) {
        const { error: imgError } = await supabase.from('product_images').insert(images);
        // A failed image insert should not read as a failed import — the
        // products are already in.
        if (imgError) {
          toast({
            title: 'Products imported, images skipped',
            description: imgError.message,
            variant: 'destructive',
          });
        }
      }

      // Fold the new names in, so importing the same sheet again now reports
      // them as duplicates without needing a page reload.
      setExistingKeys(prev => {
        const next = new Set(prev);
        ready.forEach(r => next.add(dedupeKey(r)));
        return next;
      });
      setImported(created.length);
      setResult(prev =>
        prev
          ? {
              ...prev,
              rows: prev.rows.map(r =>
                r.status === 'ready'
                  ? { ...r, status: 'duplicate', issues: ['Imported just now'] }
                  : r
              ),
              counts: { ...prev.counts, ready: 0, duplicate: prev.counts.duplicate + ready.length },
            }
          : prev
      );

      toast({
        title: `Imported ${created.length} ${created.length === 1 ? 'product' : 'products'}`,
        description: 'They are now listed on your storefront.',
      });
    } catch (err) {
      toast({
        title: 'Import failed',
        description: err instanceof Error ? err.message : 'Nothing was imported.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  if (!authLoading && !isLoggedIn) {
    return (
      <PageShell>
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold">Sign in to import</h1>
          <p className="mb-8 text-muted-foreground">
            Products are imported into your own storefront.
          </p>
          <Button asChild>
            <Link to="/login?redirect=/sell/import">Sign In</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const ready = result?.counts.ready ?? 0;

  return (
    <PageShell>
      <div className="mb-8 flex items-center gap-4 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/sell" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-white shadow-lift-sm">
            <FileSpreadsheet className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Bulk <span className="text-gold-ink">Import</span>
            </h1>
            <p className="text-muted-foreground">
              Upload a spreadsheet to list many products at once
            </p>
          </div>
        </div>
      </div>

      {!loadingContext && !skuReady && (
        <div className="mb-6 rounded-lg border-2 border-brand-amber/40 bg-brand-amber/10 p-5 animate-fade-up">
          <p className="flex items-center gap-2 font-bold text-brand-amber">
            <AlertTriangle className="h-4 w-4" />
            SKU column not found — falling back to name matching
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run <code className="font-mono">scripts/add-product-sku.sql</code> in the Supabase
            SQL editor to enable SKU-based duplicate detection and the database-level
            uniqueness guarantee. Import still works meanwhile, matching on product name.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Upload */}
          <SectionCard title="1. Upload your spreadsheet" icon={Upload} hue="teal">
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className={cn(
                'rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                dragging ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/60'
              )}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gold/10">
                <FileSpreadsheet className="h-7 w-7 text-gold-ink" />
              </div>

              {fileName ? (
                <p className="mb-1 font-bold">{fileName}</p>
              ) : (
                <p className="mb-1 font-bold">Drop your .xlsx or .csv here</p>
              )}
              <p className="mb-4 text-sm text-muted-foreground">
                Nothing is saved until you review the preview and confirm.
              </p>

              <input
                ref={fileInput}
                type="file"
                accept=".xlsx,.csv"
                className="sr-only"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />
              <Button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={loadingContext || parsing}
              >
                {parsing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose file
                  </>
                )}
              </Button>
            </div>

            {result && result.missingColumns.length > 0 && (
              <div className="mt-4 rounded-lg border-2 border-sale/30 bg-sale/10 p-4">
                <p className="flex items-center gap-2 font-bold text-sale">
                  <AlertTriangle className="h-4 w-4" />
                  Missing required columns
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The sheet has no <strong>{result.missingColumns.join(', ')}</strong> column.
                  Download the template below to see the expected headers.
                </p>
              </div>
            )}
          </SectionCard>

          {/* Preview */}
          {result && result.rows.length > 0 && (
            <SectionCard
              title="2. Review before importing"
              description={`${result.rows.length} rows read from the sheet`}
              icon={Table2}
              hue="blue"
            >
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-brand-teal/10 p-4 text-center">
                  <div className="text-2xl font-extrabold text-brand-teal">
                    {result.counts.ready}
                  </div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                    Will import
                  </div>
                </div>
                <div className="rounded-lg bg-brand-amber/10 p-4 text-center">
                  <div className="text-2xl font-extrabold text-brand-amber">
                    {result.counts.duplicate}
                  </div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                    Duplicates skipped
                  </div>
                </div>
                <div className="rounded-lg bg-sale/10 p-4 text-center">
                  <div className="text-2xl font-extrabold text-sale">
                    {result.counts.invalid}
                  </div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                    Need fixing
                  </div>
                </div>
              </div>

              <div className="max-h-[28rem] overflow-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-muted text-2xs uppercase tracking-wider">
                    <tr>
                      <th className="p-3 font-bold">Row</th>
                      <th className="p-3 font-bold">SKU</th>
                      <th className="p-3 font-bold">Product</th>
                      <th className="p-3 font-bold">Price</th>
                      <th className="p-3 font-bold">Stock</th>
                      <th className="p-3 font-bold">Category</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map(row => (
                      <ImportRow key={row.rowNumber} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SectionCard title="Template" icon={Download} hue="amber">
            <p className="mb-4 text-sm text-muted-foreground">
              The template carries the exact column headers, two example rows, and a
              second sheet listing every valid category and status.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadTemplate}
              disabled={loadingContext}
            >
              <Download className="h-4 w-4" />
              Download template
            </Button>
          </SectionCard>

          <SectionCard title="Default status" icon={CheckCircle2} hue="violet">
            <p className="mb-3 text-sm text-muted-foreground">
              Applied to rows whose sheet has no <code>status</code> column.
            </p>
            <Select
              value={defaultStatus}
              onValueChange={v => setDefaultStatus(v as ProductStatus)}
            >
              <SelectTrigger className="h-11 rounded-md border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SectionCard>

          {/* Commit */}
          <div className="card-pop p-6">
            {imported !== null ? (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal/15">
                  <CheckCircle2 className="h-6 w-6 text-brand-teal" />
                </div>
                <p className="mb-1 font-bold">
                  {imported} {imported === 1 ? 'product' : 'products'} imported
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Re-uploading the same file now skips them as duplicates.
                </p>
                <Button className="w-full" onClick={() => navigate('/sell')}>
                  Back to dashboard
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-3 text-sm text-muted-foreground">
                  {ready > 0
                    ? `${ready} ${ready === 1 ? 'row is' : 'rows are'} ready. Duplicates and invalid rows are skipped.`
                    : 'Upload a sheet to see what will be imported.'}
                </p>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={ready === 0 || importing}
                  onClick={handleImport}
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Import {ready > 0 ? ready : ''} {ready === 1 ? 'product' : 'products'}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

/** One preview row, colour-coded by outcome with its reasons listed. */
const ImportRow = ({ row }: { row: ParsedRow }) => {
  const tone =
    row.status === 'ready'
      ? { badge: 'success' as const, icon: CheckCircle2, label: 'Ready', tint: '' }
      : row.status === 'duplicate'
        ? { badge: 'amber' as const, icon: CopyX, label: 'Duplicate', tint: 'bg-brand-amber/5' }
        : { badge: 'destructive' as const, icon: AlertTriangle, label: 'Invalid', tint: 'bg-sale/5' };
  const Icon = tone.icon;

  return (
    <tr className={cn('border-t align-top', tone.tint)}>
      <td className="p-3 text-muted-foreground">{row.rowNumber}</td>
      <td className="p-3 font-mono text-xs">
        {row.sku ?? <span className="text-muted-foreground">—</span>}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              'h-4 w-4 shrink-0',
              row.status === 'ready'
                ? 'text-brand-teal'
                : row.status === 'duplicate'
                  ? 'text-brand-amber'
                  : 'text-sale'
            )}
          />
          <span className="font-semibold">{row.name || <em>(no name)</em>}</span>
        </div>
        {row.issues.length > 0 && (
          <ul className="mt-1 space-y-0.5 pl-6">
            {row.issues.map((issue, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {issue}
              </li>
            ))}
          </ul>
        )}
      </td>
      <td className="p-3 tabular-nums">{row.price ? `$${row.price}` : '—'}</td>
      <td className="p-3 tabular-nums">{row.stock}</td>
      <td className="p-3">{row.categoryName || '—'}</td>
      <td className="p-3">
        <Badge variant={tone.badge}>{tone.label}</Badge>
      </td>
    </tr>
  );
};

export default ImportProducts;
