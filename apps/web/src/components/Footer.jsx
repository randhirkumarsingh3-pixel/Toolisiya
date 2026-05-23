import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Shield, FileText, Info, LayoutGrid, Download } from 'lucide-react';

const LOGO_URL = "/logo-transparent.png";

export default function Footer() {
  const location = useLocation();

  useEffect(() => {
    const footers = document.querySelectorAll('footer[data-main-footer="true"]');
    if (footers.length > 1) {
      for (let i = 1; i < footers.length; i++) {
        footers[i].remove();
      }
    }
  }, [location.pathname]);

  const categories = [
    { name: "Developer Tools", slug: "developer" },
    { name: "Document Tools", slug: "document" },
    { name: "PDF Tools", slug: "pdf" },
    { name: "Finance Tools", slug: "finance" },
    { name: "Image Tools", slug: "image" },
    { name: "Career Tools", slug: "career" }
  ];

  return (
    <footer 
      data-main-footer="true"
      className="bg-card text-card-foreground py-12 mt-auto border-t border-border relative z-[1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Toolisiya Logo" className="h-8 w-auto object-contain" />
              <span className="text-xl font-bold tracking-tight">Toolisiya</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Your all-in-one platform for free online tools. We provide fast, secure, and easy-to-use utilities for developers, students, and professionals worldwide.
            </p>
          </div>

          {/* Categories Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Categories
            </h4>
            <ul className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Info className="w-4 h-4" /> About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Toolisiya. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Made with precision and care.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}