import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/logo-vethogar.svg" alt="Vethogar Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Vethogar</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Conectamos dueños responsables con veterinarios verificados. Tu mascota merece el mejor cuidado.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all duration-300 border border-white/10"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all duration-300 border border-white/10"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-purple-500/20 transition-all duration-300 border border-white/10"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Inicio
                </Link>
              </li>
              <li>
                <Link href="/directorio" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Directorio
                </Link>
              </li>
              <li>
                <Link href="/acerca-de" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Acerca de
                </Link>
              </li>
              <li>
                <Link href="/soy-veterinario" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Soy Veterinario
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                  → Política de Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:hola@vethogar.com" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  hola@vethogar.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+573001234567" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  +57 300 123 4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Bogotá, Colombia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} Vethogar. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
