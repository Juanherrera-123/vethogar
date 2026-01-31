"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const placeholderImage = "/assets/hero-placeholder.svg";

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 100]);
  const x2 = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const features = [
    {
      title: "Precision Engineering",
      description: "Every component crafted with surgical precision for optimal acoustic performance",
      icon: "🔧",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Premium Materials",
      description: "Aircraft-grade aluminum and memory foam for unmatched comfort and durability",
      icon: "💎",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Advanced Protection",
      description: "IPX4 water resistance and reinforced hinges built to last a lifetime",
      icon: "🛡️",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl text-white mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Crafted
            </span>
            <br />
            <span className="text-white">Perfection</span>
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            Discover the meticulous attention to detail that makes every pair a masterpiece of engineering and design
          </p>
        </motion.div>

        {/* Main product showcase */}
        <div className="relative mb-32">
          <motion.div
            style={{ scale }}
            className="flex justify-center mb-16"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  rotateY: [0, 15, -15, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={placeholderImage}
                  alt="Professional Studio Headphones"
                  className="w-[28rem] h-[28rem] object-contain"
                  style={{
                    mixBlendMode: "multiply",
                    filter: "contrast(1.3) brightness(1.2) saturate(1.2) drop-shadow(0 20px 40px rgba(0,0,0,0.7)) drop-shadow(0 8px 20px rgba(139,69,19,0.4))",
                  }}
                />
                
                {/* Premium lighting effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-transparent to-red-400/20 rounded-full blur-2xl"
                  style={{ transform: "translateZ(-5px)" }}
                />
              </motion.div>
              
              {/* Animated detail callouts */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute top-1/4 -left-20 w-4 h-4 bg-red-500 rounded-full"
              >
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                <div className="absolute -left-32 -top-8 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-red-500/30 text-white text-sm whitespace-nowrap">
                  40mm Dynamic Drivers
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute top-1/2 -right-20 w-4 h-4 bg-blue-500 rounded-full"
              >
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping" />
                <div className="absolute -right-32 -top-8 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30 text-white text-sm whitespace-nowrap">
                  Memory Foam Cushions
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"
              >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                <div className="absolute -left-16 -bottom-12 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-green-500/30 text-white text-sm whitespace-nowrap">
                  Titanium Headband
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                style={{ x: index === 1 ? 0 : index === 0 ? x1 : x2 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300`} />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors duration-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
