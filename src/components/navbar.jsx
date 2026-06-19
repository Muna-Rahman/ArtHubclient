'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

 
  const isLoggedIn = false; 
  const userRole = "user"; 

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Artworks", href: "/browse" },
  ];

 
  if (isLoggedIn) {
    navLinks.push({ name: "Dashboard", href: `/dashboard/${userRole}` });
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default-100 bg-background/70 backdrop-blur-md">
      <header className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
      
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center justify-center p-2 text-default-500 rounded-md md:hidden hover:bg-default-100 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle main menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:opacity-90">
            Art<span className="text-primary font-medium">Hub</span>
          </Link>
        </div>

       
        <nav className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      isActive ? "text-foreground font-semibold border-b-2 border-primary pb-1" : "text-default-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-4 flex items-center gap-3 border-l border-default-200 pl-4">
            {isLoggedIn ? (
              <button className="text-sm font-medium text-danger hover:opacity-80 transition-opacity">
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-medium bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

     
      {isMenuOpen && (
        <div className="border-t border-default-100 bg-background md:hidden">
          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-medium px-3 py-2 text-base font-medium transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-default-600 hover:bg-default-50 hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li className="mt-4 pt-4 border-t border-default-100">
              {isLoggedIn ? (
                <button className="w-full text-left rounded-medium px-3 py-2 text-base font-medium text-danger hover:bg-danger/10">
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center rounded-medium bg-primary px-4 py-2 text-base font-medium text-primary-foreground"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

