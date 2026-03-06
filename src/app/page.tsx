"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, MessageCircle, Star, UserPlus, CheckCircle, ArrowRight, Quote, MapPin, Stethoscope } from "lucide-react";
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { SearchBar } from '@/components/SearchBar';
import { useRouter } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { supabase } from "@/lib/supabase/client";

interface FeaturedDirectoryProfileRow {
  id: string;
  display_name: string;
  specialty: string;
  city: string;
  experience?: string | null;
  rating?: number | null;
  reviews?: number | null;
  consultation_price?: string | null;
  image_url?: string | null;
}

interface FeaturedDirectoryProfile {
  id: string;
  name: string;
  specialty: string;
  city: string;
  experience: string;
  rating: number;
  reviews: number;
  consultationPrice: string;
  image: string;
}

interface ReviewSummaryResponse {
  summaries?: Record<string, { averageRating: number; reviewCount: number }>;
}

export default function HomePage() {
  const router = useRouter();
  const [featuredProfiles, setFeaturedProfiles] = useState<FeaturedDirectoryProfile[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredCarouselApi, setFeaturedCarouselApi] = useState<CarouselApi>();

  const handleSearch = (city: string, specialty: string) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (specialty) params.set("specialty", specialty);
    const query = params.toString();
    router.push(`/directorio${query ? `?${query}` : ""}`);
  };

  const formatConsultationPrice = (rawValue?: string | null) => {
    const digits = (rawValue ?? "").replace(/\D/g, "");
    if (!digits) return "Consultar";
    const amount = Number.parseInt(digits, 10);
    if (!Number.isFinite(amount)) return "Consultar";
    return `Desde $${amount.toLocaleString("es-CO")}`;
  };

  const parseExperienceYears = (value: string | null | undefined) => {
    if (!value) return 0;
    const match = value.match(/\d+/);
    if (!match) return 0;
    const parsed = Number.parseInt(match[0], 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatExperienceLabel = (value: string | null | undefined) => {
    const years = parseExperienceYears(value);
    if (years <= 0) return "";
    return `${years} años exp`;
  };

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProfiles = async () => {
      setFeaturedLoading(true);
      const { data, error } = await supabase
        .from("directory_profiles")
        .select(
          "id,display_name,specialty,city,experience,rating,reviews,consultation_price,image_url,verified",
        )
        .eq("verified", true)
        .order("rating", { ascending: false })
        .order("reviews", { ascending: false })
        .limit(12);

      if (!isMounted) return;

      if (error) {
        setFeaturedProfiles([]);
        setFeaturedLoading(false);
        return;
      }

      const rows = (data ?? []) as unknown as FeaturedDirectoryProfileRow[];
      const mapped = rows.map((row) => ({
        id: row.id,
        name: row.display_name || "Veterinario",
        specialty: row.specialty || "Medicina general",
        city: row.city || "Colombia",
        experience: row.experience ?? "",
        rating: row.rating ?? 0,
        reviews: row.reviews ?? 0,
        consultationPrice: formatConsultationPrice(row.consultation_price),
        image:
          row.image_url ||
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600",
      }));

      let reviewSummaries: Record<string, { averageRating: number; reviewCount: number }> = {};
      if (rows.length > 0) {
        try {
          const summaryResponse = await fetch("/api/reviews/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileIds: rows.map((row) => row.id) }),
          });
          if (summaryResponse.ok) {
            const summaryPayload = (await summaryResponse.json()) as ReviewSummaryResponse;
            reviewSummaries = summaryPayload.summaries ?? {};
          }
        } catch {
          reviewSummaries = {};
        }
      }

      const mappedWithLiveReviews = mapped.map((item) => {
        const summary = reviewSummaries[item.id];
        if (!summary) return item;
        return {
          ...item,
          rating: summary.averageRating,
          reviews: summary.reviewCount,
        };
      });

      setFeaturedProfiles(mappedWithLiveReviews);
      setFeaturedLoading(false);
    };

    loadFeaturedProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!featuredCarouselApi) return;
    if (featuredProfiles.length <= 4) return;

    const interval = window.setInterval(() => {
      if (featuredCarouselApi.canScrollNext()) {
        featuredCarouselApi.scrollNext();
      } else {
        featuredCarouselApi.scrollTo(0);
      }
    }, 2600);

    return () => window.clearInterval(interval);
  }, [featuredCarouselApi, featuredProfiles.length]);

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Perfiles Verificados',
      description: 'Revisamos la tarjeta profesional y antecedentes.',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      icon: MessageCircle,
      title: 'Contacto Directo',
      description: 'Sin intermediarios. Habla directo al WhatsApp.',
      gradient: 'from-emerald-400 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-100',
    },
    {
      icon: Star,
      title: 'Reseñas Reales',
      description: 'Decisiones informadas basadas en experiencias.',
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-100',
    },
  ];

  const vetBenefits = [
    'Perfil profesional verificado',
    'Contacto directo con clientes',
    'Sin comisiones por contacto',
    'Aumenta tu visibilidad',
  ];

  const testimonials = [
    {
      name: 'María Fernanda López',
      location: 'Bogotá',
      rating: 5,
      text: 'Encontré al veterinario perfecto para mi perro en minutos. La plataforma es muy fácil de usar y todos los profesionales están verificados. ¡Muy recomendado!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    {
      name: 'Carlos Andrés Ruiz',
      location: 'Medellín',
      rating: 5,
      text: 'Mi gato necesitaba atención urgente y gracias a Vethogar pude contactar directamente por WhatsApp con un especialista. Excelente servicio.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    {
      name: 'Ana Patricia Gómez',
      location: 'Cali',
      rating: 5,
      text: 'La mejor plataforma para encontrar veterinarios confiables. Los perfiles son completos y las reseñas me ayudaron a tomar la mejor decisión para mi mascota.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section - Two Column Layout */}
      <section className="relative flex min-h-screen items-center overflow-hidden pb-14 pt-28 sm:pt-32 md:pb-20">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-blue-100/50">
          {/* Floating Gradient Orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute right-1/4 top-16 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl md:top-20 md:h-96 md:w-96"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-28 left-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/20 to-teal-400/20 blur-3xl md:bottom-40 md:h-96 md:w-96"
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="mb-4 inline-block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent md:mb-6">
                  — Para Dueños de Mascotas
                </span>
                <h1 className="mb-5 text-4xl font-bold leading-[1.1] text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
                  Encuentra a tu{" "}
                  <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                    veterinario
                  </span>{" "}
                  de confianza.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                  Hacemos que cuidar a tu mascota sea más fácil y seguro. Por eso te conectamos con tu veterinario ideal.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 sm:w-auto"
                >
                  Buscar Veterinario
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/soy-veterinario')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-purple-200 bg-white/70 px-7 py-3.5 text-base font-semibold text-gray-900 transition-all duration-300 hover:border-purple-300 hover:bg-white sm:w-auto"
                >
                  Soy Veterinario
                </motion.button>
              </motion.div>

              {/* Trust Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-6 pt-6 sm:gap-8 sm:pt-8"
              >
                <div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Veterinarios</div>
                </div>
                <div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Ciudades</div>
                </div>
                <div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">4.9★</div>
                  <div className="text-sm text-gray-600 font-medium">Calificación</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
            >
              <div className="relative">
                {/* Decorative gradient background for image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-3xl blur-2xl transform rotate-6"></div>
                
                {/* Main Image Container */}
                <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-white/50">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjB3b21hbiUyMGhhcHB5JTIwZG9nfGVufDF8fHx8MTc2OTI2ODE4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Veterinarian with happy dog"
                    className="w-full h-auto rounded-3xl object-cover"
                  />
                </div>

                {/* Floating card elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur-xl sm:block lg:-bottom-6 lg:-left-6 lg:p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Verificado</div>
                      <div className="text-xs text-gray-600">Profesional certificado</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-3 -top-4 hidden rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur-xl sm:block lg:-top-6 lg:-right-6 lg:p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">4.9/5.0</div>
                      <div className="text-xs text-gray-600">200+ reseñas</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section - Centered */}
      <section id="search-section" className="relative bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8 text-center md:mb-10">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4"
              >
                Comienza tu búsqueda
              </motion.span>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                Encuentra el cuidado que necesitas
              </h2>
              <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl">
                Busca por ciudad y especialidad para encontrar al veterinario perfecto
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Featured Vets Carousel */}
      <section className="relative bg-gradient-to-b from-pink-50 via-blue-50 to-purple-50 py-14 md:py-18">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <span className="mb-3 inline-block bg-gradient-to-r from-[#EC4899] via-[#6366F1] to-[#06B6D4] bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent">
                Destacados en Vethogar
              </span>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Veterinarios registrados
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Explora algunas opciones verificadas y conoce sus perfiles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/directorio")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EC4899] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-400/25 transition hover:-translate-y-0.5"
            >
              Ver todo el directorio
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`featured-skeleton-${index}`}
                  className="h-72 animate-pulse rounded-3xl border border-white/60 bg-white/70"
                />
              ))}
            </div>
          ) : featuredProfiles.length > 0 ? (
            <Carousel
              setApi={setFeaturedCarouselApi}
              opts={{ align: "start", loop: featuredProfiles.length > 4 }}
              className="relative"
            >
              <CarouselContent>
                {featuredProfiles.map((profile) => (
                  <CarouselItem
                    key={profile.id}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <motion.button
                      whileHover={{ y: -6 }}
                      type="button"
                      onClick={() => router.push(`/veterinario/${profile.id}`)}
                      className="group h-full w-full overflow-hidden rounded-3xl border border-white/60 bg-white/75 text-left shadow-xl backdrop-blur-xl transition hover:shadow-2xl"
                    >
                      <div className="relative h-44">
                        <ImageWithFallback
                          src={profile.image}
                          alt={profile.name}
                          className="h-full w-full object-cover object-top"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
                        <div className="absolute left-3 top-3 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow">
                          {profile.consultationPrice}
                        </div>
                      </div>

                      <div className="space-y-3 p-4">
                        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">{profile.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Stethoscope className="h-4 w-4 text-indigo-600" />
                          <span className="line-clamp-1">{profile.specialty}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                          <span className="line-clamp-1">
                            {profile.city}
                            {formatExperienceLabel(profile.experience)
                              ? ` · ${formatExperienceLabel(profile.experience)}`
                              : ""}
                          </span>
                        </div>
                        {profile.reviews > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={`${profile.id}-star-${index}`}
                                  className={`h-4 w-4 ${
                                    index < Math.round(profile.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {profile.rating.toFixed(1)} ({profile.reviews})
                            </span>
                          </div>
                        ) : (
                          <div className="h-6" />
                        )}
                      </div>
                    </motion.button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {featuredProfiles.length > 1 ? (
                <>
                  <CarouselPrevious className="-left-2 hidden h-10 w-10 border border-indigo-200 bg-white text-indigo-700 shadow-lg md:flex" />
                  <CarouselNext className="-right-2 hidden h-10 w-10 border border-indigo-200 bg-white text-indigo-700 shadow-lg md:flex" />
                </>
              ) : null}
            </Carousel>
          ) : (
            <div className="rounded-3xl border border-white/60 bg-white/70 px-6 py-8 text-center text-gray-600">
              Pronto verás aquí veterinarios destacados.
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="relative bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center md:mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
              ¿Por qué Vethogar?
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Tu tranquilidad es nuestra prioridad
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <motion.div
                  key={indicator.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl md:p-8`}
                >
                  {/* Decorative gradient overlay */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${indicator.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />
                  
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${indicator.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
                    {indicator.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    {indicator.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50 py-16 md:py-24">
        {/* Decorative Background */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
        />
        
        {/* Small gradient dots */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-violet-400/30 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 right-32 w-32 h-32 bg-gradient-to-br from-pink-400/25 to-rose-400/25 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{
            x: [0, -15, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-24 w-28 h-28 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-24 left-1/3 w-20 h-20 bg-gradient-to-br from-indigo-400/35 to-purple-400/35 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-48 right-1/4 w-16 h-16 bg-gradient-to-br from-fuchsia-400/40 to-pink-400/40 rounded-full blur-xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center md:mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
              Testimonios
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl">
              Miles de dueños de mascotas han encontrado al veterinario perfecto
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl md:p-8"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="mb-6 text-base leading-relaxed text-gray-700 md:text-lg">
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-200">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 py-14 md:py-16">
        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-teal-300/20 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-8">
              {/* Left Side - Content */}
              <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 md:p-10">
                <div className="mb-6 md:mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-4"
                  >
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">
                      💼 Para profesionales
                    </span>
                  </motion.div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                    ¿Eres veterinario?
                  </h2>
                  <p className="text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl">
                    Únete a nuestra red de profesionales verificados y conecta con dueños de mascotas que necesitan tus servicios.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="mb-8 grid grid-cols-1 gap-3 sm:gap-4">
                  {vetBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 sm:p-4"
                    >
                      <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                      <span className="text-base font-medium text-gray-800 sm:text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/soy-veterinario')}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 sm:w-auto sm:px-10 sm:py-5 sm:text-lg"
                  >
                    <UserPlus className="w-6 h-6" />
                    Crea tu perfil profesional
                  </motion.button>
                </div>
              </div>

              {/* Right Side - Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
              >
                <div className="relative">
                  {/* Decorative gradient background for image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-3xl blur-2xl transform -rotate-6"></div>
                  
                  {/* Main Image Container */}
                  <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-3 shadow-2xl border border-white/50 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1713160848421-bd49a21b09ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjB0ZWFtJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTIwMjkyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Equipo veterinario profesional"
                      className="w-full h-auto rounded-3xl object-cover"
                    />
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur-xl sm:block lg:-bottom-6 lg:-left-6 lg:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Únete hoy</div>
                        <div className="text-xs text-gray-600">500+ veterinarios</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
