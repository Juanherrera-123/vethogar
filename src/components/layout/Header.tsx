import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const Header = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center py-1">
            <Image
              src="/logovethogar.png"
              alt="VetHogar"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
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
