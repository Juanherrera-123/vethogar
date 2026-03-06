"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Shield, Users, Zap } from 'lucide-react';

export default function AcercaDePage() {
  const values = [
    {
      icon: Shield,
      title: 'Confianza',
      description: 'Verificamos cada veterinario para garantizar profesionales certificados y confiables.',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      icon: Heart,
      title: 'Compromiso',
      description: 'Nos dedicamos al bienestar animal conectando mascotas con los mejores especialistas.',
      gradient: 'from-pink-400 to-rose-600',
    },
    {
      icon: Zap,
      title: 'Innovación',
      description: 'Usamos tecnología para hacer más fácil y rápido el acceso a servicios veterinarios.',
      gradient: 'from-blue-400 to-indigo-600',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Creamos una red sólida entre dueños responsables y profesionales comprometidos.',
      gradient: 'from-emerald-400 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pb-14 pt-28 sm:pt-32 md:pb-20">
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
          className="absolute right-10 top-8 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl md:right-20 md:top-10 md:h-96 md:w-96"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-8 left-10 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/20 to-teal-400/20 blur-3xl md:bottom-10 md:left-20 md:h-96 md:w-96"
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4"
            >
              — Acerca de Vethogar
            </motion.span>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
              Conectando corazones con{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                profesionales
              </span>
            </h1>
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
              Vethogar es más que un directorio. Somos una plataforma que facilita la conexión entre dueños de mascotas responsables y veterinarios verificados, promoviendo el bienestar animal a través de la tecnología.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="h-full overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl sm:rounded-[3rem] sm:p-8 md:p-10">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Nuestra Misión</h2>
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    Facilitar el acceso a servicios veterinarios de calidad mediante una plataforma digital confiable que conecta a dueños de mascotas con profesionales verificados en toda Colombia, promoviendo el cuidado responsable y el bienestar animal.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="h-full overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl sm:rounded-[3rem] sm:p-8 md:p-10">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Nuestra Visión</h2>
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    Ser la plataforma líder en Colombia para la conexión entre mascotas y veterinarios, reconocida por nuestra confiabilidad, transparencia y compromiso con el bienestar animal, expandiendo nuestro alcance a toda Latinoamérica.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center md:mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
              Lo que nos mueve
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Nuestros Valores
            </h2>
            <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg md:text-xl">
              Los principios que guían cada decisión y acción en Vethogar
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl md:p-8"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50 py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="rounded-[2rem] border border-white/50 bg-white/60 p-8 shadow-2xl backdrop-blur-xl sm:rounded-[3rem] sm:p-10 md:p-12 lg:p-16">
              <div className="mb-10 text-center md:mb-12">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                  Vethogar en números
                </h2>
                <p className="text-base text-gray-600 sm:text-lg md:text-xl">
                  El impacto que estamos generando en la comunidad
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <div className="text-lg text-gray-700 font-medium">
                    Veterinarios Verificados
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                    50+
                  </div>
                  <div className="text-lg text-gray-700 font-medium">
                    Ciudades en Colombia
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <div className="text-lg text-gray-700 font-medium">
                    Mascotas Conectadas
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
