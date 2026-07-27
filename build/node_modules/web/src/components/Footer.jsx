import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Shield, FileText, Info, LayoutGrid, Image as ImageIcon, Camera, FileCheck2, Calculator, Github, Twitter, Linkedin } from 'lucide-react';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

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

  const { activeCategories } = useActiveTools();
  const activeCategorySlugs = new Set(activeCategories.map(c => c.slug));

  const categories = [
    { name: "Developer Tools", slug: "developer" },
    { name: "Document Tools", slug: "document" },
    { name: "PDF Tools", slug: "pdf" },
    { name: "Finance Tools", slug: "finance" },
    { name: "Image Tools", slug: "image" },
    { name: "Career Tools", slug: "career" }
  ].filter(cat => activeCategorySlugs.has(cat.slug));

  return (
    <footer 
      data-main-footer="true"
      className="bg-card text-card-foreground py-12 mt-auto border-t border-border relative z-[1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Brand & Trust Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Toolisiya Logo" className="h-10 w-auto object-contain" />
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Toolisiya</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">
              The modern browser-based productivity and creator ecosystem. Fast, secure, and entirely free. Build, edit, and convert without uploading data to the cloud.
            </p>
            <div className="flex gap-4 items-center pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Top Tools */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-bold text-foreground">Top Tools</h4>
            <ul className="space-y-3">
              <li><Link to="/image/photo-editor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Photo Studio</Link></li>
              <li><Link to="/pdf/pdf-merger" className="text-sm text-muted-foreground hover:text-primary transition-colors">PDF Merger</Link></li>
              <li><Link to="/finance/gst-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">GST Calculator</Link></li>
              <li><Link to="/pdf/document-scanner" className="text-sm text-muted-foreground hover:text-primary transition-colors">OCR Scanner</Link></li>
              <li><Link to="/image/image-compressor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Image Compressor</Link></li>
            </ul>
          </div>

          {/* Creator Ecosystem */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-bold text-foreground">Creator Studio</h4>
            <ul className="space-y-3">
              <li><Link to="/image/photo-editor" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5"/> Editor</Link></li>
              <li><Link to="/image/watermark-remover" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><FileCheck2 className="w-3.5 h-3.5"/> Background Removal</Link></li>
              <li><Link to="/invitations/wedding-invitations" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><Camera className="w-3.5 h-3.5"/> Invitations</Link></li>
            </ul>
          </div>

          {/* Categories Links */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              Ecosystem
            </h4>
            <ul className="space-y-3">
              {categories.slice(0,5).map(cat => (
                <li key={cat.slug}>
                  <Link to={`/${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-bold text-foreground">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Toolisiya Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500"/> Privacy First</span>
            <span className="flex items-center gap-1.5"><Calculator className="w-4 h-4 text-blue-500"/> Free Forever</span>
          </div>
        </div>
      </div>
    </footer>
  );
}