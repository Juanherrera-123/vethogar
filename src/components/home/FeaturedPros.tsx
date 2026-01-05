import Link from "next/link";

import Container from "../layout/Container";
import { featuredPros } from "../../data/mock";

const FeaturedPros = () => {
  return (
    <section className="bg-slate-50 py-14">
      <Container>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Algunos profesionales en tu zona
            </h2>
            <Link href="/search" className="text-sm font-semibold text-violet-600">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPros.map((pro) => (
              <article
                key={pro.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-violet-100 text-sm font-semibold text-slate-700">
                    {pro.name
                      .split(" ")
                      .slice(1, 3)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{pro.name}</h3>
                    <p className="text-sm text-slate-500">{pro.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={`${pro.id}-star-${index}`} aria-hidden="true">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-700">{pro.rating.toFixed(1)}</span>
                  <span>({pro.reviewsCount} reseñas)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span aria-hidden="true">📍</span>
                  <span>{pro.city}</span>
                </div>
                <button
                  type="button"
                  className="mt-auto inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-600"
                >
                  Ver perfil
                </button>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedPros;
