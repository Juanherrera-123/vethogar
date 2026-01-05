import Link from "next/link";

import Container from "../layout/Container";

const FinalCTA = () => {
  return (
    <section id="cta-vet" className="bg-slate-50 py-14">
      <Container>
        <div className="rounded-3xl border border-teal-100 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Tu mascota merece lo mejor
              </h2>
              <p className="text-sm text-slate-600 sm:text-base">
                Encuentra atención veterinaria con una búsqueda rápida.
              </p>
              <Link href="/login" className="text-sm font-semibold text-violet-600">
                ¿Eres veterinario? Publica tu perfil
              </Link>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
            >
              Buscar ahora
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FinalCTA;
