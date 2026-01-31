"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const placeholderImage = "/assets/hero-placeholder.svg";

export function Protection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 180, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const headphonesOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 1, 0, 0]);
  const caseOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0, 1, 1]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 py-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl text-white mb-8">
              <span className="text-white">Complete</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Protection
              </span>
            </h2>
            <p className="text-white/70 text-xl mb-8 leading-relaxed">
              Your investment deserves the ultimate protection. Our premium carrying case 
              features shock-resistant materials and a custom-molded interior that cradles 
              your headphones in perfect safety.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-white text-xl mb-2">Shock Resistant</h3>
                  <p className="text-white/60">Military-grade protection against drops and impacts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xl">💧</span>
                </div>
                <div>
                  <h3 className="text-white text-xl mb-2">Water Resistant</h3>
                  <p className="text-white/60">IPX6 rating for all-weather protection</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-white text-xl mb-2">Secure Lock</h3>
                  <p className="text-white/60">Dual-zipper system with TSA-approved locks</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3D Transition showcase */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Headphones */}
              <motion.div
                style={{ rotateY, scale, opacity: headphonesOpacity }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotateX: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                src={placeholderImage}
                    alt="Premium Headphones"
                    className="w-[22rem] h-[22rem] object-contain"
                    style={{
                      mixBlendMode: "multiply",
                      filter: "contrast(1.2) brightness(1.1) saturate(1.1) drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 8px 20px rgba(139,69,19,0.3))",
                    }}
                  />
                  
                  {/* Enhanced glow for transformation */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/25 via-red-500/25 to-orange-500/25 rounded-full blur-2xl"
                    style={{ transform: "translateZ(-8px)" }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Protective case */}
              <motion.div
                style={{ scale, opacity: caseOpacity }}
                className="absolute inset-0"
              >
                <img
                  src="https://images.unsplash.com/photo-1741647957846-a17f51573bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwcHJvdGVjdGl2ZSUyMGNhc2UlMjBjb3ZlcnxlbnwxfHx8fDE3NTY2NzE2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Protective Case"
                  className="w-80 h-80 object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating icons */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-16 -left-16"
              >
                <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full p-4 border border-emerald-500/30">
                  <span className="text-2xl">🛡️</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-16 -right-16"
              >
                <div className="bg-cyan-500/20 backdrop-blur-sm rounded-full p-4 border border-cyan-500/30">
                  <span className="text-2xl">💧</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-purple-500/20 backdrop-blur-sm rounded-full p-4 border border-purple-500/30">
                  <span className="text-2xl">🔒</span>
                </div>
              </motion.div>
            </div>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center"
            >
              <p className="text-white/60 text-sm mb-2">Scroll to see the transformation</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/40 text-2xl"
              >
                ↓
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
