"use client";

import { motion } from "framer-motion";
import { UserPlus, CheckCircle } from 'lucide-react';

export function VetCTA() {
  const benefits = [
    'Perfil profesional verificado',
    'Contacto directo con clientes',
    'Sin comisiones por contacto',
    'Aumenta tu visibilidad',
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-12 md:p-16 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                ¿Eres veterinario?
              </h2>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Únete a nuestra red de profesionales verificados y conecta con dueños de mascotas que necesitan tus servicios.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-white"
                >
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-5 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3 text-lg">
                <UserPlus className="w-6 h-6" />
                Crea tu perfil profesional
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
