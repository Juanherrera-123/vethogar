"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const placeholderImage = "/assets/hero-placeholder.svg";

export function ColorShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const colors = [
    {
      name: "Original Edition",
      gradient: "from-orange-500 to-red-600",
      accent: "bg-orange-500",
      description: "The original premium leather edition",
      filter: ""
    },
    {
      name: "Midnight Black",
      gradient: "from-gray-900 to-black",
      accent: "bg-gray-800",
      description: "Classic elegance meets professional performance",
      filter: "grayscale(100%) brightness(0.7)"
    },
    {
      name: "Ocean Blue",
      gradient: "from-blue-600 to-blue-800",
      accent: "bg-blue-600",
      description: "Deep and immersive like the ocean depths",
      filter: "hue-rotate(200deg) saturate(1.2)"
    },
    {
      name: "Forest Green",
      gradient: "from-green-600 to-emerald-700",
      accent: "bg-green-600",
      description: "Natural harmony for focused listening",
      filter: "hue-rotate(80deg) saturate(1.1)"
    },
    {
      name: "Royal Purple",
      gradient: "from-purple-600 to-indigo-700",
      accent: "bg-purple-600",
      description: "Luxurious and distinctive premium finish",
      filter: "hue-rotate(260deg) saturate(1.3)"
    },
    {
      name: "Rose Gold",
      gradient: "from-pink-400 to-rose-600",
      accent: "bg-rose-500",
      description: "Sophisticated warmth with premium appeal",
      filter: "hue-rotate(320deg) saturate(0.8) brightness(1.1)"
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
            <span className="text-white">Express</span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Yourself
            </span>
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            Choose from our stunning spectrum of colors, each carefully crafted to match your unique style and personality
          </p>
        </motion.div>

        <div className="relative">
          {/* Main product display */}
          <motion.div
            style={{ y }}
            className="flex justify-center mb-16"
          >
            <div className="relative">
              {/* Background gradient that changes with selected color */}
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-0 bg-gradient-to-br ${colors[selectedColor].gradient} rounded-full blur-3xl opacity-30 scale-150`}
              />
              
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ 
                    rotateY: [0, 10, -10, 0],
                    rotateX: [0, 3, -3, 0],
                    y: [0, -12, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                  src={placeholderImage}
                    alt={`${colors[selectedColor].name} Headphones`}
                    className="w-[28rem] h-[28rem] object-contain transition-all duration-500"
                    style={{
                      mixBlendMode: "multiply",
                      filter: `contrast(1.3) brightness(1.2) saturate(1.2) drop-shadow(0 25px 50px rgba(0,0,0,0.8)) drop-shadow(0 10px 25px rgba(139,69,19,0.3)) ${colors[selectedColor].filter}`,
                    }}
                  />
                  
                  {/* Dynamic color-based lighting */}
                  <motion.div 
                    key={selectedColor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute inset-0 bg-gradient-to-br ${colors[selectedColor].gradient} rounded-full blur-3xl opacity-30`}
                    style={{ transform: "translateZ(-10px)" }}
                  />
                  
                  {/* Animated rim lighting */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 360] 
                    }}
                    transition={{ 
                      duration: 10, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${colors[selectedColor].gradient.includes('orange') ? '#f97316' : colors[selectedColor].gradient.includes('blue') ? '#3b82f6' : colors[selectedColor].gradient.includes('green') ? '#10b981' : colors[selectedColor].gradient.includes('purple') ? '#8b5cf6' : colors[selectedColor].gradient.includes('pink') ? '#ec4899' : '#6b7280'}50, transparent)`,
                      filter: "blur(2px)",
                      transform: "translateZ(-5px)"
                    }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Floating color indicator */}
              <motion.div
                key={selectedColor}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              >
                <div className={`w-6 h-6 ${colors[selectedColor].accent} rounded-full border-4 border-white shadow-lg`} />
              </motion.div>
            </div>
          </motion.div>

          {/* Color selector */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {colors.map((color, index) => (
              <motion.button
                key={color.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(index)}
                className={`relative group ${
                  selectedColor === index ? 'ring-4 ring-white/50' : ''
                } rounded-full overflow-hidden transition-all duration-300`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${color.gradient} rounded-full`} />
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Color name tooltip */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  {color.name}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected color details */}
          <motion.div
            key={selectedColor}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className={`text-3xl md:text-4xl mb-4 bg-gradient-to-r ${colors[selectedColor].gradient} bg-clip-text text-transparent`}>
              {colors[selectedColor].name}
            </h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {colors[selectedColor].description}
            </p>
          </motion.div>

          {/* Enhanced floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {colors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.sin(index * 2) * 50, 0],
                  y: [0, Math.cos(index * 2) * 50, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
                className={`absolute w-3 h-3 bg-gradient-to-br ${color.gradient} rounded-full blur-sm`}
                style={{
                  top: `${15 + (index % 4) * 20}%`,
                  left: `${5 + (index % 5) * 18}%`,
                }}
              />
            ))}
            
            {/* Additional micro particles for current color */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${selectedColor}-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.sin(i * 0.8) * 80, 0],
                  y: [0, Math.cos(i * 0.8) * 80, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className={`absolute w-1 h-1 bg-gradient-to-br ${colors[selectedColor].gradient} rounded-full blur-sm`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
