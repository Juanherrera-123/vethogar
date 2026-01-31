import { motion } from 'motion/react';
import { Shield, MessageCircle, Star, UserPlus, CheckCircle, ArrowRight, Quote } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  const handleSearch = (city: string, specialty: string) => {
    navigate(`/directorio?city=${city}&specialty=${specialty}`);
  };

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
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
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
            className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
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
            className="absolute bottom-40 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-6">
                  — Para Dueños de Mascotas
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
                  Encuentra al{' '}
                  <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                    especialista
                  </span>
                  {' '}ideal.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  Conectamos dueños responsables con veterinarios verificados. Sin intermediarios, contacto directo.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 inline-flex items-center justify-center gap-2 text-base"
                >
                  Buscar Veterinario
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/soy-veterinario')}
                  className="bg-white/70 backdrop-blur-sm border-2 border-purple-200 text-gray-900 font-semibold py-3.5 px-7 rounded-full transition-all duration-300 hover:bg-white hover:border-purple-300 inline-flex items-center justify-center gap-2 text-base"
                >
                  Soy Veterinario
                </motion.button>
              </motion.div>

              {/* Trust Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-8 pt-8"
              >
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Veterinarios</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Ciudades</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">4.9★</div>
                  <div className="text-sm text-gray-600 font-medium">Calificación</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
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
                  className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
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
                  className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
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
      <section id="search-section" className="relative py-20 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4"
              >
                Comienza tu búsqueda
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Encuentra el cuidado que necesitas
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Busca por ciudad y especialidad para encontrar al veterinario perfecto
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-24 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
              ¿Por qué Vethogar?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Tu tranquilidad es nuestra prioridad
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  className={`relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden group`}
                >
                  {/* Decorative gradient overlay */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${indicator.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />
                  
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${indicator.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {indicator.title}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {indicator.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50 relative overflow-hidden">
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
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
              Testimonios
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de dueños de mascotas han encontrado al veterinario perfecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
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
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
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
      <section className="py-16 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/50">
                <div className="mb-8">
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
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    ¿Eres veterinario?
                  </h2>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Únete a nuestra red de profesionales verificados y conecta con dueños de mascotas que necesitan tus servicios.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {vetBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4"
                    >
                      <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                      <span className="text-lg font-medium text-gray-800">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/soy-veterinario')}
                    className="bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-bold py-5 px-10 rounded-full transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 inline-flex items-center gap-3 text-lg"
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
                className="relative hidden lg:block"
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
                    className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
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