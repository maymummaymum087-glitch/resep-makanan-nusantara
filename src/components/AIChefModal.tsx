import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ChefHat,
  Refrigerator,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  Loader2,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AIChefModal: React.FC = () => {
  const { isAIChefOpen, closeAIChef, aiContextRecipe, showToast } = useApp();

  if (!isAIChefOpen) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'fridge'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: '1',
      sender: 'ai',
      text: aiContextRecipe
        ? `Halo! Saya Chef AI Nusantara. Ada yang ingin ditanyakan tentang resep **${aiContextRecipe.title}**? Saya bisa bantu seputar takaran bumbu, substitusi bahan, atau tips memasaknya!`
        : 'Halo! Saya Chef AI Nusantara. Ada yang ingin Anda tanyakan seputar kuliner khas daerah Indonesia, cara pengolahan bumbu, atau substitusi bahan dapur?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  // Fridge Ingredients State
  const [fridgeIngredients, setFridgeIngredients] = useState<string[]>(['ayam', 'tahu', 'kencur']);
  const [newIngredientInput, setNewIngredientInput] = useState<string>('');
  const [isLoadingFridge, setIsLoadingFridge] = useState<boolean>(false);
  const [fridgeRecipes, setFridgeRecipes] = useState<any[]>([]);

  // Send Chat Message to /api/chef-ai
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/chef-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          recipeContext: aiContextRecipe
            ? { title: aiContextRecipe.title, region: aiContextRecipe.regionName }
            : null,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer || data.fallback || 'Maaf, Chef AI sedang beristirahat sebentar.',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: 'Maaf, terjadi kesalahan koneksi. Silakan periksa kunci API Gemini Anda.',
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Add Fridge Ingredient
  const handleAddFridgeIngredient = () => {
    if (!newIngredientInput.trim()) return;
    if (!fridgeIngredients.includes(newIngredientInput.trim().toLowerCase())) {
      setFridgeIngredients((prev) => [...prev, newIngredientInput.trim().toLowerCase()]);
    }
    setNewIngredientInput('');
  };

  // Generate Fridge Recipes via /api/fridge-recipes
  const handleFindFridgeRecipes = async () => {
    if (fridgeIngredients.length === 0) {
      showToast('Masukkan minimal 1 bahan kulkas', 'warning');
      return;
    }

    setIsLoadingFridge(true);
    setFridgeRecipes([]);

    try {
      const res = await fetch('/api/fridge-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: fridgeIngredients }),
      });

      const data = await res.json();
      if (data.recipes && Array.isArray(data.recipes)) {
        setFridgeRecipes(data.recipes);
      } else {
        showToast('Tidak menemukan rekomendasi masakan.', 'info');
      }
    } catch {
      showToast('Gagal memproses resep dari bahan kulkas', 'warning');
    } finally {
      setIsLoadingFridge(false);
    }
  };

  const quickQuestions = [
    'Bagaimana cara agar bumbu rendang hitam pekat?',
    'Bisa ganti belimbing wulung dengan apa?',
    'Tips agar gurih santan tidak pecah saat dimasak?',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-50 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[88vh] border border-amber-200 dark:border-amber-800/60"
        >
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-amber-800 to-amber-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-base font-serif flex items-center gap-1.5">
                  Chef AI Nusantara <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                </h3>
                <p className="text-[11px] text-amber-200/80">
                  {aiContextRecipe ? `Konteks: ${aiContextRecipe.title}` : 'Asisten Kuliner Tradisional'}
                </p>
              </div>
            </div>

            <button
              onClick={closeAIChef}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex border-b border-amber-100 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/50">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                activeTab === 'chat'
                  ? 'border-amber-600 text-amber-800 dark:text-amber-200'
                  : 'border-transparent text-stone-500 hover:text-amber-700'
              }`}
            >
              <Bot className="w-4 h-4" /> Tanya Chef AI
            </button>
            <button
              onClick={() => setActiveTab('fridge')}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                activeTab === 'fridge'
                  ? 'border-amber-600 text-amber-800 dark:text-amber-200'
                  : 'border-transparent text-stone-500 hover:text-amber-700'
              }`}
            >
              <Refrigerator className="w-4 h-4" /> Masak dari Bahan Kulkas
            </button>
          </div>

          {/* TAB 1: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col flex-grow overflow-hidden p-4">
              {/* Chat Message Scroll Box */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === 'user'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-900 text-amber-200'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <ChefHat className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-amber-600 text-white rounded-tr-none'
                          : 'bg-amber-50 dark:bg-amber-900/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-950 dark:text-amber-100 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                ))}

                {isLoadingChat && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Chef AI sedang meracik jawaban...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="mt-3 py-2 border-t border-amber-100 dark:border-amber-900/40 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-amber-100/70 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 hover:bg-amber-200 border border-amber-200/50 dark:border-amber-800/40 shrink-0"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ketik pertanyaan resep..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-950 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoadingChat || !inputPrompt.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white disabled:opacity-50 hover:from-amber-500 hover:to-orange-500 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FRIDGE INGREDIENTS */}
          {activeTab === 'fridge' && (
            <div className="p-4 flex flex-col flex-grow overflow-y-auto space-y-4">
              <div>
                <h4 className="font-bold text-sm font-serif mb-1 flex items-center gap-1.5">
                  <Refrigerator className="w-4 h-4 text-amber-600" /> Masukkan Bahan yang Ada di Kulkas
                </h4>
                <p className="text-xs text-stone-600 dark:text-amber-200/70">
                  Chef AI akan merekomendasikan resep masakan Nusantara yang bisa dibuat dari bahan tersebut.
                </p>
              </div>

              {/* Input + Tag list */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredientInput}
                  onChange={(e) => setNewIngredientInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFridgeIngredient()}
                  placeholder="Ketik nama bahan (misal: telur, tempe, cabai)..."
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 focus:outline-none"
                />
                <button
                  onClick={handleAddFridgeIngredient}
                  className="px-3 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-amber-500"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/40">
                {fridgeIngredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100"
                  >
                    {ing}
                    <button
                      onClick={() => setFridgeIngredients((prev) => prev.filter((_, i) => i !== idx))}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleFindFridgeRecipes}
                disabled={isLoadingFridge || fridgeIngredients.length === 0}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs sm:text-sm hover:from-amber-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isLoadingFridge ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Meracik Ide Masakan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Cari Ide Masakan Nusantara
                  </>
                )}
              </button>

              {/* AI Generated Recipes List */}
              {fridgeRecipes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Rekomendasi Chef AI:
                  </h5>
                  {fridgeRecipes.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h6 className="font-bold text-sm font-serif text-amber-950 dark:text-amber-100">
                          {rec.title}
                        </h6>
                        <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold px-2 py-0.5 rounded-full">
                          📍 {rec.region}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-amber-200/80 leading-relaxed">
                        {rec.description}
                      </p>

                      {rec.extraIngredientsNeeded && rec.extraIngredientsNeeded.length > 0 && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-300">
                          <strong>Bumbu Tambahan disarankan:</strong>{' '}
                          {rec.extraIngredientsNeeded.join(', ')}
                        </div>
                      )}

                      {rec.summarySteps && (
                        <div className="text-xs space-y-1 pt-1 border-t border-amber-200/50 dark:border-amber-800/40">
                          <strong>Langkah Singkat:</strong>
                          <ol className="list-decimal list-inside text-stone-600 dark:text-amber-200/80 space-y-0.5">
                            {rec.summarySteps.map((st: string, sIdx: number) => (
                              <li key={sIdx}>{st}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
