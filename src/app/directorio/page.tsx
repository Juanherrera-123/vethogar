"use client";

import { motion } from "framer-motion";
import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Star, Award, CheckCircle, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

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

export default function DirectorioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCity = searchParams.get('city') || '';
  const initialSpecialty = searchParams.get('specialty') || '';

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState('');

  const cities = [
    'Todas las ciudades',
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Santa Marta',
    'Cúcuta',
    'Ibagué',
  ];

  const specialties = [
    'Todas las especialidades',
    'Medicina General',
    'Cirugía',
    'Dermatología',
    'Oftalmología',
    'Cardiología',
    'Odontología',
    'Nutrición',
    'Etología',
    'Traumatología',
    'Oncología',
  ];

  const veterinarians: Veterinarian[] = [
    {
      id: 1,
      name: 'Dr. Carlos Mendoza',
      specialty: 'Cirugía',
      city: 'Bogotá',
      phone: '+57 310 123 4567',
      whatsapp: '+57 310 123 4567',
      rating: 4.9,
      reviews: 127,
      verified: true,
      experience: '15 años',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    },
    {
      id: 2,
      name: 'Dra. María González',
      specialty: 'Dermatología',
      city: 'Medellín',
      phone: '+57 320 234 5678',
      whatsapp: '+57 320 234 5678',
      rating: 4.8,
      reviews: 98,
      verified: true,
      experience: '10 años',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    },
    {
      id: 3,
      name: 'Dr. Andrés López',
      specialty: 'Medicina General',
      city: 'Cali',
      phone: '+57 315 345 6789',
      whatsapp: '+57 315 345 6789',
      rating: 4.7,
      reviews: 156,
      verified: true,
      experience: '12 años',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    },
    {
      id: 4,
      name: 'Dra. Laura Ramírez',
      specialty: 'Oftalmología',
      city: 'Bogotá',
      phone: '+57 318 456 7890',
      whatsapp: '+57 318 456 7890',
      rating: 4.9,
      reviews: 203,
      verified: true,
      experience: '18 años',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    },
    {
      id: 5,
      name: 'Dr. Jorge Martínez',
      specialty: 'Cardiología',
      city: 'Barranquilla',
      phone: '+57 311 567 8901',
      whatsapp: '+57 311 567 8901',
      rating: 4.8,
      reviews: 89,
      verified: true,
      experience: '14 años',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    },
    {
      id: 6,
      name: 'Dra. Patricia Silva',
      specialty: 'Odontología',
      city: 'Medellín',
      phone: '+57 313 678 9012',
      whatsapp: '+57 313 678 9012',
      rating: 4.9,
      reviews: 142,
      verified: true,
      experience: '11 años',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
  ];

  const filteredVeterinarians = veterinarians.filter((vet) => {
    const cityMatch = !selectedCity || selectedCity === 'Todas las ciudades' || vet.city === selectedCity;
    const specialtyMatch = !selectedSpecialty || selectedSpecialty === 'Todas las especialidades' || vet.specialty === selectedSpecialty;
    const searchMatch = !searchQuery || vet.name.toLowerCase().includes(searchQuery.toLowerCase());
    return cityMatch && specialtyMatch && searchMatch;
  });

  const handleWhatsAppClick = (phone: string, vetName: string) => {
    const message = encodeURIComponent(`Hola ${vetName}, encontré tu perfil en Vethogar y me gustaría agendar una consulta.`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
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
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
              Encuentra a tu{' '}
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

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 sticky top-28">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Search className="w-6 h-6 text-[#7C3AED]" />
                  Filtros
                </h2>

                {/* Search Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Buscar por nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del veterinario"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* City Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialty Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especialidad
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCity('');
                    setSelectedSpecialty('');
                    setSearchQuery('');
                  }}
                  className="w-full bg-gradient-to-r from-purple-50 to-pink-50 text-[#7C3AED] font-semibold py-3 px-6 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.aside>

            {/* Veterinarians Grid */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 flex justify-between items-center"
              >
                <p className="text-gray-600 font-medium">
                  {filteredVeterinarians.length} veterinario{filteredVeterinarians.length !== 1 ? 's' : ''} encontrado{filteredVeterinarians.length !== 1 ? 's' : ''}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVeterinarians.map((vet, index) => (
                  <motion.div
                    key={vet.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => router.push(`/veterinario/${vet.id}`)}
                    className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={vet.image}
                        alt={vet.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {vet.verified && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                          <CheckCircle className="w-4 h-4 text-[#10B981]" />
                          <span className="text-xs font-semibold text-gray-900">Verificado</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{vet.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-[#7C3AED]" />
                        <span className="text-sm font-medium text-gray-700">{vet.specialty}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{vet.city}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{vet.experience}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-semibold text-gray-900">{vet.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">({vet.reviews} reseñas)</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppClick(vet.whatsapp, vet.name);
                          }}
                          className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallClick(vet.phone);
                          }}
                          className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 text-[#7C3AED] font-semibold py-3 px-4 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Llamar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredVeterinarians.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/50">
                    <p className="text-xl text-gray-600 mb-4">No se encontraron veterinarios con estos filtros</p>
                    <button
                      onClick={() => {
                        setSelectedCity('');
                        setSelectedSpecialty('');
                        setSearchQuery('');
                      }}
                      className="bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
