"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/javascript", label: "JavaScript" },
  { href: "/react", label: "React" },
  { href: "/nextjs", label: "Next.js" },
  { href: "/system-design", label: "System Design" },
  { href: "/golang", label: "Go" },
  { href: "/postgresql", label: "PostgreSQL" },
  { href: "/docker", label: "Docker" },
  { href: "/kubernetes", label: "Kubernetes" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const userName = useMemo(() => {
    if (typeof window === "undefined") {
      return "Learner";
    }
    return localStorage.getItem("userName") || "Learner";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 font-bold text-slate-900">
            IP
          </span>
          <span className="hidden text-sm font-semibold uppercase tracking-wide text-slate-900 sm:inline dark:text-slate-100">
            Interview Practice
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-900 sm:hidden dark:text-slate-100">
            Practice
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {userName}
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
        <div className="border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
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
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  pathname === link.href
                    ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
