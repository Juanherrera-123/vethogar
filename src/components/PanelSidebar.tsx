"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type SidebarItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

interface PanelSidebarProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: SidebarItem[];
}

export function PanelSidebar({ eyebrow = "Panel", title, subtitle, items }: PanelSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const activeHref = (() => {
    if (!pathname) return "";
    const matches = items
      .map((item) => item.href)
      .filter((href): href is string =>
        Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`)),
      );
    if (matches.length === 0) return "";
    return matches.sort((a, b) => b.length - a.length)[0] ?? "";
  })();

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-3xl border border-purple-100/60 bg-white/70 backdrop-blur-xl shadow-xl p-6 lg:sticky lg:top-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-purple-600/70 font-semibold">{eyebrow}</p>
          <h2 className="text-xl font-bold text-gray-900 mt-2">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-600 mt-1">{subtitle}</p> : null}
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = item.isActive ?? Boolean(item.href && item.href === activeHref);
            return (
              <button
                key={item.href ?? item.label}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                    return;
                  }
                  if (item.href) {
                    router.push(item.href);
                  }
                }}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "text-gray-700 hover:bg-purple-50/80"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-purple-100/60">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50/70 transition disabled:opacity-60"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesion
          </button>
        </div>
      </div>
    </aside>
  );
}
