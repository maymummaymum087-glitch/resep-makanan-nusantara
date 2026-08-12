import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGIONS_DATA } from '../data/regions';
import { RECIPES_DATA } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';
import { MapPin, Search, ChevronRight, Compass, Filter, ArrowLeft } from 'lucide-react';

export const RegionsView: React.FC = () => {
  const { setSelectedRegionId, setActiveTab } = useApp();
  const [selectedIsland, setSelectedIsland] = useState<string>('Semua');
  const [regionSearch, setRegionSearch] = useState<string>('');
  const [activeRegionDetail, setActiveRegionDetail] = useState<string | null>(null);

  const islands = ['Semua', 'Sumatera', 'Jawa', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

  const filteredRegions = REGIONS_DATA.filter((reg) => {
    const matchesIsland = selectedIsland === 'Semua' ? true : reg.islandGroup === selectedIsland;
    const matchesSearch =
      reg.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
      reg.province.toLowerCase().includes(regionSearch.toLowerCase()) ||
      reg.signatureDishes.some((d) => d.toLowerCase().includes(regionSearch.toLowerCase()));
    return matchesIsland && matchesSearch;
  });

  const selectedRegionObject = REGIONS_DATA.find((r) => r.id === activeRegionDetail);
  const selectedRegionRecipes = RECIPES_DATA.filter((r) => r.regionId === activeRegionDetail);

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 to-amber-950 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" /> 38 Provinsi Indonesia
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif">
          Jelajah Kuliner 38 Provinsi Nusantara
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed max-w-xl">
          Pilih salah satu dari 38 provinsi di Indonesia di bawah ini untuk menjelajahi seluruh resep masakan khas daerah beserta cerita kelezatan budayanya.
        </p>
      </div>

      {/* Search & Island Filter Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 dark:text-amber-400" />
          <input
            type="text"
            value={regionSearch}
            onChange={(e) => setRegionSearch(e.target.value)}
            placeholder="Cari nama provinsi (misal: Aceh, Bali, Papua, Jawa Tengah, Maluku)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {islands.map((isl) => (
            <button
              key={isl}
              onClick={() => setSelectedIsland(isl)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedIsland === isl
                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                  : 'bg-white dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 hover:bg-amber-50'
              }`}
            >
              {isl}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Buttons Grid for ALL 38 PROVINCES */}
      {!activeRegionDetail && (
        <section className="p-4 rounded-3xl bg-amber-100/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-700" /> Tombol Cepat Provinsi ({filteredRegions.length} Provinsi)
            </span>
            {selectedIsland !== 'Semua' && (
              <button
                onClick={() => setSelectedIsland('Semua')}
                className="text-amber-700 dark:text-amber-400 underline text-[11px]"
              >
                Tampilkan Semua
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredRegions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setActiveRegionDetail(reg.id)}
                className="p-2.5 rounded-2xl bg-white dark:bg-amber-900/40 border border-amber-200/80 dark:border-amber-800/50 hover:border-amber-500 dark:hover:border-amber-400 text-left transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block truncate">
                    {reg.islandGroup}
                  </span>
                  <span className="text-xs font-extrabold text-amber-950 dark:text-amber-100 block group-hover:text-amber-700 truncate">
                    📍 {reg.name}
                  </span>
                </div>
                <div className="mt-2 text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-lg border border-amber-200/50 dark:border-amber-800/40 font-semibold self-start">
                  Lihat Resep →
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* If a region card is actively tapped, show its details & recipes! */}
      {activeRegionDetail && selectedRegionObject ? (
        <div className="space-y-4 animate-fadeIn">
          <button
            onClick={() => setActiveRegionDetail(null)}
            className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 bg-amber-100/60 dark:bg-amber-900/40 px-3 py-1.5 rounded-xl border border-amber-200/50 self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar 38 Provinsi
          </button>

          <div className="p-6 rounded-3xl bg-amber-900 text-white space-y-3 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                📍 {selectedRegionObject.province}
              </span>
              <span className="text-xs bg-amber-500/30 px-3 py-1 rounded-full border border-amber-400/30 font-bold">
                {selectedRegionRecipes.length} Resep Terdaftar
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif">{selectedRegionObject.name}</h3>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl">
              {selectedRegionObject.description}
            </p>
            <div className="pt-2 text-xs text-amber-300/90 font-semibold border-t border-amber-800">
              Hidangan Khas Utama: {selectedRegionObject.signatureDishes.join(', ')}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h4 className="font-bold text-base font-serif text-amber-950 dark:text-amber-100 flex items-center gap-2">
              <span>🍽️ Resep Masakan Khas {selectedRegionObject.name}</span>
            </h4>
            <button
              onClick={() => {
                setSelectedRegionId(selectedRegionObject.id);
                setActiveTab('home');
              }}
              className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline"
            >
              Lihat di Beranda →
            </button>
          </div>

          {selectedRegionRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedRegionRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-amber-50/50 dark:bg-amber-900/20 rounded-3xl border border-amber-200/50 space-y-2">
              <p className="font-bold text-amber-950 dark:text-amber-100 text-sm">
                Belum ada resep tambahan untuk provinsi ini.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Region Cards Detailed Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegions.map((reg) => (
            <div
              key={reg.id}
              onClick={() => setActiveRegionDetail(reg.id)}
              className="group relative bg-white dark:bg-amber-950/40 rounded-3xl border border-amber-100 dark:border-amber-900/40 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-amber-900 overflow-hidden">
                <img
                  src={reg.imageUrl}
                  alt={reg.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 bg-amber-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
                  {reg.recipeCount} Resep
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">
                    {reg.province}
                  </span>
                  <h3 className="text-lg font-bold font-serif leading-tight">{reg.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-stone-600 dark:text-amber-200/80 line-clamp-2 leading-relaxed">
                  {reg.description}
                </p>

                <div className="pt-2 border-t border-amber-100 dark:border-amber-900/30 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                  <span>Khas: {reg.signatureDishes.slice(0, 2).join(', ')}</span>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
