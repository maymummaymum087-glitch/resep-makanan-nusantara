export type Difficulty = 'Mudah' | 'Sedang' | 'Rumit';

export type Category = 
  | 'Makanan Utama'
  | 'Kuah & Soto'
  | 'Sate & Bakar'
  | 'Camilan & Kue'
  | 'Minuman Tradisional'
  | 'Seafood';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: 'Bumbu' | 'Daging' | 'Sayuran' | 'Bahan Utama' | 'Lainnya';
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface NutritionInfo {
  calories: number; // kcal
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface Recipe {
  id: string;
  title: string;
  indonesianTitle?: string;
  description: string;
  regionId: string;
  regionName: string; // e.g. "Jawa Tengah"
  provinceName: string; // e.g. "DI Yogyakarta / Jawa Tengah"
  islandGroup: 'Sumatera' | 'Jawa' | 'Bali & Nusa Tenggara' | 'Kalimantan' | 'Sulawesi' | 'Maluku & Papua';
  category: Category;
  imageUrl: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  ingredients: Ingredient[];
  steps: CookingStep[];
  cookingTips: string[];
  nutrition: NutritionInfo;
  authorNote?: string;
}

export interface Region {
  id: string;
  name: string;
  province: string;
  islandGroup: 'Sumatera' | 'Jawa' | 'Bali & Nusa Tenggara' | 'Kalimantan' | 'Sulawesi' | 'Maluku & Papua';
  description: string;
  imageUrl: string;
  signatureDishes: string[];
  recipeCount: number;
}

export interface ShoppingItem {
  id: string;
  recipeId?: string;
  recipeTitle?: string;
  name: string;
  amount: string;
  isBought: boolean;
  addedAt: number;
}

export type TabType = 'home' | 'regions' | 'favorites' | 'shopping' | 'profile';

export type Language = 'id' | 'en';
