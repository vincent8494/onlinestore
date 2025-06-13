
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Package, Users, TrendingUp } from 'lucide-react';

const SellerGuide = () => {
  const steps = [
    {
      step: 1,
      title: 'Create Your Seller Account',
      description: 'Sign up and complete your seller profile with business information.',
      icon: Users
    },
    {
      step: 2,
      title: 'List Your Products',
      description: 'Add detailed product descriptions, high-quality photos, and competitive pricing.',
      icon: Package
    },
    {
      step: 3,
      title: 'Start Selling',
      description: 'Once approved, your products go live and customers can start purchasing.',
      icon: DollarSign
    }
  ];

  const benefits = [
    'Reach thousands of potential customers',
    'Low seller fees - only 5% commission',
    'Built-in payment processing',
    'Marketing and promotional tools',
    'Analytics and sales insights',
    'Customer support assistance'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Seller's Guide</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Everything you need to know to start selling successfully on VMK Store
          </p>
          <Button size="lg" asChild>
            <Link to="/sell">Start Selling Now</Link>
          </Button>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.step} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">Step {step.step}</CardTitle>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Sell on VMK Store?</h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-6" asChild>
                <Link to="/register">Get Started Today</Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/20 p-8 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Growing Marketplace</h3>
                <p className="text-muted-foreground mb-4">
                  Join thousands of successful sellers who trust VMK Store
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-muted-foreground">Active Buyers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">1M+</div>
                    <div className="text-sm text-muted-foreground">Monthly Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SellerGuide;
