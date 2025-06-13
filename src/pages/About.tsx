
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, label: 'Active Users', value: '50K+' },
    { icon: Target, label: 'Products Sold', value: '1M+' },
    { icon: Award, label: 'Verified Sellers', value: '5K+' },
    { icon: Globe, label: 'Countries', value: '25+' }
  ];

  const team = [
    { name: 'John Smith', role: 'CEO & Founder', image: '/placeholder.svg' },
    { name: 'Sarah Johnson', role: 'CTO', image: '/placeholder.svg' },
    { name: 'Mike Chen', role: 'Head of Sales', image: '/placeholder.svg' },
    { name: 'Lisa Davis', role: 'Customer Success', image: '/placeholder.svg' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About VMK Store</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're building the world's most trusted marketplace where buyers and sellers 
            can connect, trade, and grow their businesses with confidence.
          </p>
          <Badge className="px-6 py-2 text-lg hover:bg-primary/80 transition-colors">Trusted by thousands worldwide</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg hover:scale-105 transition-all duration-200">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At VMK Store, we believe that everyone should have the opportunity to build 
              and grow their business online. Our platform provides the tools, support, 
              and community needed to succeed in the digital marketplace.
            </p>
            <p className="text-muted-foreground">
              We're committed to creating a safe, transparent, and efficient trading 
              environment that benefits both buyers and sellers.
            </p>
          </div>
          <div>
            <img 
              src="/placeholder.svg" 
              alt="Our Mission" 
              className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg hover:scale-105 transition-all duration-200">
                <CardContent className="pt-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover hover:scale-110 transition-transform duration-200"
                  />
                  <h3 className="font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center hover:bg-accent/50 rounded-lg p-4 transition-colors">
                <h3 className="font-semibold mb-3">Trust & Safety</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize the security and trust of our community through 
                  verified sellers and secure transactions.
                </p>
              </div>
              <div className="text-center hover:bg-accent/50 rounded-lg p-4 transition-colors">
                <h3 className="font-semibold mb-3">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We continuously improve our platform with cutting-edge technology 
                  and user-focused features.
                </p>
              </div>
              <div className="text-center hover:bg-accent/50 rounded-lg p-4 transition-colors">
                <h3 className="font-semibold mb-3">Community</h3>
                <p className="text-sm text-muted-foreground">
                  We foster a supportive community where everyone can learn, 
                  grow, and succeed together.
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

export default About;
