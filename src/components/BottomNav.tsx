import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, MapPin, Heart, ShoppingCart, User, Table } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, favorites, shoppingList } = useApp();

  const unboughtCount = shoppingList.filter((item) => !item.isBought).length;

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'table-search', label: 'Tabel Cari', icon: Table },
    { id: 'regions', label: '38 Provinsi', icon: MapPin },
    { id: 'favorites', label: 'Favorit', icon: Heart, badge: favorites.length },
    { id: 'shopping', label: 'Belanja', icon: ShoppingCart, badge: unboughtCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-amber-950/95 backdrop-blur-md border-t border-amber-100 dark:border-amber-900/40 py-1.5 px-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-700 dark:text-amber-300 font-bold scale-105'
                  : 'text-stone-500 dark:text-amber-200/60 hover:text-amber-800 dark:hover:text-amber-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>

              {/* Active Dot indicator */}
              {isActive && (
                <span className="w-1 h-1 bg-amber-600 dark:bg-amber-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
