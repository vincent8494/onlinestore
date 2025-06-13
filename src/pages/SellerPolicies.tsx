
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const SellerPolicies = () => {
  const policyCategories = [
    {
      icon: Shield,
      title: 'Account Policies',
      description: 'Guidelines for maintaining your seller account',
      badge: 'Required'
    },
    {
      icon: FileText,
      title: 'Product Policies',
      description: 'Rules for listing and selling products',
      badge: 'Important'
    },
    {
      icon: Users,
      title: 'Customer Service',
      description: 'Standards for customer interactions',
      badge: 'Best Practice'
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Items',
      description: 'Items that cannot be sold on our platform',
      badge: 'Restricted'
    }
  ];

  const prohibitedItems = [
    'Illegal or regulated items',
    'Counterfeit or replica products',
    'Hazardous materials',
    'Adult content',
    'Weapons and firearms',
    'Stolen goods',
    'Prescription medications',
    'Live animals'
  ];

  const accountRequirements = [
    'Valid government-issued ID',
    'Verified email address and phone number',
    'Accurate business information',
    'Tax identification number (if applicable)',
    'Bank account for payments',
    'Compliance with local laws'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Seller Policies</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding our policies helps you build a successful business while 
            maintaining a safe and trusted marketplace for everyone.
          </p>
        </div>

        {/* Policy Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {policyCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <category.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <Badge 
                  variant={category.badge === 'Required' ? 'destructive' : 
                           category.badge === 'Important' ? 'default' : 'secondary'}
                >
                  {category.badge}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Requirements */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Account Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {accountRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                Prohibited Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {prohibitedItems.map((item, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <XCircle className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Policies */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Listing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p className="text-sm text-muted-foreground">
                  All product listings must include accurate titles, descriptions, and images. 
                  Misleading information is strictly prohibited and may result in account suspension.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Pricing and Inventory</h3>
                <p className="text-sm text-muted-foreground">
                  Prices must be clearly stated and include all applicable fees. Inventory levels 
                  should be kept current to avoid overselling.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Images and Media</h3>
                <p className="text-sm text-muted-foreground">
                  Product images must be clear, accurate, and owned by you or used with permission. 
                  Stock photos should represent the actual product being sold.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Service Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Response Times</h3>
                <p className="text-sm text-muted-foreground">
                  Respond to customer inquiries within 24 hours. Faster response times 
                  improve your seller rating and customer satisfaction.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Order Fulfillment</h3>
                <p className="text-sm text-muted-foreground">
                  Ship orders within your stated handling time. Provide tracking information 
                  when available and communicate any delays promptly.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Returns and Refunds</h3>
                <p className="text-sm text-muted-foreground">
                  Honor your stated return policy and process refunds according to our 
                  platform guidelines. Clear return policies help build customer trust.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Violation Consequences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">Warning</Badge>
                  <p className="text-sm text-muted-foreground">
                    First-time minor violations result in a warning and guidance.
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="destructive" className="mb-2">Suspension</Badge>
                  <p className="text-sm text-muted-foreground">
                    Repeated or serious violations may lead to temporary suspension.
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Termination</Badge>
                  <p className="text-sm text-muted-foreground">
                    Severe violations or repeated offenses result in account termination.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerPolicies;
