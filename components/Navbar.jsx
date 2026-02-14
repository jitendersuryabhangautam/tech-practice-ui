"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/javascript", label: "JavaScript" },
  { href: "/react", label: "React" },
  { href: "/nextjs", label: "Next.js" },
  { href: "/system-design", label: "System Design" },
  { href: "/golang", label: "Go" },
  { href: "/postgresql", label: "PostgreSQL" },
  { href: "/docker", label: "Docker" },
  { href: "/kubernetes", label: "Kubernetes" },
];

const ADMIN_LINK = { href: "/admin", label: "AI Console" };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (!active) return;
        if (!res.ok) {
          setUser(null);
          setAuthChecked(true);
          return;
        }
        const payload = await res.json();
        setUser(payload?.user || null);
        setAuthChecked(true);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setAuthChecked(true);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  const userName = user?.name || "Learner";
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="nav-motion-shell sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div aria-hidden="true" className="nav-cartoon-track pointer-events-none">
        <span className="nav-cartoon-runner">
          <svg viewBox="0 0 48 28" className="h-7 w-12" fill="none">
            <rect x="4" y="8" width="30" height="12" rx="6" fill="#38bdf8" />
            <circle cx="14" cy="22" r="4" fill="#0f172a" />
            <circle cx="29" cy="22" r="4" fill="#0f172a" />
            <circle cx="13" cy="14" r="2" fill="#f8fafc" />
            <circle cx="20" cy="14" r="2" fill="#f8fafc" />
            <path d="M37 16h7" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="nav-logo-badge nav-logo-mark flex h-10 w-10 items-center justify-center rounded-xl text-slate-900">
            <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
              <rect x="4" y="4" width="32" height="32" rx="10" fill="#f59e0b" />
              <path d="M13 24h14M15 18h10" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="14.5" cy="14.5" r="2.1" fill="#0f172a" />
              <circle cx="25.5" cy="14.5" r="2.1" fill="#0f172a" />
            </svg>
          </span>
          <span className="nav-brand-text hidden text-sm font-semibold uppercase tracking-wide text-slate-900 sm:inline dark:text-slate-100">
            Interview Practice
          </span>
          <span className="nav-brand-text text-xs font-semibold uppercase tracking-wide text-slate-900 sm:hidden dark:text-slate-100">
            Practice
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link-motion whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition xl:px-2.5 xl:py-2 xl:text-sm ${
                pathname === link.href
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="mx-0.5 h-5 w-px bg-slate-200 xl:mx-1 dark:bg-slate-700" />
          {isAdmin && (
            <Link
              href={ADMIN_LINK.href}
              className={`nav-link-motion flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition xl:gap-1.5 xl:px-2.5 xl:py-2 xl:text-sm ${
                pathname === ADMIN_LINK.href
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {ADMIN_LINK.label}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {authChecked ? userName : "Loading..."}
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-medium lg:hidden dark:border-slate-700"
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-slate-200 bg-white px-3 py-3 sm:max-h-[calc(100dvh-4rem)] dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="mb-3 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {userName}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link-motion rounded-lg px-3 py-2 text-sm ${
                  pathname === link.href
                    ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {isAdmin && (
            <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
              <Link
                href={ADMIN_LINK.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link-motion flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname === ADMIN_LINK.href
                    ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {ADMIN_LINK.label}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
