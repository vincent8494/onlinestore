
import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">VMK Store</h3>
                <p className="text-xs opacity-80">Buy & Sell Marketplace</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Your trusted marketplace for buying and selling quality products. 
              Connect with sellers worldwide and discover amazing deals.
            </p>
            <div className="flex space-x-3">
              <Facebook className="h-5 w-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Twitter className="h-5 w-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Instagram className="h-5 w-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Youtube className="h-5 w-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="opacity-80 hover:opacity-100 transition-opacity">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/deals" className="opacity-80 hover:opacity-100 transition-opacity">
                  Best Deals
                </Link>
              </li>
              <li>
                <Link to="/sellers" className="opacity-80 hover:opacity-100 transition-opacity">
                  Top Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sell" className="opacity-80 hover:opacity-100 transition-opacity">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link to="/seller-guide" className="opacity-80 hover:opacity-100 transition-opacity">
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link to="/fees" className="opacity-80 hover:opacity-100 transition-opacity">
                  Fees & Pricing
                </Link>
              </li>
              <li>
                <Link to="/seller-support" className="opacity-80 hover:opacity-100 transition-opacity">
                  Seller Support
                </Link>
              </li>
              <li>
                <Link to="/seller-policies" className="opacity-80 hover:opacity-100 transition-opacity">
                  Seller Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 opacity-60" />
                <span className="opacity-80">support@vmkstore.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="text-xs font-medium mb-2 opacity-80">CUSTOMER SUPPORT</h5>
              <p className="text-xs opacity-60">Monday - Friday: 9AM - 6PM</p>
              <p className="text-xs opacity-60">Saturday - Sunday: 10AM - 4PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-60 mb-4 md:mb-0">
              © 2024 VMK Store. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="opacity-60 hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
              <Link to="/terms" className="opacity-60 hover:opacity-100 transition-opacity">
                Terms of Service
              </Link>
              <Link to="/cookies" className="opacity-60 hover:opacity-100 transition-opacity">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
