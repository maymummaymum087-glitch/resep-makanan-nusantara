import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { REGIONS_DATA } from '../data/regions';
import { Recipe } from '../types';
import {
  Table as TableIcon,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  Star,
  MapPin,
  Heart,
  ShoppingCart,
  Eye,
  RotateCcw,
  Sparkles,
  Utensils,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';

type SortField = 'title' | 'provinceName' | 'prepTimeMinutes' | 'rating' | 'difficulty';
type SortOrder = 'asc' | 'desc';

export const TableSearchView: React.FC = () => {
  const {
    openRecipeDetail,
    isFavorite,
    toggleFavorite,
    addToShoppingList,
    setActiveTab,
    showToast,
  } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Semua');
  const [selectedIslandGroup, setSelectedIslandGroup] = useState<string>('Semua');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Categories list
  const categories = [
    'Semua',
    'Makanan Utama',
    'Kuah & Soto',
    'Sate & Bakar',
    'Camilan & Kue',
    'Minuman Tradisional',
    'Seafood',
  ];

  // Islands list
  const islands = [
    'Semua',
    'Sumatera',
    'Jawa',
    'Bali & Nusa Tenggara',
    'Kalimantan',
    'Sulawesi',
    'Maluku & Papua',
  ];

  const difficulties = ['Semua', 'Mudah', 'Sedang', 'Rumit'];

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return RECIPES_DATA.filter((recipe) => {
      const matchesSearch =
        searchTerm === '' ||
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.provinceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.regionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesProvince =
        selectedProvince === 'Semua' || recipe.provinceName === selectedProvince || recipe.regionName === selectedProvince;

      const matchesCategory =
        selectedCategory === 'Semua' || recipe.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'Semua' || recipe.difficulty === selectedDifficulty;

      const matchesIsland =
        selectedIslandGroup === 'Semua' || recipe.islandGroup === selectedIslandGroup;

      return matchesSearch && matchesProvince && matchesCategory && matchesDifficulty && matchesIsland;
    });
  }, [searchTerm, selectedProvince, selectedCategory, selectedDifficulty, selectedIslandGroup]);

  // Sort recipes
  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => {
      let valueA: any = a[sortField];
      let valueB: any = b[sortField];

      if (sortField === 'prepTimeMinutes') {
        valueA = a.prepTimeMinutes + a.cookTimeMinutes;
        valueB = b.prepTimeMinutes + b.cookTimeMinutes;
      }

      if (typeof valueA === 'string') {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }, [filteredRecipes, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedRecipes.length / itemsPerPage);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRecipes.slice(start, start + itemsPerPage);
  }, [sortedRecipes, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('Semua');
    setSelectedCategory('Semua');
    setSelectedDifficulty('Semua');
    setSelectedIslandGroup('Semua');
    setSortField('title');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Mudah':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300';
      case 'Sedang':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300';
      case 'Rumit':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-amber-950 to-orange-950 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <TableIcon className="w-3.5 h-3.5" /> Tabel Pencarian Resep Lengkap
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
          >
            ← Kembali ke Beranda
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
          Tabel Cari Nama Makanan Nusantara
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl">
          Cari makanan khas dari 38 provinsi di Indonesia secara mendetail. Gunakan kolom pencarian, filter provinsi, atau urutkan tabel berdasarkan waktu masak dan rating.
        </p>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <section className="p-4 sm:p-5 bg-white dark:bg-amber-950/40 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 shadow-sm space-y-4">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 dark:text-amber-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Ketik nama makanan yang dicari (misal: Rendang, Soto Betawi, Gudeg, Papeda, Pempek)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-amber-50/50 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-800 text-sm font-medium text-amber-950 dark:text-amber-100 placeholder-amber-700/50 dark:placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Island Filter */}
          <div>
            <label className="block font-bold text-stone-600 dark:text-amber-300 mb-1">
              Pulau / Wilayah:
            </label>
            <select
              value={selectedIslandGroup}
              onChange={(e) => {
                setSelectedIslandGroup(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {islands.map((isl) => (
                <option key={isl} value={isl}>
                  {isl}
                </option>
              ))}
            </select>
          </div>

          {/* Province Select Filter */}
          <div>
            <label className="block font-bold text-stone-600 dark:text-amber-300 mb-1">
              Provinsi (38 Provinsi):
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Semua">Semua 38 Provinsi</option>
              {REGIONS_DATA.map((reg) => (
                <option key={reg.id} value={reg.province}>
                  📍 {reg.province}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block font-bold text-stone-600 dark:text-amber-300 mb-1">
              Kategori Hidangan:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block font-bold text-stone-600 dark:text-amber-300 mb-1">
              Tingkat Kesulitan:
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Button */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-100 dark:border-amber-900/30 text-xs">
          <div className="text-stone-600 dark:text-amber-300 font-medium">
            Ditemukan <span className="font-bold text-amber-800 dark:text-amber-200">{filteredRecipes.length}</span> makanan dari total {RECIPES_DATA.length} resep
          </div>

          {(searchTerm ||
            selectedProvince !== 'Semua' ||
            selectedCategory !== 'Semua' ||
            selectedDifficulty !== 'Semua' ||
            selectedIslandGroup !== 'Semua') && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 font-bold flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
            </button>
          )}
        </div>
      </section>

      {/* SEARCH RESULTS TABLE */}
      <section className="bg-white dark:bg-amber-950/40 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table id="recipe-search-table" className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-amber-900 text-white font-serif border-b border-amber-800">
                <th className="p-3.5 font-bold w-12 text-center">Foto</th>
                <th
                  onClick={() => handleSort('title')}
                  className="p-3.5 font-bold cursor-pointer hover:bg-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Nama Makanan</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('provinceName')}
                  className="p-3.5 font-bold cursor-pointer hover:bg-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Provinsi / Asal</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </th>
                <th className="p-3.5 font-bold">Kategori</th>
                <th
                  onClick={() => handleSort('prepTimeMinutes')}
                  className="p-3.5 font-bold cursor-pointer hover:bg-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Waktu</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </th>
                <th className="p-3.5 font-bold">Kesulitan</th>
                <th
                  onClick={() => handleSort('rating')}
                  className="p-3.5 font-bold cursor-pointer hover:bg-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </th>
                <th className="p-3.5 font-bold text-center">Tindakan</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-amber-100 dark:divide-amber-900/30">
              {paginatedRecipes.length > 0 ? (
                paginatedRecipes.map((recipe) => {
                  const favorited = isFavorite(recipe.id);
                  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

                  return (
                    <tr
                      key={recipe.id}
                      className="hover:bg-amber-50/70 dark:hover:bg-amber-900/30 transition-colors group cursor-pointer"
                      onClick={() => openRecipeDetail(recipe)}
                    >
                      {/* Image Thumbnail Column */}
                      <td className="p-2.5 text-center align-middle">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-100 dark:bg-amber-900/50 mx-auto relative border border-amber-200/60 dark:border-amber-800/60">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>
                      </td>

                      {/* Food Name & Tag */}
                      <td className="p-3 align-middle">
                        <div className="space-y-0.5">
                          <div className="font-bold text-sm text-amber-950 dark:text-amber-100 font-serif group-hover:text-amber-700 transition-colors">
                            {recipe.title}
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-amber-300/80 line-clamp-1 max-w-xs">
                            {recipe.description}
                          </p>
                        </div>
                      </td>

                      {/* Province Column */}
                      <td className="p-3 align-middle">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                          <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>{recipe.provinceName}</span>
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="p-3 align-middle">
                        <span className="font-semibold text-stone-700 dark:text-amber-200">
                          {recipe.category}
                        </span>
                      </td>

                      {/* Prep/Cook Time Column */}
                      <td className="p-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1 text-stone-700 dark:text-amber-200 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{totalMinutes} mnt</span>
                        </div>
                      </td>

                      {/* Difficulty Column */}
                      <td className="p-3 align-middle">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getDifficultyBadge(
                            recipe.difficulty
                          )}`}
                        >
                          {recipe.difficulty}
                        </span>
                      </td>

                      {/* Rating Column */}
                      <td className="p-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1 font-bold text-amber-900 dark:text-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{recipe.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-stone-400 font-normal">
                            ({recipe.reviewsCount})
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="p-3 align-middle text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openRecipeDetail(recipe)}
                            className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 hover:bg-amber-200 font-bold flex items-center gap-1"
                            title="Lihat Resep"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => toggleFavorite(recipe.id)}
                            className={`p-1.5 rounded-xl border transition-colors ${
                              favorited
                                ? 'bg-rose-100 text-rose-600 border-rose-300'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 dark:bg-amber-900/40 dark:text-amber-200'
                            }`}
                            title={favorited ? 'Hapus dari Favorit' : 'Simpan Favorit'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500' : ''}`} />
                          </button>

                          <button
                            onClick={() => addToShoppingList(recipe)}
                            className="p-1.5 rounded-xl bg-amber-700 text-white hover:bg-amber-800 font-bold shadow-xs"
                            title="Tambah Bahan ke Belanja"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500 dark:text-amber-300">
                    <Search className="w-8 h-8 mx-auto text-amber-600/40 mb-2" />
                    <p className="font-bold text-sm">
                      Tidak ditemukan makanan yang sesuai dengan kata pencarian "{searchTerm}".
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-300 underline"
                    >
                      Reset Filter & Tampilkan Semua Makanan
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {totalPages > 1 && (
          <div className="p-4 bg-amber-50/60 dark:bg-amber-900/30 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-xs">
            <span className="text-stone-600 dark:text-amber-300 font-medium">
              Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 font-bold bg-white dark:bg-amber-900/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100"
              >
                ← Sebaliknya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-xl font-bold text-xs transition-all ${
                    currentPage === page
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-white dark:bg-amber-900/40 text-stone-700 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 font-bold bg-white dark:bg-amber-900/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
