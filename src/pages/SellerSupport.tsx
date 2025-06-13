
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Mail, Clock, Book, Users } from 'lucide-react';

const SellerSupport = () => {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with a support specialist',
      availability: 'Mon-Fri 9AM-6PM',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'Knowledge Base',
      description: 'Browse our comprehensive help articles',
      articles: '500+ articles'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other sellers and share experiences',
      members: '10K+ members'
    },
    {
      icon: Clock,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides to master the platform',
      videos: '50+ tutorials'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Seller Support</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to help you succeed. Get the support you need, when you need it, 
            from our dedicated team of experts.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <option.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                <Badge variant="secondary" className="mb-4">{option.availability}</Badge>
                <div>
                  <Button className="w-full">{option.action}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Describe your issue or question..." rows={6} />
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Support Hours</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Live Chat</span>
                    <Badge>24/7</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phone Support</span>
                    <span className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email Support</span>
                    <span className="text-sm text-muted-foreground">24 hour response</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Emergency Support</h3>
                  <p className="text-sm text-muted-foreground">
                    For urgent issues affecting your sales, we provide priority support 
                    to get you back up and running quickly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Self-Help Resources */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Self-Help Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <resource.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Badge variant="outline" className="mb-4">
                    {resource.articles || resource.members || resource.videos}
                  </Badge>
                  <div>
                    <Button variant="outline" className="w-full">Browse Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerSupport;
