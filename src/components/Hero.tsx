"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const placeholderImage = "/assets/hero-placeholder.svg";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0.6]);

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Background particles effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.3),transparent_50%)]" />
      
      {/* Main headphones 3D container */}
      <motion.div
        style={{ y, scale }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="relative"
          >
            {/* Main headphones with enhanced 3D effects */}
            <motion.div
              animate={{ 
                rotateY: [0, 5, -5, 0],
                rotateX: [0, 2, -2, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={placeholderImage}
                alt="Premium 3D Headphones"
                className="w-[28rem] h-[28rem] object-contain"
                style={{
                  mixBlendMode: "multiply",
                  filter: "contrast(1.2) brightness(1.1) saturate(1.1) drop-shadow(0 25px 50px rgba(0,0,0,0.8)) drop-shadow(0 10px 25px rgba(139,69,19,0.3))",
                }}
              />
              
              {/* Enhanced glow effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 rounded-full blur-3xl"
                style={{ transform: "translateZ(-10px)" }}
              />
            </motion.div>
            
            {/* Rotating glow rings */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 1, duration: 8, repeat: Infinity, repeatType: "loop", ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-purple-500/20 blur-sm scale-110"
            />
            
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: -360 }}
              transition={{ delay: 1.5, duration: 12, repeat: Infinity, repeatType: "loop", ease: "linear" }}
              className="absolute inset-0 rounded-full border border-blue-500/20 blur-sm scale-125"
            />
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.sin(i) * 100, 0],
                  y: [0, Math.cos(i) * 100, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: i * 0.5,
                  ease: "easeInOut" 
                }}
                className="absolute w-2 h-2 bg-orange-400/50 rounded-full blur-sm"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            ))}
          </motion.div>
          
          {/* Floating feature indicators */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute -left-32 top-1/4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="text-white text-sm">
              <div className="text-purple-300">Active Noise</div>
              <div>Cancellation</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="absolute -right-32 top-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="text-white text-sm">
              <div className="text-blue-300">40H Battery</div>
              <div>Life</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="text-white text-sm">
              <div className="text-green-300">Hi-Res Audio</div>
              <div>Certified</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center z-20"
      >
        <h1 className="text-6xl md:text-8xl text-white mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            FUTURE
          </span>
          <br />
          <span className="text-white">SOUND</span>
        </h1>
        <p className="text-white/80 text-xl md:text-2xl mb-8 max-w-2xl">
          Experience audio like never before with our revolutionary 3D-powered headphones
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          Explore Now
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
