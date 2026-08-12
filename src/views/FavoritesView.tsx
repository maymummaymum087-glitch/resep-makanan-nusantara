import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';
import { Heart, Search, Trash2, Utensils } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, clearFavorites, setActiveTab } = useApp();
  const [favSearch, setFavSearch] = useState<string>('');

  const favoriteRecipes = RECIPES_DATA.filter((r) => favorites.includes(r.id)).filter(
    (r) =>
      !favSearch ||
      r.title.toLowerCase().includes(favSearch.toLowerCase()) ||
      r.regionName.toLowerCase().includes(favSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 to-amber-950 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-300 text-rose-300" /> Resep Pilihan Saya
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">Koleksi Favorit</h2>
          <p className="text-xs text-rose-100/80 mt-1">
            Data resep tersimpan di perangkat Anda tanpa perlu mendaftar akun.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/30 text-rose-200 transition-colors text-xs font-semibold flex items-center gap-1.5 shrink-0"
            title="Kosongkan Favorit"
          >
            <Trash2 className="w-4 h-4" /> Kosongkan
          </button>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {/* Search bar inside favorites */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 dark:text-amber-400" />
            <input
              type="text"
              value={favSearch}
              onChange={(e) => setFavSearch(e.target.value)}
              placeholder="Cari dalam resep favorit..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-10 text-center bg-white dark:bg-amber-950/40 rounded-3xl border border-amber-200/60 dark:border-amber-800/40 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-2" />
          </div>
          <h3 className="font-bold text-lg font-serif text-amber-950 dark:text-amber-100">
            Belum Ada Resep Favorit
          </h3>
          <p className="text-xs text-stone-600 dark:text-amber-200/70 max-w-sm mx-auto leading-relaxed">
            Tekan tanda ❤️ pada resep mana pun untuk menyimpannya di sini agar mudah diakses kembali kapan saja.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md hover:from-amber-500 hover:to-orange-500 transition-all"
          >
            Mulai Jelajah Resep
          </button>
        </div>
      )}
    </div>
  );
};
