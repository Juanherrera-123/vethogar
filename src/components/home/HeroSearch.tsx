"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Container from "../layout/Container";

const HeroSearch = () => {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (specialty.trim()) {
      params.set("specialty", specialty.trim());
    }
    if (city.trim()) {
      params.set("city", city.trim());
    }
    const query = params.toString();
    router.push(`/search${query ? `?${query}` : ""}`);
  };

  return (
    <section
      className="relative flex min-h-[calc(100vh-var(--header-height,0px))] items-center overflow-hidden bg-slate-50 bg-cover bg-center py-16 sm:py-20"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <Container className="relative">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                VetHogar
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">
                Cuidamos a quienes más quieres
              </h1>
              <p className="text-base text-slate-600 sm:text-lg">
                Encuentra veterinarios y clínicas cerca de ti
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:flex-row">
              <label className="flex w-full flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Especialidad
                <input
                  type="text"
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                  placeholder="Clínica, vacunas, cirugía"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <label className="flex w-full flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ciudad
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Ciudad"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <button
                type="button"
                onClick={handleSearch}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 sm:mt-auto"
              >
                Buscar
              </button>
            </div>
          </div>
          <div className="hidden md:block" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
};

export default HeroSearch;
