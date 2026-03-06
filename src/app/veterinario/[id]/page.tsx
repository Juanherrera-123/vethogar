"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Facebook,
  FileText,
  Home,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
  Stethoscope,
  Twitter,
} from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase/client";

interface ProfileDetail {
  id: string;
  role: "vet" | "clinic";
  name: string;
  type: string;
  specialties: string[];
  rating: number;
  consultationCost: string;
  city: string;
  neighborhood: string;
  verified: boolean;
  emergency24h: boolean;
  homeService: boolean;
  phone: string;
  image: string;
  about: string;
  address: string;
  schedule: { day: string; hours: string }[];
  additionalServices: string[];
  publicationLinks: { title: string; url: string }[];
  socialLinks: { instagram?: string; facebook?: string; twitter?: string; linkedin?: string };
  experience?: string;
  university?: string;
  otherUniversities?: string[];
  languages?: string;
  awards?: string;
  homeServiceAreas?: string;
  otherSpecialties?: string;
  professionalPhotos?: string[];
}

interface VetProfileRow {
  first_name?: string | null;
  last_name?: string | null;
  specialties?: string[] | null;
  consultation_cost?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  experience?: string | null;
  about?: string | null;
  hours?: string | null;
  university?: string | null;
  other_universities?: string[] | null;
  languages?: string | null;
  awards?: string | null;
  home_service_areas?: string | null;
  other_specialties?: string | null;
  publication_links?: unknown;
  social_links?: string | Record<string, string> | null;
  professional_photos?: unknown;
  profile_photo_url?: string | null;
  image_url?: string | null;
}

interface ClinicProfileRow {
  clinic_name?: string | null;
  services?: string[] | null;
  consultation_cost?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  about?: string | null;
  hours?: string | null;
  logo_url?: string | null;
}

interface RelatedProfileRow {
  id: string;
  display_name: string;
  specialty: string;
  city: string;
  phone?: string | null;
  whatsapp?: string | null;
  rating?: number | null;
  reviews?: number | null;
  verified?: boolean | null;
  experience?: string | null;
  consultation_price?: string | null;
  image_url?: string | null;
}

interface RelatedProfileCard {
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
}

const formatHourLabel = (value: string) => {
  const [rawHour] = value.split(":");
  const hour = Number(rawHour);
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = ((hour + 11) % 12) + 1;
  return `${hour12}${suffix}`;
};

const buildRanges = (slots: string[]) => {
  const hours = Array.from(
    new Set(
      slots
        .map((slot) => Number(slot.split(":")[0]))
        .filter((hour) => !Number.isNaN(hour)),
    ),
  ).sort((a, b) => a - b);

  if (hours.length === 0) return [];

  const ranges: Array<[number, number]> = [];
  let start = hours[0];
  let prev = hours[0];

  for (let i = 1; i < hours.length; i += 1) {
    const current = hours[i];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    ranges.push([start, prev]);
    start = current;
    prev = current;
  }

  ranges.push([start, prev]);
  return ranges;
};

const formatSchedule = (raw?: string | null) => {
  if (!raw) return [{ day: "Horario", hours: "Previa cita" }];
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.is24h) {
      return [{ day: "Todos los dias", hours: "24 horas" }];
    }
    if (!parsed?.slots) return [{ day: "Horario", hours: "Previa cita" }];

    const entries = Object.entries(parsed.slots)
      .map(([day, slots]) => {
        if (!Array.isArray(slots) || slots.length === 0) return null;
        const ranges = buildRanges(slots);
        const hoursLabel = ranges
          .map(([start, end]) => {
            const startLabel = formatHourLabel(`${start}:00`);
            const endLabel = formatHourLabel(`${end}:00`);
            return start === end ? `${startLabel}` : `${startLabel} - ${endLabel}`;
          })
          .join(" · ");
        return { day, hours: hoursLabel };
      })
      .filter((entry): entry is { day: string; hours: string } => Boolean(entry));

    return entries.length > 0 ? entries : [{ day: "Horario", hours: "Previa cita" }];
  } catch {
    return [{ day: "Horario", hours: "Previa cita" }];
  }
};

const parsePublicationLinks = (value: unknown): { title: string; url: string }[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("{")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed && typeof parsed.url === "string") {
              return {
                title: typeof parsed.title === "string" ? parsed.title : "",
                url: parsed.url,
              };
            }
          } catch {
            return { title: "", url: trimmed };
          }
        }
        return { title: "", url: trimmed };
      }
      if (typeof item === "object") {
        const candidate = item as { title?: unknown; url?: unknown; name?: unknown; link?: unknown };
        const url = typeof candidate.url === "string" ? candidate.url : candidate.link;
        if (typeof url === "string" && url.trim()) {
          return {
            title: typeof candidate.title === "string" ? candidate.title : typeof candidate.name === "string" ? candidate.name : "",
            url,
          };
        }
      }
      return null;
    })
    .filter((item): item is { title: string; url: string } => Boolean(item));
};

const parseSocialLinks = (raw?: string | Record<string, string> | null) => {
  if (!raw) return { instagram: "", facebook: "", twitter: "", linkedin: "" };
  if (typeof raw === "object") {
    return {
      instagram: raw.instagram ?? "",
      facebook: raw.facebook ?? "",
      twitter: raw.twitter ?? "",
      linkedin: raw.linkedin ?? "",
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      instagram: parsed.instagram ?? "",
      facebook: parsed.facebook ?? "",
      twitter: parsed.twitter ?? "",
      linkedin: parsed.linkedin ?? "",
    };
  } catch {
    return { instagram: "", facebook: "", twitter: "", linkedin: "" };
  }
};

const ensureStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
};

const formatConsultationPriceLabel = (rawValue?: string | null) => {
  const raw = rawValue?.trim() ?? "";
  if (!raw) return "Desde $0";

  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return raw.startsWith("Desde") ? raw : `Desde ${raw}`;
  }

  const normalizedDigits = digits.replace(/^0+(?=\d)/, "");
  const formatted = normalizedDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Desde $${formatted}`;
};

const formatHomeServiceAreasLabel = (rawValue?: string) => {
  if (!rawValue) return "";
  const labelMap: Record<string, string> = {
    norte: "Norte",
    centro: "Centro",
    sur: "Sur",
    oeste: "Oeste",
    este: "Este",
  };
  const normalized = rawValue
    .split(/[,\n;|]+/)
    .map((item) =>
      item
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    )
    .filter(Boolean);
  const unique = Array.from(new Set(normalized));
  return unique.map((item) => labelMap[item] ?? item).join(", ");
};

export default function PerfilVeterinarioPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [vet, setVet] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"perfil" | "educacion" | "resenas">("perfil");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<{ rating: number; comment: string; date: string }[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number | null>(null);
  const [relatedProfiles, setRelatedProfiles] = useState<RelatedProfileCard[]>([]);
  const [relatedProfilesLoading, setRelatedProfilesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, status")
        .eq("id", id)
        .maybeSingle();

      if (!isMounted) return;

      if (profileError || !profile) {
        setError(profileError?.message || "Perfil no encontrado.");
        setLoading(false);
        return;
      }

      if (profile.role === "vet") {
        const { data: vetProfile, error: vetError } = await supabase
          .from("vet_profiles")
          .select(
            [
              "first_name",
              "last_name",
              "specialties",
              "consultation_cost",
              "city",
              "address",
              "phone",
              "experience",
              "about",
              "hours",
              "university",
              "other_universities",
              "languages",
              "awards",
              "home_service_areas",
              "other_specialties",
              "publication_links",
              "social_links",
              "professional_photos",
              "profile_photo_url",
              "image_url",
            ].join(","),
          )
          .eq("id", id)
          .maybeSingle();

        if (!isMounted) return;

        if (vetError || !vetProfile) {
          setError(vetError?.message || "Perfil no encontrado.");
          setLoading(false);
          return;
        }
        const safeVetProfile = vetProfile as unknown as VetProfileRow;

        setVet({
          id: profile.id,
          role: "vet",
          name: `${safeVetProfile.first_name ?? ""} ${safeVetProfile.last_name ?? ""}`.trim(),
          type: safeVetProfile.specialties?.[0] ?? "Veterinario",
          specialties: safeVetProfile.specialties ?? [],
          rating: 0,
          consultationCost: safeVetProfile.consultation_cost ?? "",
          city: safeVetProfile.city ?? "",
          neighborhood: "",
          verified: profile.status === "approved",
          emergency24h: false,
          homeService: false,
          phone: safeVetProfile.phone ?? "",
          image:
            safeVetProfile.profile_photo_url ??
            safeVetProfile.image_url ??
            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600",
          about: safeVetProfile.about ?? "",
          address: safeVetProfile.address ?? "",
          schedule: formatSchedule(safeVetProfile.hours),
          additionalServices: safeVetProfile.specialties ?? [],
          publicationLinks: parsePublicationLinks(safeVetProfile.publication_links),
          socialLinks: parseSocialLinks(safeVetProfile.social_links),
          experience: safeVetProfile.experience ?? "",
          university: safeVetProfile.university ?? "",
          otherUniversities: safeVetProfile.other_universities ?? [],
          languages: safeVetProfile.languages ?? "",
          awards: safeVetProfile.awards ?? "",
          homeServiceAreas: safeVetProfile.home_service_areas ?? "",
          otherSpecialties: safeVetProfile.other_specialties ?? "",
          professionalPhotos: ensureStringArray(safeVetProfile.professional_photos),
        });
      } else if (profile.role === "clinic") {
        const { data: clinicProfile, error: clinicError } = await supabase
          .from("clinic_profiles")
          .select(
            [
              "clinic_name",
              "services",
              "consultation_cost",
              "city",
              "address",
              "phone",
              "about",
              "hours",
              "logo_url",
            ].join(","),
          )
          .eq("id", id)
          .maybeSingle();

        if (!isMounted) return;

        if (clinicError || !clinicProfile) {
          setError(clinicError?.message || "Perfil no encontrado.");
          setLoading(false);
          return;
        }
        const safeClinicProfile = clinicProfile as unknown as ClinicProfileRow;

        setVet({
          id: profile.id,
          role: "clinic",
          name: safeClinicProfile.clinic_name ?? "Clínica veterinaria",
          type: "Clínica Veterinaria",
          specialties: safeClinicProfile.services ?? [],
          rating: 0,
          consultationCost: safeClinicProfile.consultation_cost ?? "",
          city: safeClinicProfile.city ?? "",
          neighborhood: "",
          verified: profile.status === "approved",
          emergency24h: false,
          homeService: false,
          phone: safeClinicProfile.phone ?? "",
          image:
            safeClinicProfile.logo_url ??
            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600",
          about: safeClinicProfile.about ?? "",
          address: safeClinicProfile.address ?? "",
          schedule: formatSchedule(safeClinicProfile.hours),
          additionalServices: safeClinicProfile.services ?? [],
          publicationLinks: [],
          socialLinks: { instagram: "", facebook: "", twitter: "", linkedin: "" },
          professionalPhotos: [],
        });
      } else {
        setError("Perfil no encontrado.");
      }

      setLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    if (!vet?.id) {
      setRelatedProfiles([]);
      return () => {
        isMounted = false;
      };
    }

    const loadRelatedProfiles = async () => {
      setRelatedProfilesLoading(true);
      const primarySpecialty =
        vet.specialties.find((item) => typeof item === "string" && item.trim().length > 0)?.trim() ||
        vet.type.trim();

      const [bySpecialtyRes, byCityRes] = await Promise.all([
        supabase
          .from("directory_profiles")
          .select(
            "id, display_name, specialty, city, phone, whatsapp, rating, reviews, verified, experience, consultation_price, image_url",
          )
          .eq("specialty", primarySpecialty)
          .neq("id", vet.id)
          .limit(8),
        supabase
          .from("directory_profiles")
          .select(
            "id, display_name, specialty, city, phone, whatsapp, rating, reviews, verified, experience, consultation_price, image_url",
          )
          .eq("city", vet.city)
          .neq("id", vet.id)
          .limit(8),
      ]);

      if (!isMounted) return;

      const rowsBySpecialty = (bySpecialtyRes.data ?? []) as RelatedProfileRow[];
      const rowsByCity = (byCityRes.data ?? []) as RelatedProfileRow[];
      const merged = [...rowsBySpecialty, ...rowsByCity];
      const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values()).slice(0, 6);
      const mapped = deduped.map((item) => ({
        id: item.id,
        name: item.display_name,
        specialty: item.specialty,
        city: item.city,
        phone: item.phone ?? "",
        whatsapp: item.whatsapp ?? item.phone ?? "",
        rating: item.rating ?? 0,
        reviews: item.reviews ?? 0,
        verified: item.verified ?? false,
        experience: item.experience ?? "",
        consultationPrice: item.consultation_price ?? "",
        image:
          item.image_url ||
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600",
      }));

      setRelatedProfiles(mapped);
      setRelatedProfilesLoading(false);
    };

    void loadRelatedProfiles();

    return () => {
      isMounted = false;
    };
  }, [vet]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setReviewsLoading(true);
    setReviewError(null);

    fetch(`/api/reviews?profileId=${id}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "No se pudieron cargar las reseñas.");
        }
        if (isMounted) {
          const mapped = (payload?.reviews ?? []).map((review: any) => ({
            rating: Number(review.rating) || 0,
            comment: review.comment ?? "",
            date: review.created_at
              ? new Date(review.created_at).toLocaleDateString()
              : new Date().toLocaleDateString(),
          }));
          setReviews(mapped);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setReviewError(err instanceof Error ? err.message : "No se pudieron cargar las reseñas.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setReviewsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const sections = [
    { key: "perfil", label: "Perfil" },
    { key: "educacion", label: "Educación y Experiencia" },
    { key: "resenas", label: "Reseñas" },
  ] as const;

  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.key === activeSection),
  );

  const carouselPhotos = useMemo(
    () =>
      (vet ? [vet.image, ...(vet.professionalPhotos ?? [])] : []).filter(
        (item, index, array) => Boolean(item) && array.indexOf(item) === index,
      ),
    [vet],
  );

  const visibleCarouselItems = 4;
  const carouselCanScroll = carouselPhotos.length > visibleCarouselItems;

  const visibleCarouselPhotos = useMemo(() => {
    if (carouselPhotos.length === 0) return [];
    const count = Math.min(visibleCarouselItems, carouselPhotos.length);
    return Array.from({ length: count }, (_, offset) => {
      const index = (carouselStartIndex + offset) % carouselPhotos.length;
      return carouselPhotos[index];
    });
  }, [carouselPhotos, carouselStartIndex]);

  useEffect(() => {
    if (carouselPhotos.length === 0) {
      setCarouselStartIndex(0);
      return;
    }
    setCarouselStartIndex((prev) => Math.min(prev, carouselPhotos.length - 1));
  }, [carouselPhotos.length]);

  useEffect(() => {
    if (!carouselCanScroll) return;
    const intervalId = window.setInterval(() => {
      setCarouselStartIndex((prev) => (prev + 1) % carouselPhotos.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [carouselCanScroll, carouselPhotos.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center text-gray-600">Cargando perfil...</div>
      </div>
    );
  }

  if (!vet || error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil no encontrado</h1>
          {error ? <p className="text-sm text-gray-600 mb-4">{error}</p> : null}
          <button
            onClick={() => router.push('/directorio')}
            className="text-[#7C3AED] hover:underline"
          >
            Volver al directorio
          </button>
        </div>
      </div>
    );
  }

  const trackContactClick = (
    profileId: string,
    action: "whatsapp" | "call",
    source: "profile_header" | "profile_service",
  ) => {
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

  const handleWhatsAppClick = () => {
    trackContactClick(vet.id, "whatsapp", "profile_header");
    const message = encodeURIComponent(`Hola ${vet.name}, encontré tu perfil en Vethogar y me gustaría agendar una cita.`);
    window.open(`https://wa.me/${vet.phone.replace(/\s/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    trackContactClick(vet.id, "call", "profile_header");
    window.location.href = `tel:${vet.phone}`;
  };

  const handleServiceWhatsAppClick = (service: string) => {
    const phone = vet.phone.replace(/\D/g, "");
    if (!phone) return;
    trackContactClick(vet.id, "whatsapp", "profile_service");
    const message = encodeURIComponent(
      `Hola ${vet.name}, vi tu perfil en Vethogar y me gustaría pedir más información y precios del servicio de ${service}.`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleSubmitReview = async () => {
    if (!id || reviewRating === 0 || !reviewText.trim()) return;
    setReviewError(null);
    setReviewsLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: id,
          rating: reviewRating,
          comment: reviewText.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo enviar la reseña.");
      }

      const created = payload?.review;
      if (created) {
        const newReview = {
          rating: Number(created.rating) || reviewRating,
          comment: created.comment ?? reviewText.trim(),
          date: created.created_at
            ? new Date(created.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
        };
        setReviews((prev) => [newReview, ...prev]);
      }

      setReviewRating(0);
      setReviewText("");
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "No se pudo enviar la reseña.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const socialItems = [
    { key: "instagram", label: "Instagram", icon: Instagram, url: vet.socialLinks.instagram },
    { key: "facebook", label: "Facebook", icon: Facebook, url: vet.socialLinks.facebook },
    { key: "twitter", label: "Twitter", icon: Twitter, url: vet.socialLinks.twitter },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, url: vet.socialLinks.linkedin },
  ].filter((item) => item.url);

  const ratingValue = averageRating ? averageRating.toFixed(1) : "0.0";
  const ratingStars = Math.max(0, Math.min(5, Math.round(averageRating)));
  const cityValue = vet.city?.trim() || "Ciudad pendiente";
  const homeServiceAreasValue = formatHomeServiceAreasLabel(vet.homeServiceAreas);

  const profileDetailItems = [
    { label: "Ciudad", value: cityValue },
    vet.languages ? { label: "Idiomas", value: vet.languages } : null,
    homeServiceAreasValue
      ? { label: "Zonas de atención domiciliaria", value: homeServiceAreasValue }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const detailItems = [
    vet.experience ? { label: "Años de experiencia", value: vet.experience } : null,
    vet.university ? { label: "Universidad Pregrado", value: vet.university } : null,
    vet.otherUniversities && vet.otherUniversities.length > 0
      ? { label: "Otras universidades", value: vet.otherUniversities.join(", ") }
      : null,
    vet.otherSpecialties ? { label: "Diplomados y/o Cursos", value: vet.otherSpecialties } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const consultationPriceLabel = formatConsultationPriceLabel(vet.consultationCost);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      {/* Profile Header */}
      <div className="relative pb-12 pt-28 sm:pt-32 md:pt-40">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        
        {/* Profile Info Container */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <button
              type="button"
              onClick={() => router.push("/directorio")}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver al directorio
            </button>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 rounded-3xl border border-white/50 bg-white/60 p-5 shadow-2xl backdrop-blur-xl sm:p-7 md:p-10"
            >
              <div className="mb-6 flex flex-col items-start gap-6 md:mb-8 md:flex-row md:gap-8">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-white shadow-xl sm:h-36 sm:w-36 md:h-40 md:w-40">
                    <ImageWithFallback
                      src={vet.image}
                      alt={vet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {vet.verified && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg whitespace-nowrap">
                      <Shield className="w-4 h-4" />
                      Verificado
                    </div>
                  )}
                </div>

                {/* Info Block */}
                <div className="flex-1">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">{vet.name}</h1>
                      <p className="mb-4 text-base font-medium text-gray-600 sm:text-lg md:text-xl">{vet.type}</p>
                    </div>
                    <div className="rounded-2xl border border-purple-200 bg-white/80 px-5 py-4 shadow-lg">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Valor consulta</p>
                      <p className="text-3xl font-bold text-gray-900">{consultationPriceLabel}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3 grid max-w-[280px] grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-0 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-600/80">
                        Ciudad
                      </p>
                      <p className="mt-0.5 text-base font-bold leading-tight text-gray-900 md:text-lg">
                        {cityValue}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">Cerca a ti</p>
                    </div>
                    <div className="p-0 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-600">
                        Calificaciones
                      </p>
                      <p className="mt-0.5 text-xl font-bold leading-tight text-amber-500 md:text-2xl">
                        {ratingValue}
                      </p>
                      <div className="mt-0.5 flex items-center justify-start gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={`rating-star-${index}`}
                            className={`h-3 w-3 ${
                              index < ratingStars ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick badges */}
                  <div className="flex flex-wrap gap-2">
                    {vet.emergency24h && (
                      <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                        Urgencias 24h
                      </span>
                    )}
                    {vet.homeService && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        Servicio a Domicilio
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons inside the card */}
              <div className="grid grid-cols-1 gap-3 border-t border-gray-200 pt-5 sm:pt-6 md:grid-cols-2 md:gap-4">
                {/* WhatsApp Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1fb855] px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 sm:px-8 sm:py-4 sm:text-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chatear por WhatsApp
                </motion.button>

                {/* Call Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCallClick}
                  className="flex items-center justify-center gap-3 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3.5 text-base font-bold text-[#7C3AED] shadow-lg transition-all duration-300 hover:from-purple-200 hover:to-pink-200 sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Phone className="w-6 h-6" />
                  Llamar
                </motion.button>
              </div>
            </motion.div>

            {/* Content Grid - 2 Columns */}
            <div className="grid grid-cols-1 gap-6 pb-12 lg:grid-cols-3 lg:gap-8">
              {/* Main Column (Left, 66%) */}
              <div className="lg:col-span-2 space-y-8">
                {carouselPhotos.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="rounded-3xl border border-white/50 bg-white/60 p-4 shadow-xl backdrop-blur-xl sm:p-6"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCarouselStartIndex(
                            (prev) => (prev - 1 + carouselPhotos.length) % carouselPhotos.length,
                          )
                        }
                        disabled={!carouselCanScroll}
                        className="h-10 w-10 shrink-0 rounded-full border border-purple-200 bg-white text-purple-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Fotos anteriores"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-3">
                        {visibleCarouselPhotos.map((photoUrl, index) => (
                          <button
                            type="button"
                            key={`${photoUrl}-${carouselStartIndex}-${index}`}
                            onClick={() =>
                              setSelectedCarouselIndex(
                                (carouselStartIndex + index) % carouselPhotos.length,
                              )
                            }
                            className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm aspect-[4/3] cursor-zoom-in"
                            aria-label={`Ampliar foto ${carouselStartIndex + index + 1}`}
                          >
                            <img
                              src={photoUrl}
                              alt={`Foto ${carouselStartIndex + index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCarouselStartIndex((prev) => (prev + 1) % carouselPhotos.length)
                        }
                        disabled={!carouselCanScroll}
                        className="h-10 w-10 shrink-0 rounded-full border border-purple-200 bg-white text-purple-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Fotos siguientes"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/50">
                  <div className="relative flex items-center rounded-full bg-white/80 border border-purple-100 p-1">
                    <div
                      className="absolute inset-y-1 left-1 w-1/3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] shadow-md shadow-purple-500/30 transition-transform duration-300"
                      style={{ transform: `translateX(${activeIndex * 100}%)` }}
                    />
                    <div className="relative z-10 flex w-full">
                      {sections.map((item) => {
                        const isActive = activeSection === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setActiveSection(item.key as typeof activeSection)}
                            className={`flex-1 px-3 py-2 text-sm font-semibold transition ${
                              isActive ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {activeSection === "perfil" ? (
                  <>
                    {vet.about ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          Sobre mí
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{vet.about}</p>
                      </motion.div>
                    ) : null}

                    {vet.role === "vet" && profileDetailItems.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.33 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-white" />
                          </div>
                          Información adicional
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profileDetailItems.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3"
                            >
                              <p className="text-xs font-semibold uppercase tracking-widest text-sky-700/80 mb-1">
                                {item.label}
                              </p>
                              <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}

                    {vet.role === "vet" && vet.awards ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          Premios
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{vet.awards}</p>
                      </motion.div>
                    ) : null}

                    {vet.role === "vet" && vet.specialties.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          Énfasis médico
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {vet.specialties.map((specialty: string) => (
                            <span
                              key={specialty}
                              className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-2xl font-semibold text-lg border-2 border-purple-200"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}

                    {vet.role === "clinic" && vet.additionalServices.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          Servicios Adicionales
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                          {vet.additionalServices.map((service: string) => (
                            <div
                              key={service}
                              className="flex flex-col gap-3 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-[#7C3AED] flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{service}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleServiceWhatsAppClick(service)}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#EC4899] to-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-400/30 transition hover:-translate-y-0.5 hover:shadow-lg"
                              >
                                Preguntar precio
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </>
                ) : null}

                {activeSection === "educacion" ? (
                  <>
                    {detailItems.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-white" />
                          </div>
                          Educación y Experiencia
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {detailItems.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3"
                            >
                              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700/80 mb-1">
                                {item.label}
                              </p>
                              <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}

                    {vet.publicationLinks.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          Publicaciones
                        </h2>
                        <div className="space-y-3">
                          {vet.publicationLinks.map((item, index) => (
                            <a
                              key={`${item.url}-${index}`}
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/70 px-4 py-3 text-gray-700 hover:border-purple-200 hover:bg-purple-50/80"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <FileText className="w-5 h-5" />
                              </div>
                              <span className="text-base font-semibold text-gray-800">
                                {item.title || `Publicación ${index + 1}`}
                              </span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </>
                ) : null}

                {activeSection === "resenas" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      Reseñas
                    </h2>
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                        <p className="text-sm font-semibold text-gray-800 mb-3">
                          Califica el servicio
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setReviewRating(value)}
                              className="p-1"
                              aria-label={`Calificar ${value} estrellas`}
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  reviewRating >= value
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-amber-200"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={3}
                          placeholder="Comparte tu experiencia (máx. 240 caracteres)"
                          maxLength={240}
                          className="w-full rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={handleSubmitReview}
                            disabled={reviewsLoading || reviewRating === 0 || !reviewText.trim()}
                            className="inline-flex items-center gap-2 rounded-full bg-amber-500 text-white px-5 py-2 text-sm font-semibold shadow-md hover:bg-amber-600 disabled:opacity-60"
                          >
                            {reviewsLoading ? "Enviando..." : "Enviar reseña"}
                          </button>
                        </div>
                        {reviewError ? (
                          <p className="mt-3 text-sm text-rose-600">{reviewError}</p>
                        ) : null}
                      </div>

                      <div className="space-y-3">
                        {reviewsLoading ? (
                          <div className="rounded-2xl border border-gray-100 bg-white/70 px-4 py-3 text-sm text-gray-600">
                            Cargando reseñas...
                          </div>
                        ) : reviews.length === 0 ? (
                          <div className="rounded-2xl border border-gray-100 bg-white/70 px-4 py-3 text-sm text-gray-600">
                            Aún no hay reseñas. Sé el primero en dejar una.
                          </div>
                        ) : (
                          reviews.map((review, index) => (
                            <div
                              key={`${review.date}-${index}`}
                              className="rounded-2xl border border-gray-100 bg-white/70 px-4 py-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <Star
                                      key={value}
                                      className={`w-4 h-4 ${
                                        review.rating >= value
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-amber-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>

              {/* Sidebar Column (Right, 33%) */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
                {socialItems.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/50"
                  >
                    <div className="flex flex-wrap gap-3">
                      {socialItems.map((item) => (
                        <a
                          key={item.key}
                          href={item.url as string}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-100 bg-white/80 text-purple-600 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-200 hover:bg-purple-50 hover:shadow-lg hover:shadow-purple-200/60"
                          aria-label={item.label}
                        >
                          <item.icon className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ) : null}

                {/* Horarios Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Horarios</h3>
                  </div>
                  <div className="space-y-4">
                    {vet.schedule.map((item: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                        <p className="font-bold text-gray-900 mb-1">{item.day}</p>
                        <p className="text-gray-600">{item.hours}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Ubicación Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Ubicación</h3>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl h-48 mb-4 flex items-center justify-center border-2 border-orange-200">
                    <MapPin className="w-12 h-12 text-orange-400" />
                  </div>
                  
                  <p className="text-gray-900 font-bold mb-1">{vet.address}</p>
                  <p className="text-gray-600">{vet.city}, Colombia</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <section className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-purple-600/80">
                  OTROS PERFILES RECOMENDADOS
                </p>
              </div>
            </div>

            {relatedProfilesLoading ? (
              <p className="text-sm text-gray-600">Cargando perfiles relacionados...</p>
            ) : relatedProfiles.length === 0 ? (
              <p className="text-sm text-gray-600">
                Aún no encontramos perfiles relacionados para mostrar.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedProfiles.map((profile) => (
                  <motion.article
                    key={profile.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35 }}
                    onClick={() => router.push(`/veterinario/${profile.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/veterinario/${profile.id}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="group cursor-pointer overflow-hidden rounded-3xl border border-indigo-100/60 bg-white/80 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-2xl"
                  >
                    <div className="relative h-44 md:h-48">
                      <ImageWithFallback
                        src={profile.image}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 shadow-md">
                        <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-semibold">
                          Valor consulta
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatConsultationPriceLabel(profile.consultationPrice)}
                        </p>
                      </div>
                      {profile.verified ? (
                        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-gray-700">Verificado</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{profile.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <Stethoscope className="h-4 w-4 text-indigo-600" />
                        <span>{profile.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                        <span>
                          {profile.city}
                          {profile.experience ? ` · ${profile.experience}` : ""}
                        </span>
                      </div>
                      {profile.reviews > 0 ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span>
                            {profile.rating.toFixed(1)} ({profile.reviews} reseñas)
                          </span>
                        </div>
                      ) : (
                        <div className="h-5" />
                      )}
                      <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!profile.whatsapp) return;
                            const message = encodeURIComponent(
                              `Hola ${profile.name}, encontré tu perfil en Vethogar y me gustaría agendar una consulta.`,
                            );
                            window.open(
                              `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}?text=${message}`,
                              "_blank",
                            );
                          }}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
                        >
                          <MessageCircle className="h-4 w-4" /> WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!profile.phone) return;
                            window.location.href = `tel:${profile.phone}`;
                          }}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-rose-100 to-indigo-100 text-sm font-semibold text-indigo-700 shadow-sm transition hover:from-rose-200 hover:to-indigo-200"
                        >
                          <Phone className="h-4 w-4" /> Llamar
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Dialog open={selectedCarouselIndex !== null} onOpenChange={(open) => !open && setSelectedCarouselIndex(null)}>
        <DialogContent className="max-w-5xl bg-black/95 border border-purple-200 p-2">
          {selectedCarouselIndex !== null && carouselPhotos[selectedCarouselIndex] ? (
            <div className="relative">
              {carouselPhotos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCarouselIndex(
                        (prev) =>
                          prev === null
                            ? 0
                            : (prev - 1 + carouselPhotos.length) % carouselPhotos.length,
                      )
                    }
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-purple-200 bg-black/55 p-2 text-white hover:bg-black/70"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCarouselIndex(
                        (prev) => (prev === null ? 0 : (prev + 1) % carouselPhotos.length),
                      )
                    }
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-purple-200 bg-black/55 p-2 text-white hover:bg-black/70"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
              <img
                src={carouselPhotos[selectedCarouselIndex]}
                alt={`Foto ampliada ${selectedCarouselIndex + 1}`}
                className="w-full max-h-[80vh] rounded-xl object-contain"
              />
              {carouselPhotos.length > 1 ? (
                <p className="mt-2 text-center text-xs text-purple-100/90">
                  {selectedCarouselIndex + 1} / {carouselPhotos.length}
                </p>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
