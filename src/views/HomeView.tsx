import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { REGIONS_DATA } from '../data/regions';
import { RecipeCard } from '../components/RecipeCard';
import { Category } from '../types';
import {
  Flame,
  Sparkles,
  MapPin,
  Utensils,
  ChevronRight,
  Soup,
  Beef,
  Cake,
  Coffee,
  Search,
  Filter,
  Compass,
  X
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedRegionId,
    setSelectedRegionId,
    setActiveTab,
    openAIChef,
  } = useApp();

  const [selectedIslandFilter, setSelectedIslandFilter] = useState<string>('Semua');

  const categories: { name: Category | 'Semua'; icon: any }[] = [
    { name: 'Semua', icon: Utensils },
    { name: 'Makanan Utama', icon: Beef },
    { name: 'Kuah & Soto', icon: Soup },
    { name: 'Sate & Bakar', icon: Flame },
    { name: 'Camilan & Kue', icon: Cake },
    { name: 'Minuman Tradisional', icon: Coffee },
  ];

  const islands = [
    'Semua',
    'Sumatera',
    'Jawa',
    'Bali & Nusa Tenggara',
    'Kalimantan',
    'Sulawesi',
    'Maluku & Papua',
  ];

  // Filter regions based on island tab
  const displayedRegions = REGIONS_DATA.filter(
    (reg) => selectedIslandFilter === 'Semua' || reg.islandGroup === selectedIslandFilter
  );

  // Filter recipes based on search query, category, and province/region
  const filteredRecipes = RECIPES_DATA.filter((recipe) => {
    // Search matching
    const matchesSearch = searchQuery
      ? recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.regionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.provinceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    // Category matching
    const matchesCategory =
      !selectedCategoryId || selectedCategoryId === 'Semua'
        ? true
        : recipe.category === selectedCategoryId;

    // Province/Region matching
    const matchesRegion = !selectedRegionId ? true : recipe.regionId === selectedRegionId;

    return matchesSearch && matchesCategory && matchesRegion;
  });

  const popularRecipes = RECIPES_DATA.filter((r) => r.isPopular);
  const activeRegionObj = REGIONS_DATA.find((r) => r.id === selectedRegionId);

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Banner */}
      {!searchQuery && !selectedRegionId && (
        <div className="relative rounded-3xl overflow-hidden bg-amber-900 text-white shadow-xl min-h-[180px] sm:min-h-[220px] flex items-end p-5 sm:p-7">
          <img
            src="/src/assets/images/nusantara_hero_table_1786503867314.jpg"
            alt="Nusantara Recipe Banner"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-950/50 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/80 text-amber-950 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 fill-amber-950" /> 38 Provinsi Indonesia
              </span>

              <button
                onClick={() => setActiveTab('table-search')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 hover:bg-white backdrop-blur-md transition-all shadow-sm"
              >
                🔍 Tabel Cari Makanan →
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif leading-tight">
              Koleksi Resep Kuliner Semua Provinsi Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed">
              Klik salah satu tombol provinsi di bawah untuk langsung menampilkan seluruh resep masakan khas daerah tersebut, atau gunakan Tabel Pencarian.
            </p>
          </div>
        </div>
      )}

      {/* 38 PROVINCES SELECTOR SECTION */}
      <section className="p-4 sm:p-5 bg-white dark:bg-amber-950/40 rounded-3xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                <span>Pilih Provinsi (38 Provinsi)</span>
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-amber-300/70">
                Tekan tombol provinsi untuk memuat semua resep khas daerahnya
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('regions')}
            className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Compass className="w-3.5 h-3.5" /> Peta & Informasi Detail <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Island filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-amber-100 dark:border-amber-900/30">
          {islands.map((isl) => (
            <button
              key={isl}
              onClick={() => setSelectedIslandFilter(isl)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedIslandFilter === isl
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100/80'
              }`}
            >
              {isl}
            </button>
          ))}
        </div>

        {/* Horizontal Scrollable Row of All 38 Province Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {/* Reset button */}
          <button
            onClick={() => setSelectedRegionId(null)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
              !selectedRegionId
                ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                : 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100'
            }`}
          >
            🇲🇨 Semua Provinsi
          </button>

          {displayedRegions.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(isSelected ? null : reg.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white border-amber-800 shadow-md ring-2 ring-amber-500'
                    : 'bg-white dark:bg-amber-900/30 border-amber-200/80 dark:border-amber-800/60 text-amber-950 dark:text-amber-100 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/60'
                }`}
              >
                <span>📍 {reg.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-amber-500/30 text-white'
                      : 'bg-amber-100 dark:bg-amber-800/60 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {reg.recipeCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Province Active Indicator Banner */}
        {selectedRegionId && activeRegionObj && (
          <div className="p-3.5 rounded-2xl bg-amber-900 text-white flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <div>
                <span className="font-bold block font-serif text-sm">
                  Menampilkan Resep Khas: {activeRegionObj.province}
                </span>
                <span className="text-amber-200/80 text-[11px]">
                  {activeRegionObj.description}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedRegionId(null)}
              className="p-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-white font-bold flex items-center gap-1 shrink-0"
              title="Tampilkan Semua Provinsi"
            >
              <X className="w-4 h-4" /> Reset
            </button>
          </div>
        )}
      </section>

      {/* Category Pills Filter */}
      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              (!selectedCategoryId && cat.name === 'Semua') ||
              selectedCategoryId === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategoryId(cat.name === 'Semua' ? null : cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-sm'
                    : 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-800/40 text-amber-950 dark:text-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Fridge Generator Shortcut Card */}
      {!searchQuery && !selectedRegionId && !selectedCategoryId && (
        <section className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300">
              💡 Bingung Masak Apa Hari Ini?
            </span>
            <h4 className="text-sm sm:text-base font-bold font-serif text-amber-950 dark:text-amber-100">
              Rekomendasi dari Bahan Kulkas Anda
            </h4>
            <p className="text-xs text-stone-600 dark:text-amber-200/80">
              Ketik bahan yang tersisa di rumah, Chef AI akan meracik ide resepnya.
            </p>
          </div>
          <button
            onClick={() => openAIChef()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shrink-0 shadow-md hover:from-amber-500 hover:to-orange-500 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Coba AI
          </button>
        </section>
      )}

      {/* Recipe List Display */}
      {selectedRegionId || selectedCategoryId || searchQuery ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg font-serif text-amber-950 dark:text-amber-100">
              {activeRegionObj
                ? `Resep Masakan Khas ${activeRegionObj.name}`
                : 'Hasil Pencarian Resep'}
            </h3>
            <span className="text-xs text-stone-500 dark:text-amber-300">
              {filteredRecipes.length} resep ditemukan
            </span>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-amber-50/50 dark:bg-amber-900/20 rounded-3xl border border-amber-200/50 space-y-2">
              <Search className="w-8 h-8 mx-auto text-amber-600/50" />
              <p className="font-bold text-amber-950 dark:text-amber-100 text-sm">
                Tidak ada resep yang sesuai dengan kata kunci atau filter provinsi.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryId(null);
                  setSelectedRegionId(null);
                }}
                className="text-xs font-bold text-amber-700 dark:text-amber-300 underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Resep Populer Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg font-serif flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>⭐ Resep Populer Nusantara</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>

          {/* Resep Terbaru Section */}
          <section className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg font-serif flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
                <Utensils className="w-5 h-5 text-amber-600" />
                <span>🍽️ Seluruh Koleksi Resep Masakan Daerah</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECIPES_DATA.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
