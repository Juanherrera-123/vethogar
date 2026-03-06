"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle,
  Search,
  SlidersHorizontal,
  Stethoscope,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { supabase } from "@/lib/supabase/client";

interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
  city: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  verified: boolean;
  experience: string;
  consultationPrice: string;
  image: string;
  searchableText: string;
}

interface DirectoryProfileRow {
  id: string;
  display_name: string;
  specialty: string;
  city: string;
  phone: string;
  whatsapp?: string | null;
  rating?: number | null;
  reviews?: number | null;
  verified?: boolean | null;
  experience?: string | null;
  consultation_price?: string | null;
  image_url?: string | null;
}

interface ProfileRoleRow {
  id: string;
  role: string;
}

interface AboutRow {
  id: string;
  about?: string | null;
}

interface ReviewSummaryResponse {
  summaries?: Record<string, { averageRating: number; reviewCount: number }>;
}

type SortOption =
  | "default"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "rating_asc";

const parseNumericValue = (value: string | number | null | undefined): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (!value) return 0;
  const digitsOnly = value.toString().replace(/\D/g, "");
  if (!digitsOnly) return 0;
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseExperienceYears = (value: string | null | undefined): number => {
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

interface FiltersSidebarProps {
  cities: string[];
  specialties: string[];
  selectedCity: string;
  selectedSpecialty: string;
  searchQuery: string;
  selectedRating: string;
  selectedExperience: string;
  sortBy: SortOption;
  onCityChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClear: () => void;
}

function FiltersSidebar({
  cities,
  specialties,
  selectedCity,
  selectedSpecialty,
  searchQuery,
  selectedRating,
  selectedExperience,
  sortBy,
  onCityChange,
  onSpecialtyChange,
  onSearchChange,
  onRatingChange,
  onExperienceChange,
  onSortChange,
  onClear,
}: FiltersSidebarProps) {
  return (
    <div className="rounded-3xl border border-indigo-100/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl sm:p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Buscar</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nombre, especialidad o palabra clave"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Ciudad</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Especialidad</label>
          <select
            value={selectedSpecialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Puntuación (estrellas)
          </label>
          <select
            value={selectedRating}
            onChange={(e) => onRatingChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">Todas las puntuaciones</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas o más</option>
            <option value="3">3 estrellas o más</option>
            <option value="2">2 estrellas o más</option>
            <option value="1">1 estrella o más</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Experiencia (años)
          </label>
          <select
            value={selectedExperience}
            onChange={(e) => onExperienceChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">Cualquier experiencia</option>
            <option value="1">1+ años</option>
            <option value="3">3+ años</option>
            <option value="5">5+ años</option>
            <option value="10">10+ años</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="default">Relevancia</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="rating_desc">Puntuación: mayor a menor</option>
            <option value="rating_asc">Puntuación: menor a mayor</option>
          </select>
        </div>
      </div>

      <button
        onClick={onClear}
      className="mt-5 w-full rounded-xl bg-gradient-to-r from-rose-100 to-indigo-100 py-3 text-sm font-semibold text-indigo-700 transition hover:from-rose-200 hover:to-indigo-200 sm:mt-6"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

interface VetCardProps {
  vet: Veterinarian;
  onWhatsApp: (vet: Veterinarian) => void;
  onCall: (vet: Veterinarian) => void;
  onOpen: () => void;
}

function VetCard({ vet, onWhatsApp, onCall, onOpen }: VetCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-indigo-100/60 bg-white/80 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-2xl"
    >
      <div className="relative h-44 md:h-48">
        <ImageWithFallback
          src={vet.image}
          alt={vet.name}
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 shadow-md">
          <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-semibold">
            Valor consulta
          </p>
          <p className="text-lg font-bold text-gray-900">{vet.consultationPrice}</p>
        </div>

        {vet.verified && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700">Verificado</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{vet.name}</h3>

        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <Stethoscope className="h-4 w-4 text-indigo-600" />
          <span>{vet.specialty}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 text-indigo-600" />
          <span>
            {vet.city}
            {formatExperienceLabel(vet.experience) ? ` · ${formatExperienceLabel(vet.experience)}` : ""}
          </span>
        </div>

        {vet.reviews > 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Star className="h-4 w-4 text-amber-500" />
            <span>
              {vet.rating.toFixed(1)} ({vet.reviews} reseñas)
            </span>
          </div>
        ) : (
          <div className="h-5" />
        )}

        <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWhatsApp(vet);
            }}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCall(vet);
            }}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-rose-100 to-indigo-100 text-sm font-semibold text-indigo-700 shadow-sm transition hover:from-rose-200 hover:to-indigo-200"
          >
            <Phone className="h-4 w-4" /> Llamar
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function VetDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCity = searchParams.get("city") || "Todas las ciudades";
  const initialSpecialty = searchParams.get("specialty") || "Todas las especialidades";

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [directoryProfiles, setDirectoryProfiles] = useState<Veterinarian[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const cities = [
    "Todas las ciudades",
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Bucaramanga",
    "Pereira",
    "Santa Marta",
    "Cúcuta",
    "Ibagué",
  ];

  const specialties = [
    "Todas las especialidades",
    "Medicina General",
    "Cirugía",
    "Dermatología",
    "Oftalmología",
    "Cardiología",
    "Odontología",
    "Nutrición",
    "Etología",
    "Traumatología",
    "Oncología",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProfiles = async () => {
      setLoadingProfiles(true);
      setProfileError(null);

      const { data, error } = await supabase
        .from("directory_profiles")
        .select(
          [
            "id",
            "display_name",
            "specialty",
            "city",
            "phone",
            "whatsapp",
            "rating",
            "reviews",
            "verified",
            "experience",
            "consultation_price",
            "image_url",
          ].join(","),
        );

      if (!isMounted) return;

      if (error) {
        setProfileError(error.message);
        setDirectoryProfiles([]);
        setLoadingProfiles(false);
        return;
      }

      const rows = (data ?? []) as unknown as DirectoryProfileRow[];
      const profileIds = rows.map((row) => row.id);
      const descriptionById: Record<string, string> = {};

      if (profileIds.length > 0) {
        const { data: roleRows } = await supabase
          .from("profiles")
          .select("id, role")
          .in("id", profileIds);
        const roles = (roleRows ?? []) as ProfileRoleRow[];
        const vetIds = roles.filter((row) => row.role === "vet").map((row) => row.id);
        const clinicIds = roles.filter((row) => row.role === "clinic").map((row) => row.id);

        if (vetIds.length > 0) {
          const { data: vetRows } = await supabase
            .from("vet_profiles")
            .select("id, about")
            .in("id", vetIds);
          ((vetRows ?? []) as AboutRow[]).forEach((row) => {
            descriptionById[row.id] = row.about?.trim() ?? "";
          });
        }

        if (clinicIds.length > 0) {
          const { data: clinicRows } = await supabase
            .from("clinic_profiles")
            .select("id, about")
            .in("id", clinicIds);
          ((clinicRows ?? []) as AboutRow[]).forEach((row) => {
            descriptionById[row.id] = row.about?.trim() ?? "";
          });
        }
      }

      const mapped = rows.map((row) => ({
        id: row.id,
        name: row.display_name,
        specialty: row.specialty,
        city: row.city,
        phone: row.phone,
        whatsapp: row.whatsapp || row.phone,
        rating: row.rating ?? 0,
        reviews: row.reviews ?? 0,
        verified: row.verified ?? false,
        experience: row.experience ?? "",
        consultationPrice: row.consultation_price ?? "",
        image: row.image_url || "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600",
        searchableText: descriptionById[row.id] ?? "",
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

      setDirectoryProfiles(mappedWithLiveReviews);
      setLoadingProfiles(false);
    };

    loadProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVeterinarians = useMemo(() => {
    const minRating =
      selectedRating === "all" ? 0 : Number.parseFloat(selectedRating) || 0;
    const minExperience =
      selectedExperience === "all" ? 0 : Number.parseInt(selectedExperience, 10) || 0;

    const filtered = directoryProfiles.filter((vet) => {
      const cityMatch =
        !selectedCity || selectedCity === "Todas las ciudades" || vet.city === selectedCity;
      const specialtyMatch =
        !selectedSpecialty ||
        selectedSpecialty === "Todas las especialidades" ||
        vet.specialty === selectedSpecialty;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const searchMatch =
        !normalizedQuery ||
        vet.name.toLowerCase().includes(normalizedQuery) ||
        vet.specialty.toLowerCase().includes(normalizedQuery) ||
        vet.city.toLowerCase().includes(normalizedQuery) ||
        vet.searchableText.toLowerCase().includes(normalizedQuery);
      const ratingMatch = vet.rating >= minRating;
      const experienceMatch = parseExperienceYears(vet.experience) >= minExperience;
      return cityMatch && specialtyMatch && searchMatch && ratingMatch && experienceMatch;
    });

    if (sortBy === "default") return filtered;

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "price_asc") {
        return parseNumericValue(a.consultationPrice) - parseNumericValue(b.consultationPrice);
      }
      if (sortBy === "price_desc") {
        return parseNumericValue(b.consultationPrice) - parseNumericValue(a.consultationPrice);
      }
      if (sortBy === "rating_asc") {
        return a.rating - b.rating;
      }
      if (sortBy === "rating_desc") {
        return b.rating - a.rating;
      }
      return 0;
    });
    return sorted;
  }, [
    directoryProfiles,
    searchQuery,
    selectedCity,
    selectedSpecialty,
    selectedRating,
    selectedExperience,
    sortBy,
  ]);

  const filteredCount = filteredVeterinarians.length;

  const isEmpty = !loadingProfiles && filteredCount === 0;
  

  const trackContactClick = (profileId: string, action: "whatsapp" | "call", source: "directory_card") => {
    const body = JSON.stringify({ profileId, action, source });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const payload = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/contact-click", payload);
      return;
    }
    void fetch("/api/contact-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  };

  const handleWhatsAppClick = (vet: Veterinarian) => {
    trackContactClick(vet.id, "whatsapp", "directory_card");
    const message = encodeURIComponent(
      `Hola ${vet.name}, encontré tu perfil en Vethogar y me gustaría agendar una consulta.`,
    );
    window.open(`https://wa.me/${vet.whatsapp.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const handleCallClick = (vet: Veterinarian) => {
    trackContactClick(vet.id, "call", "directory_card");
    window.location.href = `tel:${vet.phone}`;
  };

  const handleClearFilters = () => {
    setSelectedCity("Todas las ciudades");
    setSelectedSpecialty("Todas las especialidades");
    setSearchQuery("");
    setSelectedRating("all");
    setSelectedExperience("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE6F1] via-[#EEF3FF] to-[#F7FBFF]">
      <section className="pb-10 pt-28 sm:pt-32">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="mb-4 text-[30px] font-bold text-gray-900 sm:text-[36px] md:text-[48px]">
              Encuentra a tu{" "}
              <span className="bg-gradient-to-r from-[#EC4899] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
                veterinario
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <FiltersSidebar
                cities={cities}
                specialties={specialties}
                selectedCity={selectedCity}
                selectedSpecialty={selectedSpecialty}
                searchQuery={searchQuery}
                selectedRating={selectedRating}
                selectedExperience={selectedExperience}
                sortBy={sortBy}
                onCityChange={setSelectedCity}
                onSpecialtyChange={setSelectedSpecialty}
                onSearchChange={setSearchQuery}
                onRatingChange={setSelectedRating}
                onExperienceChange={setSelectedExperience}
                onSortChange={setSortBy}
                onClear={handleClearFilters}
              />
            </div>

            <div className="lg:col-span-9">
              <p className="text-sm text-gray-600 mb-4">
                {loadingProfiles
                  ? "Cargando veterinarios..."
                  : `${filteredCount} veterinarios encontrados`}
              </p>

              {profileError ? (
                <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {profileError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                {filteredVeterinarians.map((vet) => (
                  <VetCard
                    key={vet.id}
                    vet={vet}
                    onWhatsApp={handleWhatsAppClick}
                    onCall={handleCallClick}
                    onOpen={() => router.push(`/veterinario/${vet.id}`)}
                  />
                ))}
              </div>

              {isEmpty ? (
                <div className="mt-6 rounded-2xl border border-indigo-100/70 bg-white/80 px-4 py-6 text-sm text-gray-600">
                  No hay perfiles aprobados todavía.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VetDirectoryPage;
