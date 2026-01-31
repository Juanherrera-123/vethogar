"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Star, Award, CheckCircle, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Veterinarian {
  id: number;
  name: string;
  specialty: string;
  city: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  verified: boolean;
  experience: string;
  image: string;
}

export default function DirectorioClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCity = searchParams.get("city") || "";
  const initialSpecialty = searchParams.get("specialty") || "";

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState("");

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

  const veterinarians: Veterinarian[] = [
    {
      id: 1,
      name: "Dr. Carlos Mendoza",
      specialty: "Cirugía",
      city: "Bogotá",
      phone: "+57 310 123 4567",
      whatsapp: "+57 310 123 4567",
      rating: 4.9,
      reviews: 127,
      verified: true,
      experience: "15 años",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    },
    {
      id: 2,
      name: "Dra. María González",
      specialty: "Dermatología",
      city: "Medellín",
      phone: "+57 320 234 5678",
      whatsapp: "+57 320 234 5678",
      rating: 4.8,
      reviews: 98,
      verified: true,
      experience: "10 años",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    },
    {
      id: 3,
      name: "Dr. Andrés López",
      specialty: "Medicina General",
      city: "Cali",
      phone: "+57 315 345 6789",
      whatsapp: "+57 315 345 6789",
      rating: 4.7,
      reviews: 156,
      verified: true,
      experience: "12 años",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    },
    {
      id: 4,
      name: "Dra. Laura Ramírez",
      specialty: "Oftalmología",
      city: "Bogotá",
      phone: "+57 318 456 7890",
      whatsapp: "+57 318 456 7890",
      rating: 4.9,
      reviews: 203,
      verified: true,
      experience: "18 años",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    },
    {
      id: 5,
      name: "Dr. Jorge Martínez",
      specialty: "Cardiología",
      city: "Barranquilla",
      phone: "+57 311 567 8901",
      whatsapp: "+57 311 567 8901",
      rating: 4.8,
      reviews: 89,
      verified: true,
      experience: "14 años",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
    },
    {
      id: 6,
      name: "Dra. Patricia Silva",
      specialty: "Odontología",
      city: "Medellín",
      phone: "+57 313 678 9012",
      whatsapp: "+57 313 678 9012",
      rating: 4.9,
      reviews: 142,
      verified: true,
      experience: "11 años",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    },
  ];

  const filteredVeterinarians = veterinarians.filter((vet) => {
    const cityMatch =
      !selectedCity || selectedCity === "Todas las ciudades" || vet.city === selectedCity;
    const specialtyMatch =
      !selectedSpecialty ||
      selectedSpecialty === "Todas las especialidades" ||
      vet.specialty === selectedSpecialty;
    const searchMatch = !searchQuery || vet.name.toLowerCase().includes(searchQuery.toLowerCase());
    return cityMatch && specialtyMatch && searchMatch;
  });

  const handleWhatsAppClick = (phone: string, vetName: string) => {
    const message = encodeURIComponent(
      `Hola ${vetName}, encontré tu perfil en Vethogar y me gustaría agendar una consulta.`,
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const handleCallClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4"
            >
              — Directorio de profesionales
            </motion.span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Encuentra a tu{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                veterinario
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Explora perfiles verificados y conecta directamente con especialistas en tu ciudad
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 pb-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre del veterinario"
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 gap-6">
          {filteredVeterinarians.map((vet) => (
            <motion.div
              key={vet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-6 items-center">
                <ImageWithFallback
                  src={vet.image}
                  alt={vet.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{vet.name}</h3>
                    {vet.verified && (
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{vet.specialty}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {vet.city}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400" /> {vet.rating} ({vet.reviews} reseñas)
                    <Award className="w-4 h-4 text-purple-500" /> {vet.experience}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleWhatsAppClick(vet.whatsapp, vet.name)}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-2xl shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    onClick={() => handleCallClick(vet.phone)}
                    className="inline-flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-700 font-semibold px-4 py-2 rounded-2xl"
                  >
                    <Phone className="w-4 h-4" /> Llamar
                  </button>
                  <button
                    onClick={() => router.push(`/veterinario/${vet.id}`)}
                    className="inline-flex items-center justify-center gap-2 text-sm text-purple-600 font-semibold"
                  >
                    Ver perfil
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
