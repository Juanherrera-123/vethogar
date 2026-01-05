import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <Container>
        <div className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logovethogar.png"
              alt="VetHogar"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-base font-semibold text-slate-900">VetHogar</span>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:gap-6">
            <Link href="#" className="transition hover:text-slate-900">
              Términos
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Privacidad
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Contacto
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-100 py-6 text-xs text-slate-400">
          © 2024 VetHogar. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
