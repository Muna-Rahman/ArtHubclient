"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [liveRole, setLiveRole] = useState("user"); 
  const dropdownRef = useRef(null);

  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session;

  useEffect(() => {
    if (isAuthenticated && session?.user?.email) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // 🌟 SECURE ROLE RESOLUTION: Targeted query instead of loading all platform user data arrays
      fetch(`${apiBaseUrl}/api/user/profile?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user?.role) {
            setLiveRole(data.user.role);
          }
        })
        .catch((err) => console.error("Failed syncing live user role validation:", err));
    }
  }, [isAuthenticated, session]);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDashboardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsMenuOpen(false);
    setIsDashboardOpen(false);
    setLiveRole("user");
    router.push("/");
    router.refresh();
  };

  const renderDashboardLinks = (isMobile) => {
    const baseStyle = isMobile
      ? "block rounded-lg pl-8 pr-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
      : "block rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors";

    if (liveRole === "admin") {
      return (
        <Link href="/dashboard/admin" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
          Admin Control Node
        </Link>
      );
    }

    if (liveRole === "artist") {
      return (
        <Link href="/dashboard/artist" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
          Overview Portfolio
        </Link>
      );
    }

    return (
      <Link href="/dashboard/user" className={baseStyle} onClick={() => { setIsMenuOpen(false); setIsDashboardOpen(false); }}>
        My Purchase Command
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <Link href="/" className="text-2xl font-black tracking-tight transition hover:opacity-90">
            <span className="text-white">Art</span>
            <span className="text-orange-500">Hub</span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <Link href="/" className={`text-sm font-medium transition ${isActive("/") ? "text-orange-500 font-semibold" : "text-zinc-400 hover:text-orange-500"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/browse" className={`text-sm font-medium transition ${isActive("/browse") ? "text-orange-500 font-semibold" : "text-zinc-400 hover:text-orange-500"}`}>
                Browse Artworks
              </Link>
            </li>

            {isAuthenticated && (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                  className={`flex items-center gap-1 text-sm font-medium transition ${pathname.startsWith("/dashboard") ? "text-orange-500 font-semibold" : "text-zinc-400 hover:text-orange-500"}`}
                >
                  Dashboard ({liveRole})
                  <svg className={`h-4 w-4 transition-transform duration-200 ${isDashboardOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDashboardOpen && (
                  <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-xl z-50">
                    {renderDashboardLinks(false)}
                  </div>
                )}
              </li>
            )}
          </ul>

          <div className="hidden items-center gap-4 md:flex">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition">Log In</Link>
                <Link href="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="rounded-lg bg-red-950 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-900/60 cursor-pointer">
                Logout
              </button>
            )}
          </div>

          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden focus:outline-none"
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
        <div className="border-t border-zinc-800 bg-black md:hidden">
          <ul className="space-y-1 px-2 py-3">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)} className={`block rounded-lg px-4 py-2.5 text-base font-medium ${isActive("/") ? "bg-zinc-900 text-orange-500 font-semibold" : "text-zinc-300 hover:bg-zinc-900"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/browse" onClick={() => setIsMenuOpen(false)} className={`block rounded-lg px-4 py-2.5 text-base font-medium ${isActive("/browse") ? "bg-zinc-900 text-orange-500 font-semibold" : "text-zinc-300 hover:bg-zinc-900"}`}>
                Browse Artworks
              </Link>
            </li>

            {isAuthenticated && (
              <li className="space-y-1">
                <div className="px-4 pt-2 pb-1 text-xs font-semibold tracking-wider text-zinc-500 uppercase">Dashboard Hub</div>
                {renderDashboardLinks(true)}
              </li>
            )}

            <li className="mt-4 border-t border-zinc-800 pt-4">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3 px-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center rounded-lg border border-zinc-800 px-4 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-900">Log In</Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-base font-medium text-white hover:bg-orange-600">Sign Up</Link>
                </div>
              ) : (
                <div className="px-2">
                  <button onClick={handleLogout} className="flex w-full items-center justify-center rounded-lg bg-red-950 py-2.5 text-base font-medium text-red-400 hover:bg-red-900/60">
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