"use client";

import { motion } from "framer-motion";
import { Shield, MessageCircle, Star } from 'lucide-react';

export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'Perfiles Verificados',
      description: 'Revisamos la tarjeta profesional y antecedentes.',
      color: 'purple',
    },
    {
      icon: MessageCircle,
      title: 'Contacto Directo',
      description: 'Sin intermediarios. Habla directo al WhatsApp.',
      color: 'green',
    },
    {
      icon: Star,
      title: 'Reseñas Reales',
      description: 'Decisiones informadas basadas en experiencias.',
      color: 'yellow',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <motion.div
                key={indicator.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-xl ${getColorClasses(
                    indicator.color
                  )} flex items-center justify-center mb-6`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {indicator.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {indicator.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
