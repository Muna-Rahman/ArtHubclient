"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar({
  isAuthenticated = false,
  role = "user",
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const dropdownRef = useRef(null);

 
  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDashboardOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const renderDashboardLinks = (isMobile) => {
    const baseStyle = isMobile
      ? "block rounded-lg pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
      : "block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors";

    if (role === "artist") {
      return (
        <>
          <Link href="/dashboard/artist" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
            Overview
          </Link>
          <Link href="/dashboard/artist/upload" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
            Add Artwork
          </Link>
          <Link href="/dashboard/artist/artworks" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
            Manage Artworks
          </Link>
        </>
      );
    }

    if (role === "admin") {
      return (
        <>
          <Link href="/dashboard/admin" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
            Overview Dashboard
          </Link>
          <Link href="/dashboard/admin/users" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
            Manage Users
          </Link>
          <Link href="/dashboard/admin/artworks" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
            Manage Artworks
          </Link>
        </>
      );
    }

   
    return (
      <>
        <Link href="/dashboard/user" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
          My Dashboard
        </Link>
        <Link href="/dashboard/user/history" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
          Purchase History
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          
          <Link href="/" className="text-2xl font-black tracking-tight transition hover:opacity-90">
            <span className="text-gray-900">Art</span>
            <span className="text-amber-600">Hub</span>
          </Link>

          
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <Link
                href="/"
                className={`text-sm font-medium transition ${
                  isActive("/")
                    ? "text-amber-600 font-semibold"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/artworks"
                className={`text-sm font-medium transition ${
                  isActive("/artworks")
                    ? "text-amber-600 font-semibold"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Browse Artworks
              </Link>
            </li>

            {isAuthenticated && (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                  className={`flex items-center gap-1 text-sm font-medium transition ${
                    pathname.startsWith("/dashboard")
                      ? "text-amber-600 font-semibold"
                      : "text-gray-600 hover:text-amber-600"
                  }`}
                  aria-expanded={isDashboardOpen}
                >
                  Dashboard
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDashboardOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDashboardOpen && (
                  <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5">
                    {renderDashboardLinks(false)}
                  </div>
                )}
              </li>
            )}
          </ul>

        
          <div className="hidden items-center gap-4 md:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                Logout
              </button>
            )}
          </div>

         
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

   
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden transition-all duration-200 opacity-100">
          <ul className="space-y-1 px-2 py-3">
            <li>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-base font-medium ${
                  isActive("/") ? "bg-amber-50 text-amber-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/artworks"
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-base font-medium ${
                  isActive("/artworks") ? "bg-amber-50 text-amber-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Browse Artworks
              </Link>
            </li>

            {isAuthenticated && (
              <li className="space-y-1">
                <div className="px-4 pt-2 pb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Dashboard Hub
                </div>
                {renderDashboardLinks(true)}
              </li>
            )}

            <li className="mt-4 border-t border-gray-100 pt-4">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3 px-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-gray-950 px-4 py-2 text-base font-medium text-white hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-2">
                  <button className="flex w-full items-center justify-center rounded-lg bg-red-50 py-2.5 text-base font-medium text-red-600 hover:bg-red-100">
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}