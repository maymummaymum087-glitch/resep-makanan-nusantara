import React from 'react';
import { Recipe } from '../types';
import { useApp } from '../context/AppContext';
import { Clock, Flame, Users, Heart, Star, MapPin } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { openRecipeDetail, isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(recipe.id);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Mudah':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Sedang':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Rumit':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div
      onClick={() => openRecipeDetail(recipe)}
      className="group relative bg-white dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-100 dark:bg-amber-900/30">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // High quality culinary dish fallback
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay for badges legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Region Tag Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-950/70 backdrop-blur-md text-amber-200 text-[11px] font-medium px-2.5 py-1 rounded-full border border-amber-500/30 shadow-sm">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{recipe.regionName}</span>
        </div>

        {/* Favorite Heart Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-amber-950/80 backdrop-blur-md hover:bg-white dark:hover:bg-amber-900 transition-transform active:scale-90 shadow-sm"
          title={favorited ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-amber-200'
            }`}
          />
        </button>

        {/* Rating Badge Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-400/20">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{recipe.rating.toFixed(1)}</span>
          <span className="text-[10px] text-amber-200/70 font-normal">({recipe.reviewsCount})</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-400 font-semibold mb-1">
            <span>{recipe.category}</span>
          </div>

          <h3 className="font-bold text-base text-amber-950 dark:text-amber-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors line-clamp-1 font-serif">
            {recipe.title}
          </h3>

          <p className="text-xs text-stone-600 dark:text-amber-200/70 line-clamp-2 mt-1 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Recipe Meta Info Pills */}
        <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-900/30 flex items-center justify-between text-xs text-stone-600 dark:text-amber-200/80">
          {/* Prep/Cook Time */}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mnt</span>
          </div>

          {/* Difficulty */}
          <div className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </div>

          {/* Servings */}
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{recipe.servings} porsi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
