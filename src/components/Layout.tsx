import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hotel } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/#rooms' },
    { name: 'Case Studies', href: '/#case-studies' },
    { name: 'Process', href: '/#process' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0B08] text-[#FAF7F2] font-sans">
      <header className="fixed top-3 left-4 right-4 z-50 border border-[#C9A96E29] rounded-[14px] bg-[#0D0B08]/70 backdrop-blur-md px-4 py-3">
        <div className="flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2">
            <Hotel className="h-7 w-7 text-[#C9A96E]" />
            <span className="text-[1.06rem] font-serif font-bold tracking-tight text-[#FAF7F2]">Alyan Haider</span>
          </Link>

          <nav className="mt-2.5 flex gap-4 flex-wrap justify-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-[0.78rem] font-medium uppercase tracking-[0.08em] transition-colors hover:text-[#E8C98A] ${
                  (item.href === '/'
                    ? location.pathname === '/'
                    : item.href === '/about'
                      ? location.pathname === '/about'
                      : item.href === '/contact'
                        ? location.pathname === '/contact'
                        : false)
                    ? 'text-[#C9A96E]'
                    : 'text-[#FAF7F2CC]'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-28">{children}</main>

      <footer className="bg-[#070603] text-[#FAF7F2B3] py-12 border-t border-[#C9A96E40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#FAF7F2]">
              <Hotel className="h-6 w-6 text-[#C9A96E]" />
              <span className="text-lg font-serif font-bold">Alyan Hider</span>
            </div>
            <p className="text-sm leading-relaxed">
              Full stack developer building fast, modern, and conversion-focused websites with clean UI and scalable backend systems.
            </p>
          </div>
          <div>
            <h3 className="text-[#E8C98A] font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/#rooms" className="hover:text-[#FAF7F2] transition-colors">Showcase</a></li>
              <li><Link to="/about" className="hover:text-[#FAF7F2] transition-colors">About Me</Link></li>
              <li><Link to="/contact" className="hover:text-[#FAF7F2] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#E8C98A] font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Alyan Hider</li>
              <li>+923255629527</li>
              <li>alyanhaider369@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#C9A96E2E] text-xs text-center">
          © {new Date().getFullYear()} Alyan Hider. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
