"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/generate", label: "Generate" },
  { href: "/admin/content", label: "Content Review" },
  { href: "/admin/publish", label: "Publish" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSubnav() {
  const pathname = usePathname();

  return (
    <nav className="mb-4 flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-700">
      {LINKS.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
