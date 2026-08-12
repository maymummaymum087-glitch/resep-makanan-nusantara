import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Sparkles, ChefHat } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw splash in current session
    const hasSeenSplash = sessionStorage.getItem('nusantara_seen_splash');
    if (hasSeenSplash) {
      setIsVisible(false);
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('nusantara_seen_splash', 'true');
    setIsVisible(false);
    setTimeout(onFinish, 400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white p-6 select-none"
        >
          {/* Subtle batik pattern overlay background effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex flex-col items-center text-center"
          >
            {/* Logo Badge */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-amber-950 flex items-center justify-center border-2 border-amber-300/40">
                  <ChefHat className="w-12 h-12 text-amber-400" />
                </div>
              </motion.div>
              <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 rounded-full p-1.5 shadow-lg">
                <Sparkles className="w-4 h-4 fill-amber-950" />
              </div>
            </div>

            {/* App Name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-100 font-serif"
            >
              Nusantara Recipe
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-2 text-amber-200/90 text-sm sm:text-base tracking-wide font-medium"
            >
              "Jelajahi Cita Rasa Nusantara"
            </motion.p>

            {/* Feature tags pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-amber-200/70"
            >
              <span className="bg-amber-900/60 backdrop-blur border border-amber-500/20 px-3 py-1 rounded-full">
                ✨ Tanpa Login
              </span>
              <span className="bg-amber-900/60 backdrop-blur border border-amber-500/20 px-3 py-1 rounded-full">
                ❤️ Simpan Lokal
              </span>
              <span className="bg-amber-900/60 backdrop-blur border border-amber-500/20 px-3 py-1 rounded-full">
                🛒 Daftar Belanja
              </span>
            </motion.div>

            {/* Loading Indicator or Direct Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-amber-950 font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg active:scale-95"
              >
                Mulai Jelajah Resep →
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
