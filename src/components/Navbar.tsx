"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/directorio") return pathname?.startsWith("/directorio") || pathname?.startsWith("/veterinario");
    return pathname === path;
  };
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-6 mt-4">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/logo-vethogar.svg" alt="Vethogar Logo" className="w-14 h-14 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] bg-clip-text text-transparent">
              Vethogar
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-all duration-300 font-medium ${
                isActive('/') 
                  ? 'text-[#7C3AED] font-semibold' 
                  : 'text-gray-600 hover:text-[#7C3AED]'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/directorio"
              className={`transition-all duration-300 font-medium ${
                isActive('/directorio') 
                  ? 'text-[#7C3AED] font-semibold' 
                  : 'text-gray-600 hover:text-[#7C3AED]'
              }`}
            >
              Veterinarios
            </Link>
            <Link
              href="/acerca-de"
              className={`transition-all duration-300 font-medium ${
                isActive('/acerca-de') 
                  ? 'text-[#7C3AED] font-semibold' 
                  : 'text-gray-600 hover:text-[#7C3AED]'
              }`}
            >
              Acerca de
            </Link>
            <Link
              href="/soy-veterinario"
              className={`transition-all duration-300 font-medium ${
                isActive('/soy-veterinario') 
                  ? 'text-[#7C3AED] font-semibold' 
                  : 'text-gray-600 hover:text-[#7C3AED]'
              }`}
            >
              Soy Veterinario
            </Link>
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
        </div>
      </div>
    </motion.nav>
  );
}
