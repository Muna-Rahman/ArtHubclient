"use client";

import Link from "next/link";
import { Button, Input, Label } from "@heroui/react";
import { Globe, Envelope, LogoFacebook, ArrowRight } from "@gravity-ui/icons";
import { Ripple } from "m3-ripple";
import "m3-ripple/ripple.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup triggered (frontend only)");
  };

  return (
    <footer className="w-full border-t border-gray-100 bg-white text-gray-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          
        
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-gray-950">
              Art<span className="text-amber-600">Hub</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Democratizing art acquisition by connecting global art collectors, enthusiasts, and emerging artists within a secure, interactive digital landscape.
            </p>
            
           
            <div className="flex items-center gap-3 mt-1">
              <a href="#" className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition" aria-label="ArtHub Facebook Community">
                <LogoFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition" aria-label="ArtHub Global Network">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition" aria-label="Contact Support Dispatch">
                <Envelope className="h-5 w-5" />
              </a>
            </div>
          </div>

    
          <div className="flex flex-col gap-4 md:pl-12">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-600 transition font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-600 transition font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-600 transition font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Stay Inspired
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Subscribe to our curation dispatch for new weekly art releases and exclusive creator highlights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2 mt-1">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="footer-newsletter-email" className="sr-only">Email Address</Label>
                <div className="flex gap-2">
                  <Input 
                    id="footer-newsletter-email" 
                    placeholder="Enter your email" 
                    type="email" 
                    required
                    className="w-full text-gray-900 bg-gray-50 focus:border-gray-500"
                  />
                  <Button 
                    type="submit" 
                    className="relative overflow-hidden bg-amber-600 text-white font-semibold shadow-sm hover:bg-amber-500 transition-colors px-5"
                  >
                    <Ripple />
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

        </div>

      
        <div className="mt-12 border-t border-gray-100 pt-8 flex items-center justify-between flex-col sm:flex-row gap-4">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} ArtHub Marketplace Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 tracking-wide font-medium">
            Designed for Excellence 
          </p>
        </div>
      </div>
    </footer>
  );
}