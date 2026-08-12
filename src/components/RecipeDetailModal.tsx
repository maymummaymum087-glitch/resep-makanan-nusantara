import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Flame,
  Users,
  Heart,
  Share2,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  ChefHat,
  MapPin,
  Info,
  Check
} from 'lucide-react';

export const RecipeDetailModal: React.FC = () => {
  const {
    activeRecipe,
    closeRecipeDetail,
    isFavorite,
    toggleFavorite,
    addToShoppingList,
    showToast,
    openAIChef,
    markRecipeCooked,
  } = useApp();

  if (!activeRecipe) return null;

  const favorited = isFavorite(activeRecipe.id);

  // Portion Scaling
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(activeRecipe.servings);
  
  useEffect(() => {
    if (activeRecipe) {
      setServingsMultiplier(activeRecipe.servings);
    }
  }, [activeRecipe]);

  const ratio = servingsMultiplier / (activeRecipe.servings || 1);

  // Ingredients Checkbox state
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Steps Checkbox state
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const toggleStepComplete = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  // Step Timer
  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast('⏰ Waktu memasak langkah selesai!', 'success');
      // Simple audio alert beep if possible
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const startStepTimer = (stepNumber: number, minutes: number) => {
    setActiveTimerStep(stepNumber);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(true);
    showToast(`⏱️ Timer ${minutes} menit dimulai untuk Langkah ${stepNumber}`, 'info');
  };

  const toggleTimerPause = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setActiveTimerStep(null);
    setTimerSecondsLeft(0);
  };

  // Voice Reader (SpeechSynthesis)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  const speakStep = (stepNumber: number, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Fitur suara tidak didukung di browser ini', 'warning');
      return;
    }

    if (isSpeaking && speakingStep === stepNumber) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingStep(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Langkah ${stepNumber}: ${text}`);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingStep(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingStep(null);
    };

    setIsSpeaking(true);
    setSpeakingStep(stepNumber);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Share Recipe
  const handleShare = async () => {
    const text = `🍽️ Resep ${activeRecipe.title} khas ${activeRecipe.regionName}\n\nWaktu: ${
      activeRecipe.prepTimeMinutes + activeRecipe.cookTimeMinutes
    } menit | Porsi: ${activeRecipe.servings}\n\nJelajahi resep di Nusantara Recipe!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: activeRecipe.title,
          text: text,
          url: window.location.href,
        });
        showToast('Berhasil membagikan resep!', 'success');
      } catch {
        // user cancelled or fallback
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      showToast('📋 Tautan & ringkasan resep telah disalin ke clipboard!', 'success');
    }
  };

  // Add all ingredients to shopping list
  const handleAddToShoppingList = () => {
    addToShoppingList(activeRecipe);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative w-full max-w-2xl bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-50 sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 my-auto pb-24"
        >
          {/* Header Image Container */}
          <div className="relative aspect-[16/9] w-full bg-amber-900">
            <img
              src={activeRecipe.imageUrl}
              alt={activeRecipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-950/40 to-black/30" />

            {/* Back / Close button */}
            <button
              onClick={closeRecipeDetail}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors shadow-lg"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(activeRecipe.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors shadow-lg"
              title={favorited ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
            >
              <Heart
                className={`w-5 h-5 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>

            {/* Title & Origin Badges over Image */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-amber-500/90 text-amber-950 font-bold text-xs px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  📍 {activeRecipe.regionName}
                </span>
                <span className="bg-black/50 text-amber-200 text-xs px-2.5 py-0.5 rounded-full backdrop-blur-md border border-amber-400/20">
                  {activeRecipe.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
                {activeRecipe.title}
              </h2>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Description */}
            <p className="text-sm text-stone-700 dark:text-amber-200/90 leading-relaxed font-sans">
              {activeRecipe.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Waktu
                </div>
                <div className="text-sm font-bold mt-0.5">
                  {activeRecipe.prepTimeMinutes + activeRecipe.cookTimeMinutes} mnt
                </div>
              </div>
              <div className="border-x border-amber-200/60 dark:border-amber-800/40">
                <div className="flex items-center justify-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-medium">
                  <Flame className="w-3.5 h-3.5" /> Kesulitan
                </div>
                <div className="text-sm font-bold mt-0.5">{activeRecipe.difficulty}</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-medium">
                  <Users className="w-3.5 h-3.5" /> Porsi
                </div>
                <div className="text-sm font-bold mt-0.5">{servingsMultiplier} Porsi</div>
              </div>
            </div>

            {/* Nutrition Chips */}
            {activeRecipe.nutrition && (
              <div className="p-3.5 rounded-2xl bg-amber-900/5 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Estimasi Nilai Gizi per Porsi
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white dark:bg-amber-900/40 p-2 rounded-xl">
                    <span className="block font-bold text-amber-950 dark:text-amber-100">
                      {Math.round(activeRecipe.nutrition.calories)} kcal
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-amber-300/70">Kalori</span>
                  </div>
                  <div className="bg-white dark:bg-amber-900/40 p-2 rounded-xl">
                    <span className="block font-bold text-amber-950 dark:text-amber-100">
                      {Math.round(activeRecipe.nutrition.protein)}g
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-amber-300/70">Protein</span>
                  </div>
                  <div className="bg-white dark:bg-amber-900/40 p-2 rounded-xl">
                    <span className="block font-bold text-amber-950 dark:text-amber-100">
                      {Math.round(activeRecipe.nutrition.carbs)}g
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-amber-300/70">Karbo</span>
                  </div>
                  <div className="bg-white dark:bg-amber-900/40 p-2 rounded-xl">
                    <span className="block font-bold text-amber-950 dark:text-amber-100">
                      {Math.round(activeRecipe.nutrition.fat)}g
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-amber-300/70">Lemak</span>
                  </div>
                </div>
              </div>
            )}

            {/* Serving Count Adjuster */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/20">
              <div>
                <span className="text-xs font-bold text-amber-950 dark:text-amber-100 block">
                  Atur Jumlah Porsi
                </span>
                <span className="text-[11px] text-stone-500 dark:text-amber-300/70">
                  Takaran bahan menyesuaikan otomatis
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-amber-900/50 p-1.5 rounded-xl border border-amber-200 dark:border-amber-700">
                <button
                  onClick={() => setServingsMultiplier((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors text-amber-900 dark:text-amber-100"
                  title="Kurangi porsi"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm w-6 text-center">{servingsMultiplier}</span>
                <button
                  onClick={() => setServingsMultiplier((prev) => prev + 1)}
                  className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors text-amber-900 dark:text-amber-100"
                  title="Tambah porsi"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg font-serif flex items-center gap-2">
                  <span>🥬 Bahan-bahan</span>
                  <span className="text-xs font-sans font-normal text-stone-500 dark:text-amber-300/70">
                    ({activeRecipe.ingredients.length} jenis)
                  </span>
                </h3>
                <button
                  onClick={handleAddToShoppingList}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline bg-amber-100 dark:bg-amber-900/50 px-3 py-1.5 rounded-full"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  + Semua Ke Belanja
                </button>
              </div>

              <div className="space-y-2">
                {activeRecipe.ingredients.map((ing) => {
                  const scaledAmount = Number((ing.amount * ratio).toFixed(1));
                  const isChecked = checkedIngredients.includes(ing.id);

                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleIngredientCheck(ing.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-100/60 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-stone-500 line-through'
                          : 'bg-white dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40 hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm font-medium">{ing.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/60 px-2.5 py-1 rounded-lg">
                        {scaledAmount} {ing.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timer Banner if Active */}
            {activeTimerStep !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-amber-900 text-amber-100 shadow-xl border border-amber-500/40 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-amber-300">
                    ⏱️ Timer Memasak Langkah {activeTimerStep}
                  </div>
                  <div className="text-2xl font-mono font-bold mt-0.5">
                    {formatTimer(timerSecondsLeft)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimerPause}
                    className="p-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100"
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Cooking Steps Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg font-serif flex items-center gap-2">
                  <span>🍳 Langkah Memasak</span>
                  <span className="text-xs font-sans font-normal text-stone-500 dark:text-amber-300/70">
                    ({completedSteps.length}/{activeRecipe.steps.length} Selesai)
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {activeRecipe.steps.map((step) => {
                  const isDone = completedSteps.includes(step.stepNumber);
                  const isVoiceSpeaking = isSpeaking && speakingStep === step.stepNumber;

                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/30 opacity-75'
                          : 'bg-white dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStepComplete(step.stepNumber)}
                            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                          </button>
                          <span
                            className={`text-xs font-bold ${
                              isDone
                                ? 'line-through text-stone-400'
                                : 'text-amber-950 dark:text-amber-100'
                            }`}
                          >
                            Langkah {step.stepNumber}
                          </span>
                        </div>

                        {/* Controls: Voice Speak & Step Timer */}
                        <div className="flex items-center gap-1.5">
                          {/* Voice Speak button */}
                          <button
                            onClick={() => speakStep(step.stepNumber, step.instruction)}
                            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                              isVoiceSpeaking
                                ? 'bg-amber-600 text-white animate-pulse'
                                : 'bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                            }`}
                            title="Dengarkan Langkah ini"
                          >
                            {isVoiceSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Timer trigger if duration exists */}
                          {step.durationMinutes && (
                            <button
                              onClick={() => startStepTimer(step.stepNumber, step.durationMinutes!)}
                              className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200 flex items-center gap-1"
                              title={`Pasang timer ${step.durationMinutes} menit`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{step.durationMinutes}m</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${
                          isDone
                            ? 'line-through text-stone-500 dark:text-amber-300/50'
                            : 'text-stone-800 dark:text-amber-100/90'
                        }`}
                      >
                        {step.instruction}
                      </p>

                      {step.tip && (
                        <div className="mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-xl border border-amber-200/50 dark:border-amber-800/30 flex items-start gap-1.5">
                          <ChefHat className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                          <span>
                            <strong>Tips Koki:</strong> {step.tip}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cooked Completion Button */}
              {completedSteps.length === activeRecipe.steps.length && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4">
                  <button
                    onClick={() => markRecipeCooked(activeRecipe.id)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
                  >
                    🎉 Saya Sudah Berhasil Memasak Resep Ini!
                  </button>
                </motion.div>
              )}
            </div>

            {/* Cooking Tips Section */}
            {activeRecipe.cookingTips && activeRecipe.cookingTips.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200 mb-2 flex items-center gap-2 font-serif">
                  <ChefHat className="w-4 h-4 text-amber-600" /> Rahasia Dapur Nusantara
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 dark:text-amber-200/90 list-disc list-inside">
                  {activeRecipe.cookingTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-amber-950/95 backdrop-blur-md border-t border-amber-200 dark:border-amber-800/50 p-3 shadow-2xl">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
              <button
                onClick={() => toggleFavorite(activeRecipe.id)}
                className={`p-2.5 rounded-2xl border transition-colors flex flex-col items-center justify-center shrink-0 ${
                  favorited
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800'
                    : 'border-amber-200 dark:border-amber-800 text-stone-600 dark:text-amber-200 hover:bg-amber-50'
                }`}
                title="Favorit"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
                <span className="text-[10px] mt-0.5 font-medium">{favorited ? 'Favorit' : 'Simpan'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-2xl border border-amber-200 dark:border-amber-800 text-stone-600 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/50 transition-colors flex flex-col items-center justify-center shrink-0"
                title="Bagikan Resep"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">Bagikan</span>
              </button>

              <button
                onClick={() => openAIChef(activeRecipe)}
                className="p-2.5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 transition-colors flex flex-col items-center justify-center shrink-0"
                title="Tanya Chef AI"
              >
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] mt-0.5 font-medium">Tanya AI</span>
              </button>

              <button
                onClick={handleAddToShoppingList}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs sm:text-sm hover:from-amber-500 hover:to-orange-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Daftar Belanja</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
