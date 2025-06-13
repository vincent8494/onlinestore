
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Fees = () => {
  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Up to 10 product listings',
        '2.9% transaction fee',
        'Basic seller tools',
        'Email support',
        'Standard listing visibility'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29/month',
      description: 'For growing businesses',
      features: [
        'Up to 100 product listings',
        '2.4% transaction fee',
        'Advanced analytics',
        'Priority support',
        'Enhanced listing visibility',
        'Bulk upload tools',
        'Custom store branding'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99/month',
      description: 'For large-scale operations',
      features: [
        'Unlimited product listings',
        '1.9% transaction fee',
        'Advanced seller tools',
        'Dedicated account manager',
        'Premium listing placement',
        'API access',
        'Custom integrations',
        'White-label options'
      ],
      popular: false
    }
  ];

  const additionalFees = [
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Standard payment processing fees apply',
      fee: '2.9% + $0.30 per transaction'
    },
    {
      icon: Truck,
      title: 'Shipping Labels',
      description: 'Discounted shipping rates available',
      fee: 'Up to 20% off retail rates'
    },
    {
      icon: Shield,
      title: 'Seller Protection',
      description: 'Optional seller protection coverage',
      fee: '0.5% of transaction value'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your business. No hidden fees, no surprises. 
            Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link to="/sell">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Fees */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFees.map((service, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <service.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Badge variant="secondary">{service.fee}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">When are fees charged?</h3>
                <p className="text-sm text-muted-foreground">
                  Fees are automatically deducted when a sale is completed and payment is processed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Are there any setup fees?</h3>
                <p className="text-sm text-muted-foreground">
                  No, there are no setup fees or monthly minimums. You only pay for what you sell.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Fees;
