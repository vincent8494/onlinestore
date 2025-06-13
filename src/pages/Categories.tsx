
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, Filter } from 'lucide-react';

const Categories = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('name');

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Phones, laptops, gadgets, and more',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing, shoes, and accessories',
      image: '/placeholder.svg'
    },
    {
      id: 7,
      name: 'Beauty & Personal Care',
      description: 'Skincare, haircare, and grooming essentials',
      image: '/placeholder.svg'
    },
    {
      id: 8,
      name: 'Groceries',
      description: 'Fresh food, pantry staples, and household essentials',
      image: '/placeholder.svg'
    },
    {
      id: 9,
      name: 'Home & Kitchen',
      description: 'Appliances, cookware, and home essentials',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Furniture, decor, and garden supplies',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Sports & Outdoors',
      description: 'Equipment, gear, and outdoor activities',
      image: '/placeholder.svg'
    },
    {
      id: 5,
      name: 'Books & Media',
      description: 'Books, movies, music, and games',
      image: '/placeholder.svg'
    },
    {
      id: 6,
      name: 'Automotive',
      description: 'Cars, parts, and accessories',
      image: '/placeholder.svg'
    }
  ];

  const filteredAndSortedCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Categories</h1>
          <p className="text-muted-foreground">Discover products across all categories</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 hover:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
              disabled
            >
              <Filter className="h-4 w-4 mr-2" />
              Sort by Name
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('grid')}
              className="hover:bg-primary/90 transition-colors"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('list')}
              className="hover:bg-primary/90 transition-colors"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAndSortedCategories.map((category) => (
            <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full hover:bg-primary/90 transition-colors">
                    Browse {category.name}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Categories;
