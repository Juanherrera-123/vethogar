"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/directorio") return pathname?.startsWith("/directorio") || pathname?.startsWith("/veterinario");
    return pathname === path;
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/directorio", label: "Veterinarios" },
    { href: "/acerca-de", label: "Acerca de" },
    { href: "/soy-veterinario", label: "Soy Veterinario" },
  ];
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-3 mt-2.5 sm:mx-4 md:mx-6 md:mt-3">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/20 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-xl sm:px-6 sm:py-2.5 md:px-8 md:py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="relative inline-flex h-11 items-center pl-[4.75rem] sm:h-12 sm:pl-[5.25rem] md:h-12 md:pl-24">
              <span className="absolute left-0 top-1/2 -translate-y-1/2">
                <img
                  src="/Logo-vethogar.png"
                  alt="Vethogar Logo"
                  className="h-[4.5rem] w-[4.5rem] max-w-none object-contain sm:h-20 sm:w-20 md:h-[5.5rem] md:w-[5.5rem]"
                />
              </span>
              <span className="bg-gradient-to-r from-[#EC4899] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
                Vethogar
              </span>
            </Link>
          
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-all duration-300 font-medium ${
                    isActive(item.href)
                      ? "text-[#7C3AED] font-semibold"
                      : "text-gray-600 hover:text-[#7C3AED]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white px-6 py-2.5 rounded-full transition-all duration-300 font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                >
                  Iniciar Sesión
                </motion.span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-200 bg-white/80 text-purple-700 shadow-sm"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="mt-3 md:hidden rounded-2xl border border-purple-100 bg-white/90 p-3 shadow-md">
              <div className="flex flex-col gap-1.5">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive(item.href)
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#EC4899] to-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-400/30"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          ) : null}
          
        </div>
      </div>
    </motion.nav>
  );
}
