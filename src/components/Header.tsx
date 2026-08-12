import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, ChefHat, Sparkles, ShoppingBag, Sun, Moon, Heart, Table } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    shoppingList,
    favorites,
    activeTab,
    setActiveTab,
    openAIChef,
  } = useApp();

  const unboughtCount = shoppingList.filter((item) => !item.isBought).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-amber-950/95 backdrop-blur-md border-b border-amber-100 dark:border-amber-900/40 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Name */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif leading-tight text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                Nusantara Recipe
              </h1>
              <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium tracking-wide">
                Jelajahi Cita Rasa Indonesia
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Table Shortcut Button */}
            <button
              onClick={() => setActiveTab('table-search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                activeTab === 'table-search'
                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                  : 'bg-amber-100/70 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
              }`}
              title="Tabel Pencarian Makanan"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabel</span> Cari
            </button>

            {/* AI Chef Assistant Button */}
            <button
              onClick={() => openAIChef()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-500/20 transition-all active:scale-95"
              title="Tanya Chef AI Nusantara"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden xs:inline">Tanya</span> AI
            </button>

            {/* Favorites Badge */}
            <button
              onClick={() => setActiveTab('favorites')}
              className="relative p-2 rounded-full text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              title="Resep Favorit"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping List Counter */}
            <button
              onClick={() => setActiveTab('shopping')}
              className="relative p-2 rounded-full text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              title="Daftar Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-amber-700 dark:text-amber-300" />
              {unboughtCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unboughtCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-300" />
              ) : (
                <Moon className="w-5 h-5 text-amber-800" />
              )}
            </button>
          </div>
        </div>

        {/* Global Search Input Bar */}
        <div className="mt-2.5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600/70 dark:text-amber-400/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari resep (misal: Gudeg, Soto, Rendang, Aceh...)..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-800/50 text-amber-950 dark:text-amber-100 placeholder-amber-700/50 dark:placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-900 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
