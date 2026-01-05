import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const Header = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-vethogar.png"
              alt="VetHogar"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold text-slate-900">VetHogar</span>
          </Link>
          <nav className="flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:gap-6">
            <Link href="/search" className="transition hover:text-slate-900">
              Buscar
            </Link>
            <Link href="/#especialidades" className="transition hover:text-slate-900">
              Especialidades
            </Link>
            <Link href="/#cta-vet" className="transition hover:text-slate-900">
              ¿Eres veterinario?
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-violet-500"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
