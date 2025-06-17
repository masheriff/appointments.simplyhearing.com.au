// src/components/layout/Header.tsx
import { Phone, Mail } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-black text-white flex items-center justify-between px-6 md:px-8 lg:px-12">
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src="/logo/simply-hearing-logo.webp" 
          alt="Simply Hearing" 
          className="h-10 w-auto"
        />
      </div>

      {/* Contact Information */}
      <div className="flex items-center gap-6 text-sm">
        <div className="hidden md:block text-white">
          Can't find time you want?
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="tel:+61422388005" 
            className="flex items-center gap-2 text-[#D1AA6D] font-bold hover:opacity-80 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            <span>+61 422 388 005</span>
          </a>
          
          <a 
            href="mailto:info@simplyhearing.com.au" 
            className="flex items-center gap-2 text-[#D1AA6D] font-bold hover:opacity-80 transition-opacity"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden lg:inline">info@simplyhearing.com.au</span>
            <span className="lg:hidden">Email</span>
          </a>
        </div>
      </div>
    </header>
  );
};