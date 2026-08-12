import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, ShoppingItem, Language } from '../types';
import { RECIPES_DATA } from '../data/recipes';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Theme & Language
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Navigation / Tabs
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegionId: string | null;
  setSelectedRegionId: (regionId: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected Active Recipe Modal / View
  activeRecipe: Recipe | null;
  openRecipeDetail: (recipe: Recipe) => void;
  closeRecipeDetail: () => void;

  // Favorites
  favorites: string[]; // recipe IDs
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  clearFavorites: () => void;

  // Shopping List
  shoppingList: ShoppingItem[];
  addToShoppingList: (recipe: Recipe, selectedIngredients?: string[]) => void;
  addCustomShoppingItem: (name: string, amount?: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  deleteShoppingItem: (itemId: string) => void;
  clearBoughtItems: () => void;
  clearAllShoppingItems: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // AI Chef Modal
  isAIChefOpen: boolean;
  openAIChef: (initialContextRecipe?: Recipe | null) => void;
  closeAIChef: () => void;
  aiContextRecipe: Recipe | null;

  // User stats & badge
  cookedRecipesCount: number;
  markRecipeCooked: (recipeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nusantara_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('nusantara_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nusantara_lang');
    return saved === 'en' ? 'en' : 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nusantara_lang', lang);
  };

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Recipe Detail
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  const openRecipeDetail = (recipe: Recipe) => {
    setActiveRecipe(recipe);
  };

  const closeRecipeDetail = () => {
    setActiveRecipe(null);
  };

  // Favorites (Recipe IDs)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nusantara_favorites');
      return saved ? JSON.parse(saved) : ['gudeg-jogja', 'rendang-padang', 'pempek-palembang'];
    } catch {
      return ['gudeg-jogja', 'rendang-padang', 'pempek-palembang'];
    }
  });

  useEffect(() => {
    localStorage.setItem('nusantara_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(recipeId);
      if (exists) {
        showToast('Resep dihapus dari Favorit', 'info');
        return prev.filter((id) => id !== recipeId);
      } else {
        showToast('❤️ Resep disimpan ke Favorit!', 'success');
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  const clearFavorites = () => {
    setFavorites([]);
    showToast('Daftar favorit telah dikosongkan', 'info');
  };

  // Shopping List
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('nusantara_shopping_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nusantara_shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addToShoppingList = (recipe: Recipe, selectedIngredients?: string[]) => {
    const ingredientsToAdd = selectedIngredients && selectedIngredients.length > 0
      ? recipe.ingredients.filter((ing) => selectedIngredients.includes(ing.id))
      : recipe.ingredients;

    const newItems: ShoppingItem[] = ingredientsToAdd.map((ing) => ({
      id: `${recipe.id}-${ing.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      name: ing.name,
      amount: `${ing.amount} ${ing.unit}`,
      isBought: false,
      addedAt: Date.now(),
    }));

    setShoppingList((prev) => [...prev, ...newItems]);
    showToast(`🛒 ${ingredientsToAdd.length} bahan masakan ditambahkan ke Daftar Belanja!`, 'success');
  };

  const addCustomShoppingItem = (name: string, amount: string = '') => {
    if (!name.trim()) return;
    const newItem: ShoppingItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      amount: amount.trim(),
      isBought: false,
      addedAt: Date.now(),
    };
    setShoppingList((prev) => [newItem, ...prev]);
    showToast('Bahan ditambahkan ke daftar belanja', 'success');
  };

  const toggleShoppingItem = (itemId: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isBought: !item.isBought } : item))
    );
  };

  const deleteShoppingItem = (itemId: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearBoughtItems = () => {
    setShoppingList((prev) => prev.filter((item) => !item.isBought));
    showToast('Bahan yang sudah dibeli dibersihkan', 'info');
  };

  const clearAllShoppingItems = () => {
    setShoppingList([]);
    showToast('Daftar belanja telah dikosongkan', 'info');
  };

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // AI Chef Assistant Modal
  const [isAIChefOpen, setIsAIChefOpen] = useState<boolean>(false);
  const [aiContextRecipe, setAiContextRecipe] = useState<Recipe | null>(null);

  const openAIChef = (initialContextRecipe?: Recipe | null) => {
    setAiContextRecipe(initialContextRecipe || null);
    setIsAIChefOpen(true);
  };

  const closeAIChef = () => {
    setIsAIChefOpen(false);
    setAiContextRecipe(null);
  };

  // Cooked counter
  const [cookedRecipes, setCookedRecipes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nusantara_cooked_recipes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markRecipeCooked = (recipeId: string) => {
    if (!cookedRecipes.includes(recipeId)) {
      const next = [...cookedRecipes, recipeId];
      setCookedRecipes(next);
      localStorage.setItem('nusantara_cooked_recipes', JSON.stringify(next));
      showToast('🎉 Selamat! Anda telah berhasil memasak resep ini!', 'success');
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        selectedRegionId,
        setSelectedRegionId,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        activeRecipe,
        openRecipeDetail,
        closeRecipeDetail,
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        shoppingList,
        addToShoppingList,
        addCustomShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        clearBoughtItems,
        clearAllShoppingItems,
        toasts,
        showToast,
        isAIChefOpen,
        openAIChef,
        closeAIChef,
        aiContextRecipe,
        cookedRecipesCount: cookedRecipes.length,
        markRecipeCooked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
