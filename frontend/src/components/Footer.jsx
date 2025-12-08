import React from 'react';
import { Instagram, PinIcon, ArrowRight } from 'lucide-react';

const Footer = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  }

  return (
    <footer className="bg-pink-100 text-[#1c1b1b] pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Top Section: Quick Links */}
        <div className="flex flex-col items-center mb-16 space-y-6">
          <h3 className="font-serif text-xl tracking-wide">Quick links</h3>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm tracking-wide text-gray-800">
            <a href="#" className="hover:opacity-70 transition-opacity">Search</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Shipping Policy</a>
            <a href="/orders" className="hover:opacity-70 transition-opacity">Returns / Exchange/ Refunds</a>
            <a href="/contact" className="hover:opacity-70 transition-opacity">Contact us</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Terms and Conditions</a>
          </nav>
        </div>

        {/* Middle Section: Newsletter & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          
          {/* Newsletter Form */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <h3 className="font-serif text-xl font-bold mb-4">Be AQUALIFE's Insider</h3>
            <div className="relative group">
              <form onSubmit={onSubmitHandler}>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border border-gray-400 px-4 py-3 placeholder-gray-600 outline-none focus:border-black transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors">
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
              </form>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6 pb-2">
            <a href="#" className="text-black hover:opacity-70 transition-opacity">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-black hover:opacity-70 transition-opacity">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="0" 
                className="lucide lucide-pinterest"
              >
                 <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.65 0-5.789 2.738-5.789 5.57 0 1.103.425 2.286.956 2.928.105.128.12.24.089.373-.098.403-.319 1.294-.363 1.475-.057.241-.19.291-.441.175-1.644-.765-2.671-3.17-2.671-5.103 0-4.155 3.018-7.966 8.706-7.966 4.572 0 8.125 3.259 8.125 7.618 0 4.547-2.868 8.216-6.848 8.216-1.336 0-2.592-.693-3.021-1.511 0 0-.722 2.748-.896 3.42-.324 1.251-1.196 2.805-1.597 3.763C9.916 23.864 10.941 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section: Separator, Cards, Legal */}
        <div className="border-t border-gray-300/50 pt-10">
          
          {/* Payment Icons (Simulated with SVG/Divs for this demo) */}
          <div className="flex justify-center gap-2 mb-6">
            <PaymentIcon type="amex" />
            <PaymentIcon type="mastercard" />
            <PaymentIcon type="visa" />
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-wider text-gray-700 text-center">
            <span>&copy; 2025, AQUALIFE Powered by Shopify</span>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="hover:text-black">Privacy policy</a>
              <a href="#" className="hover:text-black">Refund policy</a>
              <a href="#" className="hover:text-black">Terms of service</a>
              <a href="#" className="hover:text-black">Shipping policy</a>
              <a href="#" className="hover:text-black">Contact information</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper component to render simple SVG placeholders for payment cards
// In a real app, use actual SVG assets or images
const PaymentIcon = ({ type }) => {
  let content;
  if (type === 'amex') {
    content = (
      <svg viewBox="0 0 38 24" className="w-10 h-6">
         <path fill="#007bc1" d="M0 0h38v24H0z"/>
         <path fill="#fff" d="M22 10.5h-2.5v-4h3.5v1.2H21v1.3h1.8v1.2H21v2.8h-1.5v-2.5zm-5 0h-2.5v-4h3.5v1.2H16v1.3h1.8v1.2H16v2.8h-1.5v-2.5zm-8.5-4h1.6l1.2 4 1.2-4h1.6L12.5 14H11l-2.5-7.5zm-5 0h1.5l1.6 7.5H5L4.5 9h-2L2 14H.5l3-7.5z"/>
         <path fill="#fff" d="M28.5 6.5H25v7.5h1.5v-3h2v-1.3h-2v-2h2V6.5zm5.5 0h-2l-1.5 2.5-1.5-2.5h-2l2.5 4-2.8 3.5h1.8l1.8-2.5 1.8 2.5h1.8L35 10.5l3-4z"/>
      </svg>
    );
  } else if (type === 'mastercard') {
    content = (
      <svg viewBox="0 0 38 24" className="w-10 h-6">
        <rect width="38" height="24" rx="2" fill="#fff" stroke="#e2e8f0" />
        <circle cx="15" cy="12" r="7" fill="#eb001b" />
        <circle cx="23" cy="12" r="7" fill="#f79e1b" fillOpacity="0.85" />
      </svg>
    );
  } else {
    // Visa
    content = (
      <svg viewBox="0 0 38 24" className="w-10 h-6">
        <rect width="38" height="24" rx="2" fill="#fff" stroke="#e2e8f0" />
        <path fill="#1434CB" d="M16.5 15l-1-6h-1.6l1.6 6h1zm5.2-5.7c0-.2-.2-.3-.5-.4-.3-.1-1-.3-1.8-.3-2 0-3.3 1-3.3 2.5 0 1.1 1 1.7 1.8 2.1.8.4 1 .6 1 1 0 .5-.6.8-1.2.8-.8 0-1.2-.2-1.8-.5V16c.6.3 1.3.5 2 .5 2.2 0 3.6-1.1 3.6-2.6-.1-1.3-2.1-2.1-2.1-2.9zM25 9h-1.3l-2.4 6h1.6l.5-1.3h2l.2 1.3h1.5l-2.1-6zm-1.3 3.6l.8-2.1.5 2.1h-1.3zM12.6 9H10l-.2 1.3c-.6 0-2.3.8-2.8 1.4L6 9H4.2l2.8 6h1.7l3.9-6z"/>
      </svg>
    );
  }

  return (
    <div className="w-10 overflow-hidden rounded shadow-sm">
      {content}
    </div>
  );
};

export default Footer;