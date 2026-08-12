import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Moon,
  Sun,
  Globe,
  Trash2,
  HelpCircle,
  Info,
  ChefHat,
  Award,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  WifiOff
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    cookedRecipesCount,
    favorites,
    shoppingList,
    showToast,
  } = useApp();

  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Cooking badge level based on cooked recipes
  const getBadgeTitle = (count: number) => {
    if (count >= 10) return { title: 'Master Chef Nusantara 👑', color: 'bg-amber-500 text-amber-950' };
    if (count >= 5) return { title: 'Koki Muda Nusantara ⭐', color: 'bg-orange-500 text-white' };
    if (count >= 1) return { title: 'Pecinta Kuliner Daerah 🍳', color: 'bg-emerald-600 text-white' };
    return { title: 'Penjelajah Cita Rasa 🌿', color: 'bg-amber-800 text-amber-100' };
  };

  const badge = getBadgeTitle(cookedRecipesCount);

  const handleClearData = () => {
    localStorage.clear();
    setShowClearConfirm(false);
    showToast('Cache aplikasi telah dibersihkan', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Guest Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center shrink-0">
            <ChefHat className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-serif">Pengguna Tamu</h2>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Mode Tanpa Akun
              </span>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
              {badge.title}
            </span>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-amber-500/30 text-center text-xs">
          <div className="p-2 rounded-xl bg-amber-950/40">
            <span className="block font-bold text-lg text-amber-300">{cookedRecipesCount}</span>
            <span className="text-[10px] text-amber-200/70">Resep Dimasak</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/40">
            <span className="block font-bold text-lg text-amber-300">{favorites.length}</span>
            <span className="text-[10px] text-amber-200/70">Resep Favorit</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/40">
            <span className="block font-bold text-lg text-amber-300">{shoppingList.length}</span>
            <span className="text-[10px] text-amber-200/70">Bahan Belanja</span>
          </div>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Keunggulan Tanpa Login:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 dark:text-amber-200/90">
          <li className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Langsung pakai tanpa isi pendaftaran
          </li>
          <li className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Ringan & aman disimpan di memori HP
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Ramah untuk semua usia & perangkat
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Bebas spam email & pendaftaran
          </li>
        </ul>
      </div>

      {/* Settings Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-base font-serif text-amber-950 dark:text-amber-100">
          ⚙️ Pengaturan & Tampilan
        </h3>

        <div className="space-y-2 bg-white dark:bg-amber-950/40 p-4 rounded-3xl border border-amber-100 dark:border-amber-900/40">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-amber-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <span className="text-xs sm:text-sm font-bold block">Mode Gelap / Terang</span>
                <span className="text-[10px] text-stone-500 dark:text-amber-300/70">
                  Ubah tema tampilan mata
                </span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                theme === 'dark' ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between py-2 border-b border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs sm:text-sm font-bold block">Bahasa Aplikasi</span>
                <span className="text-[10px] text-stone-500 dark:text-amber-300/70">
                  Pilih bahasa utama
                </span>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-amber-50 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English (Terjemahan)</option>
            </select>
          </div>

          {/* Clear Cache */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-rose-500" />
              <div>
                <span className="text-xs sm:text-sm font-bold block">Reset Cache Data</span>
                <span className="text-[10px] text-stone-500 dark:text-amber-300/70">
                  Bersihkan histori resep tersimpan
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-amber-950 p-6 rounded-3xl max-w-sm w-full space-y-4 border border-amber-200">
            <h4 className="font-bold text-base font-serif">Bersihkan Data Lokal?</h4>
            <p className="text-xs text-stone-600 dark:text-amber-200/80 leading-relaxed">
              Tindakan ini akan menghapus semua resep favorit dan daftar belanja yang tersimpan di perangkat Anda.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Ya, Bersihkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About & FAQ Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-base font-serif text-amber-950 dark:text-amber-100">
          ℹ️ Tentang Aplikasi
        </h3>

        <div className="p-4 rounded-3xl bg-white dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 space-y-3 text-xs text-stone-700 dark:text-amber-200/90 leading-relaxed">
          <div className="flex items-center gap-2 font-bold font-serif text-amber-950 dark:text-amber-100 text-sm">
            <ChefHat className="w-5 h-5 text-amber-600" /> Nusantara Recipe v1.0
          </div>
          <p>
            Nusantara Recipe adalah platform eksplorasi resep masakan tradisional Indonesia dari 38 provinsi yang dirancang simpel, cepat, dan dapat diakses siapa saja tanpa perlu pendaftaran akun.
          </p>
          <div className="pt-2 border-t border-amber-100 dark:border-amber-900/30 text-[11px] text-amber-800 dark:text-amber-400">
            Dibuat dengan ❤️ untuk melestarikan kuliner warisan budaya bangsa Indonesia.
          </div>
        </div>
      </div>
    </div>
  );
};
