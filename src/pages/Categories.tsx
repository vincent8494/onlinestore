
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Input } from '@/components/ui/input';
import { Search, Grid, List, LayoutGrid, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES, categoryHref } from '@/lib/categories';
import { useCategoryCounts } from '@/hooks/useCategoryCounts';
import { categoryStyle } from '@/lib/theme';

const Categories = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('name');
  const { label: categoryLabel } = useCategoryCounts();
  const categories = CATEGORIES;


  const filteredAndSortedCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageShell>
      <PageHero
        eyebrow="Explore"
        title="Browse"
        highlight="Categories"
        subtitle="Discover products across all categories"
        icon={LayoutGrid}
        hue="violet"
      />

      {/* Search and view toggle */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row">
        <div className="group relative flex-1">
          <div className="absolute -inset-0.5 rounded-full bg-brand-gradient opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-50" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-full border-2 border-transparent bg-muted pl-11 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 self-start rounded-full bg-muted p-1">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all',
              viewMode === 'grid'
                ? 'bg-brand-gradient text-ink shadow-lift-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all',
              viewMode === 'list'
                ? 'bg-brand-gradient text-ink shadow-lift-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Categories Grid — each tile owns its category's hue */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        }
      >
        {filteredAndSortedCategories.map((category, i) => {
          const style = categoryStyle(category.name);
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              to={categoryHref(category.name)}
              className={cn(
                'card-pop ring-gradient group animate-fade-up overflow-hidden',
                style.tint,
                style.border,
                style.glow,
                viewMode === 'list' ? 'flex items-center gap-5 p-5' : 'p-6'
              )}
              style={{ animationDelay: `${Math.min(i, 11) * 50}ms` }}
            >
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-2xl text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                  style.gradient,
                  viewMode === 'list' ? 'h-14 w-14' : 'mb-5 h-16 w-16'
                )}
              >
                <Icon className={viewMode === 'list' ? 'h-7 w-7' : 'h-8 w-8'} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className={cn('text-lg font-bold transition-colors', style.groupHoverText)}>
                    {category.name}
                  </h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{category.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className={cn('text-xs font-bold uppercase tracking-wider', style.text)}>
                    {categoryLabel(category.name)}
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 text-sm font-bold transition-all duration-200 group-hover:gap-2',
                      style.text
                    )}
                  >
                    Browse
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredAndSortedCategories.length === 0 && (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-ink">
            <Search className="h-8 w-8" />
          </div>
          <p className="mb-2 text-lg font-bold">No categories found</p>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </PageShell>
  );
};

export default Categories;
