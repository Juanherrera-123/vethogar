"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  legalDocuments,
  legalDocumentPaths,
  type LegalDocumentKey,
} from "@/content/legal-documents";

const legalLinks: Array<{ key: LegalDocumentKey; label: string }> = [
  { key: "terms", label: "Términos y Condiciones" },
  { key: "privacy", label: "Política de Privacidad" },
  { key: "cookies", label: "Política de Cookies" },
];

export function Footer() {
  const [activeLegalKey, setActiveLegalKey] = useState<LegalDocumentKey | null>(null);
  const activeDocument = activeLegalKey ? legalDocuments[activeLegalKey] : null;

  return (
    <>
      <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 pb-8 pt-14 text-gray-300 sm:pt-16">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:mb-12">
            {/* Brand */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img src="/Logo-vethogar.png" alt="Vethogar Logo" className="h-16 w-16 object-contain" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#EC4899] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent">Vethogar</span>
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
                {legalLinks.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => setActiveLegalKey(item.key)}
                      className="w-full text-left text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2"
                    >
                      → {item.label}
                    </button>
                  </li>
                ))}
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
          <div className="border-t border-white/10 pt-6 sm:pt-8">
            <div className="text-center text-gray-500">
              <p>© {new Date().getFullYear()} Vethogar. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={Boolean(activeDocument)} onOpenChange={(isOpen) => !isOpen && setActiveLegalKey(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border border-purple-100 bg-white rounded-2xl">
          {activeDocument ? (
            <>
              <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 px-6 py-5">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-xl font-bold text-gray-900">{activeDocument.title}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Última actualización: {activeDocument.lastUpdated}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
                <p className="text-sm leading-relaxed text-gray-700">{activeDocument.intro}</p>

                {activeDocument.sections.map((section) => (
                  <section key={section.title} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}

                {activeLegalKey ? (
                  <div className="pt-2">
                    <Link
                      href={legalDocumentPaths[activeLegalKey]}
                      className="inline-flex items-center rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                    >
                      Abrir en página completa
                    </Link>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
