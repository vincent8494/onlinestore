import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CategoryRow {
  categories: { name: string } | null;
}

/**
 * Live product count per category name.
 *
 * Done as a single fetch of active products' category names and tallied on the
 * client — PostgREST has no plain GROUP BY, and one query beats eight
 * per-category HEAD requests.
 *
 * Returns `null` counts until loaded so callers can show a neutral label
 * instead of flashing "0 items".
 */
export function useCategoryCounts() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('categories(name)')
        .eq('status', 'active');

      if (cancelled) return;
      if (error || !data) {
        // Leave counts null — the UI falls back to a neutral label rather
        // than claiming zero.
        setCounts(null);
        return;
      }

      const tally: Record<string, number> = {};
      for (const row of data as unknown as CategoryRow[]) {
        const name = row.categories?.name;
        if (name) tally[name] = (tally[name] ?? 0) + 1;
      }
      setCounts(tally);
    };

    load().catch(() => {
      if (!cancelled) setCounts(null);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /** "1,234 items" when known, "Browse" while loading or on failure. */
  const label = (categoryName: string) => {
    if (!counts) return 'Browse';
    const n = counts[categoryName] ?? 0;
    return `${n.toLocaleString()} ${n === 1 ? 'item' : 'items'}`;
  };

  return { counts, label };
}
