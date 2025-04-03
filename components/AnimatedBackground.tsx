"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedBackground() {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Set isClient to true when component mounts on client
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Don't render anything until client-side
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at center, #f5f5f5, #e0e0e0)",
          backgroundSize: "150% 150%",
        }}
        animate={{
          backgroundPosition: `${mousePosition.x / 30}px ${mousePosition.y / 30}px`,
        }}
        transition={{ type: "spring", damping: 15 }}
      />
      
      {/* Static blurred circles instead of animated ones */}
      {Array.from({ length: 15 }).map((_, i) => {
        // Use deterministic values based on index
        const grayValue = 200 + (i * 3) % 50;
        const width = 100 + (i * 15) % 200;
        const height = 100 + (i * 12) % 200;
        const top = (i * 7) % 100;
        const left = (i * 11) % 100;
        const opacity = 0.1 + (i % 10) / 100;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              backgroundColor: `rgb(${grayValue}, ${grayValue}, ${grayValue})`,
              width: `${width}px`,
              height: `${height}px`,
              top: `${top}%`,
              left: `${left}%`,
              opacity,
            }}
            animate={{
              x: [0, i % 2 === 0 ? 20 : -20],
              y: [0, i % 2 === 0 ? 20 : -20],
              scale: [1, 1.1, 0.9, 1.05, 1],
            }}
            transition={{
              duration: 8 + i % 5,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        );
      })}
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: "linear-gradient(to right, #555 1px, transparent 1px), linear-gradient(to bottom, #555 1px, transparent 1px)",
          backgroundSize: "40px 40px" 
        }} 
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{ 
          backgroundImage: "radial-gradient(circle at center, transparent 30%, #000 150%)",
        }} 
      />
    </div>
  );
}

// Default export for dynamic import
export { AnimatedBackground };
export default AnimatedBackground; 