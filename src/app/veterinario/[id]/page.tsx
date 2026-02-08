"use client";

import { motion } from "framer-motion";
import { Shield, MapPin, Phone, MessageCircle, Clock, CheckCircle, Star, Award, Home } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useParams, useRouter } from 'next/navigation';

// Mock data - in a real app this would come from an API
const vetData: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Dra. María González',
    type: 'Especialista',
    specialties: ['Cirugía', 'Traumatología', 'Medicina General'],
    rating: 4.9,
    consultationCost: "$120.000",
    city: 'Bogotá',
    neighborhood: 'Chapinero',
    verified: true,
    emergency24h: true,
    homeService: true,
    phone: '+57 300 123 4567',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    about: 'Médica veterinaria con más de 10 años de experiencia especializada en cirugía y traumatología animal. Mi pasión es brindar atención de alta calidad con un enfoque compasivo y personalizado para cada paciente. Cuento con formación internacional y equipos de última tecnología para garantizar los mejores resultados en procedimientos quirúrgicos complejos.',
    address: 'Calle 63 #15-45, Chapinero',
    schedule: [
      { day: 'Lunes - Viernes', hours: '8:00 AM - 6:00 PM' },
      { day: 'Sábados', hours: '9:00 AM - 2:00 PM' },
      { day: 'Domingos', hours: 'Cerrado' },
    ],
    additionalServices: [
      'Servicio a Domicilio',
      'Urgencias 24h',
      'Rayos X Digital',
      'Laboratorio Clínico',
      'Hospitalización',
      'Cirugía Ambulatoria',
    ],
  },
  '2': {
    id: 2,
    name: 'Dr. Carlos Ramírez',
    type: 'Clínica Veterinaria',
    specialties: ['Medicina General', 'Dermatología', 'Cardiología'],
    rating: 4.8,
    consultationCost: "$130.000",
    city: 'Medellín',
    neighborhood: 'El Poblado',
    verified: true,
    emergency24h: true,
    homeService: false,
    phone: '+57 300 234 5678',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    about: 'Clínica veterinaria moderna y completa con un equipo multidisciplinario de profesionales altamente capacitados. Nos especializamos en medicina general y dermatología, ofreciendo diagnósticos precisos y tratamientos efectivos. Contamos con instalaciones de primer nivel y tecnología avanzada para el cuidado integral de tu mascota.',
    address: 'Carrera 43A #5-33, El Poblado',
    schedule: [
      { day: 'Lunes - Viernes', hours: '7:00 AM - 8:00 PM' },
      { day: 'Sábados', hours: '8:00 AM - 6:00 PM' },
      { day: 'Domingos', hours: '9:00 AM - 1:00 PM' },
    ],
    additionalServices: [
      'Urgencias 24h',
      'Rayos X Digital',
      'Ecografía',
      'Laboratorio Clínico',
      'Peluquería',
      'Guardería',
    ],
  },
  '3': {
    id: 3,
    name: 'Dra. Ana López',
    type: 'Especialista',
    specialties: ['Oftalmología', 'Medicina General'],
    rating: 5.0,
    consultationCost: "$110.000",
    city: 'Bogotá',
    neighborhood: 'Usaquén',
    verified: true,
    emergency24h: false,
    homeService: true,
    phone: '+57 300 345 6789',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    about: 'Especialista en oftalmología veterinaria certificada con experiencia en el diagnóstico y tratamiento de enfermedades oculares en perros y gatos. Utilizo técnicas modernas y equipos especializados para garantizar la mejor atención en la salud visual de tu mascota. Ofrezco consultas a domicilio para mayor comodidad.',
    address: 'Calle 119 #7-18, Usaquén',
    schedule: [
      { day: 'Lunes - Jueves', hours: '9:00 AM - 5:00 PM' },
      { day: 'Viernes', hours: '9:00 AM - 3:00 PM' },
      { day: 'Sábados', hours: 'Previa cita' },
      { day: 'Domingos', hours: 'Cerrado' },
    ],
    additionalServices: [
      'Servicio a Domicilio',
      'Consulta Especializada',
      'Cirugía Ocular',
      'Examen Oftalmológico',
    ],
  },
  '4': {
    id: 4,
    name: 'Dra. Laura Ramírez',
    type: 'Especialista',
    specialties: ['Oftalmología', 'Medicina General'],
    rating: 4.9,
    consultationCost: "$140.000",
    city: 'Bogotá',
    neighborhood: 'Chapinero',
    verified: true,
    emergency24h: false,
    homeService: true,
    phone: '+57 318 456 7890',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    about: 'Especialista en oftalmología veterinaria con formación internacional. Ofrezco diagnósticos precisos y tratamientos efectivos para enfermedades oculares en mascotas.',
    address: 'Calle 85 #12-34, Chapinero',
    schedule: [
      { day: 'Lunes - Viernes', hours: '8:00 AM - 5:00 PM' },
      { day: 'Sábados', hours: 'Previa cita' },
      { day: 'Domingos', hours: 'Cerrado' },
    ],
    additionalServices: [
      'Servicio a Domicilio',
      'Consulta Especializada',
      'Cirugía Ocular',
    ],
  },
  '5': {
    id: 5,
    name: 'Dr. Jorge Martínez',
    type: 'Especialista',
    specialties: ['Cardiología', 'Medicina Interna'],
    rating: 4.8,
    consultationCost: "$125.000",
    city: 'Barranquilla',
    neighborhood: 'El Prado',
    verified: true,
    emergency24h: true,
    homeService: false,
    phone: '+57 311 567 8901',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    about: 'Cardiólogo veterinario especializado en enfermedades cardiovasculares. Cuento con equipos de diagnóstico avanzado para ofrecer el mejor cuidado cardíaco.',
    address: 'Carrera 54 #72-45, El Prado',
    schedule: [
      { day: 'Lunes - Viernes', hours: '8:00 AM - 6:00 PM' },
      { day: 'Sábados', hours: '9:00 AM - 1:00 PM' },
      { day: 'Domingos', hours: 'Cerrado' },
    ],
    additionalServices: [
      'Urgencias 24h',
      'Ecocardiografía',
      'Electrocardiograma',
      'Rayos X',
    ],
  },
  '6': {
    id: 6,
    name: 'Dra. Patricia Silva',
    type: 'Especialista',
    specialties: ['Odontología', 'Cirugía Oral'],
    rating: 4.9,
    consultationCost: "$115.000",
    city: 'Medellín',
    neighborhood: 'Laureles',
    verified: true,
    emergency24h: false,
    homeService: false,
    phone: '+57 313 678 9012',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    about: 'Especialista en odontología veterinaria con más de 8 años de experiencia. Me dedico a la salud dental de mascotas con técnicas modernas y equipos especializados.',
    address: 'Calle 33 #75-12, Laureles',
    schedule: [
      { day: 'Lunes - Viernes', hours: '9:00 AM - 6:00 PM' },
      { day: 'Sábados', hours: '9:00 AM - 2:00 PM' },
      { day: 'Domingos', hours: 'Cerrado' },
    ],
    additionalServices: [
      'Limpieza Dental',
      'Extracción Dental',
      'Cirugía Oral',
      'Radiografía Dental',
    ],
  },
};

export default function PerfilVeterinarioPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  
  const vet = id ? vetData[id] : null;

  if (!vet) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil no encontrado</h1>
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

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hola ${vet.name}, encontré tu perfil en Vethogar y me gustaría agendar una cita.`);
    window.open(`https://wa.me/${vet.phone.replace(/\s/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${vet.phone}`;
  };

  const specialtyColors = [
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      {/* Profile Header */}
      <div className="relative pt-40 pb-12">
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
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
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
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{vet.name}</h1>
                      <p className="text-xl text-gray-600 mb-4 font-medium">{vet.type}</p>
                    </div>
                    <div className="rounded-2xl border border-purple-200 bg-white/80 px-5 py-4 shadow-lg">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Valor consulta</p>
                      <p className="text-3xl font-bold text-gray-900">{vet.consultationCost}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#7C3AED]" />
                      <span className="text-gray-700 font-medium">{vet.city}, {vet.neighborhood}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-gray-900 font-bold">{vet.rating}</span>
                      <span className="text-gray-600">calificación</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                {/* WhatsApp Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-[#25D366] to-[#1fb855] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 flex items-center justify-center gap-3 text-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chatear por WhatsApp
                </motion.button>

                {/* Call Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCallClick}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-[#7C3AED] font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 text-lg border-2 border-purple-200"
                >
                  <Phone className="w-6 h-6" />
                  Llamar
                </motion.button>
              </div>
            </motion.div>

            {/* Content Grid - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              {/* Main Column (Left, 66%) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Sobre mí Section */}
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

                {/* Especialidades Section */}
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
                    Especialidades
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {vet.specialties.map((specialty: string, index: number) => (
                      <span
                        key={specialty}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-2xl font-semibold text-lg border-2 border-purple-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Servicios Adicionales Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Servicios Adicionales
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vet.additionalServices.map((service: string) => (
                      <div key={service} className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-3 border border-emerald-100">
                        <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar Column (Right, 33%) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Horarios Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
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
    </div>
  );
}
