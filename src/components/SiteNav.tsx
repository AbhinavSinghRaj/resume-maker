"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav({ variant = "light" }: { variant?: "light" | "dark" }) {
  const pathname = usePathname();
  const link = (href: string, label: string, extra = "") => (
    <Link href={href} className={`nav-link ${extra} ${pathname === href ? "active" : ""}`}>
      {label}
    </Link>
  );

  return (
    <nav className={`topbar ${variant === "dark" ? "dark" : ""}`}>
      <div className="app-shell topbar-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">R</span>
          <span>Resume<span style={{ color: "var(--accent)" }}>Builder</span></span>
        </Link>
        <div className="nav-links">
          {link("/", "Home", "nav-hide-sm")}
          {link("/#features", "Features", "nav-hide-sm")}
          {link("/templates", "Templates")}
          <Link href="/builder" className="btn btn-dark" style={{ padding: "0.5rem 0.95rem", fontSize: "0.82rem", marginLeft: "0.35rem" }}>
            {pathname === "/builder" ? "Builder" : <span>Start<span className="nav-hide-sm"> building</span> →</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
